<template>
  <div class="file">
    <div class="file-header">
      <div class="fileH-box fileHB-box" @click='newFile("newFile")'>
        <div class="iconfont icon-xinjianwendang"></div>
        <span>新建文档</span>
      </div>     
        <el-upload
          class="setting-upload fileHB-box"
          :http-request='httpRequest'
          action=""
          accept=".doc"
          :show-file-list="false"
          :before-upload="fileBefore">
          <!-- <el-button type='primary' @click='save'>{{btn}}</el-button> -->
          <div class="fileH-box">
          <div class="iconfont icon-daochuwendang"></div>
          <span>导入文档</span>
          </div>
        </el-upload>
    </div>
    <div class="file-lately">
      <h2 class="fileL-header">最近编辑</h2>
      <div class="fileL-box">
        <dl class="fileL-list fileL-list-Lately"  v-for='i in LatelyList'  @click='lately(i.docId)'>
          <dd class='iconfont icon-wendang'></dd>
          <dt>
            <div>{{i.docName}}</div>
            <div :title="i.updateTime">{{i.updateDate}}</div>
            <!-- <div>caoshuyun/05-08 14:03</div> -->
          </dt>
        </dl>
      </div>
    </div>
    <div class="file-list">
      <h2 class="fileL-header">我的文档列表</h2>
      <div class="fileL-search"> 
        <el-input v-model="listName" class='zc-input' placeholder='请输入文档名字'></el-input>
        <el-select v-model="typeName" filterable placeholder="按分类" clearable filterable>
          <el-option
            v-for="(item,idx) in typeOption"
            :key="idx"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type='primary' @click="searchL('search')">搜索</el-button>
        <div class="fileLS-sort">
          <p>排序：</p>
          <div @click="sortL('time')">
            <span>时间</span>
            <p style="display: flex;">
              <span :class="sort.time=='asc'?'iconfont icon-shengxu active':'iconfont icon-shengxu'" ></span>
              <span :class="sort.time=='desc'?'iconfont icon-jiangxu active':'iconfont icon-jiangxu'"></span>
            </p>
          </div>
          <div @click="sortL('good')">
            <span>点赞</span>
            <p style="display: flex;">
              <span :class="sort.fabulous=='asc'?'iconfont icon-shengxu active':'iconfont icon-shengxu'" ></span>
              <span :class="sort.fabulous=='desc'?'iconfont icon-jiangxu active':'iconfont icon-jiangxu'"></span>
            </p>
          </div>
          <div @click="sortL('browse')">
            <span>浏览</span>
            <p style="display: flex;">
              <span :class="sort.browse=='asc'?'iconfont icon-shengxu active':'iconfont icon-shengxu'" ></span>
              <span :class="sort.browse=='desc'?'iconfont icon-jiangxu active':'iconfont icon-jiangxu'"></span>
            </p>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px;">
        <dl class="fileL-list"  v-for='i in docList' style="margin-bottom: 10px;">
          <dd class='iconfont icon-wendang'></dd>
          <dt @click='lately(i.docId)'>
            <div>{{i.docName}}</div>
            <div style="margin-top: 7px;">
              <span class="iconfont icon-renshu" style="font-size: 12px;" title='部分公开' v-show='i.openStatus==2'></span>
              <span class="iconfont icon-suo" style="font-size: 12px;" title='公开' v-show='i.openStatus==0'></span>
              <span class="iconfont icon-suo1" style="font-size: 12px;" title='私有' v-show='i.openStatus==1'></span>
              <span class="iconfont icon-chakan" style="font-size: 12px;" title="浏览数量">{{i.brows}}</span>
              <span class="iconfont icon-xin" style="font-size: 12px;" title="点赞数量">{{i.praises}}</span>
              <span class="iconfont icon-xiaoxi" style="font-size: 12px;" title='评论数量'>{{i.comments}}</span>
            </div>
          </dt>
          <div style="position: absolute;right: 60px;top: 33%;font-size: 22px" class="iconfont icon-xiazai" title="下载" @click='exportE(i.docId)'></div>
          <div style="position: absolute;right: 25px;top: 40%;font-size: 18px" class="iconfont icon-fenxiang" title="分享" @click='share(i.docId)'></div>
          <!-- <div style="position: absolute;right: 60px;top: 33%;font-size: 22px" class="iconfont icon-baocun" alt='fdsf' title="保存为我的文档"></div> -->
        </dl>
      </div>
    </div>
    <el-pagination
      background
      v-show='page.total>0'
      layout="prev, pager, next"
      :page-size='page.pageSize'
      :current-page='page.current'
      @current-change='nextPage'
      :total='this.page.total'>
    </el-pagination>
    <Copy :copy='copy' v-show='isCopy' @vshow='vshow'></Copy>
    <State :state='state' v-if='isState' @vstate='vstate'></State>
  </div>

</template>

<script>
import Copy from '../common/copy.vue'
import State from '../common/state.vue'
export default {
  components:{
    Copy,
    State
  },
	created(){
    this.currentData();
	},
  data () {
    return {
      isState:false,
      state:'',
      isCopy:false,
      copy:'',
      page:{
        current:1,
        pageSize:10,
        total:0
      },
      docList:[],//文档列表
      LatelyList:[],//最近列表
      listOption:[],//筛选列表渲染
      typeOption:[],//分类列表渲染
      listName:'',//筛选名字
      typeName:'',//分类名字
      sort:{
        time:'desc',
        fabulous:null,
        browse:null
      },
      fileUpload:{   //附件上传
        file:null
      },
    }
  },
  methods:{
    //导出
    exportE(docId){
      this.$Http(docId);
    },
    //上传相关
    fileBefore (file) {
      this.fileUpload.file=file;
    },
    httpRequest(){
      let fd = new FormData();
      fd.append('file', this.fileUpload.file)
      this.$CZC('/doc/parseWord',fd,(res)=>{
        if(res.code==200){
          let data=res.data;
          this.$router.push({'path':'edit',query:{docTitle:data.title,content:data.content}})
          /*this.searchL('search');
          this.$message({
            message: '上传成功',
            type: 'success'
          });*/
        }else{
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    //搜索
    searchL(_d){
      const loading = this.$loading(this.$store.state.loading);
      if(_d=='search'){
        this.sort.fabulous=null;
        this.sort.browse=null;
        this.sort.time='desc';
        this.page.current=1;
      }else if(_d=='type'){
        this.page.current=1;
      }
      this.docList=[];
      this.$CGET('/doc/findMyDoc',{
        pageNum:this.page.current,
        pageSize:this.page.pageSize,
        docName:this.listName,
        categoryId:this.typeName,
        timeOrder:this.sort.time,
        praiseOrder:this.sort.fabulous,
        browOrder:this.sort.browse
      },(res)=>{
        loading.close();
        let data=res.data.list;
        for(let i=0;i<data.length;i++){
          this.docList.push(data[i]);
        }
        this.page.total=res.data.total;
      })
    },
    //最近跳转
    lately(id){
      this.$router.push({path:'edit',query:{id}});
    },
    currentData(){
      this.searchL();
      //最近文档
      this.$CGET('/doc/findMyDocTop',{
        // num:''
      },(res)=>{
        let data=res.data;
        for(let i=0;i<data.length;i++){
          // data[i].updateTime=data[i].updateTime.substring(0,data[i].updateTime.length-9).split("T");
          this.LatelyList.push(data[i]);
        }
      })
      //我的文档列表
      this.$CGET('/doc/findMyDoc',{

      },(res)=>{
        let data=res.data.list;
        for(let i=0;i<data.length;i++){
          this.listOption.push({
            value:data[i].docId,
            label:data[i].docName
          });
        }
      })
      //查询分类列表
      this.$CGET('/category/findCategory',{
      },(res)=>{
        let data=res.data.list;
        for(let i=0;i<data.length;i++){
          this.typeOption.push({
            value:data[i].categoryId,
            label:data[i].categoryName
          })
        }
      })
    },
    vstate(){
      this.isState=false;
    },
    newFile(_d){
      /*this.isState=true;
      if(_d=='newFile'){
        this.state='新建';
      }else if(_d=='import'){
        this.state='导入';
      }*/
      this.$router.push({'path':'edit'})
    },
    vshow(){
      this.isCopy=false;
    },
    share(id){
      this.$CGET('/doc/shareDoc',{
        docId:id
      },(res)=>{
        if(res.code==200){
          this.isCopy=true;
          this.copy=res.data;
        }else{
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    nextPage(_d){
      this.page.current=_d;
      this.searchL();
    },
    sortL(d){
      if(d=='time'){
        if(this.sort.time=='asc'){
          this.sort.time='desc';
        }else if(this.sort.time=='desc'){
          this.sort.time='asc';
        }else{
          this.sort.time='desc';
        }
        this.sort.fabulous=null;
        this.sort.browse=null;
        this.searchL('type');
      }else if(d=='good'){
        if(this.sort.fabulous=='asc'){
          this.sort.fabulous='desc';
        }else if(this.sort.fabulous=='desc'){
          this.sort.fabulous='asc';
        }else{
          this.sort.fabulous='desc';
        }
        this.sort.time=null;
        this.sort.browse=null;
        this.searchL('type');
      }else{
        if(this.sort.browse=='asc'){
          this.sort.browse='desc';
        }else if(this.sort.browse=='desc'){
          this.sort.browse='asc';
        }else{
          this.sort.browse='desc';
        }
        this.sort.time=null;
        this.sort.fabulous=null;
        this.searchL('type');
      }
    }
  }
}
</script>

<style>
  .fileL-search .zc-input{
    width: 220px;
    margin-right: 10px;
  }
</style>
<style scoped>
.file{
  background: #fff;
  padding: 40px 50px 0 40px;
}
.file-header{
  display: flex;
  position: relative;
  height: 88px;
}
.fileH-box{
  width: 90px;
  text-align: center;
  margin-right: 20px;
  padding: 10px;
  border:solid 1px #ccc;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
}
.fileH-box:hover,.fileL-list:hover{
  color: #4699b9 !important;
  border: solid 1px #4699b9;
}
.setting-upload{
  position: absolute;
  top: 0;
  left: 110px;
}
.fileH-box div{
  height:50px;
  width: 100%;
  font-size: 40px;
  display: flex;
  justify-content: center;
}
.file-lately{
  margin-top: 15px;
}
.fileL-header{
  line-height: 40px;
}
.fileL-list{
  border:solid 1px #ccc;
  padding: 10px;
  display: flex;
  margin-right: 20px;
  cursor: pointer;
  position: relative;
}
.fileL-list div:last-child span{
  margin-right: 10px;
}
.fileL-list div:last-child span:before{
  margin-right: 3px;
}
.fileL-list dd{
  font-size: 22px;
  width: 30px;
  display: flex;
  align-items: center;
  color: #1f556d;
}
.file-list{
  margin: 15px 0 30px 0;
}
.fileL-search{
  display: flex;
  align-items: center;
}
.fileL-search .el-select{
  margin-right: 10px;
}
.fileLS-sort{
  display: flex;
  flex: 1;
  justify-content: flex-end;
  font-size: 16px;
  margin-right: 50px;
  align-items: center;
}
.fileLS-sort span{
  padding: 0 7px;
  cursor: pointer;
}
.fileLS-sort div{
  display: flex;
  align-items: center;
  position: relative;
}
.fileLS-sort div p{
  width: 30px;
  display: flex;
  flex-wrap: wrap;
}
.fileLS-sort div p span{
  display: inline-block;
  font-size: 30px;
  padding:0;
}
.fileLS-sort div p span:first-child{
  position: absolute;
  top: -8px;
  right: 10px;
}
.fileLS-sort div p span:last-child{
  position: absolute;
  top: -5px;
  right: 10px;
}
.fileLS-sort .active{
  color: #409eff;
}
.fileL-list-Lately{
  width: 187px;
  max-width: 187px;
  max-height: 65px;
}
.fileL-list-Lately dd{
  margin-right: 6px;
}
.fileL-list-Lately dt div{
  width: 137px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #666;
}
.fileL-list dt div{
  color: #666;
}
.fileL-list dt div:first-child{
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
}
.fileL-box{
  display: flex;
}
/* .fileHB-box:hover{
  background: red;
} */
</style>
