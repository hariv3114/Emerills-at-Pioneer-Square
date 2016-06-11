var mongoose = require('mongoose');

//Collection for Menu foods 

module.exports = mongoose.model('menu_foods',{
	
	    // Name of the food
    name: {
        type: String,
        default: ''
    },

    // Price of the food
    price: {
        type: Number,
        default: 0
    },

});