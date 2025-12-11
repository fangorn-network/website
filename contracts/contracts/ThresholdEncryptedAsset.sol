// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ThresholdEncryptedAsset is ERC721, ERC2981, Ownable {
    uint256 internal _assetPrice;
    uint256 internal _tokenIdCounter;
    uint96 internal _royaltyAmount;
    address public _delegatorAddress;

    event TokenMinted(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    event PriceChange(
        uint256 previousPrice,
        uint256 newPrice
    );

    event RoyaltyChange (
        uint96 previousRoyalty,
        uint96 newRoyalty
    );

    modifier onlyOwnerOrDelegator() {
        require(
            (msg.sender == owner() || msg.sender == _delegatorAddress) && (msg.sender != address(0)),
            "Only owner or designated delegator can call"
        );
        _;
    }

    constructor(
        uint256 nftPrice_,
        uint96 royaltyAmount_,
        bool isLimitedAmount_,
        address owner_,
        address delegatorAddress_,
        string memory tokenName,
        string memory tokenSymbol
    ) ERC721(
        isLimitedAmount_ ? string.concat("Limited", tokenName) : string.concat("Unlimited", tokenName),
        isLimitedAmount_ ? string.concat("L", tokenSymbol) : string.concat("U", tokenSymbol)
      ) 
      Ownable(owner_) {
        _setDefaultRoyalty(owner(), royaltyAmount_);
        _royaltyAmount = royaltyAmount_;
        _assetPrice = nftPrice_;
        _delegatorAddress = delegatorAddress_;
    }

    function removeDelegator() public onlyOwner {
        _delegatorAddress = address(0);
    }

    // maybe this should be accessible by the delegator as well?
    function updateDelegator(address newDelegator) public onlyOwner {
        _delegatorAddress = newDelegator;
    }

    function updatePrice(uint256 newPrice_) public onlyOwnerOrDelegator {
        emit PriceChange(_assetPrice, newPrice_);
        _assetPrice = newPrice_;
    }

    function updateRoyaltyAmount(uint96 newRoyalty_) public onlyOwnerOrDelegator {
        _setDefaultRoyalty(owner(), newRoyalty_);
        emit RoyaltyChange(_royaltyAmount, newRoyalty_);
        _royaltyAmount = newRoyalty_;
    }

    function mintToken(address buyer) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        uint256 amountOffered = msg.value;
        require (amountOffered >= _assetPrice, "Insufficient Funds to purchase token");
        _safeMint(buyer, tokenId);
        if (amountOffered > _assetPrice) {
            (bool success, ) = payable(msg.sender).call{value: amountOffered - _assetPrice}("");
            require(success, "Refund failed");
        }
        emit TokenMinted(tokenId, buyer, _assetPrice);
        _tokenIdCounter++;

        return tokenId;
    }

    function withdraw() external onlyOwnerOrDelegator {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function hasAccess(address tokenHolder) public view returns (bool) {
        return balanceOf(tokenHolder) > 0;
    }

    /**
     * @dev See {IERC165-supportsInterface}
    */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}

// Contract to be deployed after registering new CT.
// Limited Supply only. There is no way to go between a
// Limited Supply NFT to an unlimited supply.
// However, one can set new max tokens or increase
// supply as needed
contract LimitedThresholdEncryptedAsset is ThresholdEncryptedAsset {
    uint256 private _maxSupply;

    error NoTokenSupplyLeft();

    event maxSupplyChange(
        uint256 previousMaxSupply,
        uint256 newMaxSupply
    );

    constructor(
        uint256 nftPrice_,
        uint96 royaltyAmount_,
        uint256 maxSupply_,
        address owner_,
        address delegatorAddress_,
        string memory tokenName_,
        string memory tokenSymbol_
    )  ThresholdEncryptedAsset(nftPrice_, royaltyAmount_, true, owner_, delegatorAddress_, tokenName_, tokenSymbol_) {
        require(maxSupply_ > 0, "Max supply must be greater than zero");
        _maxSupply = maxSupply_;
    }

    function tryPurchaseToken(address buyer) external payable returns (uint256) {
        if (_internalAvailableTokens() > 0) {
            uint256 tokenId = mintToken(buyer);
            return tokenId;
        } else {
            revert NoTokenSupplyLeft();
        }
    }

    function increaseMaxTokensByAmount(uint256 _amountToIncrease) public onlyOwnerOrDelegator {
        _maxSupply += _amountToIncrease;
    }

    function decreaseMaxTokensByAmount(uint256 _amountToDecrease) public onlyOwnerOrDelegator {
        uint256 newMaxTokens =_maxSupply - _amountToDecrease;
        _verifyMaxTokenAmount(newMaxTokens);
        _maxSupply = newMaxTokens;
    }

    function setNewMaxTokens(uint256 _newMaxTokens) public onlyOwnerOrDelegator {
        _verifyMaxTokenAmount(_newMaxTokens);
        _maxSupply = _newMaxTokens;
    }

    function availableTokens() public view returns(uint256) {
        return _internalAvailableTokens();
    }

    function _internalAvailableTokens() internal view returns(uint256) {
        return _maxSupply - _tokenIdCounter;
    }

    function _verifyMaxTokenAmount(uint256 maxTokens) private view {
        require(maxTokens > 0, "Ensure maxTokens > 0");
        require(maxTokens >= _tokenIdCounter, "Ensure maxTokens > # of existing tokens");
    }

}

// Contract to be deployed after registering new CT.
// Since there is no need to keep count of NFTs
// we can save 256 bits of memory by not having maxSupply_
contract UnlimitedThresholdEncryptedAsset is ThresholdEncryptedAsset {

    constructor(
        uint256 nftPrice_,
        uint96 royaltyAmount_,
        address owner_,
        address delegatorAddress_,
        string memory tokenName_,
        string memory tokenSymbol_
    )  ThresholdEncryptedAsset(nftPrice_, royaltyAmount_, false, owner_, delegatorAddress_, tokenName_, tokenSymbol_) {}

    function tryPurchaseToken(address buyer) external payable returns (uint256) {
        uint256 tokenId = mintToken(buyer);
        return tokenId;
    }

}