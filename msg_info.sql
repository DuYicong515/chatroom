drop database if exists msg_info;

create database msg_info;



drop table if exists msg_info.user_info;

create table msg_info.user_info(
	username varchar(20) NOT NULL,
	password varchar(20) NOT NULL,
    primary key (username)
)character set = utf8;


drop table if exists msg_info.messages_info;

create table msg_info.messages_info(
	m_id int(16) NOT NULL AUTO_INCREMENT,
	username varchar(20) NOT NULL,
	msgtime varchar(100),
	msg varchar(100),
    primary key (m_id)
)character set = utf8;


--INSERT INTO msg_info.user_info(username,password) VALUES ('123', '456');
--INSERT INTO msg_info.messages_info(username,msgtime,msg) VALUES ('123', '8 oclock','fjijfijf');
--INSERT INTO msg_info.user_info(username,password) VALUES ('789', '456');
--INSERT INTO msg_info.user_info(username,password) VALUES ('nana', '456');