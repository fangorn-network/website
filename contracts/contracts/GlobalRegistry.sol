// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./UserRegistry.sol";

contract GlobalRegistry {

    mapping(address => address) public globalRegistry;

    function registerNewAsset(
        string memory assetName, 
        string memory cid,
        uint256 price,
        uint96 royaltyAmount,
        uint256 maxSupply
    )
    external payable {
        address registryOwner = msg.sender;
        address registryAddress = globalRegistry[registryOwner];
        require( registryAddress != address(0), "This wallet address has not created a user registry.");
        UserRegistry userRegistry = UserRegistry(registryAddress);
        // Not sure if this is necessary since registryOwner is taken from msg.sender. It may be redundant
        require(registryOwner == userRegistry.owner(), "You do not own this registry.");
        require(bytes(assetName).length > 0, "AssettName must be non-empty");
        require(bytes(cid).length > 0, "cid must be non-empty");
        userRegistry.registerNewAsset(maxSupply, assetName, price, royaltyAmount);
    }

    function mintNewAsset(address registryOwner, string memory assetName) public payable {
        address buyer = msg.sender;
        address registryAddress = globalRegistry[registryOwner];
        require(registryAddress != address(0), "Unable to find user's registry.");
        UserRegistry userRegistry = UserRegistry(registryAddress);
        userRegistry.mintNewToken(assetName, buyer);
    }

    // create new registry
    function createNewRegistry(string memory authorName_) external payable {
        address registryOwner = msg.sender;
        require(globalRegistry[registryOwner] == address(0), "This wallet address already owns a registry.");
        if (bytes(authorName_).length == 0) {
            authorName_ = Strings.toHexString(msg.sender);
        }
        UserRegistry userRegistry = new UserRegistry(registryOwner, authorName_);
        globalRegistry[registryOwner] = address(userRegistry);
    }

    function getAssetsByCreator(address creator) external view {

    }
}