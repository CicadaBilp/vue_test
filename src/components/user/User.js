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
        headers: {
          Authorization: localStorage.getItem("token"),
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
      const config = {
        headers:{
          Authorization:localStorage.getItem('token')
        }
      }
      let res = await axios.post(url,this.addUserForm,config)
      // axios.post('http://localhost:8888/api/private/v1/users',this.addUserForm,{
      //   headers:{
      //     Authorization:localStorage.getItem('token')
      //   }
      // })
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
      // .then(res=>{
      //   if(res.data.meta.status === 201){
      //     //隐藏对话框
      //     this.dialogAddUserVisible =false
      //     //提示信息
      //     this.$message({
      //       message:'添加用户成功',
      //       type:'success',
      //       duration:800
      //     })
      //     //刷新用户信息
      //     this.getUserData()
      //   }  
      // })
    }
  },
};