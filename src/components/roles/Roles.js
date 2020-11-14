import axios from "axios"


export default {
  data() {
    return {
      rolesData: [
        {
          roleName: '2016-05-02',
          roleDesc: '王小虎',
        }
      ],
      dialogRolesVisible: false,
      AllRightsdata: [
        {
          id: 1,
          label: '一级 1',
          children: [
            {
              id: 4,
              label: '二级 1-1',
              children: [
                {
                  id: 9,
                  label: '三级 1-1-1'
                }, 
                {
                  id: 10,
                  label: '三级 1-1-2'
                }
              ]
            }
          ]
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleID:0
    }
  },
  created() {
    //获取角色的信息
    this.getRolesData()
    //获取所有权限信息
    this.getRightsDataTree()
  },
  methods: {
    //获取权限列表数据
    async getRolesData() {
      let res = await axios.get('roles')
      console.log(res);
      this.rolesData = res.data.data
    },
    indexMethod(index) {
      return index
    },
    //页面加载发送请求获取所有的权限信息,树结构类型
    async getRightsDataTree(){
      let res = await axios.get('rights/tree')
      //返回的树赋值给树组件绑定的变量
      this.AllRightsdata = res.data.data
    },
    //点击分配权限按钮,弹出对话框,对角色权限进行设置
    setRights(row){
      //收到当前角色数据对象后先遍历取出其所有第三级权限的id,准备交给tree组件选中这些权限节点并显示
      let idArr = []
      this.roleID = row.id
      row.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            idArr.push(item3.id)
          })
        })
      })
      this.dialogRolesVisible = true
      //点击分配权限按钮后,开启设置权限对话框,
      //但此时不能获取到tree组件(因为此时开始渲染tree组件vue的dom渲染是异步的)而$refs只有当组件渲染完成才生效
      //可利用组件的$nextTick方法,在组件渲染完成后再回调想要的操作
      this.$nextTick(()=>{
        //tree组件提供的方法,传入节点的key即id可将其选中
        this.$refs.tree.setCheckedKeys(idArr)
      })
    },
    //设置完成,点击确定向后台发送设置的权限信息
    async sendRights(){
      //通过tree组件提供的方法,获取到被选中的节点和处于半选状态的权限节点的id
      let key1 = this.$refs.tree.getCheckedKeys()
      let key2 = this.$refs.tree.getHalfCheckedKeys()
      let keys = key1.concat(key2)
      let res = await axios.post(`roles/${this.roleID}/rights`,{
        //将获取到的更改完成的权限节点id数组拼成字符串,作为post参数传入请求
        rids:keys.join(',')
      })
      //console.log(res);
      if(res.data.meta.status === 200){
        this.dialogRolesVisible = false
        //刷新
        this.getRolesData()
        //提示
        this.$message({
          message:'角色权限设置成功',
          type:'success',
          duration:800
        })
      }
    }
  }
}