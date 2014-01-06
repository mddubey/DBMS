var mysql = require('mysql');
var order_lib = {};
exports.order_lib = order_lib;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'mritunjay',
  password : '12345',
  database : 'test',
});

order_lib.fillCustomerInfo = function(req,res){
	var max;
	connection.query('SELECT max(cust_id) from customer', function(err, rows, fields) {
  		if (err) throw err;

  		max = rows[0]['max(cust_id)'];
  		if(!max) max = 100;
  		else max += 1;
  		res.render('customer',{customer:max});
	});
}

order_lib.addCustomer = function (customer, res){
	var sqlInsCust = 
	'insert into customer(cust_id,cust_name,add1,add2,city,pinNo,contactNo) values(' +
		customer.cust_id+ ',"'+	customer.cust_name+'","'+customer.add1+'","'+customer.add2+'","'+
		customer.city+'",'+ customer.pin +',"'+customer.contact+'")';
	
	connection.query(sqlInsCust, function(err, rows, fields) {
		var result = {};
  		if (err) result.message = "Can't add this record. customer Number already exists....";
      result.message = "customer added sucessfully";
      	res.render('message',{message:result.message});
    });
}
