<template>
  <div class="copy">
    <div class="copy-content">
      <el-input v-model='contetn'></el-input>
      <el-button type='primary' v-clipboard="contetn" @success="success">复制</el-button>
      <div class="close" @click='close()'>x</div>
    </div>
  </div>
</template>

<script>
export default {
  props:[
    'copy'
  ],
  watch:{
      'copy': {
          deep: true,
          handler: function (val){
            this.contetn=val
          }
      }
  },
	created(){
	},
  data () {
    return {
      contetn:''
    }
  },
  methods:{
    close(){
      this.$emit('vshow');
    },
    success(e) {
      this.$message({
          message: '复制成功',
          type: 'success'
        });
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
    display: flex;
    width: 500px;
    height: 80px;
    background: #f5f7fa;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 20px;
  }
  .copy-content button{
    margin-left: 20px;
    margin-right: 20px;
    height: 100%;
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
</style>
