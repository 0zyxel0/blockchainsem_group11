//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NFTTrader {
    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => uint256) public balances;
    
    struct Listing {
        uint256 price;
        address seller;
    }

    function addListing(uint256 price, address contractAddr, uint256 tokenId) public {
        ERC1155 token = ERC1155(contractAddr);
        require(token.balanceOf(msg.sender, tokenId) > 0, "Creator Must Own TokenID");
        // Return the Current Smart  Contract Address and check if it will be approved
        require(token.isApprovedForAll(msg.sender, address(this)), "Contract Must Be Approved");

        listings[contractAddr][tokenId] = Listing(price, msg.sender);


    }

    function purchase(address contractAddr, uint256 tokenId, uint256 amount) public payable{
        Listing memory item = listings[contractAddr][tokenId];
        require(msg.value>= item.price * amount, "Inssuficient Funds Sent");
        balances[item.seller] += msg.value;

        ERC1155 token = ERC1155(contractAddr);
        token.safeTransferFrom(item.seller, msg.sender, tokenId, amount, "");
    }

    function withdraw(uint256 amount, address payable destAddr) public {
        // Check if the Sender has enough Money
        require(amount <= balances[msg.sender], "Insufficient Funds");
        // Amount will always be in Wei
        destAddr.transfer(amount);
        balances[msg.sender] -= amount;

    }


}