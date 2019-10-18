<template>
  <div class="vvc">
    <div class="vvc-header">
      <div class="vvcH-bar">
        <h2><i class="iconfont icon-xingxing" style="margin-right: 10px;font-size: 18px;"></i>团队动态<span @click='more("team")'>更多></span></h2>
        <div  v-for='i in teamList'>
          <div>
            <span class="vvcHB-user">{{i.authorNameValue}}</span>
            <p class="vvcHB-date">{{i.docName}}</p>
            <span>{{i.update}}</span>
            <i class="look" @click='look(i.docId)'>点击查看</i>
          </div>
        </div>
      </div>
      <div class="vvcH-bar">
        <h2><i class="iconfont icon-remen" style="margin-right: 10px;font-size: 19px;color: red"></i>热门文档<span @click='more("heat")'>更多></span></h2>
        <div  v-for='i in hostList' style="cursor: pointer;"  class="looks" @click='look(i.docId)'>
          <div>
            <p>{{i.docName}}</p>
            <span>{{i.authorNameValue}}/{{i.update}}</span>
            <i class="iconfont icon-xin" style="font-size: 12px;">{{i.praises}}</i>
          </div>
        </div>
      </div>
    </div>
    <div class="file-list">
      <h2 class="fileL-header">全站文档</h2>
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
        <el-button type='primary' @click='searchL("search")'>搜索</el-button>
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
          <dt @click='look(i.docId)'>
            <div>{{i.docName}}</div>
            <div style="margin-top: 7px;">
              <span style="font-size: 12px;">{{i.authorNameValue}}/{{i.update}}</span>
              <span class="iconfont icon-chakan" style="font-size: 12px;" title="浏览数量">{{i.brows}}</span>
              <span class="iconfont icon-xin" style="font-size: 12px;" title="点赞数量">{{i.praises}}</span>
              <span class="iconfont icon-xiaoxi" style="font-size: 12px;" title='评论数量'>{{i.comments}}</span>
            </div>
          </dt>
          <div style="position: absolute;right: 100px;top: 33%;font-size: 22px" class="iconfont icon-xiazai" title="下载" @click='exportE(i.docId)'></div>
          <div style="position: absolute;right: 20px;top: 38%;font-size: 18px" class="iconfont icon-fenxiang" title="分享" @click='share(i.docId)'></div>
          <div style="position: absolute;right: 60px;top: 34%;font-size: 22px" class="iconfont icon-baocun" alt='fdsf' title="保存为我的文档" @click='save(i.docId)'></div>
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
  </div>
</template>

<script>
import Copy from '../common/copy.vue'
export default {
  components:{
    Copy
  },
	created(){
    this.currentData();
	},
  data () {
    return {
      isCopy:false,
      page:{
        current:1,
        pageSize:10,
        total:0
      },
      copy:'',
      listOption:[],//筛选列表渲染
      typeOption:[],//分类列表渲染
      listName:'',//筛选名字
      typeName:'',//分类名字
      sort:{
        time:'desc',
        fabulous:'',
        browse:''
      },
      hostList:[],//热门文档
      teamList:[],//团队动态
      docList:[],//文档列表
    }
  },
  methods:{
    //导出
    exportE(docId){
      this.$Http(docId);
    },
    //查看
    look(id){
      this.$router.push({path:'edit',query:{id}})
    },
    //保存为我的
    save(id){
      this.$CGET('/doc/copyToMy',{
        docId:id
      },(res)=>{
        if(res.code==200){
          this.$message({
            message:'保存成功',
            type:'success'
          })
        }else{
          this.$message({
            message:res.msg,
            type:'warning'
          })
        }
      })
    },
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
      this.$CGET('/doc/findDocByCategory',{
        pageNum:this.page.current,
        pageSize:this.page.pageSize,
        docName:this.listName,//缺
        categoryId:this.typeName,//缺
        updateTime:this.sort.time,
        praises:this.sort.fabulous,
        brows:this.sort.browse
      },(res)=>{
        loading.close();
        let data=res.data.list;
        for(let i=0;i<data.length;i++){
          this.docList.push(data[i]);
        }
        this.page.total=res.data.total;
      })
    },
    currentData(){
      this.searchL();
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
      //热门文档
      this.$CGET('/doc/findHotDoc',{
        praises:'desc',
        pageNum:1,
        pageSize:5
      },(res)=>{
        let data=res.data.list;
          this.hostList=data;
      })
      //团队动态
      this.$CGET('/doc/findTeamDoc',{
        pageNum:1,
        pageSize:5,
        updateTime:'desc'
      },(res)=>{
        this.teamList=res.data.list;
      })
      //全站文档
      this.$CGET('/team/findTeamById')
    },
    more(d){//team(团队) heat(热门)
        this.$router.push({'path':'/more',query:{name:d}})
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
  .vvc{
    background: #fff;
    padding: 40px;
  }
  .vvc-header{
    display: flex;
    
  }
  .vvcH-bar{
    flex: 1;
  }
  .vvcH-bar div{
    width: 100%;
    display: flex;
    line-height: 25px;
    min-width: 600px;
  }
  .vvcH-bar div p{
    margin-right: 10px;
    width: 180px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .vvcH-bar h2{
    margin-bottom: 10px;
    width: 100%;
    position:relative;
  }
  .vvcH-bar h2 span{
    font-size: 12px;
    font-weight: normal;
    position: absolute;
    right: 120px;
    top: 7px;
    cursor: pointer;
  }
  .vvcH-bar h2 span:hover{
    color: red;
  }
  .vvcH-bar div i{
    display: flex;
    flex: 1;
    font-style: normal;
    justify-content: flex-end;
    margin-right: 120px;
    cursor: pointer;
  }
  .vvcH-bar div i:before{
    margin-right: 3px;
  }
  .vvc-doc{
    margin-top: 40px;
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
.look{
  color: #5485ed;
}
.look:hover{
  color:red;
}
.looks:hover{
  color: #5485ed;
}
.vvcHB-user{
  display:inline-block;
  margin-right: 20px;
  width: 70px;
  max-width: 70px;
  text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.vvcHB-date{
  display: inline-block;
  width: 180px !important;
}
.fileL-list dt div:first-child{
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
}
.fileL-list dt div{
  color: #666;
}
.fileL-list:hover{
  color: #4699b9 !important;
  border: solid 1px #4699b9;
}
</style>
