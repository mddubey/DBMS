var handler = {};
exports.handler = handler;
var order_m = require('./order_lib.js').order_lib;

handler.addCustomer = function (req,res) {
	var customer = {};
	var fields = Object.keys(req.body);
	fields.forEach(function(field){
		customer[field] = req.body[field];
	});
	order_m.addCustomer(customer, res);
}

handler.getHome = function(req, res){
	res.render('home');
}

// var getItemDetais = function(req){
// 	var item_details = {}
// }

// handler.placeOrder = function(req,res){
// 	var order_details = {};
// 	console.log(req.body);
// 	order_details.order_id = req.body.order_id;
// 	order_details.cust_id = req.body.cust_id;
// 	order_details.date_of_order = req.body.order_dt;
// 	order_details.date_of_delivery = req.body.delivery_dt;
// 	order_details.total_bill = req.body.bill;
// 	console.log(order_details);
// }

handler.makePayment = function(req, res){
	res.send("Work in progress");
}
