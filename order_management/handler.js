var handler = {};
exports.handler = handler;
var order_m = require('./order_lib.js').order_lib;

handler.addCustomer = function (req,res) {
	var customer = {};
	var fields = Object.keys(req.body);
	fields.forEach(function(field){
		customer[field] = req.body[field];
	})
	order_m.addCustomer(customer, res);
}
