# Simple NodeJS Ethereum

Smart contract, Ropsten Test Network Ethereum, MetaMask, Infura, Web3, Truffle.

If you're interested in Golang connecting to Ethereum, please reference my simple-go-ethereum here: https://github.com/huynhsamha/simple-go-ethereum

## Step by step

### Create accounts and deposit ether with MetaMask
+ Install extension MetaMask in Chrome browser.
+ Choose Ropsten Test Network.
+ Create accounts and deposit Ether from Test Faucet
+ Get private keys from accounts (MetaMask requires your password)

### Create account with Infura
Create account on https://infura.io

### Quickstart
+ Clone repository, installing packages with `npm` or `yarn`
+ Copy file `.env.example` to file `.env` with the same path.
+ Change variables in new file `.env` with your values.

### Compile solidity code with truffle
```bash
truffle compile
```
Solidity files in `contracts/*.sol` will be compiled to `build/contracts/*.json`

### Document for Web3js

+ Manage accounts and wallet:
	+ Private Key to Account: https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#privatekeytoaccount
	+ Add account to wallet: https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#wallet-add
	+ Remove account from wallet: https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#wallet-remove
+ Deploy smart contract: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#deploy
+ Use methods in Contract:
	+ Call: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-call
	+ Send: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
+ Some utils:
	+ toHex: https://web3js.readthedocs.io/en/1.0/web3-utils.html#tohex
	+ toWei: https://web3js.readthedocs.io/en/1.0/web3-utils.html#towei
	+ hexToBytes: https://web3js.readthedocs.io/en/1.0/web3-utils.html#hextobytes
