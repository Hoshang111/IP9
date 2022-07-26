// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OwnershipAgreement {
  address public entity;
  string public item;
  uint public date;
  bool public confirmed;
  //from OpenLaw Template
  function recordContract(string memory _item, uint _date, address _entity) public {
    item = _item;
    date = _date;
    entity = _entity; 
  }

function confirmReceipt() public {
    require(msg.sender == entity, "only entity can confirm");
    confirmed = true;
  }
}


// :[{"name":"_item","type":"string"},{"name":"_date","type":"uint256"},{"name":"_entity","type":"address"}]
// pragma solidity >=0.4.22 <0.9.0;

// contract OwnershipAgreement {
//     address payable public seller;
//     address payable public buyer;
//     string public descr;
//     uint public price;
//     bool public confirmed;

//     function recordContract(string memory _descr, uint _price, address payable _seller, address payable _buyer) public { // takes in description for item, purchase price, buyer and seller ETH addresses
//         descr = _descr;
//         price = _price;
//         seller = _seller;
//         buyer = _buyer;
//     }

// function () external payable { }

// function confirmReceipt() public payable { // allows the buyer to confirm receipt of their item and release funds stored in the contract to the seller
//     require(msg.sender == buyer, "only buyer can confirm");
//     require(address(this).balance == price, "purchase price must be funded");
//     address(seller).transfer(address(this).balance);
//     confirmed = true;
//     }
// }