var NFTFactory = artifacts.require('./NFTFactory.sol');

module.exports = function(deployer){
    deployer.deploy(NFTFactory);
}