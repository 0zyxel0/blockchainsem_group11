//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';

/// This contracts mints new NFTS 
contract NFT is ERC721URIStorage {
    // Creating a tokenid counter starting at 0:
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address NFTAuction;

    // Constructor used of ERC721 (setting AuctionHouseAddress)
    constructor(address _NFTAuction) ERC721('UZHNFT','UZH') {
        NFTAuction = _NFTAuction;
    }

    // This method mints the NFT and returns the tokenId:
    function mintToken(string memory _tokenURI) public returns(uint256){
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        // Approval is given to the operator (AuctionHouse) to 
        setApprovalForAll(NFTAuction, true);
        return newItemId;
    }

}
