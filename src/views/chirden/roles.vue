<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rowdatas" border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row style="display: flex;align-items: center;" :class="['btbottom',index==0?'bdtop':'']" v-for="(i,index) in scope.row.children" :key="i.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delright(scope.row,i.id)">{{i.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row :class="index==0?'':'bdtop'" v-for="(item,index) in i.children" :key="item.id">
                  <el-col :span="6">
                    <!-- 二级权限 -->
                    <el-tag closable @close="delright(scope.row,item.id)" type="success">{{item.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限 -->
                    <el-tag closable @close="delright(scope.row,item1.id)" type="warning" v-for="(item1,index) in item.children" :key="item1.id">{{item1.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" @click="showdowgin(scope.row)" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>


       <el-dialog
       @close="secrightcols"
        title="分配权限"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <span>
          <el-tree :data="rightlist" :props="treeProps"
          ref="treeref"
          show-checkbox node-key="id"
          default-expand-all
          :default-checked-keys="ckeckid"
          ></el-tree>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotres">确 定</el-button>
        </span>
    </el-dialog>


    </el-card>
    

  </div>
</template>

<script>
export default {
  data(){
    return{
      rowdatas:[],
      ckeckid:[],
      dialogVisible:false,
      rightlist:[],
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      reolsId:"",
    }
  },
  created(){
    this.roles();
  },
  methods:{
    async roles(){
     let resbas =  await this.$http.rightsroles()
     console.log(resbas.data.meta.status)
     if(resbas.data.meta.status!==200){
       return this.$message.error('获取角色列表失败')
     }
     this.rowdatas = resbas.data.data
    },
    delright(rels,rightid){
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res =  await this.$http.delroles(rels,rightid)
          if(res.data.meta.status!==200){
            return this.$message.error('删除权限失败')
          }
          rels.children = res.data.data
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    async showdowgin(reols){
      this.reolsId = reols.id
      console.log(reols)
      let res = await this.$http.fenpeifors()
      if(res.data.meta.status!==200){
        return this.$message.error('获取权限分配信息失败')
      }
      this.rightlist = res.data.data
      this.getlefkeys(reols,this.ckeckid)
      this.dialogVisible = true
    },
    // 递归获取角色id
    getlefkeys(node,arr){
      // console.log(arr)
      if(!node.children){
        return arr.push(node.id)
      }

      node.children.map(item=>{
        this.getlefkeys(item,arr)
      })
    },
    secrightcols(){
      this.ckeckid=[]
    },
    async allotres(){
      const keys = [...this.$refs.treeref.getCheckedKeys(),...this.$refs.treeref.getHalfCheckedKeys()]
      const rids = keys.join(',')
      let {data:res} =  await this.$http.shouqcolse({rids},this.reolsId)
      if(res.meta.status!==200){
        return this.$message.error('更新权限失败')
      }
      this.$message.success('更新权限成功')
      this.roles();

      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 10px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
}
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.btbottom{
  border-bottom: 1px solid #eee;
}
</style>