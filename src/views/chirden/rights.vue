<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>



    <el-card class="box-card">
      <el-table :data="datalist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level=='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level=='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>



  </div>
</template>

<script>
export default {
  data(){
    return{
      datalist:[],
    }
  },
  created(){
    this.rightslist();
  },
  methods:{
    async rightslist(){
     let resbas =  await this.$http.rightslist()
     if(resbas.data.meta.status!==200){
       return this.$message.error('获取权限列表失败')
     }
     this.datalist = resbas.data.data
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 10px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
}
</style>