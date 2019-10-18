import Vue from 'vue';
import vuex from 'vuex';
Vue.use(vuex);
let store = new vuex.Store({
	state:{
		etSetList:[],
		id:{
			user:'03af4af55ce14eee82c02b66ba30c226',//员工绩效考评
            pd:'074a355b40c111e99ff9ac1f6b6c77e8',//产品
            am:'14ca96d6552a42df86d4539bceb2be32',//部门绩效考评
            project:'2ac19edfef91411384f6cef6609534a5'//项目考评
		},
		loading:{
	          lock: true,
	          text: 'Loading',
	          spinner: 'el-icon-loading',
	          background: 'rgba(0, 0, 0, 0.7)'
	        }
	}
})
export default store