<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-alert title="添加商品信息" type="info" :closable="false" center show-icon></el-alert>

      <el-steps :space="200" :active="activeIndex-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormref"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" :tab-position="tabPosition" :before-leave="beforetableave" @tab-click="tabclicked">
          <el-tab-pane label="用户管理" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="ruleForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="ruleForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="ruleForm.goods_cat"
                :options="cartlist"
                :props="cateprops"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name" v-for="item in manytabdata" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlytabdata" :key="item.attr_id">
                  <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
              <el-upload
                :on-success="handsuccess"
                :action="unlodurl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headerobj"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
               <quill-editor v-model="ruleForm.goods_introduce">

               </quill-editor>
                <el-button type="primary" style="margin-top:10px" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
        title="图片预览"
        :visible.sync="preverVisible"
        width="50%"
        >
        <span><img :src="preverpath" class="prerimg" alt=""></span>
        </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preverVisible:false,
      activeIndex: "0",
      tabPosition: "left",
      ruleForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], //商品的分类数组
        pics:[],
        goods_introduce:"",//商品的描述
        attrs:[

        ]
      },
      rules: {
        goods_name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "商品重量不能为空", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "商品分类不能为空", trigger: "blur" },
        ],
      },
      cartlist: [],
      cateprops: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      manytabdata:[],
      onlytabdata:[],
      unlodurl:"http://127.0.0.1:8888/api/private/v1/upload",
      headerobj:{
          Authorization:window.sessionStorage.getItem('token')
      },
      preverpath:""
    };
  },
  created() {
    this.getcatlist();
  },
  computed:{
      cutecartid(){
          if(this.ruleForm.goods_cat.length===3){
              return this.ruleForm.goods_cat[2]
          }
          return null
      }
  },
  methods: {
    async getcatlist() {
      //获取所有商品分类数据
      let { data: res } = await this.$http.categories();
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败");
      }
      this.cartlist = res.data;
      console.log(this.cartlist);
    },
    handleChange() {
      //级联选择器change事件
      console.log(this.ruleForm.goods_cat);
      if (this.ruleForm.goods_cat.length !== 3) {
        this.ruleForm.goods_cat = [];
      }
    },
    beforetableave(activeName,oldActiveName) {
        if(oldActiveName=="0"&&this.ruleForm.goods_cat.length!==3){
            this.$message.error('请先选择商品分类')
            return false
        }
    },
    async tabclicked(){
        switch (this.activeIndex){
            case "1":
            let {data:res} = await this.$http.getgories({sel:"many"},this.cutecartid)
            if(res.meta.status!==200){
                return this.$message.error('获取参数列表信息失败')
            }
            res.data.forEach(item=>{
                item.attr_vals= item.attr_vals.length===0? [] :item.attr_vals.split(' ')
            })
            console.log(res.data)
            this.manytabdata = res.data
            break;
            case "2":
            let {data:res1} = await this.$http.getgories({sel:"only"},this.cutecartid)
            if(res1.meta.status!==200){
                return this.$message.error('获取参数列表信息失败')
            }
            this.onlytabdata = res1.data
            break;
        }
    },
    handlePreview(file){//处理图片预览效果
        // console.log(file)
        this.preverpath = file.response.data.url
        this.preverVisible=true
    },
    handleRemove(file){//移除图片操作
        console.log(file)
        const filepath = file.response.data.tmp_path
        const i = this.ruleForm.pics.findIndex(x=>
        x.pic==filepath)
        this.ruleForm.pics.splice(i,1)
        // console.log(this.ruleForm)
    },
    handsuccess(response){//图片上传成功事件
        // console.log(response)
        const picinfo = {pic:response.data.tmp_path}
        this.ruleForm.pics.push(picinfo)
        // console.log(this.ruleForm)
    },
    add(){
        this.$refs.ruleFormref.validate(async valid=>{
            if(!valid){
                return this.$message.error('请填写必要的表单项')
            }
            const infos = Object.assign({},this.ruleForm)
            infos.goods_cat = infos.goods_cat.join(',')
            this.manytabdata.forEach(item=>{
                const obj = {attr_id:item.attr_id,attr_vals:item.attr_vals.join(' ')}
                this.ruleForm.attrs.push(obj)
            })
            this.onlytabdata.forEach(item=>{
                const info = {attr_id:item.attr_id,attr_vals:item.attr_vals}
                this.ruleForm.attrs.push(info)
            })
            infos.attrs = this.ruleForm.attrs
            console.log(infos)

            let {data:res} = await this.$http.addgoodsbas(infos)
            console.log(res)
            if(res.meta.status!==201){
                return this.$message.error('添加商品失败')
            }
            this.$message.success('添加商品成功')
            this.$router.push('/goods')
        })
    }
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
}
.el-checkbox{
    margin: 0px 10px 0px 0px !important;
}
.prerimg{
    width: 100%;
}
.el-tab-pane /deep/ .ql-editor{
    min-height: 260px;
}
</style>