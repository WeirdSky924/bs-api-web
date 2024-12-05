<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用考勤管理系统：{{ name }}
      <el-button type="primary" @click="openCV">启 动 模 拟 摄 像 头</el-button></div>
    <div id="main" style="width: 100%;height: 700px"></div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getChartData, openCV} from "@/api/visitorLog";
import * as echarts from 'echarts';
import {Message} from "element-ui";
import Background from '@/assets/images/background.webp'

export default {
  name: '',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {

  },
  mounted() {
    this.fetchData()
  },
  data() {
    return {
      data: [],
      col: [],
      Background: Background
    }
  },
  methods: {
    drawChart() {
      let myChart = echarts.init(document.getElementById('main'))
      let options = {
        title: {
          text: "考情列表"
        },
        xAxis: {
          type: 'category',
          data: this.col
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: "line",
            data: this.data,
            areaStyle: {},
            label: {
              show: true,
              position: 'bottom',
              textStyle: {
                fontSize: 20
              }
            }
          }

        ]
      }
      myChart.setOption(options)
    },
    fetchData() {
      getChartData().then(res => {
        if (res.code === 20041) {
          this.col = res.data[0]
          for (let i = 0; i < res.data[1].length; i++) {
            this.data.push(Number(res.data[1][i]))
          }
          this.drawChart()
        } else {
          Message({
            type: 'error',
            message: res.message,
            center: true
          })
        }
      })
    },
    openCV() {
      openCV().then(res => {

      })
    },
    sleep(numberMillis){
      let now = new Date();
      const exitTime = now.getTime() + numberMillis;
      while (true) {
        now = new Date();
        if (now.getTime() > exitTime) return;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    //background: url("src/assets/images/background.webp");
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
