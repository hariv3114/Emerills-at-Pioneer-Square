angular.module('welcome_page_controller',[]).controller('first_controller',['$scope','$http', function($scope, $http)]){
                                                                            
      $scope.load = true;
	  $scope.welcome_text ='Welcome';
}