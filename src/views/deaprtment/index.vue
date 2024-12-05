<template>
  <div class="app-container">
    <el-container>
      <el-main>
        <el-table
            v-loading="listLoading"
            :data="list.filter(data => !search || data.departmentName.toLowerCase().includes(search.toLowerCase()))"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
        >
          <el-table-column
              fixed
              prop="departmentId"
              label="部门ID"
              width="150">
          </el-table-column>
          <el-table-column
              prop="departmentName"
              label="部门名称"
              width="200">
          </el-table-column>
          <el-table-column
              prop="departmentPhone"
              label="部门电话"
              width="120">
          </el-table-column>
          <el-table-column
              prop="departmentAdminUserIds"
              label="部门管理员"
              width="350">
            <template slot-scope="scope">{{ applyUsers(scope.row.departmentAdminUserIds) }}</template>
          </el-table-column>
          <el-table-column
              prop="remarks"
              label="备注"
              width="280">
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间"
              width="250">
          </el-table-column>
          <el-table-column
              fixed="right"
              width="200">
            <template slot="header" slot-scope="scope">
              <el-input
                  v-model="search"
                  size="mini"
                  placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
              <el-button @click="handleCheck(scope.row)" type="text" size="small">编辑</el-button>
              <el-button @click="deleteDepartment(scope.$index, scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer align="right">
        <el-button @click="handleCheck(null)" type="primary">新增</el-button>
      </el-footer>
    </el-container>
    <el-dialog :title="titleName" :visible.sync="addDialog" center width="50%">
      <el-form :model="form" :rules="departmentRules" ref="form">
        <el-form-item label="部门名称：" :label-width="formLabelWidth" prop="departmentName">
          <el-input v-model="form.departmentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门电话：" :label-width="formLabelWidth" prop="departmentPhone">
          <el-input v-model="form.departmentPhone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门管理员：" :label-width="formLabelWidth" prop="departmentAdminUserIds">
          <el-button type="primary" @click="handleSelect()" style="margin-bottom: 10px">选 择</el-button>
          <el-input v-model="form.departmentAdminUserNames" auto-complete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="remarks">
          <el-input v-model="form.remarks" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible">取 消</el-button>
        <el-button type="primary" @click="dialogFormSubmit" :loading="formLoading">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="selectTitle" :visible.sync="selectDialog" center width="40%">
      <el-table
          v-loading="listLoading"
          :data="users"
          element-loading-text="Loading"
          @selection-change="selectChange"
          border
          fit
          highlight-current-row>
        <el-table-column
            type="selection"
            width="50">
        </el-table-column>
        <el-table-column
            prop="userId"
            label="用户ID"
            width="100">
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户名称"
            width="120">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="180">
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话"
            width="120">
        </el-table-column>
        <el-table-column
            prop="remarks"
            label="备注"
            width="120">
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="dialogSelectSubmit" style="margin-top: 20px">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import {getAll, getInfo} from '@/api/user'
import {delDepartment, getAllDepartment, saveOrUpdateDepartment} from '@/api/department'
import {Message} from "element-ui";
import {title} from "@/settings";
import {validateNotEmpty, validateMobilePhone} from "@/api/validate";

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
      selectTitle: "选择管理员用户",
      addDialog: false,
      selectDialog: false,
      form: {
        departmentName: '',
        departmentPhone: '',
        departmentAdminUserIds: '',
        remarks: '',
        departmentAdminUserNames: ''
      },
      formLabelWidth: '120px',
      formLoading: false,
      search: "",
      users: [],
      departmentRules: {
        departmentName: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
        departmentPhone: [{required: true, trigger: 'blur', validator: validateMobilePhone}],
        departmentAdminUserIds: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
      },
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
      getInfo().then(res => {
        if (res.data.userType == "0") {
          getAllDepartment().then(res => {
            if (res.code == 20041) {
              this.list = res.data
              getAll().then(res => {
                if (res.code === 20041) {
                  this.users = res.data
                } else {
                  this.addDialog = false;
                  Message({
                    type: "error",
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
          })
        } else {
          Message({
            type: 'error',
            message: '非管理员无法使用此模块！',
            center: true
          })
          this.$router.push("/")
        }
        this.listLoading = false
      })

    },
    handleCheck(row) {
      this.addDialog = true;
      if (row != null) {
        this.form = row
      } else {
        this.form = {}
      }
      this.userIds2Names()
    },
    handleSelect() {
      this.selectDialog = true;
    },
    deleteDepartment(index, row) {
      this.listLoading = true
      delDepartment({departmentIds: row.departmentId}).then(res => {
        if (res.code == 20021) {
          Message({
            type: "success",
            message: res.message,
            center: true
          })
          delete this.list[index]
        } else {
          Message({
            type: "error",
            message: res.message,
            center: true
          })
        }
        this.listLoading = false
      })
    },
    dialogFormVisible() {
      this.addDialog = false
    },
    dialogFormSubmit() {
      this.formLoading = true
      this.listLoading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          saveOrUpdateDepartment(this.form).then(res => {
            if (res.code == 20011) {
              Message({
                type: "success",
                message: res.message,
                center: true
              })
              getAllDepartment().then(res => {
                if (res.code == 20041) {
                  this.list = res.data
                } else {
                  Message({
                    type: "error",
                    message: res.message,
                    center: true
                  })
                }
              })
              this.addDialog = false;
            } else {
              Message({
                type: "error",
                message: res.message,
                center: true
              })
            }
          })
        } else {
          Message({
            type: 'error',
            message: '输入有误！',
            center: true
          })
        }
      })
      this.formLoading = false
      this.listLoading = false
    },
    sleep(numberMillis) {
      let now = new Date();
      const exitTime = now.getTime() + numberMillis;
      while (true) {
        now = new Date();
        if (now.getTime() > exitTime) return;
      }
    },
    applyUsers(userIds) {
      let ids = (userIds || "").split(",")
      let str = ""
      for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < this.users.length; j++) {
          if (this.users[j].userId == ids[i]) {
            str += (this.users[j].userName + ",")
            break
          }
        }
      }
      return str.substring(0, str.length - 1)
    },
    dialogSelectSubmit() {
      this.selectDialog = false
      this.userIds2Names()
    },
    selectChange(data) {
      this.form.departmentAdminUserIds = ""
      let str = "";
      for (let i = 0; i < data.length; i++) {
        str += data[i].userId + ","
      }
      this.form.departmentAdminUserIds = str.substring(0, str.length - 1)
    },
    userIds2Names() {
      if (this.form.departmentAdminUserIds != "") {
        let str = ""
        let ids = this.form.departmentAdminUserIds.split(",")
        for (let i = 0; i < ids.length; i++) {
          for (let j = 0; j < this.users.length; j++) {
            if (this.users[j].userId == ids[i]) {
              str += this.users[j].userName + ","
              break
            }
          }
        }
        this.form.departmentAdminUserNames = str.substring(0, str.length - 1)
      }
    }
  }
}
</script>
