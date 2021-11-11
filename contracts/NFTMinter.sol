// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.3;
// Easy to use utility with safeMath:
import "@openzeppelin/contracts/utils/Counters.sol";
// This gives us the function set TokenURI:
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";
// This contract creates an NFT -> Cost: 0.5 ethers
contract NFTMinter is ERC721URIStorage {
    // We set set a new counter to declare tokenId's -> Incrementing value for the NFT.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    // Will hold the value of the marketplace:
    address contractAddress;
    // Give it a name and a symbol:
    constructor(address marketplaceAddress) ERC721("UZH NFT", "UZHNFT") {
        contractAddress = marketplaceAddress;
    }
    // Takes in the TokenURI (URL from ipfs and mints the NFT)
    function createToken(string memory tokenURI) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        // Allows the marketplace the approval to transact between users within other contracts:
        // Sets or unsets the approval of a given operator An operator is allowed to transfer all tokens
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}