<template>
  <div class="app-container" style="width: 100%; height: 100%;">
    <el-container>
      <el-aside style="width: 500px">
        <div style="margin: auto 30%;">
          <el-upload
              class="avatar-uploader"
              :action="url"
              :show-file-list="false"
              :on-change="handleChange"
              :http-request="httpRequest"
              :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <el-form :model="form" :rules="visitorRules" ref="form">
          <el-form-item label="访客名称：" :label-width="formLabelWidth" prop="visitorName">
            <el-input v-model="form.visitorName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="访客性别：" :label-width="formLabelWidth" prop="visitorSex">
            <el-select v-model="form.visitorSex" placeholder="请选择性别">
              <el-option label="男" value="0"></el-option>
              <el-option label="女" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="访客所属部门：" :label-width="formLabelWidth" prop="visitorDepartmentId">
            <el-select v-model="form.visitorDepartmentId" placeholder="请选择所属部门">
              <el-option v-for="data in departments" :key="data.departmentId" :value="data.departmentId"
                         :label="data.departmentName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出席日：" :label-width="formLabelWidth" prop="attendanceDays">
            <el-checkbox-group v-model="form.days">
              <el-checkbox v-for="data in daysText" :label="data" :key="data" :value="data" name="days"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="备注：" :label-width="formLabelWidth" prop="remarks">
            <el-input v-model="form.remarks" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin: auto 50%;">
          <el-button type="primary" @click="formSubmit" :loading="formLoading">确 定</el-button>
        </div>
      </el-aside>
      <el-container>
        <el-main>
          <el-table
              v-loading="listLoading"
              :data="list.filter(data => !search || data.visitorName.toLowerCase().includes(search.toLowerCase()))"
              element-loading-text="Loading"
              border
              fit
              highlight-current-row
          >
            <el-table-column
                fixed
                prop="visitorId"
                label="访客ID"
                width="120">
            </el-table-column>
            <el-table-column
                prop="visitorName"
                label="访客姓名"
                width="120">
            </el-table-column>
            <el-table-column
                prop="visitorSex"
                label="性别"
                width="100">
              <template slot-scope="scope">{{ scope.row.visitorSex==0 ? "男" : "女"}}</template>
            </el-table-column>
            <el-table-column
                prop="visitorDepartmentId"
                label="所属部门"
                width="120">
            </el-table-column>
            <el-table-column
                prop="attendanceDays"
                label="出席日"
                width="200">
              <template slot-scope="scope">{{ changeDays(scope.row.attendanceDays) }}</template>
            </el-table-column>
            <el-table-column
                prop="remarks"
                label="备注"
                width="250">
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
                <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="deleteVisitor(scope.$index, scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog :title="titleName" :visible.sync="editDialog" center width="50%">
      <el-form :model="formEdit" :rules="visitorRules" ref="form">
        <el-form-item label="访客名称：" :label-width="formLabelWidth" prop="visitorName">
          <el-input v-model="formEdit.visitorName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="访客性别：" :label-width="formLabelWidth" prop="visitorSex">
          <el-select v-model="formEdit.visitorSex" placeholder="请选择性别">
            <el-option label="男" value="0"></el-option>
            <el-option label="女" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访客所属部门：" :label-width="formLabelWidth" prop="visitorDepartmentId">
          <el-select v-model="formEdit.visitorDepartmentId" placeholder="请选择所属部门">
            <el-option v-for="data in departments" :key="data.departmentId" :value="data.departmentId"
                       :label="data.departmentName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出席日：" :label-width="formLabelWidth" prop="attendanceDays">
          <el-checkbox-group v-model="formEdit.days" >
            <el-checkbox @change="handleChangeEdit($event,idx,csDates)" v-for="data in daysText" :label="data" :key="data">{{ data }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth" prop="remarks">
          <el-input v-model="formEdit.remarks" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin: auto 50%;">
        <el-button type="primary" @click="editSubmit" :loading="formLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {validateNotEmpty} from "@/api/validate";
import {getAllDepartment} from "@/api/department";
import {Message} from "element-ui";
import {getAllVisitor, saveOrUpdateVisitor, delVisitor, saveVisitor, updateVisitor} from "@/api/visitor";

const Base64 = require("js-base64").Base64
export default {
  data() {
    return {
      editDialog: false,
      titleName: '编辑',
      url: '#',
      imageUrl: '',
      search: '',
      listLoading: false,
      list: [],
      form: {
        days: []
      },
      formEdit: {
        days: []
      },
      formLabelWidth: '120px',
      visitorRules: {
        visitorName: [{required: true, trigger: 'blur', validator: validateNotEmpty}],
      },
      formLoading: false,
      departments: [],
      daysText: {
        1: '星期一 ',
        2: '星期二 ',
        3: '星期三 ',
        4: '星期四 ',
        5: '星期五 ',
        6: '星期六 ',
        7: '星期天 ',
      },
      picAlready: false,
      file: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      await getAllDepartment().then(async res => {
        if (res.code === 20041) {
          this.departments = res.data
          await getAllVisitor().then(res => {
            if (res.code === 20041) {
              this.list = res.data
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
    handleChange(file, filelist) {
      this.file = file.raw
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isJPG && !isPNG) {
        Message({
          type: "error",
          message: '上传头像图片只能是 JPG/PNG 格式!',
          center: true
        })
      }
      if (!isLt2M) {
        Message({
          type: "error",
          message: '上传头像图片大小不能超过 100MB!',
          center: true
        })
      }

      const fileReader = new FileReader();
      // 将文件转为Base64
      fileReader.readAsDataURL(file);
      // 完成之后赋值
      fileReader.onload = () => {
        // 用于预览
        this.imageUrl = fileReader.result;
      }
      return (isJPG || isPNG) && isLt2M;
    },
    handleEdit(row) {
      this.formEdit = row
      let temp = this.formEdit.attendanceDays.split(",")
      this.formEdit.days=[]
      for (let i = 0; i < temp.length; i++) {
        this.formEdit.days.push(this.daysText[Number(temp[i])])
      }
      this.formEdit.visitorSex = this.formEdit.visitorSex + ""
      console.log(this.formEdit)
      this.editDialog = true
    },
    deleteVisitor(index, row) {
      this.listLoading = true
      delVisitor({visitorIds: row.visitorId}).then(async res => {
        if (res.code == 20021) {
          Message({
            type: "success",
            message: res.message,
            center: true
          })
          await this.fetchData()
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
    async formSubmit() {
      let str = ''
      this.form.days.forEach((elem, index) => {
        for (let k in this.daysText) {
          if (this.daysText[k] === elem) {
            str += (k + ",")
          }
        }
      })
      this.form.attendanceDays = str.substring(0, str.length - 1)
      this.listLoading = true
      const formData = new FormData();
      // 将之前转为base64的文件对象转回Blob并且添加到formdata里
      formData.append("file", this.file);
      formData.append("visitor", this.form.visitorName);
      await saveOrUpdateVisitor(formData).then(async res => { //传参有问题
        if (res.code === 20011) {
          await saveVisitor(this.form).then(res => {
            if (res.code === 20011) {
              this.fetchData()
              Message({
                type: "success",
                message: res.message,
                center: true
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
            message: res.message,
            center: true
          })
        }
      })
      this.listLoading = false
    }
    ,
    changeDays(data) {
      let days = (data || "").split(",");
      let daysStr = "";
      for (const k in days) {
        daysStr += this.daysText[Number(days[k])]
      }
      return daysStr;
    }
    ,
    httpRequest() {
      this.picAlready = true
    },
    // base64转Blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',');
      // 注意base64的最后面中括号和引号是不转译的
      var _arr = arr[1].substring(0, arr[1].length - 2);
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = Base64.decode(_arr);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {
        type: mime,
      })
    },
    editSubmit() {
      let str = ''
      this.formEdit.days.forEach((elem, index) => {
        for (let k in this.daysText) {
          if (this.daysText[k] === elem) {
            str += (k + ",")
          }
        }
      })
      this.formEdit.attendanceDays = str.substring(0, str.length - 1)
      this.listLoading = true
      updateVisitor(this.formEdit).then(res => {
        if (res.code === 20041) {
          this.fetchData()
          Message({
            type: "success",
            message: res.message,
            center: true
          })
        } else {
          Message({
            type: 'error',
            message: res.message,
            center: true
          })
        }
      }).finally(() => {
        this.listLoading=false
        this.editDialog=false
      })
    },
    handleChangeEdit(event,idx,csDates) {
      this.$forceUpdate()
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
