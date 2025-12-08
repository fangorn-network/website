// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/common/ERC2981.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// /**
//  * @title ThresholdEncryptedAsset
//  * @dev ERC-721 + ERC-2981 NFT contract for threshold-encrypted digital assets
//  * @notice Allows creators to mint limited edition tokens linked to encrypted content
//  */
// contract ThresholdEncryptedAsset is ERC721, ERC2981, Ownable {
//     uint256 private _tokenIdCounter;
    
//     // Platform fee configuration
//     uint256 public platformFeePercentage; // Basis points (100 = 1%)
//     uint256 public platformFlatFee; // In wei
//     address public platformFeeRecipient;
    
//     // Collection structure
//     struct Collection {
//         address creator;
//         string cid; // IPFS/storage CID for encrypted content
//         uint256 maxSupply;
//         uint256 currentSupply;
//         uint256 royaltyFee; // Basis points (100 = 1%, max 10000 = 100%)
//         uint256 creationFlatFee; // Optional flat fee paid on creation
//         bool exists;
//     }
    
//     // Mapping from collection ID to Collection data
//     mapping(uint256 => Collection) public collections;
    
//     // Mapping from token ID to collection ID
//     mapping(uint256 => uint256) public tokenToCollection;
    
//     // Events
//     event CollectionCreated(
//         uint256 indexed collectionId,
//         address indexed creator,
//         string cid,
//         uint256 maxSupply,
//         uint256 royaltyFee,
//         uint256 creationFee
//     );
    
//     event TokenMinted(
//         uint256 indexed tokenId,
//         uint256 indexed collectionId,
//         address indexed recipient
//     );
    
//     event PlatformFeeUpdated(
//         uint256 flatFee,
//         uint256 percentageFee
//     );
    
//     /**
//      * @dev Constructor
//      * @param _platformFeeRecipient Address to receive platform fees
//      * @param _platformFlatFee Flat fee for collection creation (in wei)
//      * @param _platformFeePercentage Percentage fee in basis points
//      */
//     constructor(
//         address _platformFeeRecipient,
//         uint256 _platformFlatFee,
//         uint256 _platformFeePercentage
//     ) ERC721("ThresholdEncryptedAsset", "TEA") Ownable(msg.sender) {
//         require(_platformFeeRecipient != address(0), "Invalid fee recipient");
//         require(_platformFeePercentage <= 10000, "Fee exceeds 100%");
        
//         platformFeeRecipient = _platformFeeRecipient;
//         platformFlatFee = _platformFlatFee;
//         platformFeePercentage = _platformFeePercentage;
//     }
    
//     /**
//      * @dev Create a new collection with encrypted content
//      * @param cid Content identifier for encrypted data
//      * @param maxSupply Maximum number of tokens that can be minted
//      * @param royaltyFee Royalty fee in basis points (e.g., 500 = 5%)
//      * @return collectionId The ID of the newly created collection
//      */
//     function createCollection(
//         string memory cid,
//         uint256 maxSupply,
//         uint256 royaltyFee
//     ) external payable returns (uint256) {
//         require(maxSupply > 0, "Max supply must be positive");
//         require(royaltyFee <= 10000, "Royalty fee exceeds 100%");
//         require(msg.value >= platformFlatFee, "Insufficient creation fee");
//         require(bytes(cid).length > 0, "CID cannot be empty");
        
//         // Transfer platform fee
//         if (platformFlatFee > 0) {
//             (bool success, ) = platformFeeRecipient.call{value: platformFlatFee}("");
//             require(success, "Fee transfer failed");
//         }
        
//         // Refund excess payment
//         if (msg.value > platformFlatFee) {
//             (bool refundSuccess, ) = msg.sender.call{value: msg.value - platformFlatFee}("");
//             require(refundSuccess, "Refund failed");
//         }
        
//         // Create collection
//         _collectionIds.increment();
//         uint256 collectionId = _collectionIds.current();
        
//         collections[collectionId] = Collection({
//             creator: msg.sender,
//             cid: cid,
//             maxSupply: maxSupply,
//             currentSupply: 0,
//             royaltyFee: royaltyFee,
//             creationFlatFee: platformFlatFee,
//             exists: true
//         });
        
//         // Set default royalty for this collection
//         _setTokenRoyalty(collectionId, msg.sender, uint96(royaltyFee));
        
//         emit CollectionCreated(
//             collectionId,
//             msg.sender,
//             cid,
//             maxSupply,
//             royaltyFee,
//             platformFlatFee
//         );
        
//         return collectionId;
//     }

//     // function safeMint(address receiver) public onlyOwner {
//     //     uint256 tokenId = _tokenIdCounter;
//     //     _safeMint(_receiver, tokenId);
//     //     _tokenIdCounter += 1;
//     // }
    
//     /**
//      * @dev Mint a token from a collection
//      * @param collectionId The collection to mint from
//      * @param recipient Address to receive the token
//      * @return tokenId The ID of the newly minted token
//      */
//     function mint(uint256 collectionId, address recipient) 
//         external 
//         returns (uint256) 
//     {
//         require(collections[collectionId].exists, "Collection does not exist");
//         require(
//             msg.sender == collections[collectionId].creator,
//             "Only creator can mint"
//         );
//         require(
//             collections[collectionId].currentSupply < collections[collectionId].maxSupply,
//             "Max supply reached"
//         );
//         require(recipient != address(0), "Invalid recipient");
        
//         _tokenIds.increment();
//         uint256 tokenId = _tokenIds.current();
        
//         collections[collectionId].currentSupply++;
//         tokenToCollection[tokenId] = collectionId;
        
//         _safeMint(recipient, tokenId);
        
//         // Set royalty info for this specific token
//         _setTokenRoyalty(
//             tokenId,
//             collections[collectionId].creator,
//             uint96(collections[collectionId].royaltyFee)
//         );
        
//         emit TokenMinted(tokenId, collectionId, recipient);
        
//         return tokenId;
//     }
    
//     /**
//      * @dev Batch mint multiple tokens from a collection
//      * @param collectionId The collection to mint from
//      * @param recipients Array of addresses to receive tokens
//      */
//     function batchMint(uint256 collectionId, address[] calldata recipients) 
//         external 
//     {
//         require(collections[collectionId].exists, "Collection does not exist");
//         require(
//             msg.sender == collections[collectionId].creator,
//             "Only creator can mint"
//         );
//         require(
//             collections[collectionId].currentSupply + recipients.length <= 
//             collections[collectionId].maxSupply,
//             "Exceeds max supply"
//         );
        
//         for (uint256 i = 0; i < recipients.length; i++) {
//             require(recipients[i] != address(0), "Invalid recipient");
            
//             _tokenIds.increment();
//             uint256 tokenId = _tokenIds.current();
            
//             tokenToCollection[tokenId] = collectionId;
//             _safeMint(recipients[i], tokenId);
            
//             _setTokenRoyalty(
//                 tokenId,
//                 collections[collectionId].creator,
//                 uint96(collections[collectionId].royaltyFee)
//             );
            
//             emit TokenMinted(tokenId, collectionId, recipients[i]);
//         }
        
//         collections[collectionId].currentSupply += recipients.length;
//     }
    
//     /**
//      * @dev Get the CID associated with a token
//      * @param tokenId The token ID to query
//      * @return The CID string
//      */
//     function getTokenCID(uint256 tokenId) external view returns (string memory) {
//         require(_ownerOf(tokenId) != address(0), "Token does not exist");
//         uint256 collectionId = tokenToCollection[tokenId];
//         return collections[collectionId].cid;
//     }
    
//     /**
//      * @dev Get collection information
//      * @param collectionId The collection ID to query
//      */
//     function getCollection(uint256 collectionId) 
//         external 
//         view 
//         returns (
//             address creator,
//             string memory cid,
//             uint256 maxSupply,
//             uint256 currentSupply,
//             uint256 royaltyFee
//         ) 
//     {
//         require(collections[collectionId].exists, "Collection does not exist");
//         Collection memory collection = collections[collectionId];
//         return (
//             collection.creator,
//             collection.cid,
//             collection.maxSupply,
//             collection.currentSupply,
//             collection.royaltyFee
//         );
//     }
    
//     /**
//      * @dev Update platform fees (owner only)
//      */
//     function updatePlatformFees(
//         uint256 _flatFee,
//         uint256 _percentageFee
//     ) external onlyOwner {
//         require(_percentageFee <= 10000, "Fee exceeds 100%");
//         platformFlatFee = _flatFee;
//         platformFeePercentage = _percentageFee;
        
//         emit PlatformFeeUpdated(_flatFee, _percentageFee);
//     }
    
//     /**
//      * @dev Update platform fee recipient (owner only)
//      */
//     function updatePlatformFeeRecipient(address _newRecipient) 
//         external 
//         onlyOwner 
//     {
//         require(_newRecipient != address(0), "Invalid recipient");
//         platformFeeRecipient = _newRecipient;
//     }
    
//     /**
//      * @dev See {IERC165-supportsInterface}
//      */
//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721, ERC2981)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }
    
//     /**
//      * @dev Get total number of collections created
//      */
//     function totalCollections() external view returns (uint256) {
//         return _collectionIds.current();
//     }
    
//     /**
//      * @dev Get total number of tokens minted
//      */
//     function totalTokens() external view returns (uint256) {
//         return _tokenIds.current();
//     }
// }