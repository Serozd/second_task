import * as contract from '../../../../build/contracts/Remittance.json';
import * as truffleContract from 'truffle-contract';
import * as web3 from 'web3';

class AboutController {
  constructor($scope) {
    this.name = 'about';
    this.$scope = $scope;
    this.passwordA = '';
    this.passwordB = '';
    this.contractAddress = '';
    this.sourceAddress = '';
    this.rpcProviderUrl = '';
    this.instance = null;
    this.success = '';

  }

  withdrawFunds = () => {
  	web3.providers.HttpProvider.prototype.sendAsync = web3.providers.HttpProvider.prototype.send;
  	let Remittance = truffleContract.default(contract);
  	var provider = new web3.providers.HttpProvider(this.rpcProviderUrl);
  	Remittance.setProvider(provider);
  	let self = this;
  	let password = this.passwordA + this.passwordB;
  	Remittance.at(this.contractAddress).then((instance) => {
  		self.$scope.$apply(() =>{
  			self.instance = instance;
  		});
  		return instance.unlock.sendTransaction(password,{
            from: self.sourceAddress
        })
  	}).then(() => {
  		self.$scope.$apply(() =>{
  			self.success = 'Congrats, the password is correct';
  		});
  		
  	});


  }
}
AboutController.$inject = ['$scope'];
export default AboutController;
