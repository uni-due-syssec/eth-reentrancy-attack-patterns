# Re-Entrancy Attack Patterns

These attack patterns were discovered during evaluation of `Sereum` a runtime
monitoring solution for re-entrancy attacks, which utilizes taint tracking and
dynamic write locks to detect and prevent re-entrancy attacks. For more
information please refer to our paper *"Sereum: Protecting Existing Smart
Contracts Against Re-Entrancy Attacks"* ([arxiv preprint](https://arxiv.org/abs/1812.05934)).

For every type of attack pattern, this repository contains a small example
implementation of a vulnerable contract and an attack. The source code of the
vulnerable and attacker contracts are contained in the `*.sol` files. We also
provide a `*_setup.js` file for every example, which deploys the contracts on a
dev blockchain and exploits the vulnerability in the example contract. The
scripts assume they're run in the geth dev mode blockchain (`geth --dev`).

### Cross-function re-entrancy

**Example:** `./cross-function.sol`

The Token contract in the example is vulnerable to a re-entrancy attack
starting with the `withdrawAll` function. However, the attacker cannot
re-enter the `withdrawAll`. Instead the attacker has to re-enter the contract
at the `exchangeAndWithdrawToken` to exploit the bug and drain the vulnerable
contract from ether.

### Delegated re-entrancy

**Example:** `./delegated.sol`

The `Bank` contract utilizes a library, called via `delegatecall`, for
performing the ether sending. This obfuscates the re-entrancy vulnerability in
the `withdraw` function. Any static analysis tool will not be able to detect
this vulnerability when analyzing only the `Bank` contract and not the
combination of the contract and its libraries.

### Create-based re-entrancy

**Example:** `./create-based.sol`

In this example, multiple contracts interact with each other. The `Bank`
contract utilizes the `CREATE` instruction (i.e., `new` in solidity) to create
new subcontracts. Contract creation immediately triggers the execution of the
constructor of the newly created contract. This constructor can perform
external calls to the unknown. This can lead to re-entrancy scenarios, where
the attacker re-enters a contract, during execution of a sub-contracts
constructor. For static analysis tools to catch these kinds of problems, they
must (1) also analyze combination of contracts and (2) consider the `CREATE`
instruction as an external call, similar to the `CALL` instruction.


## Tested Tools

The following table lists the tools and versions we tested. If the tool detects
the test-case, we mark it with "Yes", otherwise "No". Mythril, Securify and
Slither use a conservative policy, that marks every state update after an
external call. This would prevent all re-entrancy vulnerabilities, but also
results in a rather high number of false positives. For example, for
create-based re-entrancy vulnerabilities, it is highly likely that the creater
of the contract, will want to modify the state (e.g., registering the address
of the newly created contract). Another example would be the use of manual
locking with mutexes, which is always reported with this policy.

| Tool          | Version     | Simple                 | Cross-Function         | Delegated | Create-based | 
| ------------- | ----------- | ---------------------- | ---------------------- | --------- | ------------ |
| Oyente        | 0.2.7       | Yes                    | No                     | No<sup>1</sup> | No      |
| Mythril       | v0.19.9     | Partial (conservative) | Partial (conservative) | No        | Partial (conservative) |
| Securify      | 2018-08-01  | Partial (conservative) | Partial (conservative) | No        | No           |
| Manticore<sup>2</sup> | 0.2.2 | Yes                  | Yes<sup>3</sup>        | No        | No           |
| Slither<sup>5</sup> | 0.6.4 | Yes (conservative)     | Yes (conservative)     | Yes (conservative) | No  |
| ECFChecker    | geth1.8port | Yes                    | Yes<sup>4</sup>        | Yes       | No           |
| Sereum        |             | Yes                    | Yes                    | Yes       | Yes          |


* <sup>1</sup> Oyente detects a re-entrancy in the Library contract. However, 
  the library contract itself is arguably not vulnerable to re-entrancy.
* <sup>2</sup> We evaluate the detector enabled with `--detect-reentrancy-advanced`.
  The other detector `--detect-reentrancy` uses a similar policy to Mythril and
  Securify.
* <sup>3</sup> However, other tests (e.g., `manual-lock.sol`) show that
  Manticore is sometimes not as accurate and reports re-entrancy attacks even
  though they're not really possible.
* <sup>4</sup> However, we crafted a different example for a cross-function
  re-entrancy attack that is not detected by ECFChecker. See the next section 
  for details.
* <sup>5</sup> In contrast to the other tools Slither works on the Solidity
  source code level. It has a similar policy to Mythril and Securify, i.e. it
  reports any state update after an external call using either the low-level
  Solidity `call` or `delegatecall` functions.


## Testcase: manual lock

The file `manual-lock.sol` contains several versions of the same contract. These
contracts can be used to investigate the quality of re-entrancy detection tools.
This file contains three functionally equivalent contracts:

* `VulnBankNoLock` is vulnerable to simple same function re-entrancy.
* `VulnBankBuggyLock` is vulnerable to cross-function re-entrancy, due to a 
  incomplete locking mechanism.
* `VulnBankSecureLock` is not vulnerable due to the locking mechanism. However,
  the locking mechanism can result in a false positive.

Furthermore, there are two types of attacks implemented against all of these
contracts.

* `MallorySameFunction` implements simple same-function re-entrancy
* `MalloryCrossFunction` implements a cross-function re-entrancy attack

Static analysis tools have a hard time correctly analysing the contracts. Oyente
detects only the simple re-entrancy vulnerability and does not report the
cross-function re-entrancy. Manticore on the other hand detects a re-entrancy
bug in both the BuggyLock and SecureLock version, resulting in a false positive.
Slither and Mythril mark any state update after an external call as a problem 
and therefore report a problem with every of those contract, even though the 
`SecureLock` variant is not exploitable.

| Tool \ Testcase | NoLock   | BuggyLock | SecureLock | 
| --------------- | -------- | --------- | ---------- |
| Oyente          | Yes      | No        | No         |
| Manticore       | Yes      | Yes       | Yes        |
| Mythril         | Yes      | Yes       | Yes        |
| Slither         | Yes      | Yes       | Yes        |
| Expected        | Yes      | Yes       | No         |

For the dynamic analysis tools, we use several combinations of vulnerable
contracts and attack contracts. We verify whether the tool detects an attack
against the same-function and cross-function re-entrancy attack.

| Testcase \ Tool            | ECFChecker | Sereum    | Expected |
| ---------------------------| ---------- | --------- | -------- |
| NoLock + SameFunction      | Yes        | Yes       | Yes      |
| NoLock + CrossFunction     | No         | Yes       | Yes      |
| BuggyLock + SameFunction   | No         | Yes       | No       |
| BuggyLock + CrossFunction  | No         | Yes       | Yes      |
| SecureLock + SameFunction  | No         | Yes       | No       |
| SecureLock + CrossFunction | No         | Yes       | No       |

The reason, Sereum reports all contracts, is that the locking mechanism itself
does exhibit exactly the same pattern as an re-entrancy attack. So Sereum
reports an re-entrancy attack on the lock variables, because Sereum cannot know
the semantics of the lock variables.


## Unconditional Re-Entrancy

**Example:** `./unconditional.sol`

Typically a re-entrancy attack will try to subvert a business logic check of an
application. Every check (`if`, `require`, `assert`, etc.) is implemented as a
conditional jump (`JUMPI`) on the EVM level. While certainly unlikely it is
possible to write a contract, which does not perform any check on anything
before sending ether. In this example the functionality transfers all the ether
a user has invested. This example is exploitable only with a re-entrancy
vulnerability. ~~Currently this example is not detected by Sereum, since we
assume that this is a rather unlikely case. We plan to detect this kind of
vulnerabilities in a future versions of sereum.~~

| Tool            | Detected | 
| --------------- | --- |
| Oyente          | Yes |
| Manticore       | Yes |
| Slither         | Yes |
| Mythril         | Yes |
| ECFChecker      | Yes |
| Sereum          | ~~No~~ Yes<sup>1</sup> |

* <sup>1</sup> We have extended Sereum to cover this type of re-entrancy by
  tracking data-flow from storage variables to the parameters of calls.

Another very simple example is the following contract, which is deployed on the Ethereum blockchain at [0xb7c5c5aa4d42967efe906e1b66cb8df9cebf04f7](https://etherscan.io/address/0xb7c5c5aa4d42967efe906e1b66cb8df9cebf04f7#code).

## Citing in Academic Work

If you want to refer to these attack patterns in academic work, please cite the
following paper:

```bibtex
@inproceedings{sereum-ndss19,
  title     = "Sereum: Protecting Existing Smart Contracts Against Re-Entrancy Attacks",
  booktitle = "Proceedings of the Network and Distributed System Security Symposium ({NDSS'19})",
  author    = "Rodler, Michael and Li, Wenting and Karame, Ghassan and Davi, Lucas",
  year      =  2019
}
```
