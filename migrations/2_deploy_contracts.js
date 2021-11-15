var NFTAuction = artifacts.require('NFTAuction.sol');
var NFT = artifacts.require('NFT.sol');

module.exports = function(deployer){
    deployer.deploy(NFTAuction).then(function(){
        return deployer.deploy(NFT, NFTAuction.address);
    });
}
