<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="departmentRules" label-width="120px">
      <el-form-item label="部门ID">
        <el-input v-model="form.departmentId" auto-complete="off" disabled/>
      </el-form-item>
      <el-form-item label="部门名称">
        <el-input v-model="form.departmentName" auto-complete="off"/>
      </el-form-item>
      <el-form-item label="部门电话">
        <el-input v-model="form.departmentPhone" auto-complete="off"/>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remarks" auto-complete="off"/>
      </el-form-item>
      <el-form-item label="部门创建人ID">
        <el-input v-model="form.createId" auto-complete="off" disabled/>
      </el-form-item>
      <el-form-item label="部门创建人">
        <el-input v-model="form.createName" auto-complete="off" disabled/>
      </el-form-item>
      <el-form-item label="部门创建时间">
        <el-input v-model="form.createTime" auto-complete="off" disabled/>
      </el-form-item>
      <el-form-item label="部门管理员">
        <el-transfer
            :titles="transferTitle"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入用户名称"
            v-model="adminUsers"
            :data="users">
        </el-transfer>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {getMyDepartment, saveOrUpdateDepartment} from "@/api/department";
import {Message} from "element-ui";
import {validateMobilePhone, validateNotEmpty} from "@/api/validate";
import {getAll} from "@/api/user";

export default {
  data() {
    return {
      form: {
        departmentId: '',
        departmentName: '',
        departmentPhone: '',
        departmentAdminUserIds: '',
        remarks: '',
        createTime: '',
        createId: '',
        createName: ''
      },
      departmentRules: {
        departmentName: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
        departmentPhone: [{required: true, trigger: 'blur', validator: validateMobilePhone}],
        departmentAdminUserIds: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
      },
      adminUsers: [],
      users: [],
      transferTitle: ['全体用户', '部门管理员']
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let AdminUserIds = ""
          for (let i = 0; i < this.adminUsers.length; i++) {
            AdminUserIds += (this.adminUsers[i] + ",")
          }
          if (AdminUserIds != "") {
            this.form.departmentAdminUserIds = AdminUserIds.substring(0, AdminUserIds.length - 1)
          }
          saveOrUpdateDepartment(this.form).then(res => {
            if (res.code === 20011) {
              Message({
                type: "success",
                message: res.message,
                center: true
              })
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
    },
    onReset() {
      getMyDepartment().then(res => {
        if (res.code === 20041) {
          this.form = res.data
        } else {
          Message({
            type: 'error',
            message: res.message,
            center: true
          })
        }
      })
    },
    fetchData() {
      getMyDepartment().then(res => {
        if (res.code === 20041) {
          this.form = res.data
          getAll().then(res => {
            if (res.code === 20041) {
              this.users = res.data
              for (let i = 0; i < res.data.length; i++) {
                this.users[i].key = res.data[i].userId
                this.users[i].label = res.data[i].userName
              }
              if (this.form.departmentId != "" && this.form.departmentId != null) {
                let ids = (this.form.departmentAdminUserIds || "").split(",")
                this.adminUsers = []
                for (let i = 0; i < ids.length; i++) {
                  for (let j = 0; j < this.users.length; j++) {
                    if (this.users[j].userId == ids[i]) {
                      this.adminUsers.push(this.users[j].key)
                      break
                    }
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
            message: '非本部门管理员无法使用此模块！',
            center: true
          })
          this.$router.push("/")
        }
      })
    },
    filterMethod() {
      return true
    }
  }
}
</script>

