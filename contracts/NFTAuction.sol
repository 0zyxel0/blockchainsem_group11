//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Counters.sol';
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract NFTAuction is ReentrancyGuard {
    
    // Wallet that deploys the contract should receive ether for listing an auction:
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _auctionIds;

    address payable owner;
    uint256 auctionPrice = 0.045 ether;
      constructor() {
        owner = payable(msg.sender);
    }

    // Get auction Price:
    function getAuctionPrice() public view returns (uint256){
        return auctionPrice;
    }

    // Platform Item:
    struct NFTItem {
        uint itemId;
        uint tokenId;
        address nftContract;
        address payable owner;
    }

    // Auction of Platform Item:
    // remaining time -> update everythime 
    // Option uint bids, winner address
    struct Auction {
        NFTItem nft;
        uint auctionId;
        address payable highestBidder;
        uint startPrice;
        uint highestBid;
        uint auctionEndTime;
        bool ended;
    }
    // Mappings:
    mapping(uint256 => NFTItem) private idToNFTItem;
    mapping (uint256 => Auction) private idToAuction;

    // Events:
    event NFTCreated(uint itemId, uint tokenId, address nftContract, address owner);
    // Event for showing a new highest bidder:

    // Creating a Plattform Item:
    function createItem(address _nftContract, uint _tokenId) public nonReentrant{
        require(ERC721(_nftContract).ownerOf(_tokenId) == msg.sender, "You are not the owner of the NFT!");
        _tokenIds.increment();
        uint itemId = _tokenIds.current();
        idToNFTItem[itemId] = NFTItem(itemId,_tokenId, _nftContract, payable(msg.sender));
        emit NFTCreated(itemId, _tokenId, _nftContract, msg.sender);
    }

    // Get all the Platform Items:
    function getNFTItems() public view returns(NFTItem[] memory){
        uint totalItemCount = _tokenIds.current();
        uint currentIndex = 0;
        uint currentId = 0;

        NFTItem[] memory items = new NFTItem[](totalItemCount);
        for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            NFTItem storage currentItem = idToNFTItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex +=1;
        }
        return items;
    } 

    // Create an Auction:
    // Make sure to approve the contract address before procedding:
    function createAuction(uint _itemId, uint _startPrice, uint _biddingTime) public payable nonReentrant {
        // Make sure plattform item exists:
        require(idToNFTItem[_itemId].owner == msg.sender, "You are not the owner of the Item!");
        require(_startPrice >= 0, "The starting Price must be bigger equal 0!");
        require(_biddingTime > 0, "The bidding time must be bigger as 0 seconds!");
        require(msg.value == auctionPrice, "You need to pay the auction price!");
        
        _auctionIds.increment();
        uint auctionId = _auctionIds.current();

        // Creating an auction:
        idToAuction[auctionId] = Auction(idToNFTItem[_itemId], auctionId, payable(address(0)), _startPrice, 0, block.timestamp + _biddingTime, false);

        // Transfer Token to contract and pay fee:
        ERC721(idToNFTItem[_itemId].nftContract).transferFrom(msg.sender, address(this), idToNFTItem[_itemId].tokenId);
        payable(owner).transfer(auctionPrice);
    } 

    // Get all active Auctions:
    function getAllAuctions() public view returns(Auction[] memory){
        uint totalItemCount = _auctionIds.current();
        uint currentIndex = 0;
        uint currentId = 0;

        Auction[] memory items = new Auction[](totalItemCount);
        for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            Auction storage currentItem = idToAuction[currentId];
            items[currentIndex] = currentItem;
            currentIndex +=1;
        }
        return items;
    }

    // Allows a user to bid on an auction Item:
    function BidOnAuctionItem(uint _auctionId) public payable nonReentrant{
         if (block.timestamp > idToAuction[_auctionId].auctionEndTime){
            revert("The auction has allready ended!");
        }
         if (msg.value <=  idToAuction[_auctionId].highestBid){
            revert("There is already a higher or equal bid");
        }
        if (idToAuction[_auctionId].highestBid == 0 && msg.value != idToAuction[_auctionId].startPrice){
            revert("You need to pay the starting Price");
        }
         // We need to return the money to the old highestBidder:
        if (idToAuction[_auctionId].highestBid != 0 && idToAuction[_auctionId].highestBidder != payable(address(0))){
            // Return the money to the old highest Bidder:
            idToAuction[_auctionId].highestBidder.transfer(idToAuction[_auctionId].highestBid);
        }
        // Update the highest bid and the bidder:
        idToAuction[_auctionId].highestBid = msg.value;
        idToAuction[_auctionId].highestBidder = payable(msg.sender); 
    }

    // Function for ending the Auction:
    function transferNFTandFunds(uint _auctionId) public {
        if (block.timestamp < idToAuction[_auctionId].auctionEndTime){
            revert("not ended");
        }
        if (idToAuction[_auctionId].ended){
            revert("The money and Token have been transfered");
        }
        idToAuction[_auctionId].ended = true;
        // Transfer the NFT:
        ERC721(idToAuction[_auctionId].nft.nftContract).transferFrom(address(this),idToAuction[_auctionId].highestBidder, idToAuction[_auctionId].nft.tokenId);
        // Transfer cash to Owner:
        payable(idToAuction[_auctionId].nft.owner).transfer(idToAuction[_auctionId].highestBid);
        
    }
    // Methods missing
    // Get all auctions that are active and you are the owner of

    // Get all auctions that have ended, that you are the owner of

    
    // Get all auctions that are active and you are the highest bidder of
    
    // Get all auctions that have ended, that you are the highest bidder/winner of
}