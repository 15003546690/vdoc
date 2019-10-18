<template>
  <div class="copy">
    <div class="copy-content">
    <!-- 团队：{{teamName}}
        公开类型：{{openStateName}}
        权限：{{limitName}}
        人员：{{personalName}}
        分类：{{typeName}} -->
      <div class="close" @click='close'>x</div>
      <div class='state-box'>
        <span>*</span>
        <el-select v-model="limitName" filterable placeholder="请选择权限" @change='limitChange'>
          <el-option
            v-for="item in limit"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class='state-box'>
        <span>*</span>
        <el-select v-model="typeName" filterable placeholder="请选择分类" multiple filterable clearable>
          <el-option
            v-for="item in typeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class='state-box state-boxs' v-show="limitName==0">
        <el-checkbox-group v-model="checkList">
            <el-checkbox :label="i.juId" v-for='(i,idx) in checkListS' :key='idx'>{{i.juName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- <div class='state-box state-boxs' v-show="limitName==1">
        <el-checkbox-group v-model="selfKey">
            <el-checkbox :label="i.juId" v-for='i in checkListS' disabled>{{i.juName}}</el-checkbox>
        </el-checkbox-group>
      </div> -->
      <div class='state-box' v-show="limitName==2">
        <span>*</span>
        <el-select v-model="openStateName" filterable placeholder="请选择公开类型">
          <el-option
            v-for="item in openState"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="teamName" filterable placeholder="请选择团队" v-show='openStateName==0' clearable filterable multiple>
          <el-option
            v-for="item in team"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="personalName" filterable placeholder="请选择人员" v-show='openStateName==1'clearable filterable multiple>
          <el-option
            v-for="(item,idx) in personal"
            :key="idx"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class='state-boxs'><!--  v-show="this.state=='新建'" -->
        <!-- <el-button type='primary' @click='save'>{{btn}}</el-button> -->
        <el-upload
          :disabled=disable
          class="setting-upload"
          style='margin-right: 0'
          :http-request='httpRequest'
          action=""
          accept=".docx"
          :before-upload="fileBefore">
          <el-button type='primary' @click='save'>{{btn}}</el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:[
    'state'
  ],
 /* watch:{
      'copy': {
          deep: true,
          handler: function (val){
            this.contetn=val
          }
      }
  },*/
  created(){
    this.currentData();
  },
  data () {
    return {
      disable:true,
      btn:this.state,
      checkList:[],
      checkListS:[],//多选值
      limitName:0,
      limit:[
        {
          label:'公开',
          value:0
        },
        {
          label:'私有',
          value:1
        },
        {
          label:'部分公开',
          value:2
        }
      ],
      openStateName:0,
      openState:[
        {
          label:'对团队公开',
          value:0
        },
        {
          label:'对个人公开',
          value:1
        }
      ],
      teamName:[],
      team:[],
      personalName:[],
      personal:[],
      typeOption:[],
      typeName:[],
      fileUpload:{   //附件上传
        file:null
      },
      selfKey:[],//当选项为私有时
      docContent:'',//文档内容
      docTitle:''
    }
  },
  methods:{
    //权限改变时
    limitChange(){
      if(this.limitName==1){
        this.checkList=this.selfKey;
      }
      this.checkList=[];
      this.teamName=[];
      this.personalName=[];
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
          this.docContent=res.data.content;
          this.docTitle=res.data.title;
          this.fileSuccess();
        }else{
          this.$message({
            message: res.msg,
            type: 'warning'
          });
        }
      })
    },
    //上传成功时的操作
    fileSuccess(){
      let _data;
      if(this.limitName==0){
        _data={
          docName:this.docTitle,
          docContent:this.docContent,//文档内容
          openStatus:this.limitName,//公开状态（0公开，1私有，2部分公开）
          juIdList:JSON.stringify(this.checkList),//权限id列表
          categoryIdList:JSON.stringify(this.typeName)//分类id列表
        }
      }else if(this.limitName==2){
        if(this.openStateName==0){//对团队
          _data={
            docName:this.docTitle,
            docContent:this.docContent,//文档内容
            openStatus:this.limitName,//公开状态（0公开，1私有，2部分公开）openStateName
            teamIdList:JSON.stringify(this.teamName),
            categoryIdList:JSON.stringify(this.typeName)
          }
        }else if(this.openStateName==1){//对个人
          _data={
            docName:this.docTitle,
            docContent:this.docContent,//文档内容
            openStatus:this.limitName,//公开状态（0公开，1私有，2部分公开）openStateName
            userIdList:JSON.stringify(this.personalName),
            categoryIdList:JSON.stringify(this.typeName)
          }
        }
      }else{
        _data={
          docName:this.docTitle,
          docContent:this.docContent,//文档内容
          openStatus:this.limitName,//公开状态（0公开，1私有，2部分公开）
          juIdList:JSON.stringify(this.selfKey),//权限id列表
          categoryIdList:JSON.stringify(this.typeName)//分类id列表
        }
      }
      this.$CPOST('/doc/addDoc',_data,(res)=>{
        console.log(res)
      })
    },
    currentData(){
      //公开列表
      this.$CGET('/jurisdiction/findJuPage',{

      },(res)=>{
        let data=res.data.list;
        for(let i=0;i<data.length;i++){
          this.checkListS.push(data[i])
          this.selfKey.push(data[i].juId)
        }
      })
      //查询分类列表
      this.$CGET('/category/findCategory',{
      },(res)=>{
        let data=res.data;
        for(let i=0;i<data.length;i++){
          this.typeOption.push({
            value:data[i].categoryId,
            label:data[i].categoryName
          })
        }
      })
      //对团队公开
      this.$CGET('/team/findTeamsByUser',{
      },(res)=>{
        let data=res.data;
        for(let i=0;i<data.length;i++){
          this.team.push({
            value:data[i].teamId,
            label:data[i].teamName
          })
        }
      })
      this.$UPOST('/api/umc/user/findUserAll',{
      },(res)=>{
          let data=res.data.list;
          for(let i=0;i<data.length;i++){
              this.personal.push({
                  value:data[i].userId,
                  label:data[i].userName
              })
          }
      })
    },
    close(){
      this.$emit('vstate');
    },
    commit(){
      if(this.state=='新建'){
        this.$router.push({path:'/edit'})
      }else if(this.state=='导入'){
        this.disable=false;
      }
    },
    save(){
      if(this.typeName.length<=0){
        this.disable=true;
        this.$message({
          message: '至少选择一个分类',
          type: 'warning'
        });
      }else if(this.limitName==0){
        if(this.checkList.length<=0){
          this.disable=true;
          this.$message({
            message: '至少选择一个权限',
            type: 'warning'
          });
        }else{
          this.commit();
        }
      }else if(this.limitName==2){
        if(this.openStateName==0){
          if(this.teamName.length<=0){
            this.disable=true;
            this.$message({
              message: '至少选择一个团队',
              type: 'warning'
            });
          }else{
            this.commit();
          }
        }else if(this.openStateName==1){
          if(this.personalName.length<=0){
            this.disable=true;
            this.$message({
              message: '至少选择一个人',
              type: 'warning'
            });
          }else{
            this.commit();
          }
        }
      }else{
          this.commit();
        }
    }
  }
}
</script>


<style scoped>
  .copy{
    background: rgba(0,0,0,.7);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .copy-content{
    width: 600px;
    background: #f5f7fa;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 20px;
  }
  .copy-content .close{
    cursor: pointer;
    position: absolute;
    right: 0;
    top:0;
    width: 30px;
    height: 18px;
    line-height: 16px;
    text-align: center;
    background: #f56c6c;
    color: #fff;
    border-radius: 0 0 0 4px;
  }
  .state-box{
    margin-bottom: 20px;
  }
  .state-box span:first-child{
    color: red;
    font-size: 18px;
    margin-right: 10px;
  }
  .state-boxs{
    margin-left: 25px;
  }
  .state-box .el-select{
    margin-right: 10px;
  }
</style>
