// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./UserRegistry.sol";

contract GlobalRegistry is Ownable{

    constructor() Ownable(msg.sender) {}

    mapping(address => address) public globalRegistry;

    // event RegistryRegistered(address indexed owner, address indexed registryAddress);

    event RegistryCreated(address indexed owner, address indexed registryAddress, string authorName);

    // /**
    //  * @notice Get all assets created by an address
    //  */
    // function getAssetsByCreator(address creator) external view returns (string[] memory) {
    //     return UserRegistry(_getRegistry(creator)).getAllAssetNames();
    // }

    // function getAllRegistries() public {


    // }

    function getUserRegistry(address creator) external view returns(address) {
        return _getRegistry(creator);
    }

    function _getRegistry(address user) private view returns (address) {
        address registryAddress = globalRegistry[user];
        require(registryAddress != address(0), "No registry");
        return registryAddress;
    }

    // function _verifyRegistry(address creator, address registryAddress) private view {
    //     require(creator == UserRegistry(registryAddress).owner(), "Not the owner.");
    // }

    event AssetRegistered(address indexed registryOwner, string indexed assetName);
    // event AssetMinted(address indexed registryOwner, string indexed assetName, address indexed buyer);
    /**
     * @notice Register a new asset (delegates to UserRegistry)
     */
    function registerNewAsset(
        string calldata assetName, 
        string calldata cid,
        uint256 price,
        uint96 royaltyAmount,
        uint256 maxSupply
    )
    external payable {
        _validateAssetParams(assetName, cid);
        address registryAddress = _getRegistry(msg.sender);
        UserRegistry userRegistry = UserRegistry(registryAddress);
        userRegistry.registerNewAsset(maxSupply, assetName, price, royaltyAmount);
        emit AssetRegistered(msg.sender, assetName);
    }

    // function mintNewAsset(address registryOwner, string memory assetName) public payable {
    //     address registryAddress = _getRegistry(registryOwner);
    //     UserRegistry userRegistry = UserRegistry(registryAddress);
    //     userRegistry.mintNewToken{value: msg.value}(assetName, msg.sender);
    //     emit AssetMinted(registryOwner, assetName, msg.sender);
    // }

    /**
     * @notice Create a new user registry
     * @param authorName_ Name of the author
     */
    function createNewRegistry(string memory authorName_) external payable {
        require(globalRegistry[msg.sender] == address(0), "Registry already exists.");
        globalRegistry[msg.sender] = address(new UserRegistry(msg.sender, authorName_, address(this)));
        emit RegistryCreated(msg.sender, globalRegistry[msg.sender], authorName_);
    }

    /**
     * @notice Expose function to check that a user owns a token
     */
    function hasAccess(string memory assetName, address creatorAddress) external view returns(bool) {
        address registryAddress = _getRegistry(creatorAddress);        
        UserRegistry userRegistry = UserRegistry(registryAddress);
        return userRegistry.hasAccess(msg.sender, assetName);
    }

    function _validateAssetParams(string calldata assetName, string calldata cid) 
        private 
        pure 
    {
        require(bytes(assetName).length > 0, "Empty name");
        require(bytes(cid).length > 0, "Empty CID");
    }

    // a function to update the cost of setting up the registry
    // right now registry creation is free (minus gas fees)
    // function updateGlobalRegistryPrice() public onlyOwner {}
}