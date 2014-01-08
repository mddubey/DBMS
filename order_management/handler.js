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

var getItemDetais = function(req){
	var all_item_details = [];
	var keys = Object.keys(req.body);
	keys.forEach(function(key){
		if(key == 'order_id')
			return;
		var key_data = req.body[key];
		if(key_data[2] == 'on'){
			var item = {};
			item.order_id = req.body.order_id;
			item.product_id = key;
			item.quantity = key_data[1];
			item.price = key_data[0];
			all_item_details.push(item);
		}			
	})
	return all_item_details;
}

var getOrderDetails = function(req){
	var order_details = {};
	order_details.order_id = req.body.order_id;
	order_details.cust_id = req.body.cust_id;
	order_details.date_of_order = req.body.order_dt;
	order_details.date_of_delivery = req.body.delivery_dt;
	order_details.total_bill = req.body.bill;
	return order_details;
}

var getTotalBill = function(all_item_details){
	var total_bill = 0;
	all_item_details.forEach(function(item){
		var price = item.price * item.quantity;
		total_bill += price;
	})
	return total_bill;
}

handler.placeOrder = function(req,res){
	var order_details = getOrderDetails(req);
	var all_item_details = getItemDetais(req);
	order_details.total_bill = getTotalBill(all_item_details);
	order_m.insertOrderDetails(all_item_details,order_details,res);
}

handler.makePayment = function(req, res){
	res.send("Work in progress");
}
