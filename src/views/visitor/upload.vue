<template>
  <div class="app-container" style="width: 100%; height: 100%;">
    <el-row>
      <el-col :span="12">
        <el-upload
            class="upload-demo"
            action="#"
            drag
            :on-change="handleChangeExcel"
            :http-request="httpRequest"
            :before-upload="beforeExcelUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">导入访客EXCEL名单</div>
        </el-upload>
      </el-col>
      <el-col :span="12">
        <el-upload
            class="upload-demo"
            action="#"
            drag
            :on-change="handleChangeZip"
            :http-request="httpRequest"
            :before-upload="beforeExcelUpload">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">导入访客照片ZIP压缩包，图片命名和EXCEL名单中的访客名称相同</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row center>
      <el-col :span="10">
        <el-button type="primary" @click="formSubmit" v-loading="loading">确 定</el-button></el-col>
    </el-row>
  </div>
</template>

<script>
import {getVisitorExcel, getVisitorZip} from "@/api/upload";
import {Message} from "element-ui";

export default {
  data() {
    return {
      urlExcel: '',
      urlZip: '',
      fileExcel: null,
      fileZip: null,
      loading: false
    }
  },
  created() {

  },
  methods: {
    handleChangeExcel(file, filelist) {
      this.fileExcel = file.raw
    },
    handleChangeZip(file, filelist) {
      this.fileZip = file.raw
    },
    beforeExcelUpload(file) {
      console.log(file)
    },
    beforeZipUpload(file) {
      console.log(file)
    },
    httpRequest() {

    },
    async formSubmit() {
      this.loading = true
      const formData = new FormData();
      if (this.fileExcel != null) {
        formData.append("file", this.fileExcel);
        await getVisitorExcel(formData).then(async res => {
          if (res.code === 20011) {
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
      }
      if (this.fileZip != null) {
        formData.append("file", this.fileZip);
        await getVisitorZip(formData).then(async res => {
          if (res.code === 20011) {
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
      }
      this.loading = false
    }
  }
}
</script>
