import Vue from 'vue';
//VUE取地址栏参数
Vue.prototype.GetUrlKey=(name)=>{
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
//获取cookie
function getCookie(name){
  let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
  return unescape(arr[2]);
  else
  return null;
}
Vue.prototype.GetCookie=(name)=>{
  let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
  return unescape(arr[2]);
  else
  return null;
}
//存cookies
Vue.prototype.SetCookie=(name,value)=>{ 
    let Days = 30; 
    let exp = new Date(); 
    exp.setTime(exp.getTime() + Days*24*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 
//删除cookies 
Vue.prototype.DelCookie=(name)=>{ 
    let exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    let cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 
//如果需要设定自定义过期时间 
//那么把上面的setCookie　函数换成下面两个函数就ok; 


//程序代码 
Vue.prototype.setDateCookie=(name,value,time)=>{ 
    let strsec = getsec(time); 
    let exp = new Date(); 
    exp.setTime(exp.getTime() + strsec*1); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 
function getsec(str){ 
   let str1=str.substring(1,str.length)*1; 
   let str2=str.substring(0,1); 
   if (str2=="s")
   { 
        return str1*1000; 
   }
   else if (str2=="h")
   { 
       return str1*60*60*1000; 
   }
   else if (str2=="d")
   { 
       return str1*24*60*60*1000; 
   } 
} 
//s20是代表20秒 
//h是指小时，如12小时则是：h12 
//d是天数，30天则：d30 
// setCookie("name","hayden","s20");
let token=getCookie('token');
export default token