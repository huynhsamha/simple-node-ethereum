module.exports = {
  eth: {
    apiKey: process.env.INFURA_API_KEY || 'your infura api key',
    apiSecret: process.env.INFURA_API_SECRET || 'your infura api secret',
    provider: process.env.INFURA_PROVIDER || 'your infura url provider',
    ropstenAddress: process.env.ROPSTEN_ADDRESS || 'your Ropsten network address',
    ropstenPrivateKey: process.env.ROPSTEN_PRIVATE_KEY || 'your Ropsten netword private key',
    network: process.env.ETH_NETWORK || 'local'
  }
};
