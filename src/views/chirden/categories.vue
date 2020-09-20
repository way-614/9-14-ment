<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="tjadd">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table class="treetable" :data="cartlist"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      :show-index="true"
      :show-row-hover="false"
      border
      index-text="#">
      <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="" v-else style="color:lightgreen"></i>
      </template>
      <template slot="slot" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
      </template>
      <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </template>
      </tree-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>


      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        @close="delbas"
        width="50%"
        >
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="分类名称：" prop="cat_name">
                <el-input v-model="ruleForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类：">
              <!-- options绑定数据源 -->
                <el-cascader
                  v-model="cleckeys"
                  :options="parentcatlist"
                  :props="casecprops"
                  clearable
                  change-on-select
                  expand-trigger="hover"
                  @change="parenthandleChange"></el-cascader>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addcate">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>



  </div>
</template>

<script>
export default {
  data() {
    return {
      cleckeys:[],
      queryinfo: {
        type: "3",
        pagenum: 1,
        pagesize: 3,
      },
      cartlist: [],//商品分类的列表数据
      total:0,//总数据条数
      dialogVisible:false,
      parentcatlist:[],
      casecprops:{
        value:"cat_id",
        label:"cat_name",
        children:"children",
      },
      columns:[
          {
              label:"分类名称",
              prop:"cat_name"
          },
          {
              label:"是否有效",
              type:"template",
              template:"isok"
          },
          {
              label:"排序",
              type:"template",
              template:"slot"
          },
          {
              label:"操作",
              type:"template",
              template:"opt"
          }
      ],
      ruleForm:{
        cat_pid:0,
        cat_name:"",
        cat_level:0,
      },
      rules:{
          cat_name:[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ]
      }
    };
  },
  created() {
      this.getlistinfo();
  },
  methods: {
    async getlistinfo() {
      let { data: res } = await this.$http.categories(this.queryinfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表数据失败");
      }
      console.log(res)
      this.cartlist = res.data.result
      this.total = res.data.total
    },
    handleSizeChange(newSize){
        this.queryinfo.pagesize = newSize
        this.getlistinfo();
    },
    handleCurrentChange(newName){
        this.queryinfo.pagenum = newName
        this.getlistinfo();
    },
    // 点击按钮，展示添加分类
    tjadd(){
        this.dialogVisible = true
        this.getinfosdas();
    },
    async getinfosdas(){
        let { data: res } = await this.$http.categories({type:2});
        if(res.meta.status!==200){
            return this.$message.error("获取父级分类失败")
        }
        console.log(res.data)
        this.parentcatlist = res.data
    },
    parenthandleChange(){
      console.log(this.cleckeys)
      if(this.cleckeys.length>0){
        this.ruleForm.cat_pid = this.cleckeys[this.cleckeys.length-1];
        this.ruleForm.cat_level = this.cleckeys.length
      }else{
        this.ruleForm.cat_pid = 0
        this.ruleForm.cat_level = 0
      }
    },
    addcate(){
      console.log(this.ruleForm)
      this.$refs.ruleForm.validate(async vlde=>{
        if(!vlde){
          return 
        }

        let {data:res} = await this.$http.categoriesdbs(this.ruleForm)
        if(res.meta.status!==201){
          return this.$message.error('添加分类失败')
        }

        this.$message.success('添加分类成功')
        this.getinfosdas();

        this.dialogVisible=false

      })
    },
    delbas(){
      this.$refs.ruleForm.resetFields();
      this.cleckeys = []
      this.ruleForm.cat_pid=0
      this.ruleForm.cat_level =0
    }
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
}
.treetable{
    margin: 15px 0px;
}
</style>