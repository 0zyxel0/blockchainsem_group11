var NFTMarket = artifacts.require('NFTMarket.sol');
var NFTMinter = artifacts.require('NFTMinter.sol');

module.exports = function(deployer){
    deployer.deploy(NFTMarket).then(function(){
        return deployer.deploy(NFTMinter, NFTMarket.address);
    });
}
