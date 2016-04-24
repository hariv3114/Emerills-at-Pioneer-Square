var Food = require('./models/food');


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
      // Iterate over the retrieved food values to find the total
			for (var i = 0; i < foods.length; i++) {
							total_price += parseInt(foods[i].price);
			}

      // include the 7.5% TAX
      total_price = total_price + (7.5/100) * total_price;
      res.json(total_price);
    });
};

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

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
