
var Food = require('./models/food');
var Menu = require('./models/menu_foods');
var initial_menu = require('./documents/menu_foods');


function getFoods(res) {
    Food.find(function (err, foods) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }
        res.json(foods); // return all food items in JSON format
    });
}
;

// function to find the total price of the food items
function getTotal(res){
    Food.find(function (err, foods){
      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err) {
          res.send(err);
      }
      // Assign a variable for the total price
      var total_price = 0;
      var net_total = 0;

      var tax = 7.5;
      var bill_details ='';

      // Iterate over the retrieved food values to find the total
			for (var i = 0; i < foods.length; i++) {
				total_price += parseInt(foods[i].price);
			}

      // include the 7.5% TAX

      net_total = total_price + (tax/100) * total_price;
      bill_details = [{
                        "total":total_price,
                        "tax" : tax,
                        "net_total": net_total
                        }];

      res.json(bill_details);
    });
};



//function to retrive price for the given item
function getItemPrice(res, req){
        Menu.find({name: req.params.item},function(err, foodItem){
		if(err){
			res.send(err);
		}
		res.json(foodItem);
	});
		
}


module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all Food items
    app.get('/api/food', function (req, res) {
        // use mongoose to get all food items in the database

        getFoods(res);
    });

    // create food items and send back all food items after creation
    app.post('/api/food', function (req, res) {

        // create a food item, information comes from AJAX request from Angular
        Food.create({
            name: req.body.name,
            price: req.body.price,
			quantity :  req.body.qty,
            done: false
        }, function (err, food) {
            if (err)
                res.send(err);
            // get and return all the food items after you create another
            getFoods(res);
        });

    });

    // Create from menu
        app.post('/api/menufood', function (req, res) {

        // create a food item, information comes from AJAX request from Angular
        Food.create({
            name: req.body[0].name,
            price: req.body[0].price,
            quantity : req.body[0].quantity,
            done: false
        }, function (err, food) {
            if (err)
                res.send(err);
            // get and return all the food items after you create another
            getFoods(res);
        });

    });

    // delete a Food item
    app.delete('/api/food/:food_id', function (req, res) {
        Food.remove({
            _id: req.params.food_id
        }, function (err, food) {
            if (err)
                res.send(err);

            getFoods(res);
        });
    });

    // Calculate the total Price of the food item
    app.get('/api/total', function(req, res){
        getTotal(res);
    });
	
    // Load initial Menu items from menu_food.json
    app.get('/api/insertMenu', function(req, res){
        Menu.collection.insert(initial_menu,function(err, data){
            if (err) {
                console.log('Error while insertinf Menu items : '+err);
            };

        });

    });

	// get the Price of a item from the Menu Collection
	app.get('/api/getprice/:item', function(req, res){
        getItemPrice(res,req);
	});
	


    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

        // When routed to billing
//     app.get('/index', function (req, res) {
//        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//    });

};
