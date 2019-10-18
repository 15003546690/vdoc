<template>
  <div class="team">
    <div class="team-left">
      <h2>我的团队列表<span @click='addT(0,"add")'>+</span></h2>
      <div class="teamL-list">
        <div v-for='(i,idx) in teamList' :class="idx==active?'active teamL-content':'teamL-content'" @click='teamD(idx,i.teamId)'>
          <p>{{i.teamName}}</p>
          <span class="iconfont icon-xiangqing" @click.stop='addT(i,"detail")' title="详情"></span>
          <span class="iconfont icon-shanchu" @click.stop='del(i.teamId,idx)' title="删除"></span>
        </div>
      </div>
    </div>
    <div class="team-right">
      <h2>团队成员</h2>
      <el-table
        :data="tableData"
        border
        height="250"
        style="width: 80%">
        <el-table-column
          prop="userName"
          label="姓名"
          width="100"
          >
        </el-table-column>
        <el-table-column
          prop="orgName"
          label="组织">
        </el-table-column>
        <el-table-column
          prop="userNumber"
          label="工号">
        </el-table-column>
        <el-table-column
          prop="positionName"
          label="职位">
        </el-table-column>
      </el-table>
      <div class="teamR-add">
      <!-- {{jobName}}
      {{userName}} -->
        <h2>邀请新成员</h2>
        <p>
          <!-- <span class="idxname">职位：</span> -->
          <!-- <el-tree-select v-model="jobName"
              :selectParams="selectParams"
              :treeParams="treeParams"
              @searchFun="handleOrgSearchClick"
              @node-click='nodeCk'
              ref="treeSelect">
          </el-tree-select> -->
        </p>
        <el-transfer v-show='this.teamList.length>0' v-model="userName" :data="jobData" filterable :titles="['未选择', '已选择']"></el-transfer>
        <div class="teamRA-btn">
          <el-button type='primary' @click='save()'>保存</el-button>
        </div>
      </div>
    </div>
    <AddTeam @vshow='vshow' v-if='addTeam.show' :addTeam='addTeam'></AddTeam>
  </div>
</template>

<script>
import AddTeam from '../common/addTeam.vue';
import elTreeSelect from 'el-tree-select';
export default {
  components:{
    AddTeam,
    elTreeSelect
  },
	created(){
    this.currentData();
	},
  data () {
    return {
      teamId:'',//团队ID
      teamList:[],//团队列表
      /*treeParams: {
          clickParent: true,
          filterable: true,
          'check-strictly': true,//就是那个多选
          'default-expand-all': false,
          'expand-on-click-node': false,
          'render-content': this._renderFun,
          // 'default-checked-keys': [],
          data: [],
          props: {
          children: 'children',
          label: 'orgName',
          disabled: 'disabled',
          value: 'orgId'
          }
      },
      selectParams: {
          multiple: false,//false会报错
          clearable: true,
          placeholder: '请选择组织'
      },*/
      addTeam:{
        show:false,
        id:'',
        key:''
      },
      job:[],
      active:0,
      jobName:[],
      jobId:'',
      userName:[],
      jobData:[],
      tableData: [
      ],
    }
  },
  methods:{
    /*nodeCk(_d){
      this.jobCurent(_d.orgId)
    },*/
    /*handleOrgSearchClick (value) {
        this.$refs.treeSelect.$refs.tree.filter(value);
    },*/
    vshow(){
      this.addTeam.show=false;
      this.currentData();
    },
    addT(id,key){
      this.addTeam.show=true;
      this.addTeam.id=id;
      this.addTeam.key=key;
    },
    //团队成员table
    teamPeople(teamId){
      const loading = this.$loading(this.$store.state.loading);
      this.tableData=[];
      this.$CGET('/team/findTeamById',{
        teamId
      },(res)=>{
        loading.close();
        let data=res.data.userDataVoList;
        this.tableData=data;
      })
    },
    currentData(){
      //团队列表渲染
      this.$CGET('/team/findTeamsByUser',{
      },(res)=>{
        this.teamList=res.data;
        this.teamId=res.data[0].teamId;
        this.teamPeople(res.data[0].teamId);
      })
      //部门渲染
      this.$UPOST('/api/umc/orignization/findOrgTree',{},(res)=>{
          let data = res.data;
          // this.info.options = data;
          this.treeParams.data = data;
          this.$refs.treeSelect.treeDataUpdateFun(data);
      })
      this.jobCurent();
    },
    jobCurent(_d){
      const loading = this.$loading(this.$store.state.loading);
      this.jobData=[];
      this.$UPOST('/api/umc/user/findUserAll',{//b80c3b03406f4556b0a95eb56778790b
          // orgId:_d
      },(res)=>{
          let data=res.data.list;
          for(let i=0;i<data.length;i++){
              this.jobData.push({
                  key:data[i].userId,
                  label:data[i].userName
              })
          }
          for(let i=0;i<this.tableData.length;i++){
            this.userName.push(this.tableData[i].userId);
          }
          loading.close();
      })
    },
    teamD(idx,id){
      this.userName=[];
      this.active=idx;
      this.teamId=id;
      this.teamPeople(id);
      setTimeout(()=>{
        for(let i=0;i<this.tableData.length;i++){
          this.userName.push(this.tableData[i].userId);
        }
      },3000)
    },
    //删除
    del(teamIds,idx){
      this.$alert('确定要删除吗？', '', {
          confirmButtonText: '确定',
          callback: action => {
            if(action=='confirm'){
              this.$CPOST('/team/delTeams',{
                teamIds
              },(res)=>{
                if(res.code==200){
                  this.teamList.splice(idx,1);
                }else{
                  this.$message({
                     message: res.msg,
                     type: 'warning'
                  });
                }
              })}
          }
        })
    },
    remove(){
      this.jobCurent();
    },
    jobChange(e){
      if(e==false){
          this.jobCurent();
      }
    },
    //添加成员
    save(){
      let str='';
      for(let i=0;i<this.userName.length;i++){
        str+=this.userName[i]+','
      }
      str=str.substring(0,str.length-1);
      this.$CPOST('/team/addUserToTeam',{
        teamId:this.teamId,
        userIdList:str,
      },(res)=>{
        if(res.code==200){
          this.userName=[];
          this.jobData=[];
          this.jobName=[];
          this.teamPeople(this.teamId);
          this.jobCurent();
        }else{
          this.$message({
             message: res.msg,
             type: 'warning'
          });
        }
      })
    }
  }
}
</script>


<style scoped>
  .team{
    padding: 40px;
    display: flex;
    background: #fff;
  }
  .team-left{
    width: 180px;
    height: 300px;
  }
  .team-left h2{
    margin-bottom: 20px;
    position: relative;
  }
  .team-left h2 span{
    cursor: pointer;
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    right: 0;
    border-radius: 50%;
    background: #409eff;
    text-align: center;
    line-height: 20px;
    color: #fff;
    top: 3px;
  }
  .team-left .teamL-content{
    display: flex;
    line-height: 30px;
    cursor: pointer;
    font-size: 14px;
  }
  .team-left .teamL-content p{
    width: 130px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .team-left p:hover{
    color: #f09eff;
  }
  .team-left .active{
    color: #409eff;
  }
  .team-right{
    flex: 1;
    padding-left: 100px;
  }
  .team-right h2{
    margin-bottom: 25px;
  }
  .teamL-list{
    height: 600px;
    overflow:auto;
  }
  .teamR-add{
    margin-top: 20px;
  }
  .teamR-add p{
    margin-bottom: 15px;
  }
  .teamRA-btn{
    margin-top: 10px;
  }
</style>
