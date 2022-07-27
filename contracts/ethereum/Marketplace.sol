// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
  uint256 _ContractsSold;
  uint256 _ContractCount;
  uint256 public LISTING_FEE = 0.0001 ether;
  address payable private _marketOwner;
  uint256 totalOffers = 0;

  mapping(uint256 => Audio) private _idToAudio;
  mapping(uint256 => Offers) public _AudioOffers;

  struct Offers {
    uint offerId;
    address offerer;
    uint256 offerPrice;
    uint256 tokenId;
    bool accepted;
  }

  struct Audio {
    address AudioContract;
    uint256 tokenId;
    address payable owner;
    bool listed;
  }

  event AudioAdded(
    address AudioContract,
    uint256 tokenId,
    address owner
  );
  event AudioListed(
    address AudioContract,
    uint256 tokenId,
    address owner
  );
  event offerMade(
    address offerer,
    uint256 tokenId,
    uint256 offerPrice
  );
  event AudioSold(
    address AudioContract,
    uint256 tokenId,
    address seller,
    uint256 price
  );

  constructor() {
    _marketOwner = payable(msg.sender);
  }

  // List the Audio on the marketplace
  function addAudio(address _AudioContract, uint256 _tokenId) public nonReentrant {
    _idToAudio[_tokenId] = Audio(
      _AudioContract,
      _tokenId, 
      payable(msg.sender),
      false
    );

    emit AudioAdded(_AudioContract, _tokenId, msg.sender);
  }


// ########################################################################

  // List the Audio on the marketplace
  function listAudio(address _AudioContract, uint256 _tokenId) public payable nonReentrant {
    require(msg.value == LISTING_FEE, "Not enough ether for listing fee");
    _idToAudio[_tokenId].listed = true;
    _ContractCount++;

    emit AudioListed(_AudioContract, _tokenId, msg.sender);
  }

// ########################################################################

  function bidAudio(uint256 _tokenId, uint256 _offerPrice) public {
    require(_idToAudio[_tokenId].listed == true);
    _AudioOffers[totalOffers] = Offers(
        totalOffers,
        msg.sender,
        _offerPrice,
        _tokenId,
        false
    );
    totalOffers++;
  }

// ########################################################################

  function acceptOffer(uint256 offerId, uint256 _tokenId) public nonReentrant {
    
    Audio storage acceptedAudio = _idToAudio[_tokenId];
    Offers storage _offer = _AudioOffers[offerId];
    require(msg.sender == acceptedAudio.owner && msg.sender != _offer.offerer);

    // Signature
    // require(_offer.signatures[0] == _offer.offerer);
    // _offer.signatures.push(msg.sender);
    // require(_offer.signatures[1] == msg.sender);
    // require(_offer.signatures.length == 2);

    _offer.accepted = true;
  }

// ########################################################################

  function buyAudio(uint offerId, address _audioContract, uint256 _tokenId) public payable nonReentrant {
    Audio storage audio = _idToAudio[_tokenId];
    require(_AudioOffers[offerId].offerPrice == msg.value && msg.sender == _AudioOffers[offerId].offerer);
    address payable buyer = payable(msg.sender);
    payable(audio.owner).transfer(msg.value);
    IERC721(_audioContract).transferFrom(audio.owner, buyer, audio.tokenId);
    _marketOwner.transfer(LISTING_FEE);
    audio.owner = buyer;
    audio.listed = false;

    _ContractsSold++;
    emit AudioSold(_audioContract, audio.tokenId, buyer, msg.value);
  }

  function getListingFee() public view returns (uint256) {
    return LISTING_FEE;
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

  function getListedAudio() public view returns (Audio[] memory) {
    uint256 audioCount = _ContractCount;
    uint256 unsoldAudioCount = audioCount - _ContractsSold;

    Audio[] memory audio = new Audio[](unsoldAudioCount);
    uint Index = 0;
    for (uint i = 0; i < audioCount; i++) {
      if (_idToAudio[i + 1].listed) {
        audio[Index] = _idToAudio[i + 1];
        Index++;
      }
    }
    return audio;
  }

// ########################################################################

  function getMyAudio() public view returns (Audio[] memory) {
    uint audioCount = _ContractCount;
    uint myAudioCount = 0;
    for (uint i = 0; i < audioCount; i++) {
      if (_idToAudio[i + 1].owner == msg.sender) {
        myAudioCount++;
      }
    }

    Audio[] memory audio = new Audio[](myAudioCount);
    uint Index = 0;
    for (uint i = 0; i < audioCount; i++) {
      if (_idToAudio[i + 1].owner == msg.sender) {
        audio[Index] = _idToAudio[i + 1];
        Index++;
      }
    }
    return audio;
  }

// ########################################################################

  function getMyListedAudio() public view returns (Audio[] memory) {
    uint audioCount = _ContractCount;
    uint myListedAudioCount = 0;
    for (uint i = 0; i < audioCount; i++) {
      if (_idToAudio[i + 1].listed) {
        myListedAudioCount++;
      }
    }

    Audio[] memory audio = new Audio[](myListedAudioCount);
    uint Index = 0;
    for (uint i = 0; i < audioCount; i++) {
      if (_idToAudio[i + 1].listed) {
        audio[Index] = _idToAudio[i + 1];
        Index++;
      }
    }
    return audio;
  }

  function getOffers() public view returns (uint) {
    return totalOffers;
  }

  function getOfferPrice(uint OfferId) public view returns (uint) {
    return _AudioOffers[OfferId].offerPrice;
  }

  function getOwner(uint tokenId) public view returns (address) {
    return _idToAudio[tokenId].owner;
  }
}