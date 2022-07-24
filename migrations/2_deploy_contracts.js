var BillOfSale = artifacts.require("./BillOfSale.sol");

module.exports = function(deployer) {
  deployer.deploy(BillOfSale);
};

// var OwnershipAgreement = artifacts.require("./OwnershipAgreement.sol");

// module.exports = function(deployer) {
//   deployer.deploy(OwnershipAgreement);
// };
