<template>
  <div>
    <el-button plain type="success" @click="showAddCate">添加分类</el-button>
    <!-- 商品分类表格组件 -->
    <el-table :data="cateData" style="width: 100%">
      <!-- 合并插件列和分类 -->
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        prop="cat_name"
        label="分类名称"
        width="180"
        treeKey="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indent-size="20"
      >
      </el-table-tree-column>
      <el-table-column label="是否有效" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.cat_deleted ? "否" : "是" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level == 0">一级</span>
          <span v-if="scope.row.cat_level == 1">二级</span>
          <span v-if="scope.row.cat_level == 2">三级</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加商品分类对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="dialogAddCateVisible">
      <el-form :model="addCateForm" label-width="70px">
        <el-form-item label="分类名称">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- 此处显示已有一二级分类,用级联选择器组件 ,给它添加属性props用于设置其字段-->
          <el-cascader :options="options2" :props="defaultProps" clearable v-model="addCateForm.cat_pid_arr"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
//引入树插件
import Vue from "vue";
import ElTreeGrid from "element-tree-grid";
//在vue全局注册该组件
Vue.component(ElTreeGrid.name, ElTreeGrid);

export default {
  data() {
    return {
      //商品分类列表数据
      cateData: [
        {
          cat_name: "大春哥",
          cat_delete: "春",
          cat_level: "1级",
        },
      ],
      //用于决定是否展示添加商品分类对话框
      dialogAddCateVisible: false,
      //添加商品分类对话框的表单(用于收集数据)
      addCateForm: {
        cat_name:'',
        cat_pid_arr:[]
      },
      //级联选择器数据示例
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
          ],
        },
      ],
      //绑定到对话框中的级联选择器的数据
      options2:[],
      //该属性设置级联选择器内部的字段
      defaultProps:{
        value:"cat_id",
        label:"cat_name"
      }
    };
  },
  created() {
    this.getCategoryData();
    this.getCategoryData2();
  },
  methods: {
    //获取全部商品分类数据的第一页
    async getCategoryData() {
      let res = await axios.get("categories", {
        params: {
          type: 3,
          pagenum: 1,
          pagesize: 4,
        },
      });
      console.log(res);
      this.cateData = res.data.data.result;
    },
    //获取全部一级和二级商品分类数据
    async getCategoryData2() {
      let res = await axios.get("categories", {
        params: {
          type: 2,
        },
      });
      console.log(res);
      this.options2 = res.data.data
    },
    //点击添加分类,弹出对话框
    showAddCate(){
      this.dialogAddCateVisible = true
    },
    //点击确定按钮,发送请求,添加商品分类
    async addCate(){
      //获取收集的数据
      let {cat_name,cat_pid_arr} = this.addCateForm
      let res = await axios.post('categories',{
        cat_name,
        cat_level:cat_pid_arr.length,
        cat_pid:cat_pid_arr[cat_pid_arr.length-1]
      })
      // console.log(res);
      if(res.data.meta.status === 201){
         this.$message({
           message:'添加商品分类成功',
           type:'success',
           duration:800
         })
         this.getCategoryData()
      }
    }
  },
};
</script>

<style>
</style>