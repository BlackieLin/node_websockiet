function MyWebsocket(wsUri, autoConn) {
	this.wsUri = wsUri;
	var websocket;
	if (window.WebSocket == undefined)
		this.noWebSocket();
	else {
		if (autoConn)
			this.doConn();
	}
	return this;
}
//格式化数字函数
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//格式化时间
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [hour, minute].map(formatNumber).join(':')
}
function formatDate(str,f){
	if(f==""){
		f="Y-m-d H:i:s";
	}
    if (str==""){
      var date = new Date();
    }else{
      var date = new Date(parseInt(str) * 1000);
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hour = date.getHours()<10?"0"+date.getHours():date.getHours();
    var minute = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
    var second = date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
    return f.replace(/Y/,year).replace(/m/,month).replace(/d/,day).replace(/H/,hour).replace(/i/,minute).replace(/s/,second);
}
//不支持websocket
MyWebsocket.prototype.noWebSocket = function () {
	this.alertMsg("danger", "你使用的浏览器不支持websocket");
};
//建立连接
MyWebsocket.prototype.doConn = function () {
	var mys = this;
	this.websocket = new WebSocket(this.wsUri);
	if (this.websocket.readyState == this.websocket.CONNECTING)
		//this.alertMsg("info", "正在尝试与websocket服务器[ " + mys.wsUri + " ]进行连接");
	this.websocket.addEventListener("open", function (evt) {
		//mys.alertMsg("success", "连接websocket服务器[ " + mys.wsUri + " ]成功");
	});
	this.websocket.addEventListener("close", function (evt) {
		//mys.alertMsg("info", "已与websocket服务器[ " + mys.wsUri + " ]断开");
	});
	this.websocket.addEventListener("message", function (evt) {
		//mys.alertMsg("success", "收到来自websocket服务器[ " + mys.wsUri + " ]的消息");
		mys.appendMsg(false, evt);
	});
	this.websocket.addEventListener("error", function (evt) {
		//mys.alertMsg("danger", "与websocket服务器[ " + mys.wsUri + " ]的连接发生错误:" + evt.data);
	});
};
//接收服务器消息显示到页面上
MyWebsocket.prototype.appendMsg = function (isMyMsg, evt) {
	var data=JSON.parse(evt.data);
	if(data.type=="msg"){
		var msg = data.msg;
		var mys = this, msgObj = $(msg),to_uname = data.to_user,from_name=data.from_user;
		if (!isMyMsg){
			var msg = msg;
			var htmlData =   '<div class="msg_item fn-clear">'
						   + '   <div class="uface"><img src="static/images/0.jpg" width="40" height="40"  alt=""/></div>'
						   + '   <div class="item_right">'
						   + '     <div class="msg">' + '对 ' + to_uname + ' 说： ' + msg + '</div>'
						   + '     <div class="name_time">' + from_name + ' · '+data.time+'</div>'
						   + '   </div>'
						   + '</div>';
			$("#message_box").append(htmlData);
			$('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
		}
	}else if(data.type=="sys"){
		var msg = data.msg;
		console.log(msg);
		if(msg.length>0){
			var htmlData =   '<li class="fn-clear selected"><em>所有用户</em></li>';
			for(var i=0;i<msg.length;i++){
				htmlData += '<li class="fn-clear" data-id="'+(i+1)+'">'
								+'<span><img src="static/images/'+Math.ceil(Math.random()*3)+'.jpg" width="30" height="30"  alt=""/></span>'
								+'<em>'+msg[i].name+'</em><small class="online" title="在线"></small>'
								+'</li>'//offline，不在线
			}
		}else{
			var htmlData =   '<li class="fn-clear selected"><em>暂无用户</em></li>';
		}
		$("#user_list").html(htmlData);
	}
};
//发送消息操作
MyWebsocket.prototype.sendMessage = function(event, from_name, to_uid, to_uname){
	var mys = this;
	var time = formatTime(new Date());
	var msg = $("#message").val();
	var htmlData =   '<div class="msg_item fn-clear">'
				   + '   <div class="uface uface_own"><img src="static/images/0.jpg" width="40" height="40"  alt=""/></div>'
				   + '   <div class="item_right item_own">'
				   + '     <div class="msg own msg_own">' + '您对 ' + to_uname + ' 说： ' + msg + '</div>'
				   + '     <div class="name_time">' + from_name + ' · '+time+'</div>'
				   + '   </div>'
				   + '</div>';
	var data={
		type:'msg',
		from_user:from_name,
		to_user:to_uname,
		time:time,
		msg:msg
	};
	mys.websocket.send(JSON.stringify(data));//发送到服务器
	$("#message_box").append(htmlData);
	$('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
	$("#message").val('');
}
//公共方法
MyWebsocket.prototype.alertMsg = function (type,msg) {
	alert(msg);
};