<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数！" :closable="false" show-icon type="warning"></el-alert>
      <el-row class="wz-opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            expand-trigger="hover"
            :options="catlist"
            :props="cartprops"
            v-model="selectedOptionsbas"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isbtndisabled" @click="addialogVisible=true">添加参数</el-button>
            <!-- 动态参数表格 -->
               <el-table :data="manytabdata" border stripe>
                <el-table-column type="expand">
                  <!-- 循环渲染tag标签 -->
                  <template slot-scope="scope">
                    <el-tag 
                    closable
                    @close="handremove(index,scope.row)"
                    style="margin-left:15px;margin-bottom:10px"
                    v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                    <!-- 输入的文本框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button style="margin-left:15px" v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showdialg(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="delbutes(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isbtndisabled" @click="addialogVisible=true">添加属性</el-button>
            <!-- 静态属性表格 -->
              <el-table :data="onlytabdata" border stripe>
                <el-table-column type="expand">
                  <!-- 循环渲染tag标签 -->
                    <template slot-scope="scope">
                    <el-tag 
                    closable
                    @close="handremove(index,scope.row)"
                    style="margin-left:15px"
                    v-for="(item,index) in scope.row.attr_vals" :key="index">{{item}}</el-tag>
                    <!-- 输入的文本框 -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button style="margin-left:15px" v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showdialg(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="delbutes(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
        </el-tabs>
    </el-card>



    <!-- 添加参数的对话框 -->
    <el-dialog
    @close="addclose"
      :title="'添加'+titletext"
      :visible.sync="addialogVisible"
      width="50%"
      >
      <el-form :model="addruleForm" :rules="rulesbas" ref="ruleFormref" label-width="100px">
      <el-form-item :label="titletext" prop="attr_name">
        <el-input v-model="addruleForm.attr_name"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="qued">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 修改对话框 -->
    <el-dialog
    @close="editclose"
      :title="'修改'+titletext"
      :visible.sync="editialogVisible"
      width="50%"
      >
      <el-form :model="editruleForm" :rules="editrulesbas" ref="editruleFormref" label-width="100px">
      <el-form-item :label="titletext" prop="attr_name">
        <el-input v-model="editruleForm.attr_name"></el-input>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editbsble">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addialogVisible:false,//对话框
      activeName:"many",
      catlist: [],
      cartprops: {
        //级联选择框的配置对象
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectedOptionsbas:[],//级联选择框的双向绑定
      manytabdata:[],
      onlytabdata:[],
      rulesbas:{
        attr_name:[{required: true, message: "请输入参数名称", trigger: "blur"}]
      },
      addruleForm:{
        attr_name:""
      },
      editialogVisible:false,//修改对话框
      editruleForm:{},
      editrulesbas:{
        attr_name:[{required: true, message: "请输入参数名称", trigger: "blur"}]
      },
    };
  },
  computed:{
    isbtndisabled(){
      if(this.selectedOptionsbas.length!==3){
        return true
      }
      return false
    },
    cateid(){
      if(this.selectedOptionsbas.length===3){
        return this.selectedOptionsbas[2]
      }
      return null
    },
    titletext(){//动态计算标题文本
      if(this.activeName == "many"){
        return "动态参数"
      }else{
        return "静态属性"
      }
    }
  },
  created() {
    this.save();
  },
  methods: {
    async save() {
      let { data: res } = await this.$http.categories();
      if (res.meta.status !== 200) {
        this.$message.error("获取商品分类失败");
      }

      this.catlist = res.data;
      console.log(this.catlist);
    },
    handleChange(){
      this.getparamsdata();
    },

    async getparamsdata(){
      if(this.selectedOptionsbas.length!==3){
        this.selectedOptionsbas = []
        this.manytabdata = []
        this.onlytabdata = []
        return
      }

      let {data:res} = await this.$http.attrbutsbas({sel:this.activeName},this.cateid)
      if(res.meta.status!==200){
        return this.$message.error('获取商品失败')
      }
      
      res.data.forEach(item=>{
        item.inputVisible=false,
        item.inputValue="",
        item.attr_vals =item.attr_vals? item.attr_vals.split(' '):[]
      })
      console.log(res.data)
      if(this.activeName == "many"){
        this.manytabdata = res.data
      }else{
        this.onlytabdata = res.data
      }
    },
    handleClick(){//tab标签页点击事件
    this.getparamsdata();
    },
    addclose(){
      this.$refs.ruleFormref.resetFields();
    },
    qued(){
      this.$refs.ruleFormref.validate(async valid=>{
        if(!valid){
          return
        }
      let {data:res} = await this.$http.addbutes({
        attr_name:this.addruleForm.attr_name,
        attr_sel:this.activeName,
      },this.cateid)
      if(res.meta.status!==201){
        return this.$message.error('添加参数失败')
      }
      this.$message.success('添加参数成功')
      this.getparamsdata();
      this.addialogVisible = false
      })
    },
    async showdialg(attr_id){//点击修改按钮
      this.editialogVisible = true
      let {data:res} = await this.$http.addattrbutids({attr_sel:this.activeName},this.cateid,attr_id)
      if(res.meta.status!==200){
        return this.$message.error('获取参数失败')
      }
      this.editruleForm = res.data
    },
    editbsble(){//修改参数
      this.$refs.editruleFormref.validate(async valid=>{
        if(!valid){
          return
        }
        let {data:res} = await this.$http.attrbutes({
          attr_name:this.editruleForm.attr_name,
          attr_sel:this.activeName,
        },this.cateid,this.editruleForm.attr_id)
        console.log(res)
        if(res.meta.status!==200){
          return this.$message.error('修改参数信息失败')
        }
        this.$message.success('修改参数信息成功')
        this.getparamsdata();
        this.editialogVisible = false

      })
    },
    editclose(){
      this.$refs.editruleFormref.resetFields();
    },
    delbutes(attr_id){//删除参数
     this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          let {data:res} = await this.$http.deletebtues(this.cateid,attr_id)
          if(res.meta.status!==200){
            return this.$message.error('删除参数失败')
          }
          this.$message({
            type: 'success',
            message: '删除参数成功!'
          });
          this.getparamsdata();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    async handleInputConfirm(row){// 文本框失去焦点或按下enter键
      if(row.inputValue.trim().length==0){
        row.inputValue=""
        row.inputVisible=false
        return
      }

      row.attr_vals.push(row.inputValue.trim())
      row.inputValue=""
      row.inputVisible=false

      this.upsave(row);
    },
    async upsave(row){// 对attr_vals的操作保存到数据库
      let {data:res} = await this.$http.attrbutes({
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' '),
      },this.cateid,row.attr_id)
      if(res.meta.status!==200){
        return this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
    },
    showInput(row){//点击按钮显示文本输入框
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handremove(index,row){
      row.attr_vals.splice(index,1);
      this.upsave(row);
    }
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 10px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
}
.wz-opt {
  margin: 20px 0px;
  span {
    font-size: 15px;
  }
}
.input-new-tag{
  margin-left: 15px;
  width: 100px;
}
</style>