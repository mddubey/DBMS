create table customer(
cust_id int,
cust_name varchar(30),
add1 varchar(15),
add2 varchar(15),
city varchar(15),
pinNo int,
contactNo varchar(13)
);

alter table customer add constraint primary key(cust_id);


select * from customer;

create table order_info(
order_id int,
cust_id int,
date_of_order date,
date_of_delivery date,
total_bill float
);

alter table order_info add constraint primary key(order_id);

alter table order_info add constraint order_fk_cust_id foreign key(cust_id)
 references customer(cust_id);

create table order_item(
order_item_id int,
order_id int,
product_id int,
quantity float,
price float
);

alter table order_item add constraint primary key(order_item_id);

alter table order_item add constraint order_fk_order_id foreign key(order_id) 
references order_info(order_id);

alter table order_item drop product_fk_product_id;
desc order_item;
alter table order_item add constraint product_fk_product_id foreign key(product_id) 
references  product_info(product_id);

create table product_info(
product_id int,
product_name varchar(25),
unit_price float,
catagory varchar(10)
);

alter table product_info add constraint primary key(product_id);

create table order_item(
order_item_id int,
order_id int,
product_id int,
quantity float,
price float
);

alter table order_item add constraint primary key(order_item_id);

alter table order_item add constraint order_fk_order_id foreign key(order_id) 
references order_info(order_id);

desc order_item;
alter table order_item add constraint product_fk_product_id foreign key(product_id) 
references  product_info(product_id);