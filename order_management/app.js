
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var handler = require('./handler').handler;
var order_m = require('./order_lib.js').order_lib;

var app = express();
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', handler.getHome);
app.get('/customer', handler.getCustomerForm);
app.get('/order', order_m.getOrderForm);
app.get('/payment', handler.getPaymentForm);
app.post('/searchOrder', handler.getOrderBill);

app.post('/addCustomer',handler.addCustomer);
app.post('/placeOrder',handler.placeOrder);
app.post('/makePayment',handler.makePayment);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
