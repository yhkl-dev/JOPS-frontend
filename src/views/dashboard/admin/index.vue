<template>
  <div class="dashboard-editor-container">
    <pane-group></pane-group>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineData"></line-chart>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart height="300px" width="500px" :chart-data="pieData"></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'
  import PaneGroup from './components/PaneGroup'
  import LineChart from './components/LineChart'
  import RaddarChart from './components/RaddarChart'
  import { getWorkOrderHistoryCount, getLineChartData } from '@/api/workorder'

  export default {
    name: 'dashboard',
    components: {
      BarChart,
      PieChart,
      RaddarChart,
      PaneGroup,
      LineChart },
    data() {
      return {
        currentRole: 'adminDashboard',
        pieData: [],
        lineData: []
      }
    },
    computed: {
      ...mapGetters([
        'roles'
      ])
    },
    methods: {
      fetchData() {
        getWorkOrderHistoryCount().then(
          res => {
            this.pieData = res
          }
        )
        getLineChartData().then(
          res => {
            this.lineData = res
          }
        )
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
