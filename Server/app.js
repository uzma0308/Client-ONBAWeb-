var express = require('express');
var bodyParser=require('body-parser');
var app=express();
var mysql=require('mysql');
var multer  = require('multer');
var fs = require('fs');

app.use(bodyParser.json());     
app.use(bodyParser.urlencoded({    
    extended: false
}));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE", "OPTIONS");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
  });
var connection=mysql.createConnection(
{
	host:'localhost',
	user:'root',
	password:'root',
	database:'sql12225688'

});

connection.connect(function(error)
{
	if(error)
	{
		console.log('Error in connecting to the database');

	}
	else
	{
		console.log('Connected');
	}
});

app.post("/filter",function(req,res) {
	var data=req.body;
	console.log(data);
	var cat_arr=[];
	var promises=[];
	var no_of_category=data.checked_category.length;
	for(var i=0;i<no_of_category;i++)
	{				
	
		promises[i] = new Promise(function(resolve,reject){
			var sql='Select n.*,c.*,r.* from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and n.approve=1 and cm.category_id='+data.checked_category[i]+' INNER JOIN category c on c.category_id=cm.category_id INNER JOIN register r on n.user_id=r.user_id';

			connection.query(sql,function(error,rows,feilds)
			{
				if(error)
				{
					console.log(error);
					reject(error); 
				}
				else
				{
					for(var j=0;j<rows.length;j++)
					{
						
						cat_arr.push(rows[j]);
				
					}

					resolve("success");				}
			});
			
		});

	

	}
	Promise.all(promises).then(function(resolve){
	

	cat_arr.sort(SortArrayById);


	var arr=[];

			var obj={
				category:[],
				data:{
				user_id:'',
				user_name:'',
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''
				}
			}

	for(var i=0;i<cat_arr.length;i++)
			{
				obj={
				category:[],
				data:{
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:'',
				imgUrl:[]

				}
				}
					obj.data.notice_id=cat_arr[i].notice_id;
					console.log(cat_arr[i].notice_id);
					obj.data.user_id=cat_arr[i].user_id;
					obj.data.user_name=cat_arr[i].user_name;
			
					obj.data.title=cat_arr[i].title;


					var d=cat_arr[i].creation_date;

					obj.data.creation_date=d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear();

					obj.data.updation_date=cat_arr[i].updation_date;


					obj.data.full_desc=cat_arr[i].full_desc;

					obj.category.push(cat_arr[i].category_name);

			
					if(i!=cat_arr.length-1)
					{
					while(cat_arr[i].notice_id===cat_arr[i+1].notice_id)
					{
						obj.category.push(cat_arr[i+1].category_name);
						i=i+1;
						if(i==cat_arr.length-1)
						{
							break;
						}
						
					}
				}
	
				arr.push(obj);
			
				}
				var imagePromises =[];

				for(let k = 0;k<arr.length;k++){
					imagePromises[k] = new Promise(function(resolve,reject){
						var sql = "Select url,image_id from image where ref_id="+arr[k].data.notice_id;
						connection.query(sql,function(error,rows,feilds){
							if(error){
								console.log(error);
								reject(error);
							}else{
								console.log("image url",rows)
								for(let m=0;m<rows.length;m++){	
									let obj = {
										image_id:rows[m].image_id,
										url:rows[m].url
									}								
									arr[k].data.imgUrl.push(obj);
								}
								resolve('success');
							}
						})
					})
					
				}

				Promise.all(imagePromises).then((result)=>{console.log(result);res.send(arr)}).catch((error)=>{console.log("Image appending",error);res.send(error)});

	}).catch(function(error){
	console.log("error",error)}
	);
	
	});

function SortArrayById(a, b){

	if (a.notice_id < b.notice_id)
    return -1;
  if (a.notice_id > b.notice_id)
    return 1;
  return 0;
}


app.get("/getNotices",function(req,res) {
	
	connection.query("Select n.*,c.*,r.* from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and n.approve=1  INNER JOIN category c on c.category_id=cm.category_id INNER JOIN register r on n.user_id=r.user_id",function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in feching data from db");
		}
		else
		{

			var arr=[];
			var sorted_arr=[];
			var obj={
				category:[],
				data:{
				user_id:'',
				user_name:'',
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''
				}
			}
			console.log("All approved notices are fetched successfully"+rows.length);
			console.log(rows);

			for(var j=0;j<rows.length;j++)
			{
					sorted_arr.push(rows[j]);
				
			}
			sorted_arr.sort(SortArrayById);

			for(var i=0;i<rows.length;i++)
			{
				obj={
				category:[],
				data:{
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:'',
				imgUrl:[]

				}
				}
					obj.data.notice_id=sorted_arr[i].notice_id;
					obj.data.user_id=sorted_arr[i].user_id;
					obj.data.user_name=sorted_arr[i].user_name;
			
					obj.data.title=sorted_arr[i].title;


					var d=sorted_arr[i].creation_date;

					obj.data.creation_date=new Date(d).getDate()+'-'+(new Date(d).getMonth()+1)+'-'+new Date(d).getFullYear();

					obj.data.updation_date=sorted_arr[i].updation_date;


					obj.data.full_desc=sorted_arr[i].full_desc;

					obj.category.push(sorted_arr[i].category_name);

			
					if(i!=sorted_arr.length-1)
					{
					while(sorted_arr[i].notice_id===sorted_arr[i+1].notice_id)
					{
						obj.category.push(sorted_arr[i+1].category_name);
						i=i+1;
						if(i==sorted_arr.length-1)
						{
							break;
						}
						
					}
				}
	
				arr.push(obj);
			
				}
				var imagePromises =[];

				for(let k = 0;k<arr.length;k++){
					imagePromises[k] = new Promise(function(resolve,reject){
						var sql = "Select url,image_id from image where ref_id="+arr[k].data.notice_id;
						connection.query(sql,function(error,rows,feilds){
							if(error){
								console.log(error);
								reject(error);
							}else{
								console.log("image url",rows)
								for(let m=0;m<rows.length;m++){	
									let obj = {
										image_id:rows[m].image_id,
										url:rows[m].url
									}								
									arr[k].data.imgUrl.push(obj);
								}
								resolve('success');
							}
						})
					})
					
				}

				Promise.all(imagePromises).then((result)=>{console.log(result);res.send(arr)}).catch((error)=>{console.log("Image appending",error);res.send(error)});

		}

	});
});


app.get("/get_All_Notices",function(req,res) {
	
	connection.query("Select n.*,c.*,r.* from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and (n.approve=1 or n.approve=0)  INNER JOIN category c on c.category_id=cm.category_id INNER JOIN register r on n.user_id=r.user_id",function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in feching data from db");
		}
		else
		{

			var arr=[];
			var sorted_arr=[];
			var obj={
				category:[],
				data:{
				user_id:'',
				user_name:'',
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:'',
				approve:''
				}
			}
			console.log("All approved notices are fetched successfully"+rows.length);
			console.log(rows);

			for(var j=0;j<rows.length;j++)
			{
					sorted_arr.push(rows[j]);
				
			}
			sorted_arr.sort(SortArrayById);

			for(var i=0;i<rows.length;i++)
			{
				obj={
				category:[],
				data:{
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:'',
				approve:''

				}
				}
					obj.data.notice_id=sorted_arr[i].notice_id;
					obj.data.user_id=sorted_arr[i].user_id;
					obj.data.user_name=sorted_arr[i].user_name;
			
					obj.data.title=sorted_arr[i].title;

					obj.data.approve=sorted_arr[i].approve;


					var d=sorted_arr[i].creation_date;

					obj.data.creation_date=d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear();

					obj.data.updation_date=sorted_arr[i].updation_date;


					obj.data.full_desc=sorted_arr[i].full_desc;

					obj.category.push(sorted_arr[i].category_name);

			
					if(i!=sorted_arr.length-1)
					{
					while(sorted_arr[i].notice_id===sorted_arr[i+1].notice_id)
					{
						obj.category.push(sorted_arr[i+1].category_name);
						i=i+1;
						if(i==sorted_arr.length-1)
						{
							break;
						}
						
					}
				}
	
				arr.push(obj);
			
				}

			res.send(arr);
		}

	});
});

app.get("/get_All_Users",function(req,res) {
	
	connection.query("Select user_id,user_name,category from register",function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in feching data from db");
		}
		else
		{

			res.send(rows);
		}

	});
});



app.post("/insert",function(req,res) {

	var data=req.body;


	var sql = "INSERT INTO notice(user_id,title,full_desc,creation_date,updation_date,approve) VALUES("+data.user_id+",'"+data.title+"','"+data.full_desc+"',CURRENT_TIMESTAMP(),CURRENT_TIMESTAMP(),0)";
	
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
		}
		else
		{
			console.log("Inserted Successfully");

			var sqll = "SELECT notice_id FROM notice ORDER BY notice_id DESC LIMIT 1";

			connection.query(sqll,function(error,row,feilds)
			{
				if(error)
				{
					console.log(error);
				}
				else
				{
					var no_of_category=data.category.length;
					for(var i=0;i<no_of_category;i++)
					{
					var sql2 = "INSERT INTO category_notice_mapping(notice_id,category_id) VALUES("+row[0].notice_id+","+data.category[i]+")";
					connection.query(sql2,function(error,row,feilds)
					{
						if(error)
						{
							console.log(error);
						}
					})

					}
					res.send("Inserted Successfully");

				}
			})

			
		}

	});
});

app.post("/update_notice",function(req,res) {

	var data=req.body;
	console.log(data);

	var sql = "UPDATE notice SET approve=0,full_desc='"+data.full_desc+"',title='"+data.title+"', updation_date=CURRENT_TIMESTAMP() WHERE notice_id ="+data.notice_id;
	
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{

			console.log(error);
		}
		else
		{
			console.log("Updated Successfully");
			res.send(rows);
		}

	});
});

//params will be notice id and category array
app.post("/update_category",function(req,res) {

	var data=req.body;

	var sql = "DELETE FROM category_notice_mapping WHERE notice_id ="+data.notice_id;

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
			var no_of_category=data.category.length;
				for(var i=0;i<no_of_category;i++)
				 {
					var sql2 = "INSERT INTO category_notice_mapping(notice_id,category_id) VALUES("+data.notice_id+","+data.category[i]+")";
					connection.query(sql2,function(error,row,feilds)
					{
						if(error)
						{
							console.log(error);
						}
					})

					}
		}

		res.send("category updated successfully");

	});
});


//login(params are email and password)
app.post("/login",function(req,res) {

	
	var sql = "Select * from register where email='"+req.body.email+"' and password='"+req.body.password+"'";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in register table db");
		}
		else
		{
			if(rows.length==0)
			{
				res.send("500");
			}
			else
			{
			console.log("login Successfully");
			res.send(rows);
		}
		}

	});
});


//register(params are each feild in reg form)
app.post("/register",function(req,res) {
	
	var data=req.body;

	var sql = "Select * from register where email='"+data.email+"'";
	
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log("Error in login");
			throw error;
		}
		else
		{
			if(rows.length>0)
			{
				res.send("Email id already occupied");
			}

			var sql = "INSERT INTO register(user_name,password,category,unique_no,college,img_id,email) VALUES ('"+data.user_name+"','"+data.password+"','"+data.category+"',"+data.unique_id+",'"+data.clg_name+"',0,'"+data.email+"')";
			  connection.query(sql, function (err, result) {
			    if (err) 
			    	{
			    		console.log("Error in register");
			    		throw err;
			    	}
			    	res.send("Registered Successfully");
			        console.log("1 record inserted");
			  });

		}

	});
});


//get particular user notice(param is only id(ie user id))
app.post("/user_notices",function(req,res) {

	console.log(req.body.id);

	var sql = "Select n.*,c.*,r.user_name from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and n.approve=1 and user_id="+req.body.id+" INNER JOIN category c on c.category_id=cm.category_id INNER JOIN register r on n.user_id=r.user_id";
	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		
		else
		{

			var arr=[];
			var sorted_arr=[];
			var obj={
				category:[],
				data:{
				user_id:'',
				user_name:'',
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''
				}
			}
			console.log("All approved notices are fetched successfully"+rows.length);
			console.log(rows);

			for(var j=0;j<rows.length;j++)
			{
					sorted_arr.push(rows[j]);
				
			}
			sorted_arr.sort(SortArrayById);

			for(var i=0;i<rows.length;i++)
			{
				obj={
				category:[],
				data:{
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:'',
				imgUrl:[]

				}
				}
					obj.data.notice_id=sorted_arr[i].notice_id;
					obj.data.user_id=sorted_arr[i].user_id;
					obj.data.user_name=sorted_arr[i].user_name;
			
					obj.data.title=sorted_arr[i].title;


					var d=sorted_arr[i].creation_date;

					obj.data.creation_date=d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear();

					obj.data.updation_date=sorted_arr[i].updation_date;


					obj.data.full_desc=sorted_arr[i].full_desc;

					obj.category.push(sorted_arr[i].category_name);

			
					if(i!=sorted_arr.length-1)
					{
					while(sorted_arr[i].notice_id===sorted_arr[i+1].notice_id)
					{
						obj.category.push(sorted_arr[i+1].category_name);
						i=i+1;
						if(i==sorted_arr.length-1)
						{
							break;
						}
						
					}
				}
				

				arr.push(obj);
			
				}

				var imagePromises =[];

				for(let k = 0;k<arr.length;k++){
					imagePromises[k] = new Promise(function(resolve,reject){
						var sql = "Select url,image_id from image where ref_id="+arr[k].data.notice_id;
						connection.query(sql,function(error,rows,feilds){
							if(error){
								console.log(error);
								reject(error);
							}else{
								console.log("image url",rows)
								for(let m=0;m<rows.length;m++){	
									let obj = {
										image_id:rows[m].image_id,
										url:rows[m].url
									}								
									arr[k].data.imgUrl.push(obj);
								}
								resolve('success');
							}
						})
					})
					
				}

				Promise.all(imagePromises).then((result)=>{console.log(result);res.send(arr)}).catch((error)=>{console.log("Image appending",error);res.send(error)});

			
		}

	});
});

//get notice not approved
app.get("/user_unapprovednotices",function(req,res) {

	
	var sql = "Select n.*,c.*,r.* from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and n.approve=0  INNER JOIN category c on c.category_id=cm.category_id INNER JOIN register r on n.user_id=r.user_id";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
			if(rows.length==0)
			{
				res.send(rows);
			}
			else
				{

			var arr=[];
			var sorted_arr=[];
			var obj={
				category:[],
				data:{
				user_id:'',
				user_name:'',
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''
				}
			}
			console.log("All approved notices are fetched successfully"+rows.length);
			console.log(rows);

			for(var j=0;j<rows.length;j++)
			{
					sorted_arr.push(rows[j]);
				
			}
			sorted_arr.sort(SortArrayById);

			for(var i=0;i<rows.length;i++)
			{
				obj={
					category:[],
					data:{
					notice_id:'',
					title:'',
					creation_date:'',
					updation_date:'',
					full_desc:''

					}
				}
					obj.data.notice_id=sorted_arr[i].notice_id;
					obj.data.user_id=sorted_arr[i].user_id;
					obj.data.user_name=sorted_arr[i].user_name;
			
					obj.data.title=sorted_arr[i].title;


					/*var d=sorted_arr[i].creation_date;

					var mon=d.getMonth()+1;

					obj.data.creation_date=d.getDate()+'-'+mon+'-'+d.getFullYear();

				    var u=sorted_arr[i].updation_date;
				    console.log(u);
				    mon=u.getMonth()+1;
					obj.data.updation_date=u.getDate()+'-'+mon+'-'+u.getFullYear();*/


					obj.data.creation_date=sorted_arr[i].creation_date.getTime();
					obj.data.updation_date=sorted_arr[i].updation_date.getTime();

					obj.data.full_desc=sorted_arr[i].full_desc;

					obj.category.push(sorted_arr[i].category_name);

			
					if(i!=sorted_arr.length-1)
					{
					while(sorted_arr[i].notice_id===sorted_arr[i+1].notice_id)
					{
						obj.category.push(sorted_arr[i+1].category_name);
						i=i+1;
						if(i==sorted_arr.length-1)
						{
							break;
						}
						
					}
				}
	
				arr.push(obj);
			
			}

			
			res.send(arr);
		}
		}

	});
});



//get notice not approved
app.post("/f_unapproveNotices",function(req,res) {
console.log(req.body.id);
	
	var sql = "Select n.*,c.*,r.* from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and n.approve=0 and n.user_id="+req.body.id+" INNER JOIN category c on c.category_id=cm.category_id INNER JOIN register r on n.user_id=r.user_id";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
			if(rows.length==0)
			{
				res.send(rows);
			}
			else
				{

			var arr=[];
			var sorted_arr=[];
			var obj={
				category:[],
				data:{
				user_id:'',
				user_name:'',
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''
				}
			}
			console.log("All approved notices are fetched successfully"+rows.length);
			console.log(rows);

			for(var j=0;j<rows.length;j++)
			{
					sorted_arr.push(rows[j]);
				
			}
			sorted_arr.sort(SortArrayById);

			for(var i=0;i<rows.length;i++)
			{
				obj={
				category:[],
				data:{
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''

				}
				}
					obj.data.notice_id=sorted_arr[i].notice_id;
					obj.data.user_id=sorted_arr[i].user_id;
					obj.data.user_name=sorted_arr[i].user_name;
			
					obj.data.title=sorted_arr[i].title;


					obj.data.creation_date=sorted_arr[i].creation_date.getTime();
					obj.data.updation_date=sorted_arr[i].updation_date.getTime();

					obj.data.full_desc=sorted_arr[i].full_desc;

					obj.category.push(sorted_arr[i].category_name);

			
					if(i!=sorted_arr.length-1)
					{
					while(sorted_arr[i].notice_id===sorted_arr[i+1].notice_id)
					{
						obj.category.push(sorted_arr[i+1].category_name);
						i=i+1;
						if(i==sorted_arr.length-1)
						{
							break;
						}
						
					}
				}
	
				arr.push(obj);
			
				}

			res.send(arr);
		}
		}

	});
});


//get notice rejected
app.post("/f_rejectedNotices",function(req,res) {
console.log(req.body.id);
	
	var sql = "Select n.*,c.*,r.* from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and n.approve=2 and n.user_id="+req.body.id+" INNER JOIN category c on c.category_id=cm.category_id INNER JOIN register r on n.user_id=r.user_id";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
			if(rows.length==0)
			{
				res.send(rows);
			}
			else
				{

			var arr=[];
			var sorted_arr=[];
			var obj={
				category:[],
				data:{
				user_id:'',
				user_name:'',
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''
				}
			}
			console.log("All approved notices are fetched successfully"+rows.length);
			console.log(rows);

			for(var j=0;j<rows.length;j++)
			{
					sorted_arr.push(rows[j]);
				
			}
			sorted_arr.sort(SortArrayById);

			for(var i=0;i<rows.length;i++)
			{
				obj={
				category:[],
				data:{
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''

				}
				}
					obj.data.notice_id=sorted_arr[i].notice_id;
					obj.data.user_id=sorted_arr[i].user_id;
					obj.data.user_name=sorted_arr[i].user_name;
			
					obj.data.title=sorted_arr[i].title;


					obj.data.creation_date=sorted_arr[i].creation_date.getTime();
					obj.data.updation_date=sorted_arr[i].updation_date.getTime();

					obj.data.full_desc=sorted_arr[i].full_desc;

					obj.category.push(sorted_arr[i].category_name);

			
					if(i!=sorted_arr.length-1)
					{
					while(sorted_arr[i].notice_id===sorted_arr[i+1].notice_id)
					{
						obj.category.push(sorted_arr[i+1].category_name);
						i=i+1;
						if(i==sorted_arr.length-1)
						{
							break;
						}
						
					}
				}
	
				arr.push(obj);
			
				}

			res.send(arr);
		}
		}

	});
});

//get notice that are rejected
app.get("/rejected_notices",function(req,res) {

	
	var sql = "Select n.*,c.*,r.* from notice n INNER JOIN category_notice_mapping cm on cm.notice_id=n.notice_id and n.approve=2  INNER JOIN category c on c.category_id=cm.category_id INNER JOIN register r on n.user_id=r.user_id";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
			if(rows.length==0)
			{
				res.send(rows);
			}
			else
				{

			var arr=[];
			var sorted_arr=[];
			var obj={
				category:[],
				data:{
				user_id:'',
				user_name:'',
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''
				}
			}
			console.log("All approved notices are fetched successfully"+rows.length);
			console.log(rows);

			for(var j=0;j<rows.length;j++)
			{
					sorted_arr.push(rows[j]);
				
			}
			sorted_arr.sort(SortArrayById);

			for(var i=0;i<rows.length;i++)
			{
				obj={
				category:[],
				data:{
				notice_id:'',
				title:'',
				creation_date:'',
				updation_date:'',
				full_desc:''

				}
				}
					obj.data.notice_id=sorted_arr[i].notice_id;
					obj.data.user_id=sorted_arr[i].user_id;
					obj.data.user_name=sorted_arr[i].user_name;
			
					obj.data.title=sorted_arr[i].title;


					var d=sorted_arr[i].creation_date;

					obj.data.creation_date=d.getDate()+'-'+d.getMonth()+'-'+d.getFullYear();

					obj.data.updation_date=sorted_arr[i].updation_date;


					obj.data.full_desc=sorted_arr[i].full_desc;

					obj.category.push(sorted_arr[i].category_name);

			
					if(i!=sorted_arr.length-1)
					{
					while(sorted_arr[i].notice_id===sorted_arr[i+1].notice_id)
					{
						obj.category.push(sorted_arr[i+1].category_name);
						i=i+1;
						if(i==sorted_arr.length-1)
						{
							break;
						}
						
					}
				}
	
				arr.push(obj);
			
				}

			res.send(arr);
		}
		}

	});
});

//update unapproved notice to approve(para wil b notice id)
app.post("/approve_notice",function(req,res) {

	var comment="Notice successfully approved by Admin";	
	var sql = "UPDATE notice SET approve = 1,comment='"+comment+"' WHERE notice_id = '"+req.body.notice_id+"'";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
		
			console.log(rows.affectedRows+" record updated");
			res.send(rows.affectedRows+" record updated");
		}

	});
});

//update unapproved notice to approve(para wil b notice id)
app.post("/reject_notice",function(req,res) {

	var sql = "UPDATE notice SET approve = 2,comment='"+req.body.comment+"' WHERE notice_id = '"+req.body.notice_id+"'";

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
			console.log("sfhd");
			console.log(rows.affectedRows+" record updated");
			res.send(rows.affectedRows+" record updated");
		}

	});
});

//delete notice(para wil b notice id)
app.post("/delete",function(req,res) {

	
	var sql = "DELETE FROM notice WHERE notice_id ="+req.body.notice_id;

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
		}
		else
		{
		
			console.log(rows);

			var sql1 = "DELETE FROM category_notice_mapping WHERE notice_id ="+req.body.notice_id;

			connection.query(sql1,function(error,row,feilds)
			{
				if(error)
				{
					console.log(error);
					res.send("Error in notice table db");
				}
				else
				{
					console.log(row.affectedRows+" record deleted");
				}
			});
			res.send(rows.affectedRows+" record deleted");
		}

	});
});


//userdetails (para wil b userid)
app.post("/user_details",function(req,res) {

	var data=req.body;

	var sql = "Select * from register where user_id="+data.user_id;

	connection.query(sql,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in register table db");
		}
		else
		{
			res.send(rows);
		}

	});



	});

//details for admin
app.get("/all_admin_details",function(req,res) {

	var promises;
	var obj=
	{
		users:"",
		approve:"",
		unapprove:"",
		all_notice:""

	}

	promises = new Promise(function(resolve,reject){

	var sql1 = "Select * from register";

	connection.query(sql1,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in register table db");
			reject(error); 
		}
		else
		{
			console.log(rows.length);
			obj.users=rows.length;
		
			
		}

	});

	var sql2 = "Select * from notice where approve=1";

	connection.query(sql2,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
			//reject(error); 
		}
		else
		{
			console.log(rows.length);
			obj.approve=rows.length;
		}

	});
	var sql3 = "Select * from notice where approve=0";

	connection.query(sql3,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			//reject(error); 
			res.send("Error in notice table db");
		}
		else
		{
			console.log(rows.length);
			obj.unapprove=rows.length;
		}

	});
	var sql4 = "Select * from notice";

	connection.query(sql4,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in register table db");
		
		}
		else

		{
			console.log(rows.length);
			obj.all_notice=rows.length;
			resolve("success");	
		}

	});

	
	});

	promises.then(function(resolve){
	
	res.send(obj);
}).catch(function(error){
	console.log("error",error)}
	);
});
	

//all particular user detail(params id)
app.post("/particular_user_details",function(req,res) {

	var data=req.body;

	var promises;
	var obj=
	{
		rejected:"",
		approve:"",
		unapprove:"",
		all_notice:""

	}

	promises = new Promise(function(resolve,reject){

	var sql1 = "Select * from notice where approve=2 and user_id="+data.id;

	connection.query(sql1,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
			reject(error); 
		}
		else
		{
			console.log(rows.length);
			obj.rejected=rows.length;
		
			
		}

	});

	var sql2 = "Select * from notice where approve=1 and user_id="+data.id;

	connection.query(sql2,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in notice table db");
			//reject(error); 
		}
		else
		{
			console.log(rows.length);
			obj.approve=rows.length;
		}

	});
	var sql3 = "Select * from notice where approve=0 and user_id="+data.id;

	connection.query(sql3,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			//reject(error); 
			res.send("Error in notice table db");
		}
		else
		{
			console.log(rows.length);
			obj.unapprove=rows.length;
		}

	});
	var sql4 = "Select * from notice where user_id="+data.id;

	connection.query(sql4,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			res.send("Error in register table db");
		
		}
		else

		{
			console.log(rows.length);
			obj.all_notice=rows.length;
			resolve("success");	
		}

	});

	
	});

	promises.then(function(resolve){
	
	res.send(obj);
}).catch(function(error){
	console.log("error",error)}
	);
});

//uploading notice images.... 
console.log(__dirname+'/uploads');
app.use(express.static(__dirname + '/uploads'));
var fileName;
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, './uploads')
	},
	filename: function (req, file, cb) {
	  cb(null, fileName = req.body.notice_id+"_"+req.body.image_type + '-' + Date.now()+".jpeg")
	}
  });
  var upload = multer({ storage: storage });
app.post('/upload/noticeImg', upload.single('noticeImg'), function (req, res, next) {
	// req.file is the `avatar` file
	// req.body will hold the text fields, if there were any;
	console.log("upload image",req.body.notice_id,req.file);
	//var fileName = req.body.notice_id+"_"+req.body.image_type + '-' + Date.now()+".jpeg";
	var filePath = 'http://localhost:8085/';

	var sql3 = "INSERT INTO image(url,ref_id,image_type) VALUES('"+filePath+fileName+"',"+parseInt(req.body.notice_id)+",'"+req.body.image_type+"')";
	connection.query(sql3,function(error,rows,feilds)
	{
		if(error)
		{
			console.log(error);
			//reject(error); 
			res.send("Error in Inserting data");
		}
		else
		{
			
			res.send("Successfully uploaded");
		}

	});
});

app.post('/deleteImage',function(req,res){
	console.log("Delete request",req.body.id);
	var sql = "select url from image where image_id="+req.body.id;
	connection.query(sql,function(error,rows,fields){
		if(error){
			console.log("error");
			res.send(error);
		}else{
			let path = rows[0].url;
			let filename = path.substr(path.lastIndexOf('/'),path.length-path.lastIndexOf('/')) ;
			console.log(filename,"filenames")
			fs.unlinkSync('./uploads'+filename);
			connection.query("delete from image where image_id="+req.body.id,function(e,r,f){
				if(e){
					console.log(e);
					res.send(e);
				}else{
					res.send("successfully deleted");
				}
			})
		}
	});
	
});

app.listen(8085,function()
{
	console.log('server started');
});
