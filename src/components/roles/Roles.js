import axios from "axios"


export default {
  data() {
    return {
      rolesData: [
        {
          roleName: '2016-05-02',
          roleDesc: '王小虎',
        }
      ]
    }
  },
  created(){
    this.getRolesData()
  },
  methods:{
    //获取权限列表数据
    async getRolesData(){
      let res = await axios.get('roles')
      console.log(res);
      this.rolesData = res.data.data
    },
    indexMethod(index){
      return index
    }
  }
}