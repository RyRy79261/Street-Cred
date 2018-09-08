var CCRCore = artifacts.require("./CCRCore.sol");
var CCRCoreFactory = artifacts.require("./CCRCoreFactory.sol");
var ethRegistryAddress = "0xc9ed21ffcc88a5072454c43bdfdbbe3430888b19";

module.exports = function(deployer) {
  deployer.deploy(CCRCoreFactory, ethRegistryAddress);
};
