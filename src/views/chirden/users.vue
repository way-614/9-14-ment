<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-input @clear="dels" clearable placeholder="请输入内容" v-model="currentPage4.query">
            <el-button slot="append" icon="el-icon-search" @click="save"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 添加用户 -->
      <el-dialog
      @close="isclose"
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="ruleForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="ruleForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 修改用户对话框 -->
      <el-dialog
        title="修改用户信息"
        @close="undatabas"
        :visible.sync="updatas"
        width="50%">
        <span>
          <el-form :model="ruleFormdas" :rules="rulesros" ref="ruleFormref" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="ruleFormdas.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleFormdas.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
              <el-input v-model="ruleFormdas.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="updatas = false">取 消</el-button>
          <el-button type="primary" @click="promsuer">确 定</el-button>
        </span>
      </el-dialog>



      <el-table :data="daslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="angerow(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showedit(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deluserbyid(scope.row.id)"></el-button>
            <el-button type="success" icon="el-icon-share" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="currentPage4.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail=(rule, value, cb)=>{
      const regs = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/ 
      if(regs.test(value)){
        return cb()
      }
      cb(new Error('请输正确的邮箱地址'))
    }
    var checkMobile=(rule, value, cb)=>{
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/ 
      if(reg.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      ruleForm:{
        username:"",
        password:"",
        email:"",
        mobile:"",
      },
      ruleFormdas:{
        username:"",
        email:"",
        mobile:"",
      },
      rulesros:{
          email:[
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator:checkEmail,trigger: "blur"},
        ],
          mobile:[
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator:checkMobile,trigger: "blur"},
        ]
      },
      rules:{
        username:[
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password:[
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {min: 6,max: 15,message: "长度在 6 到 15 个字符",trigger: "blur",},
        ],
        email:[
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator:checkEmail,trigger: "blur"},
        ],
        mobile:[
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator:checkMobile,trigger: "blur"},
        ]
      },
      dialogVisible:false,
      updatas:false,
      daslist: [],
      currentPage4:{
        query: "",
        pagenum: 1,
        pagesize: 2,  
      },
      total:0
    };
  },
  created() {
    this.save();
  },
  methods:{
    save(){
      this.$http.usersbas(this.currentPage4).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取用户列表失败！");
        }
        this.daslist = res.data.data.users;
        this.total = res.data.data.total
      });
    },
    handleSizeChange(sizes){
      this.currentPage4.pagesize = sizes
      this.save();
    },
    handleCurrentChange(pages){
      this.currentPage4.pagenum = pages
      this.save();
    },
    angerow(stat){
      this.$http.statbasput(stat).then(res=>{
        console.log(res)
        if(res.data.meta.status!==200){
          stat.mg_state=!stat.mg_state
          return this.$message.error('修改用户状态失败')
        }
        this.$message.success('更新用户状态成功')
      })
    },
    dels(){
      this.save();
    },
    isclose(){
      this.$refs.ruleForm.resetFields()
    },
    adduser(){
      this.$refs.ruleForm.validate(async valid=>{
        if(!valid) return
        let userbas = await this.$http.addusers(this.ruleForm)
        console.log(userbas);
        if(userbas.data.meta.status!==201){
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.save();
      })
    },
    async showedit(id){
      this.updatas = true;
      let resbas = await this.$http.seachuser(id)
      if(resbas.data.meta.status!==200){
        return this.$message.error('查询用户信息失败')
      }
      console.log(resbas)
      this.ruleFormdas = resbas.data.data
    },
    undatabas(){
      this.$refs.ruleFormref.resetFields();
    },
    promsuer(){
      this.$refs.ruleFormref.validate(async valid=>{
        if(!valid) return
        console.log(this.ruleFormdas)
        let reabas = await this.$http.updatausersbas(this.ruleFormdas)
        if(reabas.data.meta.status!==200){
          return this.$message.error('修改用户信息失败')
        }
        this.updatas=false
        this.save();
        this.$message.success('用户信息修改成功')
      })
    },
    deluserbyid(id){
      console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let resbas =  await this.$http.deleteuserbas(id)
          if(resbas.data.meta.status!==200){
            return this.$message.error('删除用户信息失败')
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.save();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin-bottom: 10px;
}
.el-card {
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
}
.el-card:hover {
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 10px;
}
</style>