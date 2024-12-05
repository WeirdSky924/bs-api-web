<template>
  <div class="app-container">
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <label>选择访客的访问时间：</label>
        <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日 HH 时 mm 分 ss 秒"
            style="width: 400px">
        </el-date-picker>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-upload
            class="upload-demo"
            action="#"
            :show-file-list="false"
            :on-change="handleChange"
            :http-request="httpRequestIn"
            :before-upload="beforeAvatarUpload"
            list-type="picture">
          <el-button size="small" type="primary">点击上传进入用户图片</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
      </el-col>
      <el-col :span="10">
        <el-upload
            class="upload-demo"
            action="#"
            :show-file-list="false"
            :on-change="handleChange"
            :http-request="httpRequestOut"
            :before-upload="beforeAvatarUpload"
            list-type="picture">
          <el-button size="small" type="primary">点击上传退出用户图片</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {Message} from "element-ui";
import {demoIn, demoOut} from "@/api/visitorLog";

const Base64 = require("js-base64").Base64

export default {
  data() {
    return {
      fileListIn: [],
      fileListOut: [],
      demoIn: 'http://127.0.0.1:8080/' + 'visitor_log/in',
      demoOut: 'http://127.0.0.1:8080/' + 'visitor_log/out',
      date: '',
      loading: false,
      file: null,
      imageUrl: null,
      isIn: false
    }
  },
  created() {
    this.date = new Date();
  },
  methods: {
    submit() {
      this.loading = true
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("time", this.date);
      if (this.isIn) {
        demoIn(formData).then(res => {
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
        }).finally(() => {
          this.loading = false
        })
      } else {
        demoOut(formData).then(res => {
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
        }).finally(() => {
          this.loading = false
        })
      }
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
      console.log(file)
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
    httpRequestIn() {
      this.isIn = true
    },
    httpRequestOut() {
      this.isIn = false
    },
    handleChange(file, filelist) {
      this.file = file.raw
    },
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
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
