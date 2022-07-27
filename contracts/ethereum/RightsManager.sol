// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RightsManagers is ReentrancyGuard {
  uint256 _ContractsSold;
  uint256 _ContractCount;
  uint256 public LISTING_FEE = 0.0001 ether;
  address payable private _marketOwner;
  uint256 totalOffers;

  mapping(uint256 => Audio) private _idToAudio;
  mapping(uint256 => Offers) private _AudioOffers;

  struct Offers {
    uint offerId;
    address offerer;
    uint256 offerPrice;
    uint256 tokenId;
    address[] signatures;
  }

  struct Audio {
    address AudioContract;
    uint256 tokenId;
    address payable owner;
    bool listed;
  }

  event NFTListed(
    address AudioContract,
    uint256 tokenId,
    address owner
  );
  event offerMade(
    address offerer,
    uint256 tokenId,
    uint256 offerPrice
  );
  event NFTSold(
    address AudioContract,
    uint256 tokenId,
    address seller,
    address owner,
    uint256 price
  );

  constructor() {
    _marketOwner = payable(msg.sender);
    totalOffers = 0;
  }

// ########################################################################

  // List the Audio on the marketplace
  function listAudio(address _AudioContract, uint256 _tokenId) public payable nonReentrant {
    require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

    IERC721(_AudioContract).transferFrom(msg.sender, address(this), _tokenId);
    _ContractCount++;

    _idToAudio[_tokenId] = Audio(
      _AudioContract,
      _tokenId, 
      payable(msg.sender),
      true
    );

    emit NFTListed(_AudioContract, _tokenId, msg.sender);
  }

// ########################################################################

  function bidAudio(uint256 _tokenId, uint256 _offerPrice) public nonReentrant {
    _AudioOffers[totalOffers] = Offers(
        totalOffers,
        msg.sender,
        _offerPrice,
        _tokenId,
        new address[](0)
    );
    _AudioOffers[totalOffers].signatures.push(msg.sender);
    totalOffers++;
  }


// ########################################################################


  // Resell an NFT purchased from the marketplace
  function resellAudio(address _nftContract, uint256 _tokenId) public payable nonReentrant {
    require(msg.value == LISTING_FEE, "Not enough ether for listing fee");

    IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

    Audio storage audio = _idToAudio[_tokenId];
    audio.owner = payable(address(this));
    audio.listed = true;
    
    _ContractsSold--;
    emit NFTListed(_nftContract, _tokenId, msg.sender);
  }

// ########################################################################

    function getListedOffers(uint256 _tokenId) public view returns (Offers[] memory) {
        Offers[] memory offers = new Offers[](totalOffers);
        uint j = 0;
        for (uint i = 0; i < totalOffers; i++) {
            if (_AudioOffers[i].tokenId == _tokenId) {
                offers[j] = _AudioOffers[i];
                j++;
             }
        }
        return offers;
    }

// ########################################################################

    function acceptOffer(uint256 offerId, address _nftContract, uint256 _tokenId) public payable nonReentrant {
        Offers storage _offer = _AudioOffers[offerId];
        address buyer = _offer.offerer;
        // Signature
        require(_offer.signatures[0] == _offer.offerer);
        _offer.signatures.push(msg.sender);
        require(_offer.signatures[1] == msg.sender);
        require(_offer.signatures.length == 2);

        Audio storage audio = _idToAudio[_tokenId];
        payable(buyer).transfer(_offer.offerPrice);
        IERC721(_nftContract).transferFrom(address(this), payable(buyer), audio.tokenId);
        _marketOwner.transfer(LISTING_FEE);
        audio.owner = payable(buyer);
        audio.listed = false;

        _ContractsSold++;
        emit NFTSold(_nftContract, _tokenId, msg.sender, buyer, _offer.offerPrice);
    }

// ########################################################################

  function getListingFee() public view returns (uint256) {
    return LISTING_FEE;
  }

 // ######################################################################## 

  function getListedNfts() public view returns (Audio[] memory) {
    uint256 nftCount = _ContractCount;
    uint256 unsoldNftsCount = nftCount - _ContractsSold;

    Audio[] memory nfts = new Audio[](unsoldNftsCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToAudio[i + 1].listed) {
        nfts[nftsIndex] = _idToAudio[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

// ########################################################################

  function getMyNfts() public view returns (Audio[] memory) {
    uint nftCount = _ContractCount;
    uint myNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToAudio[i + 1].owner == msg.sender) {
        myNftCount++;
      }
    }

    Audio[] memory nfts = new Audio[](myNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToAudio[i + 1].owner == msg.sender) {
        nfts[nftsIndex] = _idToAudio[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }

// ########################################################################

  function getMyListedNfts() public view returns (Audio[] memory) {
    uint nftCount = _ContractCount;
    uint myListedNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToAudio[i + 1].listed) {
        myListedNftCount++;
      }
    }

    Audio[] memory audios = new Audio[](myListedNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (_idToAudio[i + 1].listed) {
        audios[nftsIndex] = _idToAudio[i + 1];
        nftsIndex++;
      }
    }
    return audios;
  }
}