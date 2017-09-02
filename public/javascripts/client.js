$(function () {
    var socket = io();
    var username;
    var password;

    /*
    * when click on log_in,verify username and password by sending data to backend
    * if succeed, then reload all the history messages
    * else give some hints
    * */
    $("#log_in").click(function () {
        username=$(".EnterUsrName").val();
        password=$("#EnterPsw").val();
        var data = {"username":username,"password":password};
        $.ajax({
            url: '/index',
            type: 'post',
            data: data,
            success: function (data, status) {
                if (status=='success') {
                    $('.LoginPage').hide();
                    $('.MainPage').show();
                    //socket.connect();
                    socket.emit("get history messages",function () {});
                }
            },
            error: function (data, status) {
                if (status=='error') {
                    alert("wrong username or password");
                }
            }
        });
    })
    /*
        * when click on register, send user name and password to backend
        * if succeed, then reload all the history messages
        * else give some hints like duplicate username
        * */
    $("#register").click(function () {
        username=$(".EnterUsrName").val();
        password=$("#EnterPsw").val();
        var data = {"username":username,"password":password};
        $.ajax({
            url: '/index_register',
            type: 'post',
            data: data,
            success: function (data, status) {
                if (status=='success') {
                    alert("Register successfully! Please remember your password to log in next time.");
                    $('.LoginPage').hide();
                    $('.MainPage').show();
                    //socket.connect();
                    socket.emit("get history messages",function () {});
                }
            },
            error: function (data, status) {
                if (status=='error') {
                    alert("User name has been used. Please try another one");
                }
            }
        });

    })
    /*
    * When click on leave, back to the main page
    * Leave all the spaces blank
    * */
    $("#leave").click(function () {
        $('.MainPage').hide();
        $('.LoginPage').show();
        $(".EnterUsrName").val('');
        $("#enterpsw").val('');
        $(".ShowMsg").empty();
        //socket.disconnect();

    })
    /*
    * when click on submit, get the message that submitted
    * sends to the back end using socket
    * it will be recorded in database and show to all users
    * */

    $(".submitMessage").click(function () {
        var time=new Date();
        socket.emit("send message",$('.inputMessage').val(),username,time.toLocaleString());
        // make the input area blank after submit
        $(".inputMessage").val('');

    })

    socket.on('show message',function(msg,username,time){
        var msg_formatting='<span class = MsgContent><br>'+msg+'</span>';
        var usr_formatting='<span class = MsgUsr>'+username+'</span>';
        var time_formatting='<span class = MsgTime>'+time+'</span>';
        $('.ShowMsg').append($('<li>'+usr_formatting+time_formatting+msg_formatting+'</li>'));
        //make sure always show the latest message, scroll the panal down to the end
        $('.ShowMsg').scrollTop($('.ShowMsg')[0].scrollHeight);

    })


});