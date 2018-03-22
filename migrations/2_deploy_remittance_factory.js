var Remittance = artifacts.require("./RemittanceFactory.sol");
const sha3 = require("browserify-sha3");


module.exports = function(deployer, network, accounts) {
  deployer.deploy(Remittance);
};
