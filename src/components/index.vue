<template>
  <div class="index" @click='home()'>
    <header>
      <div class="header-left">
        <div><img src="../assets/img/logo.png" alt=""></div>
        <span style="margin: 0 10px;font-size: 24px;color: #5485ed"></span>
        <span>你的文档管理空间</span>
      </div>
      <div class="header-center">
        <router-link to='/myfile'>
          <div :class="active==1?'header-active':''">我的文档</div>
        </router-link>
        <router-link to='/vvcircle'>
          <div :class="active==2?'header-active':''">VV圈</div>
        </router-link>
        <router-link to='/myteam'>
          <div :class="active==3?'header-active':''">我的团队</div>
        </router-link>
        <router-link to='/classif' v-show="userName=='admin'">
          <div :class="active==4?'header-active':''">文章分类</div>
        </router-link>
      </div>
      <div class="header-right">
        <ul v-show='isSet'>
          <li class="zc-active" @click='select("/diary")'>日志</li>
        </ul>
        <!-- <span class="iconfont icon-ziyuan" @click.stop='setting'  v-show="userName=='admin'"></span> -->
        <img :src='pic' alt="" class="headerR-pic">
        <!-- <span style="padding:0 5px;">{{userName}}</span>
        <span>{{userNumber}}</span> -->
      </div>
    </header>
    <div class="content">
      <router-view class='routerV'></router-view>
    </div>
  </div>
</template>

<script>
export default {
  created(){
    // sessionStorage.setItem("userId","1");    
    this.currentData();
  },
  data () {
    return {
      isSet:false,
      userName:'',
      active:1,
      userNumber:'',
      pic:''
    }
  },
  methods:{
    tab(idx){
      // @click='tab(1)'
      this.active=idx;
    }
  },
  methods:{
    home(){
      this.isSet=false;
    },
    currentData(){
      this.$UPOST('/api/umc/user/findUserByUserId',{
            userId:Base64.decode(this.GetCookie('id')),
            menuId:this.GetUrlKey('menuId')
          },(res)=>{
            this.userName=res.data.userName;
            this.userNumber=res.data.userNumber;
            this.pic=res.data.pictureBase64;
        })
    },
    select(path){
      this.isSet=false;
      this.$router.push({path});
    },
    setting(){
      this.isSet=!this.isSet;
    }
  }
}
</script>
<style>
  .header-center a{
    color: #000!important;
  }
  .header-center .router-link-active{
    color: #409eff !important;
    border-bottom: solid 4px #409eff;
  }
</style>
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
header{
  position: relative;
  line-height: 70px;
  height: 70px;
  display: flex;
  min-width: 1200px;
  border-bottom: solid 1px #ccc;
  background: #fff;
}
.header-left{
  display: flex;
  position: absolute;
  left: 10px;
}
.header-left img{
  width: 100%;
}
.header-left div{
  width: 50px;
  height: 70px;
  display: flex;
  align-items: center;
}
.header-left span:last-child{
  font-size: 12px;
  margin-top: 3px;
}
.header-center{
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  padding-left: -10px;
}
.header-center div{
  line-height: 69px;
  height: 69px;
  width: 100px;
  text-align: center;
  font-size: 16px;
}
.header-right{
  width: 300px;
  position: absolute;
  right: 10px;
}
.icon-ziyuan{
  position: absolute;
    right: 60px;
    cursor: pointer;
    font-size: 20px;
}
.header-right ul{
  background: #fff;
  position: absolute;
  top: 70px;
  right: 12px;
  width: 100px;
  line-height: 0px;
  border: solid 1px #ccc;
  border-top: none;
}
.header-right ul li{
  line-height: 30px;
  width: 100%;
  border-bottom: solid 1px #eee;
  margin-left: 0;
  text-align: center;
}
.header-right ul li:last-child{
  border-bottom: none;
}
.header-active{
  /*border-bottom: solid 4px #409eff;*/
}
.content{
  width: 1200px;
  min-width: 1200px;
  height: 100%;
  margin: auto;
  background: #fff;
}
.index{
  height: 100%;
  /*background: linear-gradient(#b2b1c8,#3e89b5);*/
}
.headerR-pic{
  position: absolute;
  width: 50px;
  height: 50px;
  right: 0px;
  top: 9px;
  border-radius: 50%;
}
.header-right ul li:hover{
  background: #ccc;
  color: #fff;
}
</style>
