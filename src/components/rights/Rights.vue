<template>
  <el-table :data="rightsData" style="width: 100%">
    <el-table-column type="index" :index="indexMethod"> </el-table-column>
    <el-table-column prop="authName" label="权限名称" width="180">
    </el-table-column>
    <el-table-column prop="path" label="路径" width="180"> </el-table-column>
    <el-table-column prop="level" label="等级">
      <!-- 这里需要自定义列,处理level的值变成等级一二三再显示 -->
      <template slot-scope="scope">
        <span v-if="scope.row.level==0">一级</span>
        <span v-else-if="scope.row.level==1">二级</span>
        <span v-else>三级</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
//导入axios
import axios from "axios";

export default {
  data() {
    return {
      rightsData: [
        {
          authName: "2016-05-02",
          path: "王小虎",
          level: "上海市普陀区金沙江路 1518 弄",
        },
      ],
    };
  },
  created() {
    this.getRightsData();
  },
  methods: {
    //请求权限列表数据
    async getRightsData() {
      let res = await axios.get("rights/list");
      this.rightsData = res.data.data;
    },
    indexMethod(index){
      return index
    }
  },
};
</script>

<style>
</style>