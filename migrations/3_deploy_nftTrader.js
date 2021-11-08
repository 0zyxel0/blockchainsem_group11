var NFTTrader = artifacts.require('./NFTTrader.sol');

module.exports = function(deployer){
    deployer.deploy(NFTTrader);
}