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

// contract to be deployed after registering new CT
contract ThresholdEncryptedAsset is ERC721, ERC2981, Ownable {
    uint256 internal _price;
    uint256 internal _tokenIdCounter;

    event TokenMinted(
        uint256 indexed tokenId,
        address indexed recipient,
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
        _price = nftPrice_;
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

contract LimitedThresholdEncryptedAsset is ThresholdEncryptedAsset {
    uint256 private _maxSupply;

    error NoTokenSupplyLeft();

    mapping(address => uint256) _tokensMinted;

    constructor(
        uint256 nftPrice_,
        uint96 royaltyAmount_,
        uint256 maxSupply_
    )  ThresholdEncryptedAsset(nftPrice_, royaltyAmount_, true) {
        require(maxSupply_ > 0, "Max supply must be greater than zero");
        _maxSupply = maxSupply_;
    }

    function tryPurchaseToken(address _recipient) public payable returns (uint256) {
        if (this.availableTokens() > 0) {
            require (msg.value >= _price, "Insufficient Funds to purchase token");
            uint256 tokenId = _tokenIdCounter;
            _safeMint(_recipient, tokenId);
             // Refund excess payment
            emit TokenMinted(tokenId, _recipient, _price);
            _tokenIdCounter += 1;
            if (msg.value > _price) {
                (bool success, ) = payable(msg.sender).call{value: msg.value - _price}("");
                require(success, "Refund failed");
            }
            return tokenId;
        } else {
            revert NoTokenSupplyLeft();
        }
    }

    function increaseMaxTokensByAmount(uint256 _tokensToAdd) public onlyOwner {
        _maxSupply += _tokensToAdd;
    }

    function setNewMaxTokens(uint256 _newMaxTokens) public onlyOwner {
        _maxSupply = _newMaxTokens;
    }

    function availableTokens() public view returns(uint256) {
        return _maxSupply - _tokenIdCounter;
    }

}

contract UnlimitedThresholdEncryptedAsset is ThresholdEncryptedAsset {

    constructor(
        uint256 nftPrice_,
        uint96 royaltyAmount_
    )  ThresholdEncryptedAsset(nftPrice_, royaltyAmount_, false) {}

    function tryPurchaseToken(address _recipient) public payable returns (uint256) {
        require (msg.value >= _price, "Insufficient Funds to purchase token");
        uint256 tokenId = _tokenIdCounter;
        _safeMint(_recipient, tokenId);
        emit TokenMinted(tokenId, _recipient, _price);
        _tokenIdCounter += 1;
        if (msg.value > _price) {
            (bool success, ) = payable(msg.sender).call{value: msg.value - _price}("");
            require(success, "Refund failed");
        }
        return tokenId;
    }

}