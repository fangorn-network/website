// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {LimitedThresholdEncryptedAsset, UnlimitedThresholdEncryptedAsset} from "./ThresholdEncryptedAsset.sol";

contract UserRegistry is Ownable, ReentrancyGuard {

    string _authorName;
    address public _delegatorAddress;
    string[] public assetNames;

    mapping(string => AssetInfo) assetRegistry;

    enum AssetType {Limited, Unlimited}

    struct AssetInfo {
        address assetAddress;
        AssetType assetType;
        uint256 createdAt;
    }

    event AssetRegistered(
        string indexed assetName, 
        address indexed assetAddress, 
        AssetType assetType
    );

    constructor(address registryCreator_, string memory authorName_) Ownable(registryCreator_) {
        _authorName = authorName_;
    }

    function registerNewAsset(uint256 maxSupply_, string memory assetName_, uint256 nftPrice_, uint96 royaltyAmount_, string memory tokenName, string memory tokenSymbol) public onlyOwner {

        require (assetRegistry[assetName_].assetAddress == address(0), "Asset name aready exists");
        address newAssetAddress;
        AssetType assetType;

        if (maxSupply_ == 0) {
            newAssetAddress = address(new UnlimitedThresholdEncryptedAsset(nftPrice_, royaltyAmount_, owner(), address(this), tokenName, tokenSymbol));
            assetType = AssetType.Unlimited;
        } else {
            newAssetAddress = address(new LimitedThresholdEncryptedAsset(nftPrice_, royaltyAmount_, maxSupply_, owner(), address(this), tokenName, tokenSymbol));
            assetType = AssetType.Limited;
        }
        
        assetRegistry[assetName_] = AssetInfo({
            assetAddress: newAssetAddress,
            assetType: assetType,
            createdAt: block.timestamp
        });
        
        assetNames.push(assetName_);
        
        emit AssetRegistered(assetName_, newAssetAddress, assetType);
    }

    function _getAsset(string memory assetName_) 
        private 
        view 
        returns (address, AssetType) 
    {
        AssetInfo memory info = assetRegistry[assetName_];
        require(info.assetAddress != address(0), "Asset not found");
        return (info.assetAddress, info.assetType);
    }

    function mintNewToken(string memory assetName, address buyer) public payable nonReentrant {
        (address assetAddr, AssetType assetType) = _getAsset(assetName);
        if (assetType == AssetType.Unlimited) {
            UnlimitedThresholdEncryptedAsset unlimitedAsset =  UnlimitedThresholdEncryptedAsset(assetAddr);
            unlimitedAsset.tryPurchaseToken{value: msg.value}(buyer);
        } else {
            LimitedThresholdEncryptedAsset limitedAsset =  LimitedThresholdEncryptedAsset(assetAddr);
            limitedAsset.tryPurchaseToken{value: msg.value}(buyer);
        }
    }

    function getAllAssetNames() public view returns(string[] memory) {
        return assetNames;
    }

    function hasAccess(address tokenHolder, string memory assetName) public view returns(bool) {

        (address assetAddr, AssetType assetType) = _getAsset(assetName);
        bool hasToken;

        if (assetType == AssetType.Unlimited) {
            UnlimitedThresholdEncryptedAsset unlimitedAsset =  UnlimitedThresholdEncryptedAsset(assetAddr);
            hasToken = unlimitedAsset.hasAccess(tokenHolder);
        } else {
            LimitedThresholdEncryptedAsset limitedAsset =  LimitedThresholdEncryptedAsset(assetAddr);
            hasToken = limitedAsset.hasAccess(tokenHolder);
        }

        return hasToken;
    }
}