<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="8"><img src="../../assets/009.jpg" alt="" /></el-col>
        <el-col :span="8"><h1>电商后台管理系统</h1></el-col>
        <el-col :span="8" class="col-r"
          >肉蛋葱鸡<a @click.prevent="logout" href="">退出</a></el-col
        >
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="2"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router='true'
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="user">用户列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">角色列表</el-menu-item>
            <el-menu-item index="rights">权限列表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
        </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  methods: {
    //点击退出触发事件
    logout() {
      this.$confirm("此操作将退出当前账户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        //点击确定退出,执行then
        .then(() => {
          //先清除本次登录的token
          localStorage.removeItem("token");
          //导航跳转
          this.$router.back();
          //提示信息退出成功
          this.$message({
            message: "退出成功",
            type: "success",
            duration: 800,
          });
        })
        //点击取消执行catch
        .catch(() => {
          this.$message({
            message: "取消成功",
            type: "info",
            duration: 800,
          });
        });
    },
  },
};
</script>

<style scoped lang='less'>
.el-container {
  height: 100%;
}
.el-header {
  background-color: cadetblue;
  padding: 0;
  img {
    height: 60px;
    display: block;
  }
  h1 {
    line-height: 60px;
    text-align: center;
    color: #fff;
  }
  .col-r {
    text-align: right;
    line-height: 60px;
    padding-right: 30px;
  }
}
.el-aside {
  background-color: aquamarine;
}
.el-main {
  background-color: blueviolet;
}
</style>