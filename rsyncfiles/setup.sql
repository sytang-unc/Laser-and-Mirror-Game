USE mirror_storage;

DROP TABLE IF EXISTS ACCOUNTS;
CREATE TABLE ACCOUNTS(username varchar(20), password varchar(20));
INSERT INTO ACCOUNTS VALUES
	("user1", "password1"),
	("user2", "password2")
;


DROP TABLE IF EXISTS SCORES;
CREATE TABLE SCORES(username varchar(20), time datetime, score int);
INSERT INTO SCORES VALUES
	("user1", "2016-03-30 09:51:13", 10),
	("user1", "2017-02-15 06:00:10", 20),
	("user1", "2017-02-25 13:23:50", 40),
	("user1", "2017-03-01 23:10:09", 0),
	("user1", "2017-03-10 20:09:05", 100)
;
