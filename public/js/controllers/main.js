angular.module('foodController', [])

	// inject the Food service factory into our controller
	.controller('mainController', ['$scope','$http','Foods','Menu',function($scope, $http, Foods, Menu) {
		// for the carousel
			$(document).ready(function() {
		 $('.carousel').carousel({interval: 7000});
		 		$scope.pushMenu();
	 		});

		$scope.formData = {};
		// $scope.loading = true;

		// Bill Modal properties
		$scope.total = 0;
		$scope.tax =  0;
		$scope.net_total = 0;
		// $scope.showTotal = true;
		
		// Menu Selection
		$scope.sel_cuisine ='Select a Cuisine';
		$scope.sel_entree = '';
		$scope.sel_side = '';
		$scope.entree_data = '';
		$scope.side_data ='';
		
		
		// Cuisine options
		$scope.cuisines = {ind:'Indian', ita :'Italian', chi :'Chinese', mex :'Mexican'};
		
		// Entree options
		$scope.ind_entree = {bc:'Butter Chicken',saag: 'Saag Panneer',palpan:'Palak Paneer',dalma: 'Dal Makahni'};
		$scope.ita_entree = {meatmar:'Meatball Marinara', sun_dried : 'Sun-Dried Tomato & Artichoke Bruschetta Flatbread',chick_brusc:'Easy 								Bruschetta Chicken',cal:'Italian Calzone'};
		$scope.mex_entree = {chic_enchi :'Chicken Enchiladas',cass :'Casserole', burr :'Burrito', faj:'Fajitas'};
		$scope.chi_entree = {pork:'Sweet and Sour Pork', gung :'Gung Pao Chicken',teri:'Teriyaki Chicken', shrimp:'Orange Shrimp'};
		
		// SIDES
		$scope.ind_sides = {roti:'Roti', pulav:'Pulav',rice:'Rice'};
		$scope.ita_sides = {pasta:'Pasta', riso:'Riso', parm:'Parmigiano Bread'};
		$scope.mex_sides = {salad:'Salad',queso:'Chilli con Queso',taco:'Tacos'}
		$scope.chi_sides = {wont:'Wontons', crab:'Crab Rangoon', frie:'Fried Rice',chow:'Chow Mein'};

		// GET =====================================================================
		// when landing on the page, get all food items and show them
		// use the service to get all the food items
		Foods.get()
			.success(function(data) {
				$scope.foods = data;
				$scope.loading = false;
			});

		// LOAD food ITEMS on a selecting a particular food item
		
		$scope.getFoodOptions = function(){
		
			if($scope.sel_cuisine == "Indian"){

					$scope.sel_entree = $scope.ind_entree;
					$scope.sel_side = $scope.ind_sides;
				
				}
			else if($scope.sel_cuisine == "Italian"){
				
					$scope.sel_entree = $scope.ita_entree;
					$scope.sel_side = $scope.ita_sides;

				}

			else if($scope.sel_cuisine == "Mexican"){
					$scope.sel_entree = $scope.mex_entree;
					$scope.sel_side = $scope.mex_sides;
				}

			else
				{
					$scope.sel_entree = $scope.chi_entree;
					$scope.sel_side = $scope.chi_sides;
				}
					
		};
		
		// ADD a food from the menu
		$scope.addFood = function(){
		
		// Call Price function for entree once and side once

			$scope.getPriceForItem($scope.entree_sel);
			$scope.getPriceForItem($scope.side_sel);
				
			// //addFood here
			// Foods.create(entree_data)
			// .success(function(data) {
			
			// 	$scope.loading = false;
			// 	$scope.formData = {}; // clear the form so our user is ready to enter another
			// 	$scope.foods = data; // assign our new list of food items
			// });


			// side_data = $scope.getPriceForItem($scope.side_sel);
			// Foods.create(side_data)
			// .success(function(side_data) {
			// 	$scope.loading = false;
			// 	$scope.formData = {}; // clear the form so our user is ready to enter another
			// 	$scope.foods = side_data; // assign our new list of food items
			// });
			
		};
		
		$scope.getPriceForItem = function(item){
			
		 if (item != undefined){
		 		Menu.getPrice(item)
		 		.success(function(data){
		 			data[0].quantity = $scope.entree_qty;
		 			Foods.createfrommenu(data)
					.success(function(ord_food) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.foods = ord_food; // assign our new list of food items
			});
		 			
		 		});
		 }
			
		};
		
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
			Foods.getTotal().success(function (data){
				
					$scope.showTotal = false; // set the hide flag false
					console.log('total '+JSON.stringify(data));
					$scope.total = data[0].total;
					$scope.tax = data[0].tax;
					$scope.net_total = data[0].net_total; // assign total
			});

		};


		// Method to load initial data into MongoDB : menu_foods
		$scope.pushMenu = function(){

			console.log('m 1');

			Menu.pushInitialMenu().success(function(){
				console.log(' Menu Loaded ');
			});
		};
	}]);
