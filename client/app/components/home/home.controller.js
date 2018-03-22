import * as sha3 from "browserify-sha3";
import * as contract from '../../../../build/contracts/RemittanceFactory.json';
import * as truffleContract from 'truffle-contract';
import * as web3 from 'web3';

class HomeController {
  constructor($scope, HomeService) {
    "ngInject";
    this.$scope = $scope;
    this.HomeService = HomeService;
    this.name = 'home';
    this.content = '';
    this.randomPassword = '';
    this.sourceAddress = '';
    this.destinationAddress = '';
    this.rpcProviderUrl = '';
    this.lockAmount = 0;
    this.availableDays = 1;
    this.instance = null;
    this.instanceAddress = '';
    this.contractAddress = '';
  }

  getLocalhost = () => {
      return this.HomeService.getLocalhost().then(result => {
        this.content = result;
      });
  }

  createRandomPassword = () => {
    let a = '';
    for (let i = 0; i < 4; i++) {
      a += Math.random().toString(36).substring(7);
     } 
    this.randomPassword = 'a' + a + 'b';
  }

  deployContranct = () => {
    let passwordHash = (new sha3.SHA3Hash(256)).update(this.randomPassword).digest();
    web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send;

    let RemittanceFactory = truffleContract.default(contract);
    var provider = new web3.providers.HttpProvider(this.rpcProviderUrl);
    var Web3 = new web3.default(provider);
    RemittanceFactory.setProvider(provider);
    var self = this;
    RemittanceFactory.at(self.contractAddress).then(
      function(instance) {
        return instance.deploy(self.destinationAddress,
            passwordHash,
            self.availableDays,
            {
              value: self.lockAmount,
              from: self.sourceAddress,
              gas:812388,
              gasPrice:10000000000
            });
      }).then((instance) => {
        self.$scope.$apply(() => {
                self.instanceAddress = instance.logs[0].args['contr'];
                self.instance = instance;
        });

    });


  }
}
HomeController.$inject =['$scope','HomeService'];
export default HomeController;
