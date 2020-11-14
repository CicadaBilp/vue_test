//引入axios
import axios from "axios";

export default {
  data() {
    return {
      //用户信息表格组件绑定的数据(数组)
      tableData: [
        {
          username: "大春哥",
          email: "aaa@qq.com",
          mobile: "123456789",
        },
      ],
      total: 0,
      currpage: 1,
      searchUser: "",
      //添加用户信息的表单组件绑定的数据(对象)
      addUserForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //用于决定添加用户对话框是否显示
      dialogAddUserVisible:false,
      rules:{
        //校验表单
        username: [
          //require表示是否必填 ; trigger表示什么时候触发校验
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 5,
            message: "用户名在 3 到 5 个字符之间",
            trigger: "blur",
          },
        ],
        password: [
          //require表示是否必填 ; trigger表示什么时候触发校验
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 6,
            message: "密码在 3 到 6 个字符之间",
            trigger: "blur",
          },
        ],
        //校验邮箱
        email:{
          pattern:/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
          message: "格式不正确",
          trigger: "blur",
        },
        //校验手机号
        mobile:{
          pattern:/^1[3|4|5|7|8][0-9]{9}$/,
          message:'格式不正确',
          trigger:'blur'
        }
      },
      value1:true,
      //用于决定编辑用户对话框是否显示
      dialogEditUserVisible:false,
      //编辑用户信息的表单组件绑定的数据(对象)
      editUserForm:{
        username:'大春哥',
        email:'',
        mobile:'',
        id:0
      }
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    //向后端发送get请求,获取user数据
    async getUserData(pagenum = 1, query = "") {
      //get请求中url地址,配置对象(包含参数对象和请求头对象)
      const url = "http://localhost:8888/api/private/v1/users"
      const config =  {
        params: {
          query,
          pagenum,
          pagesize: 2,
        },
      }
      let res = await axios.get(url,config)
      
      //请求成功获取到用户信息数据
      this.tableData = res.data.data.users;
      //获取到用户数据总数保存赋值给total
      this.total = res.data.data.total;
      //将本次请求的页码赋值给当前页currpage
      this.currpage = res.data.data.pagenum;
  
    },
    //组件中自带的事件,当前页改变时触发(即点击分页盒子),触发后发送请求获取此页数据
    //该事件会默认接收改变的当前页(用curr接收)
    currentPageChange(curr) {
      //调用getUserData方法传入当前页
      this.getUserData(curr, this.searchUser);
    },
    //点击搜索按钮后获取到搜索框内容(双向绑定到data中的变量),调用getUserData方法
    queryUser() {
      this.getUserData(1, this.searchUser);
    },
    //点击添加用户弹出对话框(更改dialogAddUserVisible为true)
    showAddUser(){
      this.dialogAddUserVisible = true
    },
    //点击确定,发送请求添加用户
    async addUser(){
      const url = 'http://localhost:8888/api/private/v1/users'
      let res = await axios.post(url,this.addUserForm)
      if(res.data.meta.status === 201){
        //隐藏对话框
        this.dialogAddUserVisible =false
        //提示信息
        this.$message({
          message:'添加用户成功',
          type:'success',
          duration:800
        })
        //刷新用户信息
        this.getUserData()
      }  
    },
    //点击删除按钮,进行删除用户
    async delUser(row){
      try {
        //获取到传递的当前行数据对象
        const id = row.id
        //这个点击的操作当点击确定就正常,当点取消会出现异常
        await this.$confirm("此操作将删除当前用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true,
        })
        //确定删除,要发送请求进行删除
        let res = await axios.delete(`http://localhost:8888/api/private/v1/users/${id}`)
        //console.log(res);
        //判断返回的res是否删除成功
        if(res.data.meta.status === 200){
          this.$message({
            message: "删除成功",
            type: "success",
            duration: 800,
          })
          //更新用户列表页
          this.getUserData()
        }

      } catch (error) {
        //catch这里是对await中异步操作出现异常的处理
        this.$message({
          message: "取消成功",
          type: "info",
          duration: 800,
        })
      }

    },
    //点击状态开关,发送请求修改状态
    async stateChange(row){
      const id = row.id
      const mg_state = row.mg_state
      //进行请求修改
      let res = await axios.put(`http://localhost:8888/api/private/v1/users/${id}/state/${mg_state}`,null)
      //console.log(res);
      //请求发送成功后,判断返回状态码
      if(res.data.meta.status === 200){
        //删除成功,提示
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 800,
        })
        //刷新页面
        this.getUserData(this.currpage)
      }
    },
    //点击编辑按钮(通过按钮将本条用户数据传递到函数,将其信息给编辑的表单显示),弹出用户信息对话框进行编辑
    showEditUser(row){
      console.log('aaa');
      this.dialogEditUserVisible = true
      const {username,email,mobile,id} = row
      this.editUserForm.username = username
      this.editUserForm.email = email
      this.editUserForm.mobile = mobile
      this.editUserForm.id = id
    },
    //编辑完成点击确定,发送修改信息到后端进行修改
    async editUser(){
      //从data中获取编辑表单的数据对象中需要的数据
      const {mobile,email,id} = this.editUserForm
      //发送请求
      let res = await axios.put(`/users/${id}`,{mobile,email})
      if(res.data.meta.status === 200){
        this.dialogEditUserVisible = false
        //提示
        this.$message({
          message:'编辑成功',
          type:'success',
          duration:800
        })
        //更新
        this.getUserData(this.currpage)
      }
    },
    closeDialogAddUser(){
      this.$refs.addForm.resetFields()
    }
    //nihao
  },
}; 