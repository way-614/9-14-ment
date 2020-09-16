<template>
  <div class="wz-box">
    <section>
      <nav>后台管理系统</nav>
      <div class="wz-bck">
        <el-form ref="loginform" :model="form" :rules="login" label-width="80px">
          <el-form-item prop="name" class="wz-itme">
            <el-input placeholder="请输入用户名" v-model="form.name">
              <template slot="prepend">
                <el-button type="button" icon="el-icon-user"></el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="word" class="wz-itme">
            <el-input type="password" placeholder="请输入密码" class="wz-put" v-model="form.word">
              <template slot="prepend">
                <el-button type="button" icon="el-icon-unlock"></el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="wz-bcks">
        <el-button type="primary" @click="logins">登录</el-button>
        <el-button type="button" class="wz-btn" @click="resplace">重置</el-button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    
    return {
      form: {
        name: "admin",
        word: "123456",
      },
      login: {
        name: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        word: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",},
        ],
      },
    };
  },
  methods:{
    resplace(){
      this.$refs.loginform.resetFields();
    },
    logins(){
      this.$refs.loginform.validate(async valde=>{
        if(!valde) return;
        let res= await this.$http.loginadds({username:this.form.name,password:this.form.word,})
        if(res.data.meta.status!==200) return this.$message.error('登录失败！')
        this.$message({message: '登录成功',type: 'success'});
        window.sessionStorage.setItem('token',res.data.data.token);
        this.$router.push('/')
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.wz-box {
  width: 100%;
  height: 100%;
  background: url("../../assets/bjl.jpg");
  background-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  section {
    width: 350px;
    height: 250px;
    background: hsla(0, 0%, 100%, 0.3);
    border-radius: 3px;
    nav {
      color: #fff;
      font-size: 18px;
      text-align: center;
      line-height: 50px;
      border-bottom: 0.8px solid #666;
      width: 100%;
      height: 50px;
    }
    .wz-bck {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 24px 10px 24px;
      display: flex;
      justify-content: center;
      .wz-put {
        width: 100%;
        margin-top: 20px;
      }
      .wz-itme {
        width: 100%;
      }
    }
    .wz-bcks {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 52px 10px 24px;
      display: flex;
      justify-content: flex-end;
      .wz-btn {
        color: #fff;
        background-color: #909399;
        border-color: #909399;
      }
    }
  }
}

.wz-bck /deep/ .el-form-item__content {
  margin: 0px !important;
}
.el-form-item {
  margin: 0px !important;
}
</style>