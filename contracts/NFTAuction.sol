//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
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
    // title + Desctiption
    // Previous owner 
    struct NFTItem {
        uint itemId;
        uint tokenId;
        string title;
        string description;
        address nftContract;
        address payable owner;
        address payable previousOwner;
    }

    // Auction of Platform Item:
    struct Auction {
        NFTItem nft;
        uint auctionId;
        address payable highestBidder;
        address payable winner;
        uint buyNow;
        uint startPrice;
        uint highestBid;
        uint bids;
        uint auctionEndTime;
        bool ended;
    }
    // Mappings:
    mapping(uint256 => NFTItem) private idToNFTItem;
    mapping (uint256 => Auction) private idToAuction;

    // Events:
    // Emits, that a NFT-Item has been created:
    event NFTCreated(uint itemId, uint tokenId, address nftContract, address owner);
    // Emits, that an Auction has been created:
    event AuctionCreated(uint auctionId, uint itemId, uint startPrice, uint auctionEndTime);
    // Event for showing a new highest bidder:
    event NewHighestBid(uint auctionId, address newBidder, uint newHighestBid);


    // Creating a Plattform Item:
    function createItem(address _nftContract, uint _tokenId, string memory _title, string memory _description) public nonReentrant{
        require(ERC721(_nftContract).ownerOf(_tokenId) == msg.sender, "You are not the owner of the NFT!");
        _tokenIds.increment();
        uint itemId = _tokenIds.current();
        idToNFTItem[itemId] = NFTItem(itemId,_tokenId, _title, _description,_nftContract, payable(msg.sender), payable(msg.sender));
        emit NFTCreated(itemId, _tokenId, _nftContract, msg.sender);
    }

    // Get all the Platform Items (ALL):
    function getAllNFTItems() public view returns(NFTItem[] memory){
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

    // Get all NFT Items, that the user owns (the msg.sender):
    function getAllNFTOwned() public view returns(NFTItem[] memory){
        uint totalItemCount = _tokenIds.current();
        uint currentIndex = 0;
        uint currentId = 0;
        uint lenght_items = 0;

        // Calculate the lenght of the items array:
         for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            NFTItem storage currentItem = idToNFTItem[currentId];
            if(currentItem.owner == msg.sender){
                lenght_items +=1;
            }
        }
        // Calculate the array of items:
        NFTItem[] memory items = new NFTItem[](lenght_items);
        for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            NFTItem storage currentItem = idToNFTItem[currentId];
            if(currentItem.owner == msg.sender){
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }

    // Create an Auction:
    // Make sure to approve the contract address before procedding:
    function createAuction(uint _itemId, uint _startPrice, uint _buyNow, uint _biddingTime) public payable nonReentrant {
        // Make sure plattform item exists:
        require(idToNFTItem[_itemId].owner == msg.sender, "You are not the owner of the Item!");
        require(_startPrice >= 0, "The starting Price must be bigger equal 0!");
        require(_buyNow > 0, "The Buynow price must be bigger than 0!");
        require(_buyNow > _startPrice, "The BuyNow price must be bigger than the starting price");
        require(_biddingTime > 0, "The bidding time must be bigger as 0 seconds!");
        require(msg.value == auctionPrice, "You need to pay the auction price!");

        
        _auctionIds.increment();
        uint auctionId = _auctionIds.current();

        // Setting the new owner to the contract address and the previous owner to msg.sender:
        idToNFTItem[_itemId].owner = payable(address(this));
        idToNFTItem[_itemId].previousOwner = payable(msg.sender);

        // Creating an auction (winner = highestbidder = 0 address)
        uint endOfAuction = block.timestamp + _biddingTime;
        idToAuction[auctionId] = Auction(idToNFTItem[_itemId], auctionId, payable(address(0)), payable(address(0)),_buyNow,_startPrice, 0, 0, endOfAuction, false);

        // Transfer Token to contract and pay fee to contract owner:
        ERC721(idToNFTItem[_itemId].nftContract).transferFrom(msg.sender, address(this), idToNFTItem[_itemId].tokenId);
        payable(owner).transfer(auctionPrice);
        emit AuctionCreated(auctionId,_itemId,_startPrice, endOfAuction);
        
    } 

    // Get all Auctions, that you are not the previous owner of (ended and not ended):
    // These are the ones displayed on the Marketplace:
    function getAllAuctions() public view returns(Auction[] memory){
        uint totalItemCount = _auctionIds.current();
        uint currentIndex = 0;
        uint currentId = 0;
        uint lenght_items = 0;


        // Calculate the lenght of the items array:
         for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            Auction storage currentItem = idToAuction[currentId];
            if(currentItem.nft.previousOwner != msg.sender){
                lenght_items +=1;
            }
        }

        // Getting the array of elements:
        Auction[] memory items = new Auction[](lenght_items);
        for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            Auction storage currentItem = idToAuction[currentId];
            if (currentItem.nft.previousOwner != msg.sender){
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }
    
    // Get All Auction, that you are the previous owner of - Auctions you have started with your NFTItem (ended and not ended):
    function getAllAuctionsOwned() public view returns(Auction[] memory){
        uint totalItemCount = _auctionIds.current();
        uint currentIndex = 0;
        uint currentId = 0;
        uint lenght_items = 0;


         // Calculate the lenght of the items array:
         for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            Auction storage currentItem = idToAuction[currentId];
            if(currentItem.nft.previousOwner == msg.sender){
                lenght_items +=1;
            }
         }
        
        // Calculate the array:
        Auction[] memory items = new Auction[](lenght_items);
        for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            Auction storage currentItem = idToAuction[currentId];
            if (currentItem.nft.previousOwner == msg.sender){
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }

    // Allows a user to bid on an auction Item:
    function BidOnAuctionItem(uint _auctionId) public payable nonReentrant{
         if (block.timestamp > idToAuction[_auctionId].auctionEndTime){
            revert("The auction has allready ended, you cannot bid anymore!");
        }
         if (msg.value <=  idToAuction[_auctionId].highestBid){
            revert("There is already a higher or equal bid on the item!");
        }
        // Checks if the starting price was met or not:
        if (idToAuction[_auctionId].highestBid == 0 && msg.value != idToAuction[_auctionId].startPrice){
            revert("You need to pay the starting Price!");
        }
         // We need to return the money to the old highestBidder:
        if (idToAuction[_auctionId].highestBid != 0 && idToAuction[_auctionId].highestBidder != payable(address(0))){
            // Return the money to the old highest Bidder:
            idToAuction[_auctionId].highestBidder.transfer(idToAuction[_auctionId].highestBid);
        }
        // Update the highest bid and the bidder:
        idToAuction[_auctionId].highestBid = msg.value;
        idToAuction[_auctionId].highestBidder = payable(msg.sender); 
        idToAuction[_auctionId].bids += 1;
        emit NewHighestBid(_auctionId, msg.sender, msg.value);
    }
    

    // Get all the auctions, where you are the highest Bidder, but not the previous owner (ended and not ended):
    function getAllAuctionHighestBidder() public view returns(Auction[] memory){
        uint totalItemCount = _auctionIds.current();
        uint currentIndex = 0;
        uint currentId = 0;
        uint lenght_items = 0;

        // Calculate the size of the array:
         for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            Auction storage currentItem = idToAuction[currentId];
            if(currentItem.highestBidder == msg.sender){
                lenght_items +=1;
            }
         }
        
        // Calculate the array:
        Auction[] memory items = new Auction[](lenght_items);
        for(uint i = 0; i < totalItemCount; i++) {
            currentId = i + 1;
            Auction storage currentItem = idToAuction[currentId];
            if (currentItem.highestBidder == msg.sender){
                items[currentIndex] = currentItem;
                currentIndex +=1;
            }
        }
        return items;
    }
    // This method needs to get called if someone wants to use the buy Now functionality:
    function BuyNFTNow(uint _auctionId) public payable nonReentrant{
           if (block.timestamp > idToAuction[_auctionId].auctionEndTime){
            revert("The auction has ended, you cannot use the buy Now functionality!");
        }
        require(idToAuction[_auctionId].buyNow == msg.value, "The Buynow Price has not been paid!");
        
        // Setting the user as highest bidder + ending the auction by setting the endtime = Now:
        idToAuction[_auctionId].highestBid = msg.value;
        idToAuction[_auctionId].highestBidder = payable(msg.sender);
        idToAuction[_auctionId].auctionEndTime = block.timestamp;
    }

    // Function for ending the Auction:
    function transferNFTandFunds(uint _auctionId) public {
        if (block.timestamp < idToAuction[_auctionId].auctionEndTime){
            revert("The auction has not ended yet!");
        }
        if (idToAuction[_auctionId].ended){
            revert("The money and Token have been transfered already!");
        }
        // Only the previous Owner or the HighestBidder can call this function:
        if (payable(msg.sender) != idToAuction[_auctionId].nft.previousOwner && payable(msg.sender) != idToAuction[_auctionId].highestBidder){
            revert("You do not have the authority to call this function!");
        }
        idToAuction[_auctionId].ended = true;

        // If NFT not sold transfer it back to the previous owner:
        if (idToAuction[_auctionId].highestBidder == address(0)){
            idToNFTItem[idToAuction[_auctionId].nft.itemId].owner = payable(idToAuction[_auctionId].nft.previousOwner);
            ERC721(idToAuction[_auctionId].nft.nftContract).transferFrom(address(this),idToNFTItem[idToAuction[_auctionId].nft.itemId].owner, idToAuction[_auctionId].nft.tokenId);
        }
        else {
            // Transfer the NFT to the highest Bidder:
            idToNFTItem[idToAuction[_auctionId].nft.itemId].owner = idToAuction[_auctionId].highestBidder;
            idToAuction[_auctionId].winner =  idToAuction[_auctionId].highestBidder;
            ERC721(idToAuction[_auctionId].nft.nftContract).transferFrom(address(this),idToAuction[_auctionId].highestBidder, idToAuction[_auctionId].nft.tokenId);
            payable(idToAuction[_auctionId].nft.previousOwner).transfer(idToAuction[_auctionId].highestBid);
        }
    }
  
}