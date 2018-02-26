var Remittance = artifacts.require("Remittance");
const expectedExceptionPromise = require("./expected_exception_testRPC_and_geth.js");
const sha3 = require("browserify-sha3");

contract('Remittance', function(accounts) {
    var instance;
    var password = 'mysupersecurepasswordsplitbytwoparts';

    beforeEach(function() {
        var password_hash = (new sha3.SHA3Hash(256)).update(password).digest();
        return Remittance.new(accounts[1], password_hash, 1,{from: accounts[0], value: web3.toWei(1)}).then(function(contract) {
            instance = contract;
        });
    });


    it("should have 1 eth balance initially", function() {
        return new Promise(function(resolve, reject) {
            resolve(web3.eth.getBalance(instance.address));
        }).then(function(balance) {
            assert.equal(balance.valueOf(), web3.toWei(1), "should have 1 eth balance initially");
        });
    });


    it("should unlock with correct password", function() {
        return instance.unlock.sendTransaction(password,{
            from: accounts[1]
        }).then(function() {
            return new Promise(function(resolve, reject) {
            resolve(web3.eth.getBalance(instance.address));
        }).then(function(balance) {
            assert.equal(balance.valueOf(), 0 , "should have 0 balance");
        });
        });
    });


    it("should not transfer with incorrect password", function() {

        return instance.unlock.sendTransaction('incorrectpassword',{
            from: accounts[1]
        }).then(function() {
            return new Promise(function(resolve, reject) {
            resolve(web3.eth.getBalance(instance.address));
        }).then(function(balance) {
            assert.equal(balance.valueOf(), web3.toWei(1) , "should have 1 eth balance");
        });
        });
    });


    it("should not transfer with unauthorised user", function() {
        return expectedExceptionPromise(function() {
            return instance.unlock.sendTransaction('incorrectpassword',{
                    from: accounts[0]
            });
        }).then(function() {
            return new Promise(function(resolve, reject) {
            resolve(web3.eth.getBalance(instance.address));
        }).then(function(balance) {
            assert.equal(balance.valueOf(), web3.toWei(1) , "should have 1 eth balance");
        });
        });
    });

    it("should not refund sortly after  creation", function() {
        return expectedExceptionPromise(function() {
            return instance.redeem.sendTransaction({
                    from: accounts[0]
            });
        }).then(function() {
            return new Promise(function(resolve, reject) {
            resolve(web3.eth.getBalance(instance.address));
        }).then(function(balance) {
            assert.equal(balance.valueOf(), web3.toWei(1) , "should have 1 eth balance");
        });
        });
    });

});