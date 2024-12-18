<template>
  <div class="app-container">
    <el-table
        v-loading="listLoading"
        :data="logs.filter(data => !search || data.visitorName.toLowerCase().includes(search.toLowerCase()))"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :row-class-name="tableRowClassName"
    >
      <el-table-column
          fixed
          prop="visitorLogId"
          label="ID"
          width="150">
      </el-table-column>
      <el-table-column
          prop="visitorId"
          label="访客ID"
          width="120">
      </el-table-column>
      <el-table-column
          prop="visitorName"
          label="访客姓名"
          width="150">
      </el-table-column>
      <el-table-column
          prop="visitorTimeIn"
          label="进入时间"
          width="200">
        <template slot-scope="scope"> {{ (scope.row.visitorTimeIn || "").split(".")[0].replace('T', ' ') }}</template>
      </el-table-column>
      <el-table-column
          prop="visitorTimeOut"
          label="出去时间"
          width="200">
        <template slot-scope="scope"> {{ (scope.row.visitorTimeOut || "").split(".")[0].replace('T', ' ') }}</template>
      </el-table-column>
      <el-table-column
          prop="attendanceState"
          label="是否非法"
          align="center"
          width="150">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.isLegal ? 'success' : 'danger'"
              disable-transitions>{{ scope.row.isLegal ? "合法" : "非法" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="departmentName"
          label="所属部门"
          width="200">
      </el-table-column>
      <el-table-column
          fixed="right"
          width="300">
        <template slot="header" slot-scope="scope">
          <el-row style="margin: auto">
            <el-col :span="16">
              <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"/>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" round size="small" @click="drawer=true">更多搜索</el-button>
            </el-col>
          </el-row>
        </template>
        <template slot-scope="scope">
          <el-button @click="deleteLog(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="displayPic(scope.row)" type="text" size="small">查看照片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
        title="更多搜索"
        :visible.sync="drawer"
        :direction="direction"
        size="50%">
      <el-form :model="drawerForm">
        <el-form-item label="日期：" :label-width="formLabelWidth">
          <el-date-picker
              v-model="drawerForm.date"
              type="daterange"
              format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 438px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用户名称：" :label-width="formLabelWidth">
          <el-input v-model="drawerForm.search" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户部门：" :label-width="formLabelWidth">
          <el-input v-model="drawerForm.visitorDepartmentId" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="searchSubmit" :loading="formLoading" style="margin: auto 50%">提 交</el-button>
    </el-drawer>
    <el-dialog :title="picTitle" :visible.sync="picDialog" center width="350px">
      <el-image
          center
          style="width: 300px; height: 300px"
          :src="url"
          fit="fill"
      ></el-image>
    </el-dialog>
  </div>
</template>

<script>
import {getInfo, updateInfo, delUser} from '@/api/user'
import {getAllLog, delLog, getBySearch, getLogPic} from "@/api/visitorLog";
import {Message} from "element-ui";
import {title} from "@/settings";
import defaultPic from "@/assets/images/default.jpg"
import {getAllDepartment} from "@/api/department";

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
      listLoading: true,
      titleName: "编辑",
      addDialog: false,
      form: {},
      formLabelWidth: '120px',
      formLoading: false,
      logs: [],
      statusText: {
        0: '进入',
        1: '出去',
      },
      daysText: {
        1: '星期一 ',
        2: '星期二 ',
        3: '星期三 ',
        4: '星期四 ',
        5: '星期五 ',
        6: '星期六 ',
        7: '星期天 ',
      },
      search: "",
      drawer: false,
      direction: "rtl",
      drawerForm: {
        date: '',
        search: '',
        departmentId: '',
        days: [],
        attendanceDays: '',
        startTime: '',
        endTime: '',
        visitorDepartmentId: ''
      },
      url: defaultPic,
      picDialog: false,
      picTitle: '照片',
      department: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    title() {
      return title
    },
    async fetchData() {
      this.listLoading = true
      await getAllLog().then(async res => {
        if (res.code == 20041) {
          this.logs = res.data
          await getAllDepartment().then(res => {
            if (res.code == 20041) {
              this.department = res.data
              for (let i = 0; i < this.logs.length; i++) {
                for (let j = 0; j < this.department.length; j++) {
                  if (this.department[j].departmentId === this.logs[i].visitorDepartmentId) {
                    this.logs[i].departmentName = this.department[j].departmentName
                    break
                  }
                }
              }
            } else {
              Message({
                type: 'error',
                message: res.message,
                center: true
              })
            }
          })
        } else {
          Message({
            type: 'error',
            message: res.message,
            center: true
          })
        }
        this.listLoading = false
      })
    },
    handleCheck(row) {
      this.addDialog = true;
      this.form = row
    },
    deleteLog(index, row) {
      this.listLoading = true
      delLog({logIds: row.visitorLogId}).then(res => {
        if (res.code === 20021) {
          Message({
            type: "success",
            message: res.message,
            center: true
          })
          delete this.logs[index]
          this.listLoading = false
        } else {
          Message({
            type: "error",
            message: res.message,
            center: true
          })
          this.listLoading = false
        }
      })

    },
    dialogFormVisible() {
      this.addDialog = false;
    },
    dialogFormSubmit() {
      this.formLoading = true;
      this.form.confirmPassword = this.form.password;
      updateInfo(this.form).then(res => {
        if (res.code == 20011) {
          Message({
            type: "success",
            message: res.message,
            center: true
          })
          this.addDialog = false;
        } else {
          Message({
            type: "error",
            message: res.message,
            center: true
          })
        }
        this.formLoading = false;
      })

    },
    sleep(numberMillis) {
      let now = new Date();
      const exitTime = now.getTime() + numberMillis;
      while (true) {
        now = new Date();
        if (now.getTime() > exitTime) return;
      }
    },
    changeDays(data) {
      let days = data.split(",");
      let daysStr = "";
      for (const k in days) {
        daysStr += this.daysText[Number(days[k])]
      }
      return daysStr;
    },
    searchSubmit() {
      // let str = ''
      // this.drawerForm.days.forEach((elem, index) => {
      //   for (let k in this.daysText) {
      //     if (this.daysText[k] === elem) {
      //       str += (k + ",")
      //     }
      //   }
      // })
      // this.drawerForm.attendanceDays = str.substring(0, str.length - 1)
      this.drawerForm.startTime = this.drawerForm.date[0]
      this.drawerForm.endTime = this.drawerForm.date[1]
      this.listLoading = true
      getBySearch(this.drawerForm).then(res => {
        if (res.code === 20041) {
          this.logs = res.data
          this.listLoading = false
        } else {
          Message({
            type: "error",
            message: res.message,
            center: true
          })
        }
      })
    },
    displayPic(row) {
      getLogPic({visitorLogId: row.visitorLogId}).then(res => {
        if (res.code === 20041) {
          if (res.data != null || res.data != 'data:image/jpeg;base64,') {
            this.url = res.data
          } else {
            this.url = defaultPic
          }
          this.picDialog = true
        } else {
          Message({
            type: "error",
            message: res.message,
            center: true
          })
        }
      })
    },
    tableRowClassName({row, rowIndex}) {
      if (row.isLegal) {
        return 'success-row'
      } else {
        return 'warning-row'
      }
    }
  }
}
// 非法访问记录判断，删除出席日期列
</script>
