// A module for the food available to order
angular.module('foodorder_service',[])
	.factory('Food_Order',['$http', function($http){
		return {
			get : function(){
				return $http.get('/api/getavailfoods');
			},
			create : function(){
				return $http.get('/api/newfood');	
			},
			delete : function(){
				return $http.get('/api/deletenewfood');
			}
		}
	}]);


