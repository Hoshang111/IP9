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


:[{"name":"_item","type":"string"},{"name":"_date","type":"uint256"},{"name":"_entity","type":"address"}]