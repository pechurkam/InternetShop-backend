create table category
(
	id serial not null
		constraint category_pk
			primary key,
	name varchar(100) not null,
	description text not null
);

alter table category owner to postgres;

create table product
(
	id serial not null
		constraint product_pk
			primary key,
	name varchar(100) not null,
	description text not null,
	image_url varchar(255) not null,
	price double precision not null,
	special_price double precision,
	category_id integer not null
		constraint product_to_categories__fk
			references category
				on update cascade on delete cascade
);

alter table product owner to postgres;

create table "order"
(
	id serial not null
		constraint order_pk
			primary key,
	client_name varchar(255) not null,
	client_phone varchar(20) not null,
	client_email varchar(255)
);

alter table "order" owner to postgres;

create table order_to_product
(
	order_id integer not null
		constraint order_to_product_order_id_fk
			references "order"
				on update cascade on delete cascade,
	product_id integer not null
		constraint order_to_product_product_id_fk
			references product
				on update cascade on delete restrict,
	count integer default 1 not null,
	constraint order_product_pkey
		primary key (order_id, product_id)
);

alter table order_to_product owner to postgres;