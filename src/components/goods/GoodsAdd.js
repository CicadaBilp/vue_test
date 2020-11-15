import axios from 'axios'
//引入富文本编辑组件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {quillEditor} from 'vue-quill-editor'

export default {
  //在当前组件注册
  components:{
    quillEditor
  },
  data(){
    return {
      active:1,
      activeName:'one',
      //添加商品的表单绑定的对象
      addGoodsForm:{
        goods_name:'',
        goods_cat:[],
        goods_price:'',
        goods_number:'',
        goods_weight:'',
        goods_introduce:'',
        pics:[],
        //单选框绑定的变量
        radio:true
      },
      //级联选择器的数据
      options: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }]
      }],
      //级联选择器设置关键字段
      defaultProps:{
        value:'cat_id',
        label:'cat_name'
      },
      //上传图片
      dialogImageUrl: '',
      dialogVisible: false,
      headers:{
        Authorization : localStorage.getItem('token')
      }

    }
  },
  created(){
    this.getCateData()
  },
  methods:{
    clickTab(tab){
      this.active = +tab.index+1
    },
    //点击tab中的下一步,同时改变进度数据和tab数据
    next(index,name){
      this.active = index
      this.activeName = name 
    },
    //获取到三级的所有商品分类数据
    async getCateData(){
      let res = await axios.get('categories',{
        params:{
          type:3
        }
      })
      console.log(res);
      this.options = res.data.data
    },
    //上传组件中的方法,点击删除图标触发
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //上传组件的方法,点击预览图标触发
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传成功后触发,上传成功后会返回上传的图片在服务器的地址,需要将此地址放入addGoodsForm中存起来
    upLoadSuccess(res){
      console.log(res);
      this.addGoodsForm.pics.push({
        pic:res.tmp_path
      })
    },
    async addGoods(){
      const {
        goods_name,
        goods_cat,
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
      } = this.addGoodsForm

      let res = await axios.post('goods',{
        goods_name,
        goods_cat:goods_cat.join(','),
        goods_price,
        goods_number,
        goods_weight,
        goods_introduce,
        pics,
      })
      //console.log(res);
      if(res.data.meta.status === 201){
        this.$message({
          message:'添加商品成功',
          type:'success',
          duration:800
        })
        //跳转回goods
        this.$router.push('/goods')
      }
    }
  }
}