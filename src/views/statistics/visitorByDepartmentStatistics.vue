<template>
  <div class="app-container" align="center">
    <el-table
        :data="list"
        v-loading="listLoading"
        style="width: 70%;margin-bottom: 20px;"
        border
        default-expand-all>
      <el-table-column
          prop="departmentName"
          label="部门名称"
          sortable
          width="250">
      </el-table-column>
      <el-table-column
          prop="logCount"
          label="访客记录数量"
          sortable
          width="200">
      </el-table-column>
      <el-table-column
          prop="visitorCount"
          label="登记人员数量"
          width="200">
      </el-table-column>
      <el-table-column
          prop="rate"
          label="近一月出勤率"
          width="210">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {Message} from "element-ui";
import {title} from "@/settings";
import {getVisitorByDepartmentStatistics} from "@/api/statistics";

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
      getVisitorByDepartmentStatistics().then(res => {
        if (res.code === 20041) {
          for (let k in res.data) {
            let temp = new Object()
            temp.departmentName = k
            temp.logCount = res.data[k].logCount
            temp.visitorCount = res.data[k].visitorCount
            temp.rate = res.data[k].rate
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
