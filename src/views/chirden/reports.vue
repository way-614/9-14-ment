<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      options: {//合并的数据
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  created() {},
  async mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    let { data: res } = await this.$http.getreports();
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败");
    }

    let newobj = Object.assign(this.options,res.data);


    myChart.setOption(newobj);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 10px;
  box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.05);
}
</style>