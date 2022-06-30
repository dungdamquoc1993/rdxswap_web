import { ethers } from 'ethers'

import { PoolPair, RedDotToken, WojakToken } from './constant'
const { ethereum } = window

export const getContract = async (contractName) => {
    if (!ethereum) {
        alert('please install metamask˝')
    }
    let contract
    const provider = new ethers.providers.Web3Provider(ethereum)

    const signer = provider.getSigner()

    if (contractName === 'POO') {
        contract = new ethers.Contract(PoolPair.contractAddress, PoolPair.contractABI, signer)
    } else if (contractName === 'RDX') {
        contract = new ethers.Contract(RedDotToken.contractAddress, RedDotToken.contractABI, signer)
    } else if (contractName === 'WJK') {
        contract = new ethers.Contract(WojakToken.contractAddress, WojakToken.contractABI, signer)
    }
    return contract
}