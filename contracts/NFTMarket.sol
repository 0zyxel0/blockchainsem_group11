// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
// Security mechanism: Protects against hitting the contract with multiple reentrances (reentry attacks)
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    // These are for the Market Items: 
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    // Address for the owner of the contract -> They make a comission for listing and creating the NFT:
    address payable owner;
    uint256 creationPrice = 0.5 ether;
    uint256 listingPrice = 0.4 ether;

    // The person deploying it is the owner:
    constructor(){
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        address creator;
        uint256 price;
        bool sold;
    }
    // MarketItemId to MarketItem
    mapping(uint256 => MarketItem) private idToMarketItem;

    // Event when MarketItem is created:
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        address creator,
        uint256 price,
        bool sold
     );

    // Functions to get the Listing Price (Sell it on the market):
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }
    // Function to get the creation price for the NFT: 
     function getcreationPrice() public view returns (uint256) {
        return creationPrice;
    }

    // Function to approve transfer:
     function approveForTransfer(address nftContract, address marketContract, uint256 tokenId) public {
       IERC721(nftContract).approve(marketContract, tokenId);
     }

    /* This function creates a Market NFT Item (Can be seen on the Market):
      @param: nftContract: The Contract Address of the NFT
      @tokenId: The id of the Token
    */
    function createMarketNFT(address nftContract, uint256 tokenId) public payable nonReentrant  {
        require(msg.value == creationPrice, "Price must be equal to Market Item creation price");
         // Creating the MarketItem NFT: Is now visible on the Market:
         _itemIds.increment();
        uint256 itemId = _itemIds.current();

        // This sets the seller and owner to the owner of the NFT and sets the price to 0 and sold to false:
        idToMarketItem[itemId] =  MarketItem(itemId,nftContract,tokenId,payable(msg.sender),payable(msg.sender),msg.sender,0,false);

        // Sending the money to the contract:
        payable(owner).transfer(creationPrice);
        emit MarketItemCreated(itemId, nftContract,tokenId,msg.sender,msg.sender,msg.sender,0,false);

    }

    /*  This function lists the NFT for sale on the market:
        @param: nftContract: The Contract Address of the NFT
        @param: itemId: The MarketItem Id
        @param: price: The price of the user to sell the NFT
    */
    function ListMarketItemForSale(address nftContract, uint256 itemId, uint256 price) public payable nonReentrant{
        // Price has to be bigger then 0:
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");
        require(msg.sender == idToMarketItem[itemId].owner, "You are not the owner of the Market Item / NFT!");

        // Updating the MarketItem:
        idToMarketItem[itemId].owner = payable(address(0));
        idToMarketItem[itemId].price = price;
        idToMarketItem[itemId].sold = false;

        // Sending the ownership of the NFT to the contract:
        ERC721(nftContract).transferFrom(msg.sender, address(this), idToMarketItem[itemId].tokenId);
        // Pay the owner the listing price:
        payable(owner).transfer(listingPrice);
        emit MarketItemCreated(itemId, nftContract,idToMarketItem[itemId].tokenId,msg.sender,address(0),idToMarketItem[itemId].creator,price,false);
     }

     /* Creates a sale for a market item, Transfer Ownership from the contract to the new owner
        and send the funds from new owner to seller 
        @param: nftContract: Address of the NFT contract
        @param: itemId: Id of the MarketItem    
    */
    function createMarketSale(address nftContract, uint256 itemId) public payable nonReentrant { 
        // We do not want, that the seller of the NFT can buy his own NFT!
        require(msg.sender != idToMarketItem[itemId].seller, "You cannot buy your own NFT!");
        uint price = idToMarketItem[itemId].price;
        uint tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        
        // Transfer the price in Eth from new owner (msg.sender) to seller:
        idToMarketItem[itemId].seller.transfer(msg.value);

        // Changing the values:
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].seller = payable(msg.sender);

        // Transfer ownership from contract to new owner (msg.sender):
        ERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
    }

    /* Unlist Item from Marketplace */ 
    function unlistNft(address nftContract, uint256 itemId) public payable nonReentrant{
      require(msg.sender == idToMarketItem[itemId].seller, "You cannot unlist an NFT, that is not yours!");
      // We now unlist the item from the marketplace -> Setting the owner back to the seller:
      ERC721(nftContract).transferFrom(address(this),idToMarketItem[itemId].seller,idToMarketItem[itemId].tokenId);
    }


    /* Returns an array of Market Items (non sold) */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        // All unsold MarketItems:
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        // i+1 as we start with MarketItem with itemId = 1:
        // if address(0) is set as owner it means the item is for sale but not sold!
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                // Adding the item to the array index:
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }return items;
    }

    /* Returns all the Market Items a user can buy are being sold */
    function fetchMarketItemsUser() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      // Checks for items sold, that are not sold by the owner:
      if (idToMarketItem[i + 1].owner == address(0) && idToMarketItem[i + 1].seller != msg.sender) {
        itemCount += 1;
      }
    }
    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == address(0) && idToMarketItem[i + 1].seller != msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
    }

    /* Returns only items that a user has bought */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  /* Returns only items a user has created (is trying to sell) */
  function fetchItemsCreated() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].creator == msg.sender) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].creator == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  } 

   /* Returns all the NFT's the user currently has listed on the marketplace (not sold yet)*/
    function nftsListed() public view returns (MarketItem[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender && idToMarketItem[i + 1].owner == address(0)) {
        itemCount += 1;
      }
    }

    MarketItem[] memory items = new MarketItem[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].seller == msg.sender && idToMarketItem[i + 1].owner == address(0)) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  } 



}
