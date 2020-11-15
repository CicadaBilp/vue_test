<template>
  <div>
    <el-button @click="toAddGoods" type="success" plain>添加商品</el-button>
    <el-table :data="goodsData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="goods_price" label="商品价值" width="180">
      </el-table-column>
      <el-table-column prop="goods_number" label="商品数量"> </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope"> 
          <span>{{scope.row.add_time | dateFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
import Vue from 'vue'
//导入moment,时间过滤使用moment
import moment from 'moment'

//注册过滤器,对收到的时间进行过滤处理
Vue.filter('dateFilter',res=>{
  return moment(res).format('YYYY-MM-DD')
})

export default {
  data() {
    return {
      goodsData: [
        {
          add_time: "2016-05-02",
          goods_name: "王小虎",
          goods_price:15,
          goods_number: " 1518 弄",
        },
      ],
    };
  },
  created(){
    this.getGoodsData()
  },
  methods:{
    //获取商品列表
    async getGoodsData(){
      let res = await axios.get('goods',{
        params:{
          pagenum:1,
          pagesize:4
        }
      })
      //console.log(res);
      this.goodsData = res.data.data.goods
    },
    //点击添加商品按钮,跳转路由到添加商品页面
    toAddGoods(){
      this.$router.push('/goods-add')
    }
  }
};
</script>

<style>
</style>
