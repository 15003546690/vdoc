<template>
  <div class="diary">
    <div class="diary-search">
      <el-input v-model='info.docName' placeholder='请输入文档名称'></el-input>
      <el-date-picker
        v-model="info.startTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="开始时间">
      </el-date-picker>
      <el-date-picker
        v-model="info.endTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetime"
        placeholder="结束时间">
      </el-date-picker>
      <el-button type='primary' @click='searchL'>搜索</el-button>
    </div>
    <div class="diary-table">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="docName"
          label="文档名称"
          >
        </el-table-column>
        <el-table-column
          prop="authorName"
          label="作者"
          width='150'
          >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="230"
          >
        </el-table-column>
        <el-table-column
          prop="modifyDate"
          label="操作时间"
          width="230"
          >
        </el-table-column>
        <el-table-column
          prop="logType"
          label="操作"
          width="150"
          >
          <template slot-scope="scope">
            {{scope.row.logType==0?'删除':'更新'}}
          </template>
        </el-table-column>
       <!--  <el-table-column
             label="操作"
           width=100
           style='text-align: center;'
             >
           <template slot-scope="scope">
             <span class="iconfont icon-xiazai zc-btn" @click="exportE(scope.row.docId)" style="margin-left: 10px;cursor: pointer;color: #409eff;" title="下载"></span>
             <span class="iconfont icon-chakan zc-btn" @click="look(scope.row.docId)" style="margin-left: 10px;cursor: pointer;color: #409eff;" title="查看"></span>
           </template>
       </el-table-column> -->
      </el-table>
    </div>
    
  </div>
</template>
<script>
export default {
	created(){
    this.currentData();
	},
  data () {
    return {
      tableData:[],
      info:{
        startTime:'',
        endTime:'',
        docName:''
      }
    }
  },
  methods:{
    currentData(docName,startTime,endTime){
      const loading = this.$loading(this.$store.state.loading);
      this.tableData=[];
      this.$CGET('/log/findLog',{
        docName,
        startTime,
        endTime
      },(res)=>{
        loading.close();
        let data=res.data;
        this.tableData=data.list;
      })
    },
    searchL(){
      this.currentData(this.info.docName,this.info.startTime,this.info.endTime);
    }
  }
}
</script>
<style>
  .diary-search .el-input{
    width: 300px;
    margin-right: 10px;
  }
  .diary-search .el-date-editor{
    width: 200px;
  }
</style>
<style scoped>
  .diary{
    padding: 40px;
    background: #fff;
  }
  .diary-search{
    display: flex;
    margin-bottom: 20px;
  }
</style>
