/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

// ERC780 registries 
// Mainnet (id: 1) 	0xdb55d40684e7dc04655a9789937214b493a2c2c6
// Ropsten (id: 3) 	0x737f53c0cebf0acd1ea591685351b2a8580702a5
// Rinkeby (id: 4) 	0xc9ed21ffcc88a5072454c43bdfdbbe3430888b19
// Kovan (id: 42) 	0x7ed7ceb55167eb71e775a352111dae44db754c40


module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 500
    }
  } 
};
