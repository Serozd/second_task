import * as sha3 from "browserify-sha3";
import * as contract from '../../../../build/contracts/Remittance.json';
import * as truffleContract from 'truffle-contract';
import * as web3 from 'web3';

class HomeController {
  constructor(HomeService) {
    "ngInject";
    this.HomeService = HomeService;
    this.name = 'home';
    this.content = '';
    this.randomPassword = '';
    this.destinationAddress='';
    this.availableDays=1;
    this.instance = null;
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

    let Remittance = truffleContract.default(contract);
    var provider = new web3.providers.HttpProvider('http://localhost:7545');
    var Web3 = new web3.default(provider);
    Remittance.setProvider(provider);

    Remittance.new(
      this.destinationAddress,
      passwordHash,
      this.availableDays,
      {
        value: 1e18,
        from: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
        gas:612388,
        gasPrice:10000000000
      }).then((instance) => {
      this.instance = instance;
    });


  }
}
HomeController.$inject =['HomeService'];
export default HomeController;
