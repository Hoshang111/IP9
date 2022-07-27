// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
<<<<<<< HEAD
import "@openzeppelin/contracts/utils/Counters.sol";

contract AudioContract is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address newAudioContract;
  event NFTMinted(uint256);
=======

contract AudioContract is ERC721URIStorage {
  uint256 numtokenIds;
  address newAudioContract;
>>>>>>> 85801c3088b10bbb32283bc91a31806b2924cf63

  constructor(address _newAudioContract) ERC721("Audio Contract", "AC") {
    newAudioContract = _newAudioContract;
  }

  function mint(string memory _tokenURI) public {
<<<<<<< HEAD
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
=======
    numtokenIds++;
    uint256 newTokenId = numtokenIds;
>>>>>>> 85801c3088b10bbb32283bc91a31806b2924cf63
    
    _safeMint(msg.sender, newTokenId);

    _setTokenURI(newTokenId, _tokenURI);

    setApprovalForAll(newAudioContract, true);
<<<<<<< HEAD
    emit NFTMinted(newTokenId);
=======
>>>>>>> 85801c3088b10bbb32283bc91a31806b2924cf63
  }
}