var OA = artifacts.require("./OwnershipAgreement.sol");

module.exports = function(deployer) {
  deployer.deploy(OA);
};
