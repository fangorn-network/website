// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

abstract contract ThresholdEncryptedAsset is ERC721, ERC2981, Ownable {
    uint256 internal _defaultPrice;
    uint256 internal _tokenIdCounter;
    bool internal _overridePrice;
    uint256 internal _overriddenPrice;
    bool internal _overrideRoyalties;
    uint96 internal _overriddenRoyalties;
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
        address delegatorAddress_
    ) ERC721(
        isLimitedAmount_ ? "LimitedThresholdEncryptedAsset" : "UnlimitedThresholdEncryptedAsset",
        isLimitedAmount_ ? "LTEA" : "UTEA"
      ) 
      Ownable(owner_) {
        require(royaltyAmount_ <= 10000, "Fee exceeds 100%");
        _setDefaultRoyalty(owner(), royaltyAmount_);
        _defaultPrice = nftPrice_;
        _delegatorAddress = delegatorAddress_;
    }

    function removeDelegator() public onlyOwner {
        _delegatorAddress = address(0);
    }

    // maybe this should be accessible by the delegator as well?
    function updateDelegator(address newDelegator) public onlyOwner {
        _delegatorAddress = newDelegator;
    }

    function overridePrice(uint256 newPrice_) public onlyOwnerOrDelegator {
        _overridePrice = true;
        _overriddenPrice = newPrice_;

        emit PriceChange(_defaultPrice, newPrice_);
    }

    function useDefaultPrice() public onlyOwnerOrDelegator() {
        _overridePrice = false;
        emit PriceChange(_defaultPrice, _overriddenPrice);
    }

    function setNewDefaultPrice(uint256 defaultPrice_) public onlyOwnerOrDelegator {
        emit PriceChange(_defaultPrice, defaultPrice_);
        _defaultPrice = defaultPrice_;
    }

    function setNewDefaultRoyalty(uint96 newDefaultRoyalty_) public onlyOwnerOrDelegator {
        require(newDefaultRoyalty_ <= 10000, "Fee exceeds 100%");
        // emit RoyaltyChange(, newRoyalty);
        _setDefaultRoyalty(owner(), newDefaultRoyalty_);
    }

    function overrideRoyalties(uint96 overriddenRoyalty_) public onlyOwnerOrDelegator {
        require(overriddenRoyalty_ <= 10000, "Fee exceeds 100%");
        _overrideRoyalties = true;
        _overriddenRoyalties = overriddenRoyalty_;
    }

    function useDefaultRoyalty() public onlyOwnerOrDelegator {
        _overrideRoyalties = false;
    }

    function mintToken(address buyer) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        uint256 amountOffered = msg.value;
        uint256 price = _overridePrice ? _overriddenPrice : _defaultPrice;
        require (amountOffered >= price, "Insufficient Funds to purchase token");
        if (_overrideRoyalties) {
            _setTokenRoyalty(tokenId, owner(), _overriddenRoyalties);
        }
        _safeMint(buyer, tokenId);
        if (amountOffered > price) {
            (bool success, ) = payable(msg.sender).call{value: amountOffered - price}("");
            require(success, "Refund failed");
        }
        emit TokenMinted(tokenId, buyer, price);
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
        address delegatorAddress_
    )  ThresholdEncryptedAsset(nftPrice_, royaltyAmount_, true, owner_, delegatorAddress_) {
        require(maxSupply_ > 0, "Max supply must be greater than zero");
        _maxSupply = maxSupply_;
    }

    function tryPurchaseToken(address buyer) external payable returns (uint256) {
        if (internalAvailableTokens() > 0) {
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
        require(newMaxTokens > 0, "You cannot have a <= max supply amount. Please ensure that the maximum supply - your decrement is >0.");
        require(newMaxTokens >= _tokenIdCounter, "You cannot have less supply than there are already existing NFTs");
        _maxSupply = newMaxTokens;
    }

    function setNewMaxTokens(uint256 _newMaxTokens) public onlyOwnerOrDelegator {
        require(_newMaxTokens > 0, "You cannot have a zero max supply amount");
        require(_newMaxTokens >= _tokenIdCounter, "You cannot have less supply than there are already existing NFTs");
        _maxSupply = _newMaxTokens;
    }

    function internalAvailableTokens() internal view returns(uint256) {
        return _maxSupply - _tokenIdCounter;
    }

    function availableTokens() public view returns(uint256) {
        return _maxSupply - _tokenIdCounter;
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
        address delegatorAddress_
    )  ThresholdEncryptedAsset(nftPrice_, royaltyAmount_, false, owner_, delegatorAddress_) {}

    function tryPurchaseToken(address buyer) external payable returns (uint256) {
        uint256 tokenId = mintToken(buyer);
        return tokenId;
    }

}