<template>
  <div class="app-container">
    <el-container>
      <el-aside width="700px">
        <el-button type="primary" @click="addSpace" style="margin-bottom: 10px;">新增</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
          <el-tab-pane label="未启用" name="disable">
            <el-table
                v-loading="listLoading"
                :data="disabled.filter(data => !search || data.spaceName.toLowerCase().includes(search.toLowerCase()))"
                element-loading-text="Loading"
                border
                fit
                @row-click="handleDisableClick"
                highlight-current-row>
              <el-table-column
                  prop="spaceName"
                  label="空间名称"
                  width="150">
              </el-table-column>
              <el-table-column
                  prop="spaceDepartmentId"
                  label="空间部门"
                  width="120">
              </el-table-column>
              <el-table-column
                  prop="spaceTime"
                  label="空间时间"
                  width="270">
                <template slot-scope="scope">起始：{{ scope.row.spaceTime[0]}} <br />结束：{{scope.row.spaceTime[1] }}</template>
              </el-table-column>
              <el-table-column
                  fixed="right"
                  width="150">
                <template slot="header" slot-scope="scope">
                  <el-input
                      v-model="search"
                      size="mini"
                      placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button @click="handleEnable(scope.row)" type="primary" size="small">启用</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="启用" name="enable" @tab-click="handleTabClick">
            <el-table
                v-loading="listLoading"
                :data="enabled.filter(data => !search || data.spaceName.toLowerCase().includes(search.toLowerCase()))"
                element-loading-text="Loading"
                border
                fit
                @row-click="handleEnableClick"
                highlight-current-row>
              <el-table-column
                  prop="spaceName"
                  label="空间名称"
                  width="150">
              </el-table-column>
              <el-table-column
                  prop="spaceDepartmentId"
                  label="空间部门"
                  width="120">
              </el-table-column>
              <el-table-column
                  prop="spaceTime"
                  label="空间时间"
                  width="270">
                <template slot-scope="scope">起始：{{ scope.row.spaceTime[0]}} <br />结束：{{scope.row.spaceTime[1] }}</template>
              </el-table-column>
              <el-table-column
                  fixed="right"
                  width="150">
                <template slot="header" slot-scope="scope">
                  <el-input
                      v-model="search"
                      size="mini"
                      placeholder="输入关键字搜索"/>
                </template>
                <template slot-scope="scope">
                  <el-button @click="handleDisable(scope.row)" type="primary" size="small">禁用</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-container>
        <el-main>
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="空间ID">
              <el-input v-model="form.spaceId" auto-complete="off" disabled/>
            </el-form-item>
            <el-form-item label="空间名称">
              <el-input v-model="form.spaceName" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="空间所属部门">
              <el-input v-model="form.spaceDepartmentId" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="空间管理员">
              <el-transfer
                  :titles="transferTitle1"
                  filterable
                  :filter-method="filterMethod"
                  filter-placeholder="请输入用户名称"
                  v-model="adminUsers"
                  :data="users">
              </el-transfer>
            </el-form-item>
            <el-form-item label="起始时间">
              <el-date-picker
                  v-model="form.spaceTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="启用情况">
              <el-input v-model="form.spaceEnable" auto-complete="off" disabled/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.remarks" auto-complete="off"/>
            </el-form-item>
            <el-form-item label="空间创建人ID">
              <el-input v-model="form.createId" auto-complete="off" disabled/>
            </el-form-item>
            <el-form-item label="空间创建人">
              <el-input v-model="form.createName" auto-complete="off" disabled/>
            </el-form-item>
            <el-form-item label="空间创建时间">
              <el-input v-model="form.createTime" auto-complete="off" disabled/>
            </el-form-item>
            <el-form-item label="空间考勤情况">
              <el-transfer
                  :titles="transferTitle2"
                  filterable
                  :filter-method="filterMethod"
                  filter-placeholder="请输入访客名称"
                  v-model="alreadyVisitor"
                  :data="visitors">
              </el-transfer>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog :title="titleName" :visible.sync="addDialog" center width="55%">
      <el-form ref="form" :model="DialogForm" label-width="120px">
        <el-form-item label="空间名称">
          <el-input v-model="DialogForm.spaceName" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="空间所属部门">
          <el-select v-model="DialogForm.spaceDepartmentId" placeholder="请选择所属部门">
            <el-option v-for="data in departments" :key="data.departmentId" :value="data.departmentId" :label="data.departmentName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="空间管理员">
          <el-transfer
              :titles="transferTitle1"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入用户名称"
              v-model="DialogAdminUsers"
              :data="users">
          </el-transfer>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker
              v-model="DialogForm.spaceTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="DialogForm.remarks" auto-complete="off"/>
        </el-form-item>
        <el-form-item label="访客名单">
          <el-transfer
              :titles="transferTitle4"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入访客名称"
              v-model="DialogAlreadyVisitor"
              :data="visitors">
          </el-transfer>
        </el-form-item>
        <el-form-item label="部门名单">
          <el-transfer
              :titles="transferTitle3"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="请输入部门名称"
              v-model="DialogAlreadyDepartment"
              :data="departments">
          </el-transfer>
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

import { getAllSpace, saveOrUpdateSpace } from "@/api/space";
import {Message} from "element-ui";
import {getAll} from "@/api/user";
import {getAllVisitor, getBySpace} from "@/api/visitor";
import { getAllDepartment } from "@/api/department";
import {getLogBySpace} from "@/api/visitorLog";

export default {
  data() {
    return {
      listLoading: false,
      transferTitle1: ['全体用户', '管理员'],
      transferTitle2: ['全体访客', '已完成考勤'],
      transferTitle3: ['全部部门', '已包含部门'],
      transferTitle4: ['全部访客', '已包含访客'],
      transferButton: ['启用', '禁用'],
      spaces: [],
      enabled: [],
      disabled: [],
      activeName: 'disable',
      search: '',
      enableRow: {
        spaceId: '',
        spaceName: '',
        spaceDepartmentId: '',
        spaceTime: ['',''],
        spaceEnable: '',
        remarks: '',
        createId: '',
        createName: '',
        createTime: '',
        listId: ''
      },
      disableRow: {
        spaceId: '',
        spaceName: '',
        spaceDepartmentId: '',
        spaceTime: ['',''],
        spaceEnable: '',
        remarks: '',
        createId: '',
        createName: '',
        createTime: '',
        listId: ''
      },
      form: {
        spaceId: '',
        spaceName: '',
        spaceDepartmentId: '',
        spaceTime: ['',''],
        spaceEnable: '',
        remarks: '',
        createId: '',
        createName: '',
        createTime: ''
      },
      DialogForm: {
        spaceId: '',
        spaceName: '',
        spaceDepartmentId: '',
        spaceTime: ['',''],
        spaceEnable: '',
        remarks: '',
        createId: '',
        createName: '',
        createTime: ''
      },
      users: [],
      adminUsers: [],
      DialogAdminUsers: [],
      visitors: [],
      alreadyVisitor: [],
      DialogAlreadyVisitor: [],
      addDialog: false,
      titleName: "新增访客空间",
      formLoading: false,
      DialogAlreadyDepartment: [],
      departments: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    filterMethod() {
      return true
    },
    async fetchData() {
      await getAllSpace().then(res => {
        if (res.code === 20041) {
          this.spaces = res.data
          for (let i = 0; i < this.spaces.length; i++) {
            this.spaces[i].spaceTime = [this.spaces[i].spaceStartTime, this.spaces[i].spaceEndTime]
            if (this.spaces[i].spaceEnable == "0") {
              this.disabled.push(this.spaces[i])
            } else {
              this.enabled.push(this.spaces[i])
            }
          }
          getAll().then(res => {
            if (res.code === 20041) {
              this.users = res.data
              for (let i = 0; i < res.data.length; i++) {
                this.users[i].key = res.data[i].userId
                this.users[i].label = res.data[i].userName
              }
              getAllDepartment().then(async res => {
                if (res.code === 20041) {
                  this.departments = res.data
                  for (let i = 0; i < res.data.length; i++) {
                    this.departments[i].key = res.data[i].departmentId
                    this.departments[i].label = res.data[i].departmentName
                  }
                  await getAllVisitor().then(res => {
                    if (res.code === 20041) {
                      this.visitors = res.data
                      for (let i = 0; i < res.data.length; i++) {
                        this.visitors[i].key = res.data[i].visitorId
                        this.visitors[i].label = res.data[i].visitorName
                      }
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
                    type: "error",
                    message: res.message,
                    center: true
                  })
                }
              })
              this.handleTabClick()
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
            type: "error",
            message: res.message,
            center: true
          })
        }
      })
    },
    async handleEnable(row) {
      this.listLoading = true
      row.spaceEnable = "1"
      await saveOrUpdateSpace(row).then(res => {
        if (res.code === 20011) {
          delete this.disabled[this.disabled.indexOf(row)]
          this.enabled.push(row)
        } else {
          Message({
            type: "error",
            message: res.message,
            center: true
          })
        }
      })
      this.listLoading = false
    },
    async handleDisable(row) {
      this.listLoading = true
      row.spaceEnable = "0"
      await saveOrUpdateSpace(row).then(res => {
        if (res.code === 20011) {
          delete this.enabled[this.enabled.indexOf(row)]
          this.disabled.push(row)
        } else {
          Message({
            type: "error",
            message: res.message,
            center: true
          })
        }
      })
      this.listLoading = false
    },
    handleDisableClick(row) {
      this.disableRow = row
      this.handleTabClick()
    },
    handleEnableClick(row) {
      this.enableRow = row
      this.handleTabClick()
    },
    onSubmit() {
      let AdminUserIds = ""
      for (let i = 0; i < this.adminUsers.length; i++) {
        AdminUserIds += (this.adminUsers[i] + ",")
      }
      if (AdminUserIds != "") {
        this.form.spaceAdminUserIds = AdminUserIds.substring(0, AdminUserIds.length - 1)
      }
      this.form.spaceStartTime = this.form.spaceTime[0]
      this.form.spaceEndTime = this.form.spaceTime[1]
      saveOrUpdateSpace(this.form).then(res => {
        if (res.code === 20011) {
          Message({
            type: "success",
            message: res.message,
            center: true
          })
          this.addDialog = false
          this.listLoading = true
          getAllSpace().then(res => {
            if (res.code === 20041) {
              this.spaces = res.data

            } else {
              Message({
                type: "error",
                message: res.message,
                center: true
              })
            }
          }).finally(() => {
            this.listLoading = false
          })
        } else {
          Message({
            type: "error",
            message: res.message,
            center: true
          })
        }
      })
    },
    addSpace() {
      this.addDialog = true
    },
    async handleTabClick() {
      if (this.activeName == "disable") {
        this.form = this.disableRow
      } else {
        this.form = this.enableRow
      }
      if (this.form.spaceId != "" && this.form.spaceId != null) {
        let ids = (this.form.spaceAdminUserIds || "").split(",")
        this.adminUsers = []
        for (let i = 0; i < ids.length; i++) {
          for (let j = 0; j < this.users.length; j++) {
            if (this.users[j].userId == ids[i]) {
              this.adminUsers.push(this.users[j].key)
              break
            }
          }
        }
        this.sleep(200)
        await getBySpace(this.form).then(async res => {
          if (res.code === 20041) {
            this.visitors = res.data
            this.alreadyVisitor = []
            for (let i = 0; i < this.visitors.length; i++) {
              this.visitors[i].key = this.visitors[i].visitorId
              this.visitors[i].label = this.visitors[i].visitorName
            }
            // 添加一个查找该空间时段内所包含访客的已访问名单
            await getLogBySpace(this.form).then(res => {
              if (res.code === 20041) {
                for (let i = 0; i < res.data.length; i++) {
                  this.alreadyVisitor.push(res.data[i].visitorId)
                }
              }
            })
          } else {
            Message({
              type: "error",
              message: res.message,
              center: true
            })
          }
        })
      }
    },
    dialogFormVisible() {
      this.addDialog = false
    },
    dialogFormSubmit() {
      let AdminUserIds = ""
      for (let i = 0; i < this.DialogAdminUsers.length; i++) {
        AdminUserIds += (this.DialogAdminUsers[i] + ",")
      }
      if (AdminUserIds != "") {
        this.DialogForm.spaceAdminUserIds = AdminUserIds.substring(0, AdminUserIds.length - 1)
      }
      let departmentIds = ""
      for (let i = 0; i < this.DialogAlreadyDepartment.length; i++) {
        departmentIds += (this.DialogAlreadyDepartment[i] + ",")
      }
      if (departmentIds != "") {
        this.DialogForm.departmentIds = departmentIds.substring(0, departmentIds.length - 1)
      }
      let visitorIds = ""
      for (let i = 0; i < this.DialogAlreadyVisitor.length; i++) {
        visitorIds += (this.DialogAlreadyVisitor[i] + ",")
      }
      if (visitorIds != "") {
        this.DialogForm.visitorIds = visitorIds.substring(0, visitorIds.length - 1)
      }
      this.DialogForm.spaceStartTime = this.DialogForm.spaceTime[0]
      this.DialogForm.spaceEndTime = this.DialogForm.spaceTime[1]
      saveOrUpdateSpace(this.DialogForm).then(res => {
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

