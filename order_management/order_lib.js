var mysql = require('mysql');
var order_lib = {};
exports.order_lib = order_lib;
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'mritunjay',
  password : '12345',
  database : 'test',
});

order_lib.getCustomerForm = function(req,res){
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
  var sqlInsCust = 'insert into customer set ?';
  connection.query(sqlInsCust,customer, function(err, rows, fields) {
    var result = {};
    if (err) result.message = "Can't add this record. customer Number already exists....";
    result.message = "customer added sucessfully";
    res.render('message',{message:result.message});
  });
}

order_lib.getOrderForm = function(req,res){
  var max;
  connection.query('SELECT max(order_id) from order_info', function(err, rows, fields) {
      if (err) throw err;

      max = rows[0]['max(order_id)'];
      if(!max) max = 100;
      else max += 1;
      connection.query('SELECT product_id,product_name,unit_price from product_info', function(err,rows){
        if(err) throw err;
        res.render('order',{orderId:max,products:rows});
      });
  });
}
