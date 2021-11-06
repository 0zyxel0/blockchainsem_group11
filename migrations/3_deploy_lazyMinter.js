var LazyMinter = artifacts.require('./LazyMinter.sol');

module.exports = function(deployer){
    deployer.deploy(LazyMinter);
}