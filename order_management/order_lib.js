var mysql = require('mysql');
var order_lib = {};
exports.order_lib = order_lib;
var db_details = {
  host     : 'localhost',
  user     : 'mritunjay',
  password : '12345',
  database : 'test',
};

var connection = mysql.createConnection(db_details);
order_lib.getCustomerForm = function(req,res){
  var max_cust_id = 'SELECT ifnull(max(cust_id),100) as cust_id from customer';
  connection.query(max_cust_id, function(err, rows, fields) {
      var max;
  		if (err) throw err;
  		max = rows[0]['cust_id'];
  		max += 1;
  		res.render('customer',{customer:max});
  });
  // connection.end();
}

order_lib.addCustomer = function (customer, res){
  var sqlInsCust = 'insert into customer set ?';
  connection.query(sqlInsCust,customer, function(err, rows, fields) {
    var result = {};
    if (err) result.message = "Can't add this record. customer Number already exists....";
    result.message = "customer added sucessfully";
    res.render('message',{message:result.message});
  });
  // connection.end();
}

var listAllProducts = function(res, max){
  return function(err,rows){
      if(err) throw err;
      res.render('order',{orderId:max,products:rows});
    }
  // connection.end();
}

var fillOrderId = function(res){
  return function(err, rows, fields) {
      var max;
      if (err) throw err;
      max = rows[0]['order_id'];
      max += 1;
      var products_query = 'SELECT product_id,product_name,unit_price from product_info';
      connection.query(products_query,listAllProducts(res, max));
  }
}

order_lib.getOrderForm = function(req,res){
  var max_order_id = 'SELECT ifnull(max(order_id),100) as order_id from order_info';
  connection.query(max_order_id,fillOrderId(res));
}

order_lib.insertOrderDetails = function(all_item_details,order_details,res){
  var insertOrderSql = 'insert into order_info set ?';
  var message = "";
  console.log(order_details.cust_id)
  connection.query(insertOrderSql,order_details,function(err, rows){
    if(err) message = err;
    else{
        var insertItemSql = 'insert into order_item set ?';
        all_item_details.forEach(function(item){
          connection.query(insertItemSql,item,function(err,rows){
            if(err) throw err;
          })
        })      
        message = "Order Inserted successfully";
    }
    res.render('message',{message:message});
  })
  // connection.end();
}