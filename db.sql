#xz_news[id/title/ctime/img_url/point/content]
USE xz;
CREATE TABLE xz_news(
   id  INT PRIMARY KEY AUTO_INCREMENT,
   title  VARCHAR(255),
   ctime  DATETIME,
   img_url VARCHAR(255),
   point   INT,
   content VARCHAR(2000)
);
INSERT INTO xz_news VALUES(null,'1231',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'1232',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'1233',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'1234',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'1235',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'1236',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'1237',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'1238',now(),
'http://127.0.0.1:3000/1.png',0,'1239');
INSERT INTO xz_news VALUES(null,'123',now(),
'http://127.0.0.1:3000/1.png',0,'12310');
INSERT INTO xz_news VALUES(null,'123',now(),
'http://127.0.0.1:3000/1.png',0,'12311');
INSERT INTO xz_news VALUES(null,'123',now(),
'http://127.0.0.1:3000/1.png',0,'12312');
INSERT INTO xz_news VALUES(null,'123',now(),
'http://127.0.0.1:3000/1.png',0,'12313');
INSERT INTO xz_news VALUES(null,'12314',now(),
'http://127.0.0.1:3000/1.png',0,'12314');
INSERT INTO xz_news VALUES(null,'12315',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'12316',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'12317',now(),
'http://127.0.0.1:3000/1.png',0,'123');
INSERT INTO xz_news VALUES(null,'123',now(),
'http://127.0.0.1:3000/1.png',0,'12318');
INSERT INTO xz_news VALUES(null,'123',now(),
'http://127.0.0.1:3000/1.png',0,'12319');
INSERT INTO xz_news VALUES(null,'123',now(),
'http://127.0.0.1:3000/1.png',0,'12320');
INSERT INTO xz_news VALUES(null,'123',now(),
'http://127.0.0.1:3000/1.png',0,'12321');
INSERT INTO xz_news VALUES(null,'12322',now(),
'http://127.0.0.1:3000/1.png',0,'123');




#创建表 xz_comment 评论表
CREATE TABLE xz_comment(
  id INT PRIMARY KEY AUTO_INCREMENT,
  content VARCHAR(2000),
  ctime DATETIME,
  nid   INT
);
INSERT INTO xz_comment VALUES(null,'1',now(),1);
INSERT INTO xz_comment VALUES(null,'2',now(),1);
INSERT INTO xz_comment VALUES(null,'3',now(),1);
INSERT INTO xz_comment VALUES(null,'4',now(),1);
INSERT INTO xz_comment VALUES(null,'5',now(),1);
INSERT INTO xz_comment VALUES(null,'6',now(),1);
INSERT INTO xz_comment VALUES(null,'7',now(),1);
INSERT INTO xz_comment VALUES(null,'8',now(),1);
INSERT INTO xz_comment VALUES(null,'9',now(),1);
INSERT INTO xz_comment VALUES(null,'10',now(),1);
INSERT INTO xz_comment VALUES(null,'11',now(),1);
INSERT INTO xz_comment VALUES(null,'12',now(),1);
INSERT INTO xz_comment VALUES(null,'13',now(),1);
INSERT INTO xz_comment VALUES(null,'14',now(),1);
INSERT INTO xz_comment VALUES(null,'15',now(),1);
INSERT INTO xz_comment VALUES(null,'16',now(),1);
INSERT INTO xz_comment VALUES(null,'17',now(),1);
INSERT INTO xz_comment VALUES(null,'18',now(),1);
INSERT INTO xz_comment VALUES(null,'19',now(),1);
INSERT INTO xz_comment VALUES(null,'20',now(),1);
INSERT INTO xz_comment VALUES(null,'21',now(),1);
INSERT INTO xz_comment VALUES(null,'22',now(),1);


#创建商品表
#xz_product
#id       INT
#name     VARCHAR(255)
#img_url  VARCHAR(255)
#price    DECIMAL(10,2) 
#bank     INT

CREATE TABLE xz_product(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  img_url VARCHAR(255),
  price DECIMAL(10,2),
  bank  INT
);
INSERT INTO xz_product VALUES(1,'辣椒1','http://127.0.0.1:3000/img/banner1.png',10.50,1);
INSERT INTO xz_product VALUES(2,'辣椒2','http://127.0.0.1:3000/img/banner1.png',13.50,1);
INSERT INTO xz_product VALUES(3,'辣椒3','http://127.0.0.1:3000/img/banner1.png',12.50,1);
INSERT INTO xz_product VALUES(4,'辣椒4','http://127.0.0.1:3000/img/banner1.png',11.50,1);




#购物车:
#xz_cart
#id     编号
#count  数量
#price  价格
#name   商品名称
#pid    商品编号
#uid    用户编号

#SELECT id,count,price,name,pid,uid
#FROM  xz_cart
#WHERE  uid = ?
# pno2-029282823-
CREATE TABLE xz_cart(
  id INT PRIMARY KEY AUTO_INCREMENT,
  uid INT,
  pid INT,
  price DECIMAL(10,2),
  count INT
);
INSERT INTO xz_cart VALUES(null,1,1,10,1);
INSERT INTO xz_cart VALUES(null,1,2,12,2);

#分析:查询购物信息
#[id,uid,price,count],[name]
#xz_cart              xz_product
#多表查询套路
#-将所有表名保存FROM 后
#FROM xz_cart,xz_product
#-为每一张表起一个别名
#FROM xz_cart c,xz_product p
#-查找两张表1个列有关系(= != <= >= )
#WHERE  c.pid = p.id 

SELECT c.uid,c.id,c.count,c.price,p.name
FROM xz_cart c,xz_product p
WHERE  c.pid = p.id 

#用户注册
# 用户登录:id name pwd 
# 用户信息:avatar phone addr ..
# 创建xz_cart xz_login    
CREATE TABLE xz_login(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(25),
  pwd  VARCHAR(32)
);
INSERT INTO xz_login VALUES(null,'tom',md5('123'));
INSERT INTO xz_login VALUES(null,'jerry',md5('123'));

#创建美食表
#xz_shoplist
#id        INT             编号
#img_url   VARCHAR(255)    美食图片
#dname     VARCHAR(255)    店铺名称
#dphone    VARCHAR(25)     店铺电话
#daddr     VARCHAR(255)    店铺地址
#dtime     VARCHAR(25)     店铺营业时间
#dpoint    INT             评分

CREATE TABLE xz_shoplist(
  id INT PRIMARY KEY AUTO_INCREMENT,
  img_url VARCHAR(255),
  dname   VARCHAR(255),
  dphone  VARCHAR(25),
  daddr   VARCHAR(255),
  dtime   VARCHAR(25),
  dpoint  INT
);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店1','13999999999','万寿路','9:00~21:00',80);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店2','13999999999','万寿路','9:00~21:00',85);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店3','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店4','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店5','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店6','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店7','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店8','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店9','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店10','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店11','13999999999','万寿路','9:00~21:00',90);
INSERT INTO xz_shoplist VALUES(null,'http://127.0.0.1:3000/niu.png','牛排店12','13999999999','万寿路','9:00~21:00',90);



#小程序--消息列表
#xz_message
#id     INT
#title  VARCHAR(255)
#ctime  DATETIME
#img_url VARCHAR(255)
#desc2   VARCHAR(255)
#content VARCHAR(2000)

CREATE TABLE xz_message(
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  ctime DATETIME,
  img_url VARCHAR(255),
  desc2   VARCHAR(255),
  content VARCHAR(2000)
);
INSERT INTO xz_message VALUES(null,'年终大促1','2019-01-28','http://127.0.0.1:3000/img/banner1.png','好消息好消息','年终大促');
INSERT INTO xz_message VALUES(null,'年终大促2','2019-02-28','http://127.0.0.1:3000/img/banner2.png','好消息好消息','年终大促');
INSERT INTO xz_message VALUES(null,'年终大促3','2019-03-28','http://127.0.0.1:3000/img/banner3.png','好消息好消息','年终大促');
INSERT INTO xz_message VALUES(null,'年终大促4','2019-04-28','http://127.0.0.1:3000/img/banner4.png','好消息好消息','年终大促');
INSERT INTO xz_message VALUES(null,'年终大促5','2019-05-28','http://127.0.0.1:3000/img/banner5.png','好消息好消息','年终大促');




DROP DATABASE IF EXISTS xcx;
CREATE DATABASE xcx CHARSET=UTF8;
USE xcx;

CREATE TABLE xcx_product(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  san VARCHAR(25),
  phone VARCHAR(25)
);



