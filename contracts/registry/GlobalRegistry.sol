// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// contract GlobalRegistry {

//     // List of entries
//     Entry[] private entries;

//     struct Entry {
//         string filename;
//         string cid;
//         address contract_address;
//     }

    


//     function register(
//         string memory filename, 
//         string memory cid, 
//         uint256 total_supply, 
//         uint256 floor_price, 
//         uint256 royalty
//         ) 
//     external payable {

//         address payable owner = payable(msg.sender);

//     }
// }

// contract to be deployed after registering new CT
contract ThresholdEncryptedAsset is ERC721, ERC2981, Ownable {
    uint256 private _tokenIdCounter;
    uint96 _royaltyAmount;
    uint256 private _maxSupply;

    event TokenMinted(
        uint256 indexed tokenId,
        address indexed recipient
    );

    constructor(
        uint96 royaltyAmount_,
        uint256 maxSupply_
        )  ERC721("ThresholdEncryptedAsset", "TEA") Ownable(msg.sender) {
        require(royaltyAmount_ <= 10000, "Fee exceeds 100%");
        require(maxSupply_ > 0, "Max supply must be positive");
        
        // if maxSupply is 0, we interpret this to mean "I want a functionally unlimited supply of tokens"
        if (maxSupply_ == 0) {
            _maxSupply = type(uint256).max;
        } else {
            _maxSupply = maxSupply_;
        }
    }

    function mintToken(address _recipient) public returns (uint256) {
        _checkOwner();
        uint256 tokenId = _tokenIdCounter;
        _safeMint(_recipient, tokenId);
        _setTokenRoyalty(tokenId, owner(), uint96(_royaltyAmount));
        emit TokenMinted(tokenId, _recipient);
        _tokenIdCounter += 1;
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