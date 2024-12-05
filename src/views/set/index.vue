<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()))"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
          fixed
          prop="userId"
          label="用户ID"
          width="150">
      </el-table-column>
      <el-table-column
          prop="userName"
          label="用户"
          width="120">
      </el-table-column>
      <el-table-column
          prop="userType"
          label="身份权限"
          width="120">
        <template slot-scope="scope"> {{ statusText[scope.row.userType] }}</template>
      </el-table-column>
      <el-table-column
          prop="deptId"
          label="部门ID"
          width="120">
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
          width="300">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="手机号码"
          width="120">
      </el-table-column>
      <el-table-column
          prop="remarks"
          label="备注"
          width="200">
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
          <el-button @click="deleteUser(scope.$index, scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="titleName" :visible.sync="addDialog" center width="50%">
      <el-form :model="form" ref="form" :rules="userRules">
        <el-form-item label="用户名称：" :label-width="formLabelWidth" prop="userName">
          <el-input v-model="form.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户账号：" :label-width="formLabelWidth" prop="userCode">
          <el-input v-model="form.userCode" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="用户权限：" :label-width="formLabelWidth" prop="userType">
          <el-select v-model="form.userType" placeholder="请选择权限等级">
            <el-option label="管理员" value="0"></el-option>
            <el-option label="普通用户" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门ID" :label-width="formLabelWidth" prop="departmentId">
          <el-select v-model="form.deptId" placeholder="请选择所属部门">
            <el-option v-for="data in departments" :key="data.departmentId" :value="data.departmentId" :label="data.departmentName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱：" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input v-model="form.remarks" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible">取 消</el-button>
        <el-button type="primary" @click="dialogFormSubmit" :loading="formLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAll, getInfo, updateInfo, delUser } from '@/api/user'
import {delDepartment, getAllDepartment} from '@/api/department'
import {Message} from "element-ui";
import {title} from "@/settings";
import { validateEmail, validateMobilePhone, validateNotEmpty } from "@/api/validate";

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
      addDialog: false,
      form: {

      },
      formLabelWidth: '120px',
      formLoading: false,
      departments: {},
      statusText: {
        '0': '管理员',
        '1': '普通用户'
      },
      search: "",
      userRules: {
        userName: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
        userCode: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
        password: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
        userType: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
        phone: [{required: true, trigger: 'blur', validator: validateMobilePhone}],
        email: [{required: true, trigger: 'blur', validator: validateEmail}],
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
          getAll().then(response => {
            this.list = response.data
            this.listLoading = false
            getAllDepartment().then(res => {
              if (res.code == 20041) {
                this.departments = res.data
              } else {
                Message({
                  type: 'error',
                  message: res.message,
                  center: true
                })
              }
            })
          })
        } else {
          Message({
            type: 'error',
            message: '非管理员无法使用此模块！',
            center: true
          })
          this.$router.push("/")
        }

      })

    },
    handleCheck(row) {
      this.addDialog = true;
      this.form = row
    },
    deleteUser(index, row) {
      this.listLoading = true
      delUser({userIds: row.userId} ).then(res => {
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
      this.addDialog = false;
    },
    dialogFormSubmit() {
      this.formLoading = true;
      this.form.confirmPassword=this.form.password;
      this.$refs.form.validate(valid => {
        if (valid) {
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
          })
        } else {
          Message({
            type: 'error',
            message: '输入有误！',
            center: true
          })
        }
      })
      this.formLoading = false;
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
