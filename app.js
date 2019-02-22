//vue_app_server 服务器
const express = require("express");
//加载两个模块 fs 移动文件
//第三方上传文件模块
const fs = require("fs");
//移动 将临时文件 移动 upload
//fs.renameSync(临时文件,新文件)；
const multer = require("multer");
//创建上传文件对象
var upload = multer({dest:"upload/"});

var app = express();
app.use(express.static("public"));
app.listen(3000);
const pool = require("./pool");

//express mysql 参数 request;response
//跨域访问配置
//1:加载模块cors
const cors = require("cors");
//2:配置cors
app.use(cors({
  origin:["http://127.0.0.1:3001",
         "http://localhost:3001"],//允许列表
  credentials:true   //是否验证
}));
//3:加载第三方模块: express-session
const session = require("express-session");
//4:对模块配置
app.use(session({
  secret:"128位随机字符串",   //安全令牌
  resave:false,              //请求保存
  saveUninitialized:true,    //初始化
  cookie:{                   //sessionid保存时
    maxAge:1000*60*60*24     //间1天 cookie
  }
}));
//功能十一:用户登录
app.get("/login",(req,res)=>{
  //1:获取登录参数
  var name = req.query.name;
  var pwd = req.query.pwd;
  //2:正则
  //3:创建sql
  var sql =" SELECT count(id) as c,id";
     sql +=" FROM xz_login";
     sql +=" WHERE name = ? AND pwd = md5(?)";
  //4:如果参数匹配成功将用户id保存session对象
  pool.query(sql,[name,pwd],(err,result)=>{
       if(err)throw err;
       var c = result[0].c;
       if(c == 1){
        req.session.uid = result[0].id
        res.send({code:1,msg:"登录成功"});
       }else{
         res.send({code:-1,msg:"用户名或密码有误"})
       }
  });
  //5:返回结果
  //  {code:1,msg:"登录成功"}
  //  {code:-1,msg:"用户名或密码错误"}
});


//
app.get("/getyang",(req,res)=>{
	var yang = [
		{id:1,img_url:"http://127.0.0.1:3000/img/1.png",title:"你好"},	
		{id:2,img_url:"http://127.0.0.1:3000/img/1.png",title:"你好"},	
		{id:3,img_url:"http://127.0.0.1:3000/img/1.png",title:"你好"},	
		{id:4,img_url:"http://127.0.0.1:3000/img/1.png",title:"你好"}
	];
	res.send(yang);
})

//
app.get("/getkezhao",(req,res)=>{
  var kezhao = [
    {id:1,img_url:"http://127.0.0.1:3000/img/1.png",title:""},
    {id:2,img_url:"http://127.0.0.1:3000/img/1.png",title:""},
    {id:3,img_url:"http://127.0.0.1:3000/img/1.png",title:"爱情不是最初的甜蜜，而是繁华褪去。"},
    {id:4,img_url:"http://127.0.0.1:3000/img/1.png",title:"爱情不是最初的甜蜜，而是繁华褪去。"},
    {id:5,img_url:"http://127.0.0.1:3000/img/1.png",title:"爱情不是最初的甜蜜，而是繁华褪去。"}
  ];
  res.send(kezhao);
})

//功能一:首页轮播
app.get("/getImages",(req,res)=>{
  var rows = [
    {id:1,img_url:"http://127.0.0.1:3000/img/1.png"},
    {id:2,img_url:"http://127.0.0.1:3000/img/2.png"},
    {id:3,img_url:"http://127.0.0.1:3000/img/3.png"},
  ];
  res.send(rows);
})

//功能二:新闻分页显示
app.get("/getNews",(req,res)=>{
  //1:参数       pno 页码;pageSize 页大小
  var pno = req.query.pno;
  var pageSize = req.query.pageSize;
  //1.2:默认值
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 7;
  }
  //2:验证正则表达式
  var reg = /^[0-9]{1,}$/;
  if(!reg.test(pno)){
     res.send({code:-1,msg:"页码格式不正确"});
     return;
  }
  if(!reg.test(pageSize)){
    res.send({code:-2,msg:"页大小格式不正确"});
    return;
  }
  //3:创建sql
  //  查询总页数
  var sql = "SELECT count(id) as c FROM xz_news";
  var progress = 0; //sql执行进度
  obj = {code:1};
  pool.query(sql,(err,result)=>{
       if(err)throw err;
       //console.log(result[0].c);
       var pageCount = Math.ceil(result[0].c/pageSize);
       obj.pageCount = pageCount;
       progress += 50;
       if(progress == 100){
        res.send(obj);
       }
  });
  //  查询当前页内容
var sql=" SELECT id,ctime,title,img_url,point";
    sql +=" FROM xz_news";
    sql +=" LIMIT ?,?"
var offset = parseInt((pno-1)*pageSize);
pageSize = parseInt(pageSize);
  pool.query(sql,[offset,pageSize],(err,result)=>{
    if(err)throw err;
    //console.log(result);
    obj.data = result;
    progress+=50;
    if(progress==100){
      res.send(obj);
    }
  }); 
})

//功能三:依据新闻编号查询新闻详细信息
app.get("/getNewsInfo",(req,res)=>{
  //1:参数   id   53
  var id = req.query.id;
  //2:sql    SELECT id,title,ctime,content FROM 
  //         xz_news WHERE id = ?
  var sql=" SELECT id,title,ctime,content";
      sql+=" FROM xz_news WHERE id = ?";
  //3:json   {code:1,data:obj}
  pool.query(sql,[id],(err,result)=>{
      if(err)throw err;
      res.send({code:1,data:result[0]});
  })
})

//功能四:发表评论
app.get("/addComment",(req,res)=>{
  //1:参数 nid content
  var nid = req.query.nid;
  var content = req.query.content;
  //console.log("1:"+nid+"|"+content);
  //2:sql  INSERT INTO
  var sql = "INSERT INTO xz_comment(id,content,ctime,nid)VALUES(null,?,now(),?)";
  pool.query(sql,[content,nid],(err,result)=>{
      if(err)throw err;  
      //console.log(2);
      //console.log(result);
      //影响行数
      if(result.affectedRows > 0){
       res.send({code:1,msg:"评论发送成功"});      
      }else{
        res.send({code:-1,msg:"评论发送失败"});    
      }
  }) 
  //3:json {code:1,msg:""}
})



//功能五:依据新闻编号(id),查询指定新闻编号评论列表
app.get("/getComments",(req,res)=>{
  //1:参数       pno 页码;pageSize 页大小
  var pno = req.query.pno;
  var pageSize = req.query.pageSize;
  var nid = parseInt(req.query.nid);
  //1.2:默认值
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 7;
  }
  //2:验证正则表达式
  var reg = /^[0-9]{1,}$/;
  if(!reg.test(pno)){
     res.send({code:-1,msg:"页码格式不正确"});
     return;
  }
  if(!reg.test(pageSize)){
    res.send({code:-2,msg:"页大小格式不正确"});
    return;
  }
  //3:创建sql
  //  查询总页数
  var sql = "SELECT count(id) as c FROM xz_comment";
  sql +=" WHERE nid = ?"
  var progress = 0; //sql执行进度
  obj = {code:1};
  pool.query(sql,[nid],(err,result)=>{
       if(err)throw err;
       //console.log(result[0].c);
       var pageCount = Math.ceil(result[0].c/pageSize);
       obj.pageCount = pageCount;
       progress += 50;
       if(progress == 100){
        res.send(obj);
       }
  });
  //  查询当前页内容
var sql=" SELECT id,ctime,content";
    sql +=" FROM xz_comment";
    sql +=" WHERE nid = ?";
    sql +=" ORDER BY id DESC";//按编号降序排列
    sql +=" LIMIT ?,?"
var offset = parseInt((pno-1)*pageSize);
pageSize = parseInt(pageSize);
  pool.query(sql,[nid,offset,pageSize],(err,result)=>{
    if(err)throw err;
    //console.log(result);
    obj.data = result;
    progress+=50;
    if(progress==100){
      res.send(obj);
    }
  }); 
});


//#功能六:商品列表
app.get("/getGoodsList",(req,res)=>{
  //1:参数       pno 页码;pageSize 页大小
  var pno = req.query.pno;
  var pageSize = req.query.pageSize;
  //1.2:默认值
  if(!pno){
    pno = 1;
  }
  if(!pageSize){
    pageSize = 4;
  }
  //2:验证正则表达式
  var reg = /^[0-9]{1,}$/;
  if(!reg.test(pno)){
     res.send({code:-1,msg:"页码格式不正确"});
     return;
  }
  if(!reg.test(pageSize)){
    res.send({code:-2,msg:"页大小格式不正确"});
    return;
  }
  //3:创建sql
  //  查询总页数
  var sql = "SELECT count(id) as c FROM xz_product";
  var progress = 0; //sql执行进度
  obj = {code:1};
  pool.query(sql,(err,result)=>{
       if(err)throw err;
       //console.log(result[0].c);
       var pageCount = Math.ceil(result[0].c/pageSize);
       obj.pageCount = pageCount;
       progress += 50;
       if(progress == 100){
        res.send(obj);
       }
  });
  //  查询当前页内容
var sql=" SELECT id,name,img_url,price,bank";
    sql +=" FROM xz_product";
    sql +=" LIMIT ?,?"
var offset = parseInt((pno-1)*pageSize);
pageSize = parseInt(pageSize);
  pool.query(sql,[offset,pageSize],(err,result)=>{
    if(err)throw err;
    //console.log(result);
    obj.data = result;
    progress+=50;
    if(progress==100){
      res.send(obj);
    }
  }); 
});

//功能七:将商品信息添加至购物车
app.get("/addCart",(req,res)=>{
  //1:参数 uid pid price count
  var uid   = parseInt(req.query.uid);
  var pid   = parseInt(req.query.pid);
  var price = parseFloat(req.query.price);
  var count = parseInt(req.query.count);
  //2:sql  INSERT
  var sql=" INSERT INTO `xz_cart`(`id`, ";
      sql+=" `uid`, `pid`, `price`,";
      sql+=" `count`) VALUES (null,?,?,?,?)";
  pool.query(sql,[uid,pid,price,count],(err,result)=>{
      if(err)throw err;
      if(result.affectedRows > 0){
        res.send({code:1,msg:"添加成功"});
      }else{
        res.send({code:-1,msg:"添加失败"});
      }
  })
  //3:json {code:1,msg:"添加成功"}
}); 

//功能八:查询商品详细信息
app.get("/getProduct",(req,res)=>{
   //1:参数 商品id
   var pid = parseInt(req.query.id);
   //2:sql  SELECT id,name,price,
   var sql =" SELECT `id`, `name`, `img_url`";
   sql+=" , `price`, `bank` FROM `xz_product`"; sql+=" WHERE id = ?";
   pool.query(sql,[pid],(err,result)=>{
      if(err)throw err;
      res.send({code:1,data:result[0]})
   });
   //3:json {code:1,data:{}}
});

//功能九:用户注册
app.get("/register",(req,res)=>{
   //1:参数 name,pwd
   var name = req.query.name;
   var pwd = req.query.pwd;
   //1.1:验证
   var reg = /^[a-z0-9_]{8,12}$/;
   if(!reg.test(name)){
     res.send({code:-1,msg:"用户名格式不正确"});
     return;
   }
   var sql = "INSERT INTO xz_login VALUES(null";
      sql +=",?,md5(?))";
   pool.query(sql,[name,pwd],(err,result)=>{
          if(err)throw err;
          if(result.affectedRows>0){
            res.send({code:1,msg:"注册成功"})
          }else{
            res.send({code:-1,msg:"注册失败"});
          }
   })
});

//功能十:用户名是否存在
app.get("/existsName",(req,res)=>{
  //1:参数
  var name = req.query.name;
  //2:sql
  var sql = " SELECT count(id) as c FROM xz_login";
      sql+=" WHERE name = ?";
  pool.query(sql,[name],(err,result)=>{
       if(err)throw err;
       //result node.js 数组
       //[{c:0}]
       ///result[0].c
       if(result[0].c > 0){
         res.send({code:-1,msg:"该用户名己存在"})
       }else{
         res.send({code:1,msg:"欢迎使用"});
       }
  })    
  //3:json
});
//功能十二:查询购物车中数据
app.get("/getCartList",(req,res)=>{
  //1:参数
  var uid = req.session.uid;
  console.log("|"+uid+"|");
  //2:sql
  var sql =" SELECT p.name,c.count,c.price";
      sql +=" ,c.id";
      sql +=" FROM xz_product p,xz_cart c";
      sql +=" WHERE p.id = c.pid";
      sql +=" AND c.uid = ?";
  console.log(sql);    
  pool.query(sql,[uid],(err,result)=>{
      if(err)throw err;
      res.send({code:1,data:result});
  }) 
})
//功能十三:同步购物中商品数量
app.get("/updateCart",(req,res)=>{
  //1:参数 id count
  var id = parseInt(req.query.id);
  var count = parseInt(req.query.count);
  //2:sql UPDATE
  var sql = " UPDATE xz_cart SET count = ?";
     sql += " WHERE id = ?";
  pool.query(sql,[count,id],(err,result)=>{
    if(err)throw err; //17:30 sub add
    if(result.affectedRows > 0){
      res.send({code:1,msg:"更新成功"});
    }else{
      res.send({code:-1,msg:"更新失败"});
    }
  })
  //3:json {code:1,msg:""}
})
app.get("/logout",(req,res)=>{
  req.session.uid = null;
  res.send({code:1,msg:"退出成功"});
})

//功能十四:小程序 九宫格
app.get("/getNavImages",(req,res)=>{
  var list = [
    {id:1,img_url:"http://127.0.0.1:3000/img/icons/grid-01.png",title:"美食"},
    {id:2,img_url:"http://127.0.0.1:3000/img/icons/grid-02.png",title:"美食"},
    {id:3,img_url:"http://127.0.0.1:3000/img/icons/grid-03.png",title:"美食"},
    {id:4,img_url:"http://127.0.0.1:3000/img/icons/grid-04.png",title:"美食"},
    {id:5,img_url:"http://127.0.0.1:3000/img/icons/grid-05.png",title:"美食"},
    {id:6,img_url:"http://127.0.0.1:3000/img/icons/grid-06.png",title:"美食"},
    {id:7,img_url:"http://127.0.0.1:3000/img/icons/grid-07.png",title:"美食"},
    {id:8,img_url:"http://127.0.0.1:3000/img/icons/grid-08.png",title:"美食"},
    {id:9,img_url:"http://127.0.0.1:3000/img/icons/grid-09.png",title:"美食"}
  ];
  res.send(list);
});


//功能十六:小程序美食分页显示
app.get("/getShopList",(req,res)=>{
   //1:参数       pno 页码;pageSize 页大小
   var pno = req.query.pno;
   var pageSize = req.query.pageSize;
   //1.2:默认值
   if(!pno){
     pno = 1;
   }
   if(!pageSize){
     pageSize = 7;
   }
   //2:验证正则表达式
   var reg = /^[0-9]{1,}$/;
   if(!reg.test(pno)){
      res.send({code:-1,msg:"页码格式不正确"});
      return;
   }
   if(!reg.test(pageSize)){
     res.send({code:-2,msg:"页大小格式不正确"});
     return;
   }
   //3:创建sql
   //  查询总页数
   var sql = "SELECT count(id) as c FROM xz_shoplist";
   var progress = 0; //sql执行进度
   obj = {code:1};
   pool.query(sql,(err,result)=>{
        if(err)throw err;
        //console.log(result[0].c);
        var pageCount = Math.ceil(result[0].c/pageSize);
        obj.pageCount = pageCount;
        progress += 50;
        if(progress == 100){
         res.send(obj);
        }
   });
   //  查询当前页内容
 var sql=" SELECT id,img_url,dname,daddr,dphone,dtime,dpoint";
     sql +=" FROM xz_shoplist";
     sql +=" LIMIT ?,?"
 var offset = parseInt((pno-1)*pageSize);
 pageSize = parseInt(pageSize);
   pool.query(sql,[offset,pageSize],(err,result)=>{
     if(err)throw err;
     //console.log(result);
     obj.data = result;
     progress+=50;
     if(progress==100){
       res.send(obj);
     }
   }); 
});


//功能十七:添加商品
app.get("/saveP",(req,res)=>{
    //1:获取参数 pname price
    console.log(req.query);
    var pname = req.query.pname;
    var phone = req.query.phone;
    var san = req.query.san;
    //2:创建sql语句添加
    var sql = "INSERT INTO xcx_product VALUES(null,?,?,?)";
    pool.query(sql,[pname,san,phone],(err,result)=>{
      if(err)throw err;
      if(result.affectedRows>0){
        res.send({code:1,msg:"商品添加成功"});
      }else{
        res.send({code:-1,msg:"商品添加失败"});
      }
    }); //15:36
    //3:判断添加是否成功并且返回值  
});


//功能十九:分页显示小程序消息列表
app.get("/getMessage",(req,res)=>{
    //1:参数       pno 页码;pageSize 页大小
    var pno = req.query.pno;
    var pageSize = req.query.pageSize;
    //1.2:默认值
    if(!pno){
      pno = 1;
    }
    if(!pageSize){
      pageSize = 2;
    }
    //2:验证正则表达式
    var reg = /^[0-9]{1,}$/;
    if(!reg.test(pno)){
       res.send({code:-1,msg:"页码格式不正确"});
       return;
    }
    if(!reg.test(pageSize)){
      res.send({code:-2,msg:"页大小格式不正确"});
      return;
    }
    //3:创建sql
    //  查询总页数
    var sql = "SELECT count(id) as c FROM xz_message";
    var progress = 0; //sql执行进度
    obj = {code:1};
    pool.query(sql,(err,result)=>{
         if(err)throw err;
         //console.log(result[0].c);
         var pageCount = Math.ceil(result[0].c/pageSize);
         obj.pageCount = pageCount;
         progress += 50;
         if(progress == 100){
          res.send(obj);
         }
    });
    //  查询当前页内容
  var sql=" SELECT id,img_url,title,ctime,desc2,content";
      sql +=" FROM xz_message";
      sql +=" LIMIT ?,?"
  var offset = parseInt((pno-1)*pageSize);
  pageSize = parseInt(pageSize);
    pool.query(sql,[offset,pageSize],(err,result)=>{
      if(err)throw err;
      //console.log(result);
      obj.data = result;
      progress+=50;
      if(progress==100){
        res.send(obj);
      }
    }); 
 });

//  
app.get("/getquan",(req,res)=>{
  var quan1 = [
    {id:1,img_url:"http://127.0.0.1:3000/kezhao/1.png",title:"111111"},
    {id:2,img_url:"http://127.0.0.1:3000/kezhao/1.png",title:"222222"},
    {id:3,img_url:"http://127.0.0.1:3000/kezhao/1.png",title:"3333333"}
  ];
  var quan2 = [
    {id:1,img_url:"http://127.0.0.1:3000/kezhao/1.png",title:"4444444"}
  ];
  var quan3 = [
    {id:1,img_url:"http://127.0.0.1:3000/kezhao/1.png",title:"5555555"},
    {id:2,img_url:"http://127.0.0.1:3000/kezhao/1.png",title:"6666666"}
  ];
  var quan4 = [
    {id:1,img_url:"http://127.0.0.1:3000/kezhao/1.png",title:"见覅偶阿"}
  ];
  var id = req.query.id;
  if(id == 1){
    res.send(quan1);
    return;
  };
  if(id == 2){
    res.send(quan2);
    return;
  };
  if(id == 3){
    res.send(quan3);
    return;
  };
  if(id == 4){
    res.send(quan4);
    return;
  };
});

 //功能二十:小程序学子商城上传图片
 app.post("/upload",upload.single("mypic"),(req,res)=>{
  //1:获取上传文件大小超过2m提示错误
  var size = req.file.size/1000/1000;
  if(size > 2){
    res.send({code:-1,msg:"上传图片过大超过2M"});
    return;
  }
  //2:获取上传文件类型不是图片
  var type = req.file.mimetype;
  var i2 = type.indexOf("image");
  if(i2==-1){
    res.send({code:-2,msg:"上传只能是图片"});
    return;
  }
  //3:创建新文件 ./upload/时间戳+随机数+后缀
  var src = req.file.originalname;
  var time = new Date().getTime();
  var r = Math.floor(Math.random()*9999);
  var i3 = src.lastIndexOf(".");
  var suff = src.substring(i3,src.length);
  var des = "./upload/"+time+r+suff;
  //4:将临时文件移动 upload
  fs.renameSync(req.file.path,des);
  //5:上传成功
  res.send({code:1,msg:"上传成功"});
 })