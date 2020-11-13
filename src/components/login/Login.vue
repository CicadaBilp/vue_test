
<template>
  <!-- el-row就是一行,el-col就是列 -->
  <el-row type="flex" justify="center" align="middle">
    <el-col :span="8">
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="startLogin">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
//引入axios
import axios from 'axios'


export default {
  data() {
    return {
      //表单数据对象,其属性为表单元素绑定的变量
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        //表单校验:根据form-item的prop属性校验
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
      },
    };
  },
  methods: {
    startLogin() {
      //点击登录后,获取到这个大表单组件调用validate方法,该方法也是校验,是登录之前的整体校验
      this.$refs.loginForm.validate( async (valid) => {
        if(!valid){
          return 
        }
        //表单校验通过,发送请求进行登录验证
        const url = 'http://localhost:8888/api/private/v1/login'

        let res = await axios.post(url,this.loginForm)
          //返回的数据进行判断是否登录成功
          if(res.data.meta.status === 200){
            //每次登录成功,后端接口会返回一个token指令,将它存储在本地用于访问其他路由时判断
            localStorage.setItem('token',res.data.data.token)
            //提示信息
            this.$message({
              message: '恭喜你，登录成功',
              type: 'success',
              duration:1000
            })
            //登录成功进行跳转
            this.$router.push('/home')
          }else{
            this.$message.error('错了哦，登录失败');
            duration:1000
          }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    },
  },
};
</script>

<style scoped>

.el-row {
  height: 100%;
  background-color: #2d434c;
}
.el-col {
  background-color: #fff;
  padding: 30px 50px 30px 0;
  border-radius: 15px;
}
</style>