angular.module('menuservice',[])

	.factory('Menu', ['$http',function($http){
		return {
			getPrice : function(item){
				return $http.get('/api/getprice/'+item);
			},

			pushInitialMenu : function(){
				return $http.get('/api/insertMenu');
			}

	}
}
	
]);