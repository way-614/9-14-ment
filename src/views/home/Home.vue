<template>
  <div>
    首页
  <el-button type="info" @click="back">退出</el-button>

  
  </div>
</template>

<script>
export default {
  methods:{
    back(){
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style>

</style>