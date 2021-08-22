<template>
  <div class="chart-container">
    <chart height="100%" width="100%" :chart-data="lineData"></chart>
  </div>
</template>

<script>
  import Chart from '@/components/Charts/historyChart'
  import { getLineChart } from '@/api/workorder'
  export default {
    name: 'workOrderChart',
    components: { Chart },
    data() {
      return {
        lineData: []
      }
    },
    methods: {
      fetchData() {
        getLineChart().then(
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

<style scoped>
  .chart-container{
    position: relative;
    width: 100%;
    height: calc(100vh - 84px);
  }
</style>

