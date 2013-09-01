create database hyperfill;
create table user( 
user_id int(10) primary key auto_increment, 
user_name varchar(65) not null, 
user_passwd varchar(65) not null 
); 
create table form(
  user_name varchar(65) not null,
  url varchar(250) not null,
  content varchar(3000),
  primary key(user_name, url)
);