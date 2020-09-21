<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row style="margin-bottom:14px">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderlist" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price" width="120px"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status" width="120px">
              <template slot-scope="scope">
                  <el-tag type="success" v-if="scope.row.pay_status=='1'">已付款</el-tag>
                  <el-tag type="danger" v-else>未付款</el-tag>
              </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send" width="120px"></el-table-column>
          <el-table-column label="下单时间" prop="create_time">
              <template slot-scope="scope">
                  {{scope.row.create_time | dateflomt}}
              </template>
          </el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showdioling"></el-button>
                  <el-button type="success" icon="el-icon-location" size="mini" @click="showpreassbox"></el-button>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页器 -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfos.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryinfos.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>

        <!-- 修改地址对话框 -->
        <el-dialog
        @close="delcolse"
        title="修改地址"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormref" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
            <el-cascader :options="citydata" v-model="ruleForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
            <el-input v-model="ruleForm.address2"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 展示物流进度对话框 -->
        <el-dialog
        title="物流进度"
        :visible.sync="wuliuVisible"
        width="50%"
        >
        <!-- 时间线 -->
          <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in progreinfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>
        </el-dialog>
    </el-card>
  </div>
</template>

<script>
import citydata from "../../assets/citydata"
export default {
  data() {
    return {
      queryinfos: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total:0,
      orderlist:[],
      dialogVisible:false,
      ruleForm:{
          address1:[],
          address2:"",
      },
      rules:{
          address1:[{required: true, message: "请选择省市区县", trigger: "blur"}],
          address2:[{required: true, message: "请填写详细地址", trigger: "blur"}],
      },
      citydata,
      wuliuVisible:false,
      progreinfo:[],
    };
  },
  created() {
    this.getorderlist();
  },
  methods: {
    async getorderlist() {
      let { data: res } = await this.$http.getordersbas(this.queryinfos);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
    //   console.log(res.data)
      this.total = res.data.total
      this.orderlist = res.data.goods
    },
    handleSizeChange(newsize){
        this.queryinfos.pagesize = newsize
        this.getorderlist();
    },
    handleCurrentChange(newnum){
        this.queryinfos.pagenum = newnum
        this.getorderlist();
    },
    showdioling(){
        this.dialogVisible=true
    },
    delcolse(){
        this.$refs.ruleFormref.resetFields();
    },
    async showpreassbox(){
        let {data:res} = await this.$http.ceshikuaidi()
        console.log(res)
        if(res.meta.status!==200){
            return this.$message.error('获取物流信息失败')
        }
        this.progreinfo = res.data
        console.log(this.progreinfo)
        this.wuliuVisible=true
    }
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.05);
  margin-top: 10px;
}
.el-table{
    font-size: 10px;
}
.el-cascader{
    width: 100%;
}
</style>