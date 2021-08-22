<template>
  <div class="app-container">
    hello world<br/>
    {{ this.$store.getters.username }}
    <div class="chart-container">
      <el-row :gutter="30">
        <el-col :span="8">
          <el-card>
            <pie-chart height="300px" width="500px" :chart-data="pieData"></pie-chart>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <bar-chart></bar-chart>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import { getWorkOrderHistoryCount } from '@/api/workorder'

// import editorDashboard from './editor'

export default {
  name: 'dashboard',
  components: { BarChart, PieChart },
  data() {
    return {
      currentRole: 'adminDashboard',
      pieData: []
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
          console.log(this.pieData)
        }
      )
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>
