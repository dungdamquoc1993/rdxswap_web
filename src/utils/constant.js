const POOabi = require('./PoolPair.json')
const RDXabi = require('./RedDotToken.json')
const WJKabi = require('./WojakToken.json')

const KOVAN_API = 'https://kovan.infura.io/v3/8bf322110b8c4fbf87055c7fd3981adf'

const PoolPair = {
    contractABI: POOabi.abi,
    contractAddress: '0xeEBB4792E21928081cD51B51450Ff205C7C41fb1'
}
const RedDotToken = {
    contractABI: RDXabi.abi,
    contractAddress: '0xf502F5266A9ED86a58775499a9728f397a2e33C6'
}
const WojakToken = {
    contractABI: WJKabi.abi,
    contractAddress: '0x5115E5b0A2CdDDe4f5b80f674855dff5b5BB3b66'
}

module.exports = {PoolPair, RedDotToken, WojakToken, KOVAN_API}


