use Ecommerc

drop table user_table

create table user_table(
id int primary key identity(1,1),
namee varchar(25) not null ,
surname varchar(30) not null,
user_name varchar(35) unique,
passwordd varchar (10) not null,
user_telephone_number varchar (25) not null,
user_address varchar(30) not null,
user_email varchar(40) not null,
user_role varchar(10) default 'USER',
);


insert into user_table(namee,surname,user_name,passwordd,user_telephone_number,user_address,user_email,user_role)
values('Admin','admin','admin_','admin123','000000','none','none','ADMIN');

Select *
from user_table

ALTER TABLE user_table
ALTER COLUMN user_email VARCHAR(40) NULL;
------------------------------------------------------------------------------------------------------------------->
drop table Product

CREATE TABLE product (
    id INT PRIMARY KEY identity(1,1),
    product_name VARCHAR(50) NOT NULL,
    product_description VARCHAR(250) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
	photo1_url varchar(MAX) not null,
	photo2_url varchar(MAX) not null,
	photo3_url varchar(MAX) not null,
	photo4_url varchar(MAX) not null,
	prodhuesi varchar(50) not null,
	garancioni varchar(15) not null,
	vendIProdhimit varchar(50) not null,
	category varchar (35) not null,
);

ALTER TABLE Product
DROP COLUMN description;

ALTER TABLE Product
ADD category varchar(35) not null;

insert into Product(product_name,product_description,price,quantity,photo1_url,photo2_url,photo3_url,photo4_url,prodhuesi,
garancioni,vendIProdhimit,pesha)
values('Ndegjuese','Produkt i mir me ze te mire',13.00,5,'safasffsafas','safasffsafas','safasffsafas','safasffsafas','fksalf',25,'fsafasf',15);

Select *
from Product
--------------------------------------------------------------------------------------------------------------------->
CREATE TABLE user_messagee (
    id int PRIMARY KEY identity(1,1),
    content varchar(MAX) NOT NULL,
    user_id int FOREIGN KEY REFERENCES user_table(id),
	username_user varchar(35) not null,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
);

drop table user_messagee

Select *
from user_messagee
----------------------------------------------------------------------------------------------------------------------->
CREATE TABLE shopping_cart(
id int primary key identity(1,1),
user_id int foreign key references user_table(id),
product_id int foreign key references product(id),
username_of_user varchar(35) not null,
id_of_product int not null,
quantity int not null,
);

insert into shopping_cart(user_id,product_id,username_of_user,id_of_product)values(18,1,'meticakaj',1)

drop table shopping_cart

Select *
from shopping_cart
-------------------------------------------------------------------------------------------------------------------------->
CREATE TABLE wish_list(
id int primary key identity(1,1),
user_id int foreign key references user_table(id),
product_id int foreign key references product(id),
username_of_user varchar(35) not null,
id_of_product int not null,
);

drop table wishList

Select *
from wish_list
--------------------------------------------------------------------------------------------------------------------------->
CREATE TABLE Orders (
    id INT PRIMARY KEY identity(1,1),
    user_id int foreign key references user_table(id),
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	username_of_user varchar not null,
	country varchar(15) not null,
	city varchar(35) not null,
	address varchar(MAX) not null,
);

drop table Orders

ALTER TABLE Orders
ADD type_of_transport varchar(30) not null;

Select *
from Orders

insert into Orders(user_id,total,status,username_of_user)values(18,250,'fsf','meticakaj')

------------------------------------------------------------------------------------------------------------------------------>
CREATE TABLE order_items (
    id int primary key identity(1,1),
    order_id int foreign key references Orders(id),
    product_id int foreign key references product(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
	id_of_product int not null,
	id_of_order int not null
);

drop table OrderItems

Select *
from order_items

insert into order_items(order_id,product_id,quantity,price,id_of_product,id_of_order)values(3,1,25,30,1,3)
------------------------------------------------------------------------------------------------------------------------------->