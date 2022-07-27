// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AudioContract is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address newAudioContract;

  constructor(address _newAudioContract) ERC721("Audio Contract", "AC") {
    newAudioContract = _newAudioContract;
  }

  function mint(string memory _tokenURI) public {
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    
    _safeMint(msg.sender, newTokenId);

    _setTokenURI(newTokenId, _tokenURI);

    setApprovalForAll(newAudioContract, true);
  }
}