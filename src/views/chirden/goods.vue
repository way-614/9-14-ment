<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card class="box-card">
      <el-row :gutter="20" style="margin-bottom:10px">
        <el-col :span="8">
           <el-input v-model="queryinfo.query" clearable @clear="getGoodslist" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" @click="getGoodslist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goaddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" width="100px" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" width="140px" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time | dateflomt}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="delremove(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>
    </el-card>


  </div>
</template>

<script>
export default {
  data(){
    return{
      queryinfo:{//查询参数
        query:"",
        pagenum:1,
        pagesize:10,
      },
      goodslist:[],//商品列表
      total:0,
    }
  },
  created(){
    this.getGoodslist();
  },
  methods:{
    async getGoodslist(){
      let {data:res} = await this.$http.getgoods(this.queryinfo)
      if(res.meta.status!==200){
        return this.$message.error('获取商品列表数据失败')
      }
      console.log(res.data)
      this.$message.success('获取商品列表数据成功')
      this.goodslist = res.data.goods
      this.total = res.data.total

    },
    handleSizeChange(newSize){
      this.queryinfo.pagesize = newSize
      this.getGoodslist();
    },
    handleCurrentChange(newPage){
      this.queryinfo.pagenum = newPage
      this.getGoodslist();
    },
    delremove(id){//删除商品
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        let {data:res} = await this.$http.removebyid(id)
        if(res.meta.status!==200){
          return this.$message.error('删除商品失败')
        }
        this.getGoodslist();
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
    goaddpage(){
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
}
.el-table{
  font-size: 10px;
}
</style>