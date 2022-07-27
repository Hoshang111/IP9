var AudioContract = artifacts.require("AudioContract");
var RightsManager = artifacts.require("RightsManager");

module.exports = async function(deployer) {
  await deployer.deploy(RightsManager);
  const rightsmanager = await RightsManager.deployed();
  await deployer.deploy(AudioContract, rightsmanager.address);
}