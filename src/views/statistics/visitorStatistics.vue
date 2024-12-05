<template>
  <div class="app-container" align="center">
    <el-table
        :data="list"
        v-loading="listLoading"
        style="width: 70%;margin-bottom: 20px;"
        row-key="areaId"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
          prop="visitorName"
          label="访客姓名"
          sortable
          width="250">
      </el-table-column>
      <el-table-column
          prop="time"
          label="时间"
          sortable
          width="200">
      </el-table-column>
      <el-table-column
          prop="sum"
          label="出勤次数"
          width="200">
      </el-table-column>
      <el-table-column
          prop="rate"
          label="近七日出勤率"
          width="210">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {Message} from "element-ui";
import {title} from "@/settings";
import {getVisitorStatistics} from "@/api/statistics";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      titleName: "编辑",
      formLabelWidth: '120px',
      formLoading: false,
      search: "",
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    title() {
      return title
    },
    fetchData() {
      this.listLoading = true
      getVisitorStatistics().then(res => {
        if (res.code === 20041) {
          let j = 1
          for (let k in res.data) {
            let child = []
            for (let i = 0; i < res.data[k].length; i++) {
              let childTemp = {
                areaId: j * 1000 + i,
                time: res.data[k][i].year + "-" + res.data[k][i].month,
                sum: res.data[k][i].sum
              }
              child.push(childTemp)
            }
            let temp = {
              areaId: j,
              visitorName: k,
              children: child,
              rate: res.data[k][0].rate
            }
            j += 1
            this.list.push(temp)
          }
        } else {
          Message({
            type: 'error',
            message: res.message,
            center: true
          })
        }
      }).finally(() => {
        this.listLoading = false
      })
    },
    sleep(numberMillis) {
      var now = new Date();
      var exitTime = now.getTime() + numberMillis;
      while (true) {
        now = new Date();
        if (now.getTime() > exitTime) return;
      }
    }
  }
}
</script>
