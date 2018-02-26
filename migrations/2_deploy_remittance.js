var Remittance = artifacts.require("./Remittance.sol");
const sha3 = require("browserify-sha3");


module.exports = function(deployer, network, accounts) {
  var password_hash = (new sha3.SHA3Hash(256)).update('mysupersecurepasswordsplitbytwoparts').digest();

  deployer.deploy(Remittance, accounts[1], password_hash, 1);
};
