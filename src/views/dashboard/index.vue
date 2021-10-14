<template>
<!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div class="dashboard-container">
    <!-- element中的布局 -->
    <!-- 面板统计组件 -->
    <panel-group :userTotal="this.userTotal" :articleTotal="this.articleTotal" :questionTotal="this.questionTotal"/>

    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="12">
        <!-- 卡片 -->
        <el-card>
          <pie-chart v-if="flag" :seriesData="categoryTotal.nameAndValueList"/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <!-- 卡片 -->
        <el-card>
          <bar-chart v-if="flag" :xAxisData="monthAritcleTotal.yearMonthList" :seriesData="monthAritcleTotal.aritcleTotalList"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PieChart from "./components/PieChart"
import BarChart from "./components/BarChart"
import PanelGroup from "./components/PanelGroup"
import api from "@/api/home"
export default {
  name:'Dashboard',
  components:{ PieChart , BarChart ,PanelGroup},
  data() {
    return {
      userTotal:0,
      articleTotal:0,
      questionTotal:0,

      flag: false, //是否显示子组件，加载数据完成后,echarts必须先加载数据再渲染
      categoryTotal: {}, // 每个分类下的文章数 
      monthAritcleTotal: {} // 查询近6个月发布的文章数
    }
  },
  mounted() {
    // 查询总记录数
    this.getTotal()
    // 统计各技术频道文章数和近6个月发布文章数
    this.getArticleTotal()
  },
  methods:{
    async getTotal() {
      // 总用户
      const {data:userTotal} = await api.getUserTotal()
      this.userTotal = userTotal
      // 总文章
      const {data:articleTotal} = await api.getArticleTotal()
      this.articleTotal = articleTotal
      // 总提问
      const {data:questionTotal} = await api.getQuestionTotal()
      this.questionTotal = questionTotal
    },

    async getArticleTotal() {
      // 每个分类下的文章数
      const {data:categoryTotal} = await api.getCategoryTotal()
      this.categoryTotal = categoryTotal
      // 查询6个月来的发布的文章数
      const {data:monthAritcleTotal} = await api.getMonthAritcleTotal()
      this.monthAritcleTotal = monthAritcleTotal

      // 数据加载完成，显示子组件
      this.flag = true
    }
  }
     
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
