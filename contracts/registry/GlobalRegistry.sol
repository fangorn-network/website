// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GlobalRegistry {

    // List of entries
    Entry[] private entries;

    struct Entry {
        string filename;
        string author;
        string cid;
        address creator;
        address contract_address;
    }

    mapping(string => Entry) public registry;

    // Register takes in a filename (for displaying)
    // a cid provided from the storage provider
    // an (optional) author name (defaults to message sender's address)
    // the contract associated with minting NFTs for the specified file
    function register(
        string memory filename, 
        string memory cid,
        string memory author,
        address contract_address
    ) 
    external payable {

        if (bytes(author).length == 0) {
            author = Strings.toHexString(msg.sender);
        }
        require(bytes(filename).length > 0, "Filename must be non-empty");
        require(bytes(cid).length > 0, "cid must be non-empty");
        require(contract_address != address(0), "You must include an address to the contract for the NFT");

        registry[cid] = Entry({
            filename: filename,
            cid: cid,
            author: author,
            creator: msg.sender,
            contract_address: contract_address
        });
    }
}

contract ThresholdEncryptedAsset is ERC721, ERC2981, Ownable {
    uint256 internal _defaultPrice;
    uint256 internal _tokenIdCounter;
    bool internal _overridePrice;
    uint256 internal _overriddenPrice;
    bool internal _overrideRoyalties;
    uint96 internal _overriddenRoyalties;

    event TokenMinted(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price
    );

    constructor(
        uint256 nftPrice_,
        uint96 royaltyAmount_,
        bool isLimitedAmount_
    ) ERC721(
        isLimitedAmount_ ? "LimitedThresholdEncryptedAsset" : "UnlimitiedThresholdEncryptedAsset",
        isLimitedAmount_ ? "LTEA" : "UTEA"
      ) 
      Ownable(msg.sender) {
        require(royaltyAmount_ <= 10000, "Fee exceeds 100%");
        _setDefaultRoyalty(owner(), royaltyAmount_);
        _defaultPrice = nftPrice_;
    }

    function overridePrice(uint256 newPrice_) public onlyOwner {
        _overridePrice = true;
        _overriddenPrice = newPrice_;
    }

    function useDefaultPrice() public onlyOwner() {
        _overridePrice = false;
    }

    function setNewDefaultPrice(uint256 defaultPrice_) public onlyOwner {
        _defaultPrice = defaultPrice_;
    }

    function setNewDefaultRoyalty(uint96 newDefaultRoyalty_) public onlyOwner {
        _setDefaultRoyalty(owner(), newDefaultRoyalty_);
    }

    function overrideRoyalties(uint96 overridenRoyalty_) public onlyOwner {
        require(overridenRoyalty_ <= 10000, "Fee exceeds 100%");
        _overrideRoyalties = true;
        _overriddenRoyalties = overridenRoyalty_;
    }

    function useDefaultRoyalty() public onlyOwner {
        _overrideRoyalties = false;
    }

    function mintToken() internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        address buyer = msg.sender;
        uint256 amountOffered = msg.value;
        uint256 price = _overridePrice ? _overriddenPrice : _defaultPrice;
        require (amountOffered >= price, "Insufficient Funds to purchase token");
        if (_overrideRoyalties) {
            _setTokenRoyalty(tokenId, buyer, _overriddenRoyalties);
        }
        _safeMint(buyer, tokenId);
        if (amountOffered > price) {
            (bool success, ) = payable(msg.sender).call{value: amountOffered - price}("");
            require(success, "Refund failed");
        }
        emit TokenMinted(tokenId, buyer, price);

        return tokenId;
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

    constructor(
        uint256 nftPrice_,
        uint96 royaltyAmount_,
        uint256 maxSupply_
    )  ThresholdEncryptedAsset(nftPrice_, royaltyAmount_, true) {
        require(maxSupply_ > 0, "Max supply must be greater than zero");
        _maxSupply = maxSupply_;
    }

    function tryPurchaseToken() public payable returns (uint256) {
        if (this.availableTokens() > 0) {
            uint256 tokenId = mintToken();
            return tokenId;
        } else {
            revert NoTokenSupplyLeft();
        }
    }

    function increaseMaxTokensByAmount(uint256 _amountToIncrease) public onlyOwner {
        _maxSupply += _amountToIncrease;
    }

    function decreaseMaxTokensByAmount(uint256 _amountToDecrease) public onlyOwner {
        uint256 newMaxTokens =_maxSupply - _amountToDecrease;
        require(newMaxTokens > 0, "You cannot have a zero max supply amount");
        require(newMaxTokens >= _tokenIdCounter, "You cannot have less supply than there are already existing NFTs");
        _maxSupply = newMaxTokens;
    }

    function setNewMaxTokens(uint256 _newMaxTokens) public onlyOwner {
        require(_newMaxTokens > 0, "You cannot have a zero max supply amount");
        require(_newMaxTokens >= _tokenIdCounter, "You cannot have less supply than there are already existing NFTs");
        _maxSupply = _newMaxTokens;
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
        uint96 royaltyAmount_
    )  ThresholdEncryptedAsset(nftPrice_, royaltyAmount_, false) {}

    function tryPurchaseToken() public payable returns (uint256) {
        uint256 tokenId = mintToken();
        return tokenId;
    }

}