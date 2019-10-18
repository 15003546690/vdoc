<template>
  <div class="classif">
    <div class="classif-table">
      <el-table
          :data="tableData"
          border
          >
          <el-table-column
            prop="name"
            label="分类名称">
            <template slot-scope='scope'>
              <el-input v-if='scope.row.show' v-model='scope.row.name'></el-input>
              <span v-else>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop='person'
            label="创建人">
          </el-table-column>
          <el-table-column
            prop="describe"
            label="描述">
            <template slot-scope='scope'>
              <el-input v-if='scope.row.show' v-model='scope.row.describe'></el-input>
              <span v-else>{{scope.row.describe}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注">
            <template slot-scope='scope'>
              <el-input v-if='scope.row.show' v-model='scope.row.remark'></el-input>
              <span v-else>{{scope.row.remark}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width='100'>
            <template slot-scope="scope">
              <div title='编辑'  class='iconfont icon-bianji zc-btn' @click="edit(scope.$index, scope.row)" style="cursor: pointer;color: #409eff;float: left;margin-right: 10px;"></div>
              <div title='删除'  class='iconfont icon-shanchu zc-btn' @click="dele(scope.$index, scope.row)" style="cursor: pointer;color: #409eff;font-size: 18px"></div>
            </template>
          </el-table-column>
      </el-table>
      <div class="page">
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
    <div class='classif-add'>
      <div class="add-target">
        <el-tag>文章分类新增</el-tag>
        <div class="addT-content">
          <el-table
              :data="addData"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="分类名称">
                <template slot-scope="scope">
                  <el-input rows=1 resize='none' type='textarea' v-model='scope.row.name' placeholder="请输入考评类型名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="describe"
                label="描述">
                <template slot-scope="scope">
                  <el-input rows=1 resize='none' type='textarea' v-model='scope.row.describe' placeholder="请输入考评类型名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注">
                <template slot-scope="scope">
                  <el-input rows=1 resize='none' type='textarea' v-model='scope.row.remark' placeholder="请输入备注" class='zzz'></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
              width=100
                >
                  <template slot-scope="scope">
                    <span class="iconfont icon-baocun zc-btn" @click="add(scope.row)" style="margin-right: 10px;cursor: pointer;color: #409eff;"></span>
                    <span class="iconfont icon-qingchu zc-btn" @click="clear(scope.row)" style="cursor: pointer;color: #409eff;"></span>
                  </template>
              </el-table-column>
            </el-table>
        </div>
      </div>
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
      page:{
        current:1,
        pageSize:5,
        total:0
      },
      tableData:[
      ],
      addData:[{
        name:'',
        describe:'',
        remark:''
      }]
    }
  },
  methods:{
    //next下一个，page页数，nextpage下一页
    nextPage(_d){
      this.page.current=_d;
      this.currentData();
    },
    //新增
    add(_d){
      this.$CGET('/category/addCategory',{
        categoryName:_d.name,
        description:_d.describe,
        remark:_d.remark
      },(res)=>{
        if(res.code==200){
          this.currentData();
          this.$message({
            message:res.msg,
            type:'success'
          })
          this.addData=[{
            name:'',
            describe:'',
            remark:''
          }]
        }else{
          this.$message({
            message:res.msg,
            type:'warning'
          })
        }
      })
    },
    //删除
    dele(idx,_d){
      this.$alert('确定要删除吗？', '', {
        confirmButtonText: '确定',
        callback: action => {
          if(action=='confirm'){
            this.$CGET('/category/delCategory',{
              categoryId:_d.id
            },(res)=>{
              if(res.code==200){
                this.tableData.splice(idx,1);
              }else{
                this.$message({
                  message:res.msg,
                  type:'warning'
                })
              }
            })
          }
        }
      })
    },
    //更新
    edit(idx,_d){
      if(!_d.show){
        _d.show=true;
      }else{
        this.$CGET('/category/updateCategory',{
          categoryId:_d.id,
          description:_d.describe,
          categoryName:_d.name,
          remark:_d.remark
        },(res)=>{
          if(res.code==200){
            _d.show=false;
          }else{
            this.$message({
              message: res.msg,
              type: 'warning'
            });
          }
        })
        
      }
    },
    currentData(){
      this.tableData=[];
      const loading = this.$loading(this.$store.state.loading);
      this.$CGET('/category/findCategory',{
        pageNum:this.page.current,
        pageSize:this.page.pageSize,
      },(res)=>{
        loading.close();
        let data=res.data.list;
        for(let i=0;i<data.length;i++){
          this.tableData.push({
            id:data[i].categoryId,
            name:data[i].categoryName,
            date:data[i].create,
            person:data[i].createUserName,
            describe:data[i].description,
            remark:data[i].remark,
            show:false
          })
        }
        this.page.total=res.data.total;
      })
    },
    //肯定是清除呀
    clear(){
      this.addData=[{
        name:'',
        describe:'',
        remark:''
      }]
    }
  }
}
</script>


<style scoped>
.classif{
  background: #fff;
  padding: 40px;
}
/*新增*/
  .add-target{
    margin-top: 20px;
    background: #f5f7fa;
  }
  .el-tag{
    width: 100%;
    border: none;
    border-radius: 0;
    font-size: 14px;
  }
  .addT-content{
    padding: 20px;
    border-top: 1px solid #f5f5f5;
  }
  .page{
    margin-top: 10px;
  }
</style>
