<template>
  <div class="copy">
    <div class="copy-content">
      <div class="close" @click='close()'>x</div>
      <div class="add-target">
        <el-tag>团队列表新增</el-tag>
        <div class="addT-content">
          <el-table
              v-show="addTeam.key=='detail'"
              :data="addData"
              style="width: 100%">
              <el-table-column
                prop="teamName"
                label="发起类型名称">
                <template slot-scope="scope">
                  <el-input rows=1 resize='none' type='textarea' v-model='scope.row.teamName' placeholder="团队名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                label="团队详情">
                <template slot-scope="scope">
                  <el-input rows=1 resize='none' type='textarea' v-model='scope.row.description' placeholder="团队详情"></el-input>
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
              width='150'
                prop="createUserName"
                label="创建人">
                <template slot-scope="scope">
                  <div>{{scope.row.createUserName}}</div>
                  <!-- <el-input rows=1 resize='none' type='textarea' v-model='scope.row.createUserName' placeholder="创建人"></el-input> -->
                </template>
              </el-table-column>
              <el-table-column
              width='250'
                prop="create"
                label="创建时间">
                <template slot-scope="scope">
                  <div>{{scope.row.create}}</div>
                  <!-- <el-date-picker
                    v-model="scope.row.create"
                    type="datetime" 
                    value-format="yyyy-MM-dd HH:mm:ss" 
                    placeholder="创建时间">
                  </el-date-picker> -->
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
              width=100
                >
                  <template slot-scope="scope">
                    <span class="iconfont icon-baocun zc-btn" @click="save(scope.row,'update')" style="margin-right: 10px;cursor: pointer;color: #409eff;" title="保存"></span>
                    <span class="iconfont icon-qingchu zc-btn" @click="clear(scope.row)" style="cursor: pointer;color: #409eff;" title="清除"></span>
                  </template>
              </el-table-column>
            </el-table>
          <el-table
              v-show="addTeam.key=='add'"
              :data="addList"
              style="width: 100%">
              <el-table-column
                prop="teamName"
                label="发起类型名称">
                <template slot-scope="scope">
                  <el-input rows=1 resize='none' type='textarea' v-model='scope.row.teamName' placeholder="团队名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="description"
                label="团队详情">
                <template slot-scope="scope">
                  <el-input rows=1 resize='none' type='textarea' v-model='scope.row.description' placeholder="团队详情"></el-input>
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
                    <span class="iconfont icon-baocun zc-btn" @click="save(scope.row,'add')" style="margin-right: 10px;cursor: pointer;color: #409eff;" title="新增"></span>
                    <span class="iconfont icon-qingchu zc-btn" @click="clear(scope.row)" style="cursor: pointer;color: #409eff;" title="清除"></span>
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
    console.log(this.addTeam.key)
    if(this.addTeam.key=='detail'){
      this.addData.push(this.addTeam.id);
    }else{
      this.addList.push({
        teamName:'',
        description:'',
        remark:'',
      })
    }
  },
  /*watch:{
      'addTeam.id': {
          deep: true,
          handler: function (val){
            this.addData[0].name=val;
          }
      }
  },*/
  props:[
    'addTeam'
  ],
  data () {
    return {
      addData:[],//详情展示
      addList:[],//添加
    }
  },
  methods:{
    clear(){
      if(this.addTeam.key=='detail'){
        this.addData[0].teamName='';
        this.addData[0].description='';
        this.addData[0].remark='';
      }else{
        this.addList.push({
          teamName:'',
          description:'',
          remark:'',
        })
      }
    },
    save(_d,key){
      if(key=='update'){
        this.$CGET('/team/updateTeam',{
          teamName:_d.teamName,
          description:_d.description,
          remark:_d.remark,
          teamId:_d.teamId
        },(res)=>{
          if(res.code==200){
            this.close();
          }else{
            this.$message({
               message: res.msg,
               type: 'warning'
            });
          }
        })
      }else if(key=='add'){
        this.$CGET('/team/addTeam',{
          teamName:_d.teamName,
          description:_d.description,
          remark:_d.remark,
        },(res)=>{
          if(res.code==200){
            this.close();
          }else{
            this.$message({
               message: res.msg,
               type: 'warning'
            });
          }
        })
      }
    },
    close(){
      this.$emit('vshow');
    },
    /*success(e) {
      this.$message({
          message: '复制成功',
          type: 'success'
        });
    }*/
  }
}
</script>

<style>
  .copy-content .el-date-editor.el-input{
    width: 100%;
    height: 33px;
  }
  .copy-content .el-input--prefix .el-input__inner{
    height: 33px;
  }
  .copy-content .el-input__prefix{
    top: -4px;
  }
</style>
<style scoped>
  .copy{
    z-index: 999;
    background: rgba(0,0,0,.7);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .copy-content{
    width: 1200px;
    height: 80px;
    background: #f5f7fa;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .copy-content .close{
    cursor: pointer;
    position: absolute;
    right: 0;
    top:0;
    width: 60px;
    height: 32px;
    line-height: 24px;
    text-align: center;
    background: #f56c6c;
    color: #fff;
    font-size: 24px;
  }
  /*新增*/
  .add-target{
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
</style>
