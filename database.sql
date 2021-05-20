-- create users table
create table users(
  id serial primary key,
  email varchar(255) not null unique,
  password varchar(255) not null,
  resetPasswordToken text default '',
  resetPasswordExpiresIn date,
  created_at date default current_date,
  role int default 0
);

-- types
create type animal as enum('cat', 'dog');
create type gender as enum('male', 'female');
create type size as enum('small', 'medium', 'large');
create type adopt_location as enum('north','center','south');

-- create posts table
create table posts(
  id serial primary key,
  user_id int not null,
  created_at date default current_date,
  foreign key (user_id) references users(id)
);

-- animals table
create table animals (
   id serial primary key,
   post_id int not null unique,
   animal_name varchar(50) not null,
   animal_type animal not null,
   post_location adopt_location,
   already_adopted boolean default false,
   age int not null,
   birth_date date,
   animal_gender gender not null,
   animal_size size not null,
   color varchar(255) not null,
   immune boolean,
   sterilized_or_castrated boolean, 
   about text,
   foreign key (post_id) references posts(id) 
);

-- animal images
create table animal_images (
   id serial primary key,
   animal_id int not null,
   image_url text,
   public_id text,
   foreign key (animal_id) references animals(id)
);

