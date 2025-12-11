// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./UserRegistry.sol";

contract GlobalRegistry is Ownable{

    mapping(address => address) public globalRegistry;
    address[] public registryAddresses;
    address public userRegistryImpl;

    constructor(address userRegistryImpl_) Ownable(msg.sender) {
        userRegistryImpl = userRegistryImpl_;
    }


    event RegistryCreated(address indexed owner, address indexed registryAddress, string authorName);

    /**
     * @notice Get certain number of registries
     */
    function getUserRegistries(uint256 numberOfRegistries) public view returns(address[] memory) {
        numberOfRegistries = numberOfRegistries > registryAddresses.length ? registryAddresses.length : numberOfRegistries;
        address[] memory addresses = new address[](numberOfRegistries);
        for (uint256 i = 0; i < numberOfRegistries; i++) {
            addresses[i] = registryAddresses[i];
        }
        return addresses;
    }

    function getUserRegistry(address creator) external view returns(address) {
        return _getUserRegistry(creator);
    }

    function _getUserRegistry(address user) private view returns (address) {
        address registryAddress = globalRegistry[user];
        require(registryAddress != address(0), "No registry");
        return registryAddress;
    }

    /**
     * @notice Create a new user registry
     * @param authorName_ Name of the author
     */
    function createNewRegistry(string memory authorName_) external payable {
        require(globalRegistry[msg.sender] == address(0), "Registry already exists.");
        address newRegistryAddress = Clones.clone(userRegistryImpl);
        UserRegistry newRegistry = UserRegistry(newRegistryAddress);
        newRegistry.transferOwnership(msg.sender);
        globalRegistry[msg.sender] = newRegistryAddress;
        registryAddresses.push(newRegistryAddress);
        emit RegistryCreated(msg.sender, newRegistryAddress, authorName_);
    }

    /**
     * @notice Expose function to check that a user owns a token
     */
    function hasAccess(string memory assetName, address creatorAddress) external view returns(bool) {
        address registryAddress = _getUserRegistry(creatorAddress);        
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
}