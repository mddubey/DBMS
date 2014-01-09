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

order_lib.addCustomer = function (customer, res){
  var sqlInsCust = 'insert into customer set ?';
  connection.query(sqlInsCust,customer, function(err, rows, fields) {
    var result = {};
    if (err) result.message = "Can't add this record. customer Number already exists....";
    result.message = "customer added sucessfully";
    res.render('message',{message:result.message});
  });
}

var listAllProducts = function(res){
  return function(err,rows){
      if(err) throw err;
      res.render('order',{products:rows});
    }
}

order_lib.getOrderForm = function(req,res){
  var max_order_id = 'SELECT product_id,product_name,unit_price from product_info';
  connection.query(max_order_id,listAllProducts(res));
}

order_lib.insertOrderDetails = function(all_item_details,order_details,res){
  var insertOrderSql = 'insert into order_info set ?';
  var message = "";
  connection.query(insertOrderSql,order_details,function(err, rows){
    var order_id = rows.insertId;
    if(err) message = err;
    else{
        var insertItemSql = 'insert into order_item set ?';
        all_item_details.forEach(function(item){
          item.order_id = order_id;
          connection.query(insertItemSql,item,function(err,rows){
            if(err) throw err;
          })
        })      
        message = "Order Inserted successfully";
    }
    res.render('message',{message:message});
  })
}