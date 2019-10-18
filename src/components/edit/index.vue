<template>
  <div class="edit">
    <el-button @click='modify' :disabled=disabled v-show='!disabled&&!isBtnBJ'>编辑</el-button>
    <el-button @click='delDoc' v-show='!stateDisabled&&!isBtnBJ' type='primary'>删除</el-button>
    <div :class="active?'edit-content':'edit-contents'">
      <div :class="active?'editC-left':'editC-lefts'" v-show='!isModify'>
        <div class="edit-pic-bar">
          <div v-for='i in picBar'>
            <img :src="i.img" :alt="i.name" :title='i.name' v-if='i.img!=null'>
            <span v-else>{{i.name.substr(i.name.length-2,2)}}</span>
          </div>
        </div>
        <!-- <div class="zc-heiSho iconfont icon-shousuo" @click='shrink'></div> -->
        <div class="edit-header"  v-if='!isEdit'>
          <transition name='fade'>
            <div class="box" v-if="isTrans">+1</div>
          </transition>
          <span class="iconfont icon-chakan" style="font-size: 14px;" title="查看数量">{{info.brows}}</span>
          <span :class="isfabulous?'iconfont icon-xin fabulous-active':'iconfont icon-xin'" style="font-size: 14px;" @click='fabulous()' title="点赞">{{info.praises}}</span>
          <span class="iconfont icon-xiaoxi" style="font-size: 14px;" title="评论数量">{{info.comments}}</span>
          <div class="zc-heiSho iconfont icon-shousuo" @click='shrink'></div>
        </div>
        <div class="edit-title">
          <el-input placeholder='请输入文章标题' v-model='docTitle' :disabled=disabled maxlength='30'></el-input>
        </div>
        <el-upload
                class="avatar-uploader"
                :action="serverUrl"
                name="img"
                :data='fileUpload'
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload">
        </el-upload>
        <el-row v-loading="uillUpdateImg">
        <quill-editor v-model="docContent"
              :disabled=disabled
              ref="myQuillEditor"
              :options="editorOption"
              @blur="handleEditorBlur($event)"
              @focus="handleEditorFocus($event)"
              @change="handleEditorChange($event)">
        </quill-editor>
        </el-row>
        <!-- <div class="zc-len" v-show='textLen<350'>您还可以输入<span style='color: #66b1ff'>{{350-textLen}}</span>个字</div>
        <div class="zc-len" v-show='textLen>350'>您已超出<span style="color: red">{{beyond}}</span>个字</div> -->
        <div style="margin-top: 10px;">
          <el-select v-model="typeName" filterable placeholder="请选择文章分类" multiple filterable clearable :disabled=stateDisabled>
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </div>
        <div class="editCL-footer">
          <el-select v-model="limitName" filterable placeholder="请设置文章权限" @change='limitChange' :disabled=stateDisabled>
            <el-option
              v-for="item in limit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="zc-btn">
            <el-button type='primary' @click='save' :disabled=disabled>发表</el-button>
          </div>
        </div>
        <div class='state-box' v-show="limitName==2">
            <el-select v-model="openStateName" filterable placeholder="请选择公开类型" :disabled=stateDisabled>
              <el-option
                v-for="item in openState"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="teamName" filterable placeholder="请选择团队" v-show='openStateName==0' clearable filterable multiple :disabled=stateDisabled>
              <el-option
                v-for="item in team"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="personalName" filterable placeholder="请选择人员" v-show='openStateName==1'clearable filterable multiple :disabled=stateDisabled>
              <el-option
                v-for="(item,idx) in personal"
                :key="idx"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class='state-box state-boxs' v-show="limitName==0||limitName==2">
            <!-- <el-checkbox-group v-model="checkList">
                <el-checkbox :label="i.juId" v-for='(i,idx) in checkListS' :key='idx'>{{i.juName}}</el-checkbox>
            </el-checkbox-group> -->
            <label>文章操作权限：</label><el-radio :disabled=stateDisabled v-model="checkList" v-for='(i,idx) in checkListS' :label="i.juId" :key='idx'>{{i.juName}}</el-radio>
          </div>
      </div>
      <div :class="active?'editC-left':'editC-lefts'" v-if='isModify'>
        <div class="edit-pic-bar">
          <div v-for='i in picBar'>
            <img :src="i.img" :alt="i.name" :title='i.name' v-if='i.img!=null'>
            <span v-else>{{i.name.substr(i.name.length-2,2)}}</span>
          </div>
        </div>
        <!-- <div class="zc-heiSho iconfont icon-shousuo" @click='shrink'></div> -->
        <div class="edit-header"  v-if='!isEdit'>
          <transition name='fade'>
            <div class="box" v-if="isTrans">+1</div>
          </transition>
          <span class="iconfont icon-chakan" style="font-size: 14px;" title="查看数量">{{info.brows}}</span>
          <span :class="isfabulous?'iconfont icon-xin fabulous-active':'iconfont icon-xin'" style="font-size: 14px;" @click='fabulous()' title="点赞">{{info.praises}}</span>
          <span class="iconfont icon-xiaoxi" style="font-size: 14px;" title="评论数量">{{info.comments}}</span>
          <div class="zc-heiSho iconfont icon-shousuo" @click='shrink'></div>
        </div>
        <div class="edit-title">
          <h2>{{docTitle}}</h2>
        </div>
        <el-upload
                class="avatar-uploader"
                :action="serverUrl"
                name="img"
                :data='fileUpload'
                :show-file-list="false"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :before-upload="beforeUpload">
        </el-upload>
        <el-row v-loading="uillUpdateImg">
        <quill-editor v-model="docContent"
              class="zc-quill"
              disabled
              ref="myQuillEditor"
              :options="editorOptions"
              @blur="handleEditorBlur($event)"
              @focus="handleEditorFocus($event)"
              @change="handleEditorChange($event)">
        </quill-editor>
        </el-row>
      </div>
      <div :class="active?'editC-right':'editC-rights'" v-if='!isEdit'>
        <div class="editCR-header">评论留言</div>
        <div class="editCR-other-msg">
          <div class="editCR-otherM-parent" v-for='i in commontData'>
            <p><img :src="i.var1!=null?i.var1:parentImg" alt=""><span style="color: #eb7350">{{i.frompeople}}：</span>{{i.content}}<span style="display: inline-block;"><span class="reply" @click='reply(i)'>回复</span><span class="dele" @click='dele(i)' v-if='i.isme'>删除</span></span></p>
            <div class="editCR-otherM-child" v-for='j in i.subComment'>
              <img :src="j.var1!=null?j.var1:parentImg" alt=""><span style="color: #eb7350">{{j.frompeople}} <span class="child-reply">回复 <!-- <img :src="j.var2!=null?j.var2:childImg" alt=""> -->{{j.topeople}}：</span></span>
              {{j.content}}<span style="display: inline-block;"><span class="reply" @click='reply(j)'>回复</span>
              <span class="dele" @click='dele(j)' v-if='j.isme'>删除</span></span>
            </div>
          </div>
        </div>
        <div class="editCR-my-msg">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="myMsg"
            maxlength="50"
            show-word-limit
            rows='3'
            @keyup.8.native="keyUp"
          >
          </el-input>
          <div>
            <el-button type='primary' @click='send()'>发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toolbarOptions from './edit.js';
export default {
  watch:{
      'myMsg': {
          deep: true,
          handler: function (val){
            if(val.length<=0){
              this.isReply=false;
            }
          }
      }
  },
	created(){
    this.currentData();
    if(this.$route.query.id!=undefined){
      this.docId=this.$route.query.id;
      this.isEdit=false;
      this.commont();
      this.echoDisplay();
      this.isBtnBJ=false;
    }else{
      this.docTitle=this.$route.query.docTitle;
      this.docContent=this.$route.query.content;
      this.isModify=false;
      this.isBtnBJ=true;
      this.active=false;
    }
	},
  data () {
    return {
      picBar:[],//可见头像的
      isBtnBJ:true,//是否显示编辑按钮
      isModify:true,//是否可编辑
      active:true,//收缩
      childImg:'http://58.30.9.142:48086/files/2019/04/19/20190419131639_logo2.png',
      parentImg:'http://58.30.9.142:48086/files/2019/04/19/20190419131639_logo2.png',
      info:{
        brows:'',//浏览数量
        praises:'',//点赞数量
        comments:'',//评论数量
      },
      isReply:false,//是否回复
      commontData:[],//评论数据
      isTrans:false,//transition
      isfabulous:false,//是否点赞
      fileUpload:{   //附件上传
        file:null
      },
      uillUpdateImg:false,
      serverUrl: 'http://192.168.112.168:8087/file/upload',//上传图片的地址
      docId:'',
      isEdit:true,
      docTitle:'',
      checkList:[],
      checkListS:[],//多选值
      typeOption:[],
      typeName:[],
      limitName:0,
      limit:[
        {
          label:'所有人可见',
          value:0
        },
        {
          label:'仅自己可见',
          value:1
        },
        {
          label:'部分可见',
          value:2
        }
      ],
      stateDisabled:false,//是否有权限编辑
      disabled:false,//是否有编辑文章的权限
      myMsg:'',//评论内容
      myMsgDel:'',//监听删除事件
      myMsgLen:'',
      reviewId:'',//回复人ID
      pcommentId:'',//回复人父节点ID
      docContent:'',
      editorOptions:{//不能编辑时
        modules: {
          toolbar: {
              container: [],  // 工具栏
          }
        }
      },
      editorOption: {
        placeholder: '',
        theme: 'snow',  // or 'bubble'
        modules: {
          toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                  'image': function (value) {
                  if (value) {
                    document.querySelector('.avatar-uploader input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
          }
        }
      },
      textLen:'',
      beyond:'',
      selfKey:[],//当选项为私有时
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
    }
  },
  methods:{
    //删除文档
    delDoc(){
      this.$alert('确定要删除吗？', '', {
        confirmButtonText: '确定',
        callback: action => {
          if(action=='confirm'){
            this.$CGET('/doc/delDoc',{
              docId:this.docId
            },(res)=>{
              if(res.code==200){
                this.$router.push({'path':'/myfile'});
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
    //编辑
    modify(){
      this.isModify=!this.isModify;
    },
    //收缩
    shrink(){
      this.active=!this.active;
    },
    //删除
    dele(i){
      this.$alert('确定要删除吗？', '', {
        confirmButtonText: '确定',
        callback: action => {
          if(action=='confirm'){
            this.$CPOST('/comment/delComment',{
              commentId:i.commentId
            },(res)=>{
              if(res.code==200){
                this.commont();
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
    //回显
    echoDisplay(){
      const loading = this.$loading(this.$store.state.loading);
      this.$CPOST('/doc/findDocById',{
        docId:this.docId
      },(res)=>{
        loading.close();
        let data=res.data;
        let docJuTeamVos=data.docJuTeamVos;
        let docJuUserVos=data.docJuUserVos;
        for(let i=0;i<data.categoryList.length;i++){
          this.typeName.push(data.categoryList[i].categoryId)
        }
        if(data.docJuUserVos==null&&data.docJuTeamVos!=null){
          this.openStateName=0;
          for(let i=0;i<docJuTeamVos.length;i++){
            if(i<10){
              this.picBar.push({
                img:docJuTeamVos[i].pictureBase64,
                name:docJuTeamVos[i].teamName
              })
            }else{
              break
            }
          }
        }else if(data.docJuTeamVos==null&&data.docJuUserVos!=null){
          this.openStateName=1;
          for(let i=0;i<docJuUserVos.length;i++){
            if(i<10){
              this.picBar.push({
                img:docJuUserVos[i].pictureBase64,
                name:docJuUserVos[i].userName
              })
            }else{
              break
            }
          }
        }
        if(data.isPraise==0){//没点
          this.isfabulous=false;
        }else{
          this.isfabulous=true;
        }
        this.docContent=data.docContent;
        this.docTitle=data.docName;
        this.info.brows=data.brows;
        this.info.praises=data.praises;
        this.info.comments=data.comments;
        this.limitName=data.openStatus;
        this.checkList=data.juList[0];
        if(data.docJuTeamVos!=null){
          for(let i=0;i<data.docJuTeamVos.length;i++){
            this.teamName.push(data.docJuTeamVos[i].teamId);
          }
        }
        if(data.docJuUserVos!=null){
          for(let i=0;i<data.docJuUserVos.length;i++){
            this.personalName.push(data.docJuUserVos[i].userId)
          }
        }
        if(data.juList[0]=='bianji'){
          this.disabled=false;
        }else{
          this.disabled=true;
        }
        //加入统一登录时记得修改；如果data.author==登录id就可以编辑
        if(data.author==Base64.decode(this.GetCookie('id'))){
          this.stateDisabled=false;
        }else{
          this.stateDisabled=true;
        }
        
      })
    },
    send(){
      let _d='';
      let msg;
      if(!this.isReply){
        msg=this.myMsg;
      }else{
        msg=this.myMsg.slice(this.myMsgLen);
      }
      if(msg.trim()==''){
        this.$message({
           message: '评论内容不能为空',
           type: 'warning'
        });
      }else if(this.isReply){//回复
        _d={
          docId:this.docId,
          content:msg,
          status:1,
          reviewId:this.reviewId,
          pcommentId:this.pcommentId
        }
      }else{
        _d={
          docId:this.docId,
          content:msg,
          status:0,
        }
      }
      if(_d!=''){
        this.$CPOST('/comment/addComment',_d,(res)=>{
          if(res.code==200){
            this.commont();
            this.myMsg='';
            this.isReply=false;
          }else{
            this.$message({
               message: res.msg,
               type: 'warning'
            });
          }
        })
      }
    },
    keyUp(){
      if(this.myMsg==this.myMsgDel){
        this.myMsg='';
        this.isReply=false;
      }
    },
    //回复
    reply(_d){
      this.reviewId=_d.userId;
      this.pcommentId=_d.pcommentId;
      this.isReply=true;
      this.myMsg='回复'+_d.frompeople+'：';
      this.myMsgDel='回复'+_d.frompeople;
      let len='回复'+_d.frompeople+'：';
      this.myMsgLen=len.length;
    },  
    //评论
    commont(){
      this.$CPOST('/comment/findAllComment',{
        docId:this.docId
      },(res)=>{
        this.commontData=res.data;
      })
    },
    //点赞
    fabulous(){
      this.$CPOST('/praise/toPraise',{
        docId:this.docId
      },(res)=>{
        if(res.code==200){
          this.isfabulous=res.data;
          if(res.data){
            this.info.praises++;
          }else{
            this.info.praises--;
          }
          if(this.isfabulous){
            this.isTrans=true;
            setTimeout(()=>{
              this.isTrans=false;
            },700)
          }
        }else{
          this.$message({
             message: res.msg,
             type: 'warning'
          });
        }
      })
    },
    uploadError() {
        // loading动画消失
        this.quillUpdateImg = false
        this.$message.error('图片插入失败')
    },
    uploadSuccess(res, file){
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.code == 200 && res.data !== null) {
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片  res.info为服务器返回的图片地址
          quill.insertEmbed(length, 'image', res.data)
          // 调整光标到最后
          quill.setSelection(length + 1)
      } else {
          this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    beforeUpload(file) {
      this.fileUpload.file=file;
        // 显示loading动画
        this.quillUpdateImg = true
    },
    //权限改变时
    limitChange(){
      if(this.limitName==1){
        this.checkList=this.selfKey;
      }
      this.typeName=[];
      this.checkList=[];
      this.teamName=[];
      this.personalName=[];
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
        let data=res.data.list;
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
    commit(){
      let _data;
      if(this.limitName==0){
        _data={
          docId:this.docId,
          docName:this.docTitle,
          docContent:this.docContent,//文档内容
          openStatus:this.limitName,//公开状态（0公开，1私有，2部分公开）
          juIdList:JSON.stringify([this.checkList]),//权限id列表
          categoryIdList:JSON.stringify(this.typeName)//分类id列表
        }
      }else if(this.limitName==2){
        if(this.openStateName==0){//对团队
          _data={
            docId:this.docId,
            docName:this.docTitle,
            docContent:this.docContent,//文档内容
            openStatus:this.limitName,//公开状态（0公开，1私有，2部分公开）openStateName
            teamIdList:JSON.stringify(this.teamName),
            juIdList:JSON.stringify([this.checkList]),//权限id列表
            categoryIdList:JSON.stringify(this.typeName)
          }
        }else if(this.openStateName==1){//对个人
          _data={
            docId:this.docId,
            docName:this.docTitle,
            docContent:this.docContent,//文档内容
            openStatus:this.limitName,//公开状态（0公开，1私有，2部分公开）openStateName
            userIdList:JSON.stringify(this.personalName),
            juIdList:JSON.stringify([this.checkList]),//权限id列表
            categoryIdList:JSON.stringify(this.typeName)
          }
        }
      }else{
        _data={
          docId:this.docId,
          docName:this.docTitle,
          docContent:this.docContent,//文档内容
          openStatus:this.limitName,//公开状态（0公开，1私有，2部分公开）
          categoryIdList:JSON.stringify(this.typeName)//分类id列表
        }
      }
      if(this.docId==''){
        this.$CPOST('/doc/addDoc',_data,(res)=>{
          if(res.code==200){
            this.$router.push({'path':'/myfile'});
          }else{
            this.$message({
               message: res.msg,
               type: 'warning'
            });
          }
        })
      }else{
        this.$CPOST('/doc/updateDocByVo',_data,(res)=>{
          if(res.code==200){
            this.$router.push({'path':'/myfile'});
          }else{
            this.$message({
               message: res.msg,
               type: 'warning'
            });
          }
        })
      }
    },
    save(){
      if(this.docTitle==''){
        this.$message({
          message: '请输入文档标题',
          type: 'warning'
        });
      }else if(this.docContent==''){
        this.$message({
          message: '请输入文档内容',
          type: 'warning'
        });
      }else{
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
          if(this.checkList.length<=0){
            this.disable=true;
            this.$message({
              message: '至少选择一个权限',
              type: 'warning'
            });
          }else if(this.openStateName==0){
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
    },
    handleInputChange () {},
    handleEditorBlur () {},
    handleEditorFocus () {},
    handleEditorChange (e) {
      /*this.textLen = e.text.length - 1;
      this.beyond = this.textLen - 350;
      if (this.textLen > 350) {
        this.info.evId = '';
      } else {
        this.info.evId = this.evList[0].evId;
      }*/
    },
  }
}
</script>

<style>
  .zc-quill .ql-editor{
    padding: 40px !important;
  }
  .zc-quill{
    box-shadow: 0 0 10px 1px #eee !important;
  }
  .zc-quill .ql-toolbar{
    display: none !important;
  }
  .zc-quill .ql-container{
    border: none !important;
  }
  .ql-container{
    min-height: 373px !important;
  }
  .editCR-my-msg textarea{
    resize: none;
  }
</style>
<style scoped>
.edit{
  background: #fff;
}
.edit-title{
  margin-bottom: 10px;
}
.edit-header{
  position: relative;
  line-height: 40px;
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
.edit-header span{
  margin-right: 10px;
  cursor: pointer;
}
.edit-header span:before{
  margin-right: 3px;
}
.edit{
  padding:40px;
}
.edit-content{
  display: flex;
  height: 100%;
}
.edit-content{
  display: flex;
  flex-wrap: wrap;
  height: 100%;
}
.editC-left{
  width: 70%;
  position: relative;
  transition:width 1s;
  -moz-transition:width 1s; /* Firefox 4 */
  -webkit-transition:width 1s; /* Safari and Chrome */
  -o-transition:width 1s; /* Opera */
}
.editC-lefts{
  width: 100%;
  position: relative;
  transition:width 1s;
  -moz-transition:width 1s; /* Firefox 4 */
  -webkit-transition:width 1s; /* Safari and Chrome */
  -o-transition:width 1s; /* Opera */
}
.editC-right{
  flex: 1;
  margin-left: 30px;
  transition:width 1s;
  -moz-transition:width 1s; /* Firefox 4 */
  -webkit-transition:width 1s; /* Safari and Chrome */
  -o-transition:width 1s; /* Opera */
}
.editC-rights{
  width: 100%;
}
.editCR-header{
  line-height: 40px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
.editCR-otherM-parent{
  padding: 7px 0;
  line-height: 20px;
}
.editCR-otherM-parent p:first-child{
  /*display: flex;*/
}
.editCR-otherM-parent img{
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
  vertical-align: middle;
}
.editCR-otherM-parent:last-child{
  border-bottom: none;
}
.editCR-otherM-child{
  margin: 5px 0 0 40px;
  line-height: 20px;
}
.editCR-other-msg{
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #eee;
}
.editCR-my-msg div:last-child{
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.editCR-my-msg div:last-child button{
  margin-top: 10px;
  height: 30px;
  line-height: 4px;
}
.editCL-footer{
  margin: 10px 0 15px 0;
  display: flex;
}
.editCL-footer .el-select{
  margin-right: 15px;
}
.editCL-footer button{
  margin-left: 20px;
}
.editCL-footer .zc-btn{
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.state-box{
    margin-bottom: 20px;
}
.state-box span:first-child{
  color: red;
  font-size: 18px;
  margin-right: 10px;
}
.state-box .el-select{
  margin-right: 10px;
}
.fabulous-active{
  color: red;
}
.box {
  position: absolute;
  width: 10px;
  height: 10px;
  color: red;
  right: 60px;
  top: -17px;
  font-weight: bold;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
.reply{
  color: #79a5e5;
  margin-left: 20px;
  cursor: pointer;
  display: inline-block;
}
.child-reply{
  color: #999999;
}
.dele{
  color: red;
  margin-left: 10px;
  cursor: pointer;
  display: inline-block;
}
.zc-heiSho{
  /*position: absolute;*/
  cursor: pointer;
  right: -20px;
  top: 9px;
  color: #5485ED;
  font-size: 20px;
}
.edit-pic-bar{
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.edit-pic-bar img{
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-right: -15px;
  border: 1px solid #fff;
  border-radius: 50%;
  vertical-align: middle;
}
.edit-pic-bar span{
  vertical-align: middle;
  text-align: center;
  line-height: 40px;
  display: inline-block;
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin-right: -15px;
  border: 1px solid #fff;
  border-radius: 50%;
  background: #f5f5f5;
}
</style>
