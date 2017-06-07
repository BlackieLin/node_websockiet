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
		mys.appendMsg(false, evt.data);
	});
	this.websocket.addEventListener("error", function (evt) {
		//mys.alertMsg("danger", "与websocket服务器[ " + mys.wsUri + " ]的连接发生错误:" + evt.data);
	});
};
//接收服务器消息显示到页面上
MyWebsocket.prototype.appendMsg = function (isMyMsg, msg) {
	var mys = this, msgObj = $(msg),to_uname = '',from_name='';
	if (!isMyMsg){
		var msg = msg;
		if(to_uname != ''){
			msg = '您对 ' + to_uname + ' 说： ' + msg;
		}
		var htmlData =   '<div class="msg_item fn-clear">'
					   + '   <div class="uface"><img src="static/images/hetu.jpg" width="40" height="40"  alt=""/></div>'
					   + '   <div class="item_right">'
					   + '     <div class="msg">' + msg + '</div>'
					   + '     <div class="name_time">' + from_name + ' · 30秒前</div>'
					   + '   </div>'
					   + '</div>';
		$("#message_box").append(htmlData);
		$('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
	}
};
//发送消息操作
MyWebsocket.prototype.sendMessage = function(event, from_name, to_uid, to_uname){
	var mys = this;
	var msg = $("#message").val();
	if(to_uname != ''){
		msg = '您对 ' + to_uname + ' 说： ' + msg;
	}
	var htmlData =   '<div class="msg_item fn-clear">'
				   + '   <div class="uface uface_own"><img src="static/images/hetu.jpg" width="40" height="40"  alt=""/></div>'
				   + '   <div class="item_right item_own">'
				   + '     <div class="msg own msg_own">' + msg + '</div>'
				   + '     <div class="name_time">' + from_name + ' · 30秒前</div>'
				   + '   </div>'
				   + '</div>';
	mys.websocket.send(msg);//发送到服务器
	$("#message_box").append(htmlData);
	$('#message_box').scrollTop($("#message_box")[0].scrollHeight + 20);
	$("#message").val('');
}
//公共方法
MyWebsocket.prototype.alertMsg = function (type,msg) {
	alert(msg);
};