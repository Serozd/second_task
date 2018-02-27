

class HomeService {
  constructor($http) {
    this.$http = $http;
  }

  getLocalhost =  () => {
    	return this.$http.get('http://127.0.0.1/');
    }
}
HomeService.$inject =['$http'];
export default HomeService;
