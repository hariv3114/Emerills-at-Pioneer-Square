angular.module('foodController', [])

	// inject the Food service factory into our controller
	.controller('mainController', ['$scope','$http','Foods', function($scope, $http, Foods) {

		// for the carousel
			$(document).ready(function() {
		 $('.carousel').carousel({interval: 7000});
	 		});

		$scope.formData = {};
		$scope.loading = true;
		$scope.total = 0;
		$scope.showTotal = true;

		// GET =====================================================================
		// when landing on the page, get all food items and show them
		// use the service to get all the food items
		Foods.get()
			.success(function(data) {
				$scope.foods = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createFoodItem = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.name != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Foods.create($scope.formData)

					// if successful creation, call our get function to get all the new food items
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.foods = data; // assign our new list of food items
					});
			}
		};

		// DELETE ==================================================================
		// delete a food item if not included for billing
		$scope.deleteFoodItem = function(id) {
			$scope.loading = true;

			Foods.delete(id)
				// if successful creation, call our get function to get all the new food items
				.success(function(data) {
					$scope.loading = false;
					$scope.foods = data; // assign our new list of food Items
				});
		};

		// TOTAL ===================================================================
		// Calculate the total price of the food items added
		$scope.getTotal = function() {
			console.log('Inside');

			Foods.getTotal().success(function (data){
				   $scope.showTotal = false; // set the hide flag false
					 console.log(data);
					 $scope.total = data; // assign total
			});

		};

	}]);
