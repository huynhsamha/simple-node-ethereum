require('dotenv').config();

const Web3 = require('web3');
const config = require('./config');

const BallotContractJSON = require('./build/contracts/Ballot.json');

/**
 * ==========================================================================
 * Configure Ethereum
 * ==========================================================================
 * */
const provider = config.eth.network == 'testnet' ? config.eth.provider : 'http://localhost:8545';
console.log('Ethereum provider:', provider);

const web3 = new Web3(new Web3.providers.HttpProvider(provider));

const { abi, bytecode } = BallotContractJSON;
const gasPrice = web3.utils.toHex(1e9);

const demoBallotContractAddress = '0xeCa88b23A42e54e5497cDa8a2c6307439bF3A6c8';

const accountIsFree = []; // Mark if ETH Account is free (true/false), default is true => free
let numberAccounts = 0;

/**
 * Configure Functions
 * use async for similar with configDefaultAccount_Local
 */
const configDefaultAccount_TestNet = async () => {
  /**
   * Add to wallet, can use sendTransaction()
   * Dont have to sign to transaction manually
   */
  const privateKey = config.eth.ropstenPrivateKey;
  const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);

  // add test accounts
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(`0x${process.env.ROPSTEN_PRIVATE_KEY_A}`));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(`0x${process.env.ROPSTEN_PRIVATE_KEY_B}`));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(`0x${process.env.ROPSTEN_PRIVATE_KEY_C}`));
  web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(`0x${process.env.ROPSTEN_PRIVATE_KEY_D}`));

  web3.eth.accounts.wallet.add(account);

  /** Set the default account, used to `from` */
  web3.eth.defaultAccount = account.address;
};

const configDefaultAccount_Local = async () => {
  const accounts = await web3.eth.getAccounts();
  web3.eth.defaultAccount = accounts[0];
};

const configDefaultAccount = async () => {
  if (config.eth.network == 'testnet') {
    await configDefaultAccount_TestNet();
  } else {
    await configDefaultAccount_Local();
  }

  console.log('Default account address:', web3.eth.defaultAccount);

  // Mark free for all account
  numberAccounts = web3.eth.accounts.wallet.length;
  for (let i = 0; i < numberAccounts; i++) {
    accountIsFree.push(true);
  }
};


/**
 * ==========================================================================
 * Functions
 * ==========================================================================
 * */

/** Get nonce of default account */
const getNonce = () => {
  web3.eth.getTransactionCount(web3.eth.defaultAccount)
    .then(nonce => console.log('Nonce: ', nonce))
    .catch(err => console.log(err));
};

/** Get nonce with pending of default account */
const getNoncePending = () => {
  web3.eth.getTransactionCount(web3.eth.defaultAccount, 'pending')
    .then(nonce => console.log('Nonce: ', nonce))
    .catch(err => console.log(err));
};

/**
 * Deploy new contract
 * @param {numProposals}: arguments for contract
 */
const deployBallotContract = async ({ numProposals }) => {
  try {
    const BallotContract = new web3.eth.Contract(abi);

    const txInstance = BallotContract.deploy({
      arguments: [numProposals],
      data: bytecode
    });

    const gasLimit = await txInstance.estimateGas();
    console.log('Gas limit: ', gasLimit);

    txInstance.send({
      from: address,
      gas: gasLimit,
      gasPrice
    })
      .on('transactionHash', (txHash) => {
        console.log('Transaction Hash: ', txHash);
        // store database here, send response to client
      })
      .on('receipt', (receipt) => {
        console.log('Receipt: ', receipt);
        // update database here with contract address
      })
      .on('error', (err) => {
        console.log(err);
      });

  } catch (err) {
    console.log(err);
  }
};


/**
 * Call method `giveRightToVote(address toVoter)` from smart contract
 * Will send a transaction to the smart contract and execute its method.
 * Note this can alter the smart contract state.
 * @param {contractAddress}: the address of contract, example such as `demoBallotContractAddress`
 */
const giveRightToVote = async ({ contractAddress, toVoterAddress }) => {
  try {
    const BallotContract = new web3.eth.Contract(abi, contractAddress);

    const txInstance = BallotContract.methods.giveRightToVote(toVoterAddress);

    // TODO: estimate gas is not working here
    // const gasLimit = await txInstance.estimateGas();
    const gasLimit = web3.utils.toHex(1e5);
    console.log('Gas limit:', gasLimit);

    txInstance.send({
      from: web3.eth.defaultAccount,
      gas: gasLimit,
      gasPrice
    })
      .on('transactionHash', (txHash) => {
        console.log('Transaction Hash: ', txHash);
        // store database here, send response to client
      })
      .on('receipt', (receipt) => {
        console.log('Receipt: ', receipt);
      })
      .on('error', (err) => {
        console.log(err);
      });

  } catch (err) {
    console.log(err);
  }
};


/**
 * Call method `winningProposal(address toVoter)` from smart contract
 * Will call a “constant” method and execute its smart contract method in the EVM
 * without sending any transaction. Note calling can not alter the smart contract state.
 * @param {contractAddress}: the address of contract, example such as `demoBallotContractAddress`
 */
const winningProposal = async ({ contractAddress }, cb) => {
  try {
    const BallotContract = new web3.eth.Contract(abi, contractAddress);

    const txInstance = BallotContract.methods.winningProposal();

    // TODO: estimate gas is not working here
    // const gasLimit = await txInstance.estimateGas();
    const gasLimit = web3.utils.toHex(1e5);
    console.log('Gas limit:', gasLimit);

    txInstance.call({
      from: web3.eth.defaultAccount,
      gas: gasLimit,
      gasPrice
    })
      .then(result => console.log('Result: ', result))
      .catch(err => console.log(err));

  } catch (err) {
    console.log(err);
  }
};

/**
 * Call method `giveRightToVote(address toVoter)` from smart contract
 * Will send a transaction to the smart contract and execute its method.
 * Note this can alter the smart contract state.
 * @param {contractAddress}: the address of contract, example such as `demoBallotContractAddress`
 * @param {fromAddress}: the address of sender, example such as process.env.ROPSTEN_ADDRESS_A, or web3.eth.defaultAccount
 */
const vote = async ({ contractAddress, toProposal, fromAddress }) => {
  try {
    const BallotContract = new web3.eth.Contract(abi, contractAddress);

    const txInstance = BallotContract.methods.vote(toProposal);

    // TODO: estimate gas is not working here
    // const gasLimit = await txInstance.estimateGas();
    const gasLimit = web3.utils.toHex(1e5);
    console.log('Gas limit:', gasLimit);

    let address = fromAddress;
    let index = -1;

    if (!address) {
      // find free account now
      index = accountIsFree.indexOf(true);
      if (index != -1) { // exist free account
        accountIsFree[index] = false;
        address = web3.eth.accounts.wallet[index].address;

        console.log('Index - False:', index);
      } else {
        // TODO: ???
      }
    }

    console.log('Address:', address);

    // get Nonce with option pending, for handle parallel request
    const nonce = await web3.eth.getTransactionCount(address, 'pending');
    console.log('Nonce:', nonce);

    txInstance.send({
      from: address,
      gas: gasLimit,
      gasPrice,
      nonce
    })
      .on('transactionHash', (txHash) => {
        console.log('Transaction Hash: ', txHash);
        // mark address is free now
        if (index != -1) {
          accountIsFree[index] = true;
          console.log('Index - True:', index);
        }

        // store database here, send response to client
      })
      .on('receipt', (receipt) => {
        console.log('Receipt: ', receipt);
      })
      .on('error', (err) => {
        console.log(err);
      });

  } catch (err) {
    console.log(err);
  }
};

/**
 * Start here
 * */
configDefaultAccount();


/**
 * Use setTimeout for waiting config accounts
 */
setTimeout(() => {
  console.log('Started. Please waiting...');

  // getNonce();
  // getNoncePending();

  // deployBallotContract({ numProposals: 5 });

  // giveRightToVote({
  //   contractAddress: demoBallotContractAddress,
  //   toVoterAddress: process.env.ROPSTEN_ADDRESS_A
  // });

  // winningProposal({ contractAddress: demoBallotContractAddress });

  // vote({
  //   contractAddress: demoBallotContractAddress,
  //   toProposal: 1,
  //   fromAddress: process.env.ROPSTEN_ADDRESS_B
  // });


  // Vote without fromAddress
  vote({
    contractAddress: demoBallotContractAddress,
    toProposal: 1
  });
  vote({
    contractAddress: demoBallotContractAddress,
    toProposal: 1
  });
  vote({
    contractAddress: demoBallotContractAddress,
    toProposal: 1
  });

}, 1000);
