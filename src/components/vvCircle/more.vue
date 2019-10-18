<template>
  <div class="more">
    <div class="more-main">
      <h2>{{title}}</h2>
      <div class="more-search">
        <el-input v-model="listName" class='zc-input' placeholder='请输入文档名字'></el-input>
        <el-select v-model="teamName" filterable placeholder="按团队" clearable filterable class='zc-input'  v-if="title=='团队动态'">
          <el-option
            v-for="(item,idx) in teamList"
            :key="idx"
            :label="item.teamName"
            :value="item.teamId">
          </el-option>
        </el-select>
         <el-select v-model="typeName" filterable placeholder="按分类" clearable filterable>
          <el-option
            v-for="(item,idx) in typeOption"
            :key="idx"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type='primary' @click='searchL("search")'>搜索</el-button>
      </div>
      <div class="moreM-table" >
        <el-table
          v-show="title=='团队动态'"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="docName"
            label="标题"
            >
          </el-table-column>
          <el-table-column
            prop="authorNameValue"
            label="作者"
            width="150"
            >
          </el-table-column>
          <el-table-column
            prop="update"
            label="更新时间"
            width="180"
            >
          </el-table-column>
            <!-- <el-table-column
              prop="teamName"
              label="团队">
            </el-table-column> -->
          <el-table-column
              label="操作"
              width=100
              style='text-align: center;'
                >
              <template slot-scope="scope">
                <span class="iconfont icon-xiazai zc-btn" @click="exportE(scope.row.docId)" style="margin-left: 10px;cursor: pointer;color: #409eff;" title="下载"></span>
                <span class="iconfont icon-chakan zc-btn" @click="look(scope.row.docId)" style="margin-left: 10px;cursor: pointer;color: #409eff;" title="查看"></span>
              </template>
          </el-table-column>
        </el-table>
        <el-table
          v-show="title=='热门文章'"
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="docName"
            label="标题"
            >
          </el-table-column>
          <el-table-column
            prop="authorNameValue"
            label="作者"
            width="150"
            >
          </el-table-column>
          <el-table-column
            prop="update"
            label="更新时间"
            width="230"
            >
          </el-table-column>
          <el-table-column
                label="操作"
              width=100
              style='text-align: center;'
                >
              <template slot-scope="scope">
                <span class="iconfont icon-xiazai zc-btn" @click="exportE(scope.row.docId)" style="margin-left: 10px;cursor: pointer;color: #409eff;" title="下载"></span>
                <span class="iconfont icon-chakan zc-btn" @click="look(scope.row.docId)" style="margin-left: 10px;cursor: pointer;color: #409eff;" title="查看"></span>
              </template>
          </el-table-column>
        </el-table>
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
    </div>
  </div>
</template>

<script>
export default {
	created(){
    let _d=this.$route.query.name;
    if(_d=='heat'){
      this.title='热门文章';
    }else if(_d=='team'){
      this.title='团队动态';
    }
    this.currentData();
    this.searchL();
	},
  data () {
    return {
      listName:'',//文档名字
      typeName:'',//权限ID
      typeOption:[],//权限
      title:'',
      article:'',
      teamName:'',
      teamList:[],
      articleAll:[],
      tableData:[],
      page:{
        current:1,
        pageSize:10,
        total:0
      },
    }
  },
  methods:{
    //导出
    exportE(docId){
      this.$Http(docId);
    },
    //查看
    look(id){
      this.$router.push({path:'edit',query:{id}});
    },
    //搜索
    searchL(_d){
      const loading = this.$loading(this.$store.state.loading);
      if(_d=='search'){
        this.page.current=1;
      }
      this.tableData=[];
      if(this.title=='团队动态'){
        this.$CGET('/doc/findTeamDoc',{
          docName:this.listName,
          pageNum:this.page.current,
          pageSize:this.page.pageSize,
          categoryId:this.typeName,
          teamId:this.teamName
        },(res)=>{
          loading.close();
          this.tableData=res.data.list;
          this.page.total=res.data.total;
        })
        //团队列表
        this.$CGET('/team/findTeamsByUser',{
        },(res)=>{
          let data=res.data;
          this.teamList=data;
        })
      }else{
        this.$CGET('/doc/findHotDoc',{
          docName:this.listName,
          pageNum:this.page.current,
          pageSize:this.page.pageSize,
          praises:'desc',
          categoryId:this.typeName
        },(res)=>{
          loading.close();
          this.tableData=res.data.list;
          this.page.total=res.data.total;
        })
      }
    },
    nextPage(_d){
      this.page.current=_d;
      this.searchL();
    },
    currentData(){
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
    }
  }
}
</script>
<style>
  .more-search .zc-input{
    width: 220px;
    margin-right: 10px;
  }
</style>
<style scoped>
.more{
  background: #fff;
  padding: 40px;
}
.more-search{
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.more-main{
  width: 1000px;
}
.more-main button{
  margin-left: 15px;
}
.moreM-table{
  margin: 20px 0;
}
</style>
