import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'

import { NetworkConnector } from './NetworkConnector'

enum ChainId {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_ROPSTEN = 3,
  ETHEREUM_RINKEBY = 4,
  ETHEREUM_GÖRLI = 5,
  ETHEREUM_KOVAN = 42,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
  AVALANCHE_FUJI = 43113,
  AVALANCHE_MAINNET = 43114,
}

const AVAX_NETWORK_URL = 'https://api.avax.network/ext/bc/C/rpc'
const ETH_NETWORK_URL =
  'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'

export const NETWORK_URL: { [key in ChainId]: string } = {
  [ChainId.AVALANCHE_MAINNET]: AVAX_NETWORK_URL,
  [ChainId.ETHEREUM_MAINNET]: ETH_NETWORK_URL,
  3: '',
  4: '',
  42: '',
  43113: '',
  5: '',
  56: '',
  97: '',
}

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(network: NetworkConnector): Web3Provider {
  return (networkLibrary =
    networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({})
