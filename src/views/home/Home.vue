<template>
  <div class="wz-box">
    <!-- 非全屏状态 -->
    <div v-if="!isFullscreen">
      <el-container>
      <el-header>
        <div class="header-left">
          <span class="toggerbtn" @click="togger">
            <i class="el-icon-s-unfold" v-show="!isprs"></i>
            <i class="el-icon-s-fold" v-show="isprs"></i>
          </span>
          <span>后台管理系统</span>
        </div>
        <div class="header-right">
          <span class="an1" @click="qhuan">
            <i class="el-icon-rank"></i>
          </span>
          <span class="an1">
            <i class="el-icon-bell"></i>
          </span>
          <span class="an1">
            <img src="../../assets/logo.jpg" alt />
          </span>

          <el-dropdown trigger="click">
            <span class="an2">
              admin &nbsp; <i class="el-icon-caret-bottom" style="margin-left:3px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="links">仓库目录</span></el-dropdown-item>
              <el-dropdown-item><span @click="back">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>


        </div>
      </el-header>
      <el-container class="el-containers">
        <el-aside :width="isprs? '60px':'200px'">
          <el-menu
            :unique-opened="true"
            :default-active="activepath"
            :collapse="isprs"
            :collapse-transition="false"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            router
          >
            <el-submenu v-for="(i,index) in listleft" :key="index" :index="i.id+''">
              <template slot="title">
                <i :class="iconse[i.id]"></i>
                <span class="wz-span">{{i.authName}}</span>
              </template>
              <el-menu-item v-for="(i,index) in i.children" :key="index"
              :index="'/'+i.path"
              @click="savepath('/'+i.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span index="1-1">{{i.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    </div>


    <!-- 非全屏代码 -->
    <div v-if="isFullscreen">
      <el-container>
      <el-header>
        <div class="header-left">
          <span class="toggerbtn" @click="togger">
            <i class="el-icon-s-unfold" v-show="!isprs"></i>
            <i class="el-icon-s-fold" v-show="isprs"></i>
          </span>
          <span>后台管理系统</span>
        </div>
        <div class="header-right">
          <span class="an1">
            <i class="el-icon-rank"></i>
          </span>
          <span class="an1">
            <i class="el-icon-bell"></i>
          </span>
          <span class="an1">
            <img src="../../assets/logo.jpg" alt />
          </span>

          <el-dropdown trigger="click">
            <span class="an2">
              admin &nbsp; <i class="el-icon-caret-bottom" style="margin-left:3px"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span @click="links">仓库目录</span></el-dropdown-item>
              <el-dropdown-item><span @click="back">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>


        </div>
      </el-header>
      <el-container class="el-containers">
        <el-aside :width="isprs? '60px':'200px'">
          <el-menu
            :unique-opened="true"
            :default-active="activepath"
            :collapse="isprs"
            :collapse-transition="false"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            router
          >
            <el-submenu v-for="(i,index) in listleft" :key="index" :index="i.id+''">
              <template slot="title">
                <i :class="iconse[i.id]"></i>
                <span class="wz-span">{{i.authName}}</span>
              </template>
              <el-menu-item v-for="(i,index) in i.children" :key="index"
              :index="'/'+i.path"
              @click="savepath('/'+i.path)"
              >
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span index="1-1">{{i.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    </div>
    
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  data() {
    return {
      isFullscreen: false,
      listleft: [],
      iconse: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isprs: false,
      activepath:''
    };
  },
  created() {
    this.activepath = window.sessionStorage.getItem('activepath')
    this.$http.menusbas().then((res) => {
      console.log(res.data);
      if (!res.data.meta.status) return this.$message.error(res.data.meta.msg);
      this.listleft = res.data.data;
    });
  },
  mounted(){
    window.onresize = () => {
      // 全屏下监控是否按键了ESC
      if (!this.checkFull()) {
        // 全屏下按键esc后要执行的动作
        this.isFullscreen = false;
      }
    }
  },
  methods: {
    back() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    links(){
      let url='https://github.com/way-614/9-14-ment'
      window.open(url)
    },
    savepath(path){
      window.sessionStorage.setItem('activepath',path)
      this.activepath = path
    },
    togger() {
      this.isprs = !this.isprs;
    },

        /**
     * 全屏事件
     */
    qhuan() {
      if (screenfull.enabled) {
        this.$message({
          message: '浏览器不能全屏',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle();
      this.isFullscreen = true;
    },
    /**
     * 是否全屏并按键ESC键的方法
     */
    checkFull() {
      var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      // to fix : false || undefined == undefined
      if (isFull !== undefined) {
          isFull = false;
      }
      return isFull;
    }
  },
};
</script>

<style lang="scss" scoped>
.wz-box {
  width: 100%;
  height: 100%;
  div{
    width: 100%;
    height: 100%;
  }
}
.el-container {
  height: 100%;
}
.el-containers {
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #242f42;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-header {
  height: 70px !important;
  padding: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-left {
    width: 30%;
    display: flex;
    height: 100%;
    justify-content: end;
    align-items: center;
    span {
      color: #fff;
      font-size: 20px;
    }
    .toggerbtn {
      width: 50px;
      display: block;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .toggerbtn:hover {
      cursor: pointer;
      background: #283446;
    }
  }
  .header-right {
    margin-right: 20px;
    width: 10%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-dropdown{
      display: flex;
      align-items: center;
      height: 30%;
    }
    span {
      display: inline-flex;
      align-items: center;
      height: 80%;
      margin-right: 10px;
    }
    .an1 {
      cursor: pointer;
      margin-right: 10px;
      color: #fff;
      font-size: 20px;
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
    }
    .an2 {
      color: #fff;
      font-size: 12px;
    }
    .an2:hover {
      cursor: pointer;
    }
  }
}

.el-aside {
  height: 100%;
  background-color: #333744;
  color: #333;
  text-align: center;
  line-height: 200px;
  .el-menu {
    border: 0px;
  }
}
.el-menu-vertical-demo {
  height: 100%;
  background: #333744;
}

::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.el-main {
  // overflow: visible;
  background-color: #F0F0F0;
  color: #333;
  // text-align: center;
}
.iconfont {
  margin-right: 10px;
}
.wz-span {
  margin-right: 60px;
}
</style>