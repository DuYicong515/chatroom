var socketio = {};
var express = require('express');
var router = express.Router();
var socket_io = require('socket.io');
var mysql = require('mysql');


var db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'newpass',
    database: 'msg_info',
});

/*
* handle the post request from frontend
* make a query in database
* if the login information is not correct
* send error status
* */

router.post('/index', function (req,res,next){
  var username=req.body.username;
  var password=req.body.password;
  db.query("SELECT * FROM msg_info.user_info WHERE password= '"+password+"' AND username='"+username+"'",function(err,rows){
        if(err) throw err;
        if (rows.length>0) {res.send('1');}
        else
            {
                res.send(404);
            }

    });

})

/*
* when client wants to register, front end send a post request here
* make a query first to check if the username could be used
* if it could be used, insert the new record into database
* if not send error status
*
* */

router.post('/index_register', function (req,res,next){
    var username=req.body.username;
    var password=req.body.password;
    db.query("SELECT * FROM msg_info.user_info WHERE username='"+username+"'",function(err,rows){
        if(err) throw err;
        if (rows.length==0) {
          res.send('1');
          var insert_usr={username:username,password:password};
          db.query('INSERT INTO user_info SET ?',insert_usr, function(err,res){
                if(err) throw err;
            });
        }
        else
        {
            res.send(500);
        }

    });

})
/*socket io part dealing with chatroom*/

socketio.getSocketio = function(server){
    var io = socket_io.listen(server);
    io.on('connection', function(socket){
        //load history message by making query in database
        //emit a show message request, make front end append message to panal
        socket.on('get history messages',function () {
            db.query('SELECT * FROM msg_info.messages_info', function (err, rows) {
                if (err) throw err;

                for (var i = 0; i < rows.length; i++) {
                    var username = rows[i].username;
                    var time = rows[i].msgtime;
                    var msg = rows[i].msg;
                    socket.emit('show message', msg, username, time);
                }
            })
        })

        // event handler when a user wants to submit message
        // insert into database
        // show in this user's panal and also broadcast to all users
        socket.on('send message',function(msg,usr_name,time) {
            var insert_info={username:usr_name,msg:msg,msgtime:time};

            db.query('INSERT INTO messages_info SET ?',insert_info, function(err,res){
                if(err) throw err;
                //console.log(message);
            });
            socket.broadcast.emit('show message',msg,usr_name,time);
            socket.emit('show message',msg,usr_name,time);

        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });



    });


};


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


/*
* make two exports value
* socketio for www file to start socket
* router for app.js
* */


var data={"socketio":socketio,"router":router}
module.exports = data;

