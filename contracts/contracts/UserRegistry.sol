// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ThresholdEncryptedAsset.sol";
contract UserRegistry is Ownable{

    string _authorName;
    address public immutable _delegatorAddress;
    string[] public assetNames;

    mapping(string => AssetInfo) assetRegistry;

    enum AssetType {Limited, Unlimited}

    struct AssetInfo {
        address assetAddress;
        AssetType assetType;
        uint256 createdAt;
    }

    modifier onlyOwnerOrDelegator() {
        require(
            msg.sender == owner() || msg.sender == _delegatorAddress,
            "Only owner or designated delegator can call"
        );
        _;
    }

    event AssetRegistered(
        string indexed assetName, 
        address indexed assetAddress, 
        AssetType assetType
    );

    constructor(address registryCreator_, string memory authorName_, address delegatorAddress_) Ownable(registryCreator_) {
        _authorName = authorName_;
        _delegatorAddress = delegatorAddress_;
    }

    function registerNewAsset(uint256 maxSupply_, string memory assetName_, uint256 nftPrice_, uint96 royaltyAmount_) public onlyOwnerOrDelegator {

        require (assetRegistry[assetName_].assetAddress == address(0), "Asset name aready exists");
        address newAssetAddress;
        AssetType assetType;
        bool isUnlimitedSupply = maxSupply_ == 0; 

        if (isUnlimitedSupply) {
            UnlimitedThresholdEncryptedAsset newAsset = 
                new UnlimitedThresholdEncryptedAsset(nftPrice_, royaltyAmount_, owner(), address(this));
            newAssetAddress = address(newAsset);
            assetType = AssetType.Unlimited;
        } else {
            LimitedThresholdEncryptedAsset newAsset = 
                new LimitedThresholdEncryptedAsset(nftPrice_, royaltyAmount_, maxSupply_, owner(), address(this));
            newAssetAddress = address(newAsset);
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

    function getAsset(string memory assetName_) 
        public 
        view 
        returns (address, AssetType) 
    {
        AssetInfo memory info = assetRegistry[assetName_];
        require(info.assetAddress != address(0), "Asset not found");
        return (info.assetAddress, info.assetType);
    }

    function mintNewToken(string memory assetName, address buyer) public payable onlyOwnerOrDelegator {
        (address assetAddr, AssetType assetType) = this.getAsset(assetName);
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
}