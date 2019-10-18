import Vue from 'vue';
let v = new Vue();
let host=window.location.hostname,httpH;
if(host=="192.168.112.210"){//测试
  httpH = '192.168.112.210:8092';//导出
}else if(host=="192.168.112.168"){//正式内网
  httpH='192.168.112.168:8092';//导出
}else if(host=="58.30.9.142"){//正式外网
  httpH='192.168.112.168:8087';//导出
}else{
  httpH= '192.168.112.210:8092';//导出
}
//下载
Vue.prototype.$Http=(docId)=>{
  let url='http://'+httpH+'/doc/exportDoc?docId='+docId;
    window.location.href=url;
}
//websocket
Vue.prototype.$Socket=()=>{
	if ('WebSocket' in window) {
		let id=Base64.decode(Vue.prototype.GetCookie('id'));
		/*let url = 'ws://192.168.112.86:8096/webSocket'; // 正式
		let devUrl = 'ws://192.168.112.210:8096/webSocket'; // bate
		let localUrl = 'ws://10.1.54.57:8096/webSocket'; // 本地*/
		/*let webUrl='ws://192.168.112.86:8096/webSocket';*/
		let webUrl='ws://192.168.112.168:8087/webSocket/'+id;
		// let webUrl='ws://192.168.112.210:8087/webSocket/'+id;
		let socket = new WebSocket(webUrl);
		socket.onopen = (event) => {
		  // onOpen
		};
		socket.onmessage = (event) => {
		  // onMessage
		  v.$message({
			  message: event.data,
			  type: 'success'
			});
		};
		socket.onclose = (event) => {
		  // onClose
		};
		socket.onerror = (event) => {
		  // content error
		};
		socket.onbeforeunload = (event) => {
		  // window close
		  socket.onclose();
		};
	} else {
		this.$message({
		  message: '您的浏览器不支持WebSocket',
		  type: 'error'
		});
	}
}
Vue.prototype.$Socket();
export default host