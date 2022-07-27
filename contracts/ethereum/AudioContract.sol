// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AudioContract is ERC721URIStorage {
  uint256 numtokenIds;
  address newAudioContract;

  constructor(address _newAudioContract) ERC721("Audio Contract", "AC") {
    newAudioContract = _newAudioContract;
  }

  function mint(string memory _tokenURI) public {
    numtokenIds++;
    uint256 newTokenId = numtokenIds;
    
    _safeMint(msg.sender, newTokenId);

    _setTokenURI(newTokenId, _tokenURI);

    setApprovalForAll(newAudioContract, true);
  }
}