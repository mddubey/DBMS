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

var insertEachItem = function(res, all_item_details){
  return function(err, rows){
    var order_id = rows.insertId;
    if(err) throw err;
    var insertItemSql = 'insert into order_item set ?';
    all_item_details.forEach(function(item){
      item.order_id = order_id;
      connection.query(insertItemSql,item,function(err,rows){
        if(err) throw err;
      })
    })      
    message = "Order Inserted successfully";
    res.render('message',{message:message});
  }
}

order_lib.insertOrderDetails = function(all_item_details,order_details,res){
  var insertOrderSql = 'insert into order_info set ?';
  var message = "";
  connection.query(insertOrderSql,order_details,insertEachItem(res, all_item_details));
}

order_lib.fillOrderBill = function(res, order_id){
  var SqlGetBill = 'SELECT total_bill from order_info where order_id = ' + order_id;
  connection.query(SqlGetBill, function(err, rows){
    if(err) throw err;
    if(rows[0] && rows[0].total_bill)
      res.render('payment',{order_id:order_id,bill:rows[0].total_bill})
    res.render('payment',{order_id:'',bill:0})
  })
}

order_lib.insertPaymentDetails = function(res, paymentDetais){
  var insPaySql = 'insert into payment_info set ?';
  connection.query(insPaySql, paymentDetais, function(err, rows){
    if(err) throw err;
    var updateOrderSql = 'update order_info set is_paid = "Y" where order_id = '
                           + paymentDetais.order_id;
    connection.query(updateOrderSql, function(err, rows){
        if(err) throw err;
        res.render('message',{message:'payment details inserted successfully'});
    })
  })
}