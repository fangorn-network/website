// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./UserRegistry.sol";

contract GlobalRegistry is Ownable{

    constructor() Ownable(msg.sender) {}

    mapping(address => address) public globalRegistry;

    event RegistryCreated(address indexed owner, address indexed registryAddress, string authorName);
    event AssetRegistered(address indexed registryOwner, string indexed assetName);
    event AssetMinted(address indexed registryOwner, string indexed assetName, address indexed buyer);

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
        require(registryAddress != address(0), "This wallet address has not created a user registry.");
        UserRegistry userRegistry = UserRegistry(registryAddress);
        // Not sure if this is necessary since registryOwner is taken from msg.sender. It may be redundant
        require(registryOwner == userRegistry.owner(), "You do not own this registry.");
        require(bytes(assetName).length > 0, "AssettName must be non-empty");
        require(bytes(cid).length > 0, "cid must be non-empty");
        userRegistry.registerNewAsset(maxSupply, assetName, price, royaltyAmount);
        emit AssetRegistered(msg.sender, assetName);
    }

    function mintNewAsset(address registryOwner, string memory assetName) public payable {
        address buyer = msg.sender;
        address registryAddress = globalRegistry[registryOwner];
        require(registryAddress != address(0), "Unable to find user's registry.");
        UserRegistry userRegistry = UserRegistry(registryAddress);
        userRegistry.mintNewToken{value: msg.value}(assetName, buyer);
        emit AssetMinted(registryOwner, assetName, msg.sender);
    }

    // create new registry
    function createNewRegistry(string memory authorName_) external payable {
        address registryOwner = msg.sender;
        require(globalRegistry[registryOwner] == address(0), "The calling address already owns a registry.");
        if (bytes(authorName_).length == 0) {
            authorName_ = Strings.toHexString(msg.sender);
        }
        UserRegistry userRegistry = new UserRegistry(msg.sender, authorName_, address(this));
        address userRegistryAddress = address(userRegistry);
        globalRegistry[registryOwner] = userRegistryAddress;
        emit RegistryCreated(msg.sender, userRegistryAddress, authorName_);
    }

    function getAssetsByCreator(address creator) external view returns(string[] memory) {
        address registryAddress = globalRegistry[creator];
        require( registryAddress != address(0), "This wallet address has not created a user registry.");
        UserRegistry userRegistry = UserRegistry(registryAddress);
        return userRegistry.getAllAssetNames();
    }

    function updateGlobalRegistryPrice() public onlyOwner {}
}