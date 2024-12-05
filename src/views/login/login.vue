<template>
  <div class="login" :style="'background-image:url('+ Background +');'">
    <div v-if="!regFlag">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px"
               class="login-form">
        <h3 class="title">
          考勤管理系统
        </h3>

        <el-form-item prop="username">
          <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                    @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;">
          记住我
        </el-checkbox>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                     @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button size="medium" type="primary" style="width:100%;"
                     @click="regFlag=!regFlag">
            <span>注 册</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="regFlag">
      <el-form ref="regForm" :model="regForm" :rules="regRules" label-position="left" label-width="0px"
               class="login-form">
        <h3 class="title">
          考勤管理系统
        </h3>
        <el-form-item prop="regUsername">
          <el-input v-model="regForm.regUsername" type="text" auto-complete="off" placeholder="昵称">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="regUsername">
          <el-input v-model="regForm.regUserCode" type="text" auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="regPassword">
          <el-input v-model="regForm.regPassword" type="password" auto-complete="off" placeholder="密码">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input v-model="regForm.confirmPassword" type="password" auto-complete="off" placeholder="请确认密码">
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="regForm.phone" type="text" auto-complete="off" placeholder="手机号">
            <svg-icon slot="prefix" icon-class="text" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="regForm.email" type="text" auto-complete="off" placeholder="邮箱">
            <svg-icon slot="prefix" icon-class="text" class="el-input__icon input-icon"/>
          </el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                     @click="handleRegister">
            <span v-if="!loading">注 册</span>
            <span v-else>注 册 中...</span>
          </el-button>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button size="medium" type="primary" style="width:100%;"
                     @click="regFlag=!regFlag">
            <span>返 回</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--  底部  -->
    <div v-if="$store.state.settings.showFooter" id="el-login-footer">
      <span v-html="$store.state.settings.footerTxt"/>
      <span v-if="$store.state.settings.caseNumber"> ⋅ </span>
    </div>
  </div>
</template>

<script>
import Background from '@/assets/images/background.webp'
import {login, getInfo, reg} from '@/api/login'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {Message} from 'element-ui'

const Base64 = require("js-base64").Base64

export default {
  name: 'Login',
  data() {
    return {
      Background: Background,
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: this.validateNotEmpty}],
        password: [{required: true, trigger: 'blur', validator: this.validateNotEmpty}],
      },
      regRules: {
        regUsername: [{required: true, trigger: 'blur', validator: this.validateNotEmpty}],
        regUserCode: [{required: true, trigger: 'blur', validator: this.validateNotEmpty}],
        regPassword: [{required: true, trigger: 'blur', validator: this.validateNotEmpty}],
        confirmPassword: [{required: true, trigger: 'blur', validator: this.validateNotEmpty}],
        phone: [{required: true, trigger: 'blur', validator: this.validateMobilePhone}],
        email: [{required: true, trigger: 'blur', validator: this.validateEmail}],
      },
      regForm: {
        regUsername: '',
        regUserCode: '',
        regPassword: '',
        confirmPassword: '',
        phone: '',
        email: ''
      },
      loading: false,
      redirect: '/',
      regFlag: false
    }
  },
  watch: {},
  mounted() {
    let username = localStorage.getItem("username");
    if (username) {
      this.loginForm.username = localStorage.getItem("username");
      this.loginForm.password = Base64.decode(localStorage.getItem("password"));// base64解密
      this.loginForm.rememberMe = true;
    }
  },
  methods: {
    handleLogin() {
      let username = this.$refs.loginForm.$props.model.username;
      let password = this.$refs.loginForm.$props.model.password;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          login({userCode: username, password: password}).then(res => {
            console.log(res);
            if (res.code === 20041) {
              setToken(res.data.token);
              this.$router.push(this.redirect)

              if (this.loginForm.rememberMe) {
                let password1 = Base64.encode(password); // base64加密
                localStorage.setItem("username", username);
                localStorage.setItem("password", password1);
              } else {
                localStorage.removeItem("username");
                localStorage.removeItem("password");
              }
              return;
            }

          }).finally(() => {
            this.loading = false;
          });
        } else {
          Message({
            type: 'error',
            message: '输入有误！',
            center: true
          })
          this.loading = false;
        }
      })
    },
    handleRegister() {
      let username = this.$refs.regForm.$props.model.regUsername;
      let userCode = this.$refs.regForm.$props.model.regUserCode;
      let password = this.$refs.regForm.$props.model.regPassword;
      let confirmPassword = this.$refs.regForm.$props.model.confirmPassword;
      let phone = this.$refs.regForm.$props.model.phone;
      let email = this.$refs.regForm.$props.model.email;
      this.$refs.regForm.validate(valid => {
        if (valid) {
          if (confirmPassword == password) {
            this.loading = true;
            reg({
              userName: username,
              userCode: userCode,
              password: password,
              confirmPassword: confirmPassword,
              phone: phone,
              email: email
            }).then(res => {
              if (res.code == 20011) {
                this.regFlag = !this.regFlag;
                Message({
                  type: 'success',
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
          this.loading = false;
          return
        } else {
          Message({
            type: 'error',
            message: '输入有误！',
            center: true
          })
        }
      })
    },
    validateEmail(rule, value, callback) {
      if (value === '') {
        callback(new Error('请正确填写邮箱'));
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (!reg.test(value)) {
            callback(new Error('请输入有效的邮箱'));
          }
        }
        callback();
      }
    },
    validateMobilePhone(rule, value, callback) {
      if (value === '') {
        callback(new Error('负责人手机号不可为空'));
      } else {
        if (value !== '') {
          var reg = /^1[3456789]\d{9}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入有效的手机号码'));
          }
        }
        callback();
      }
    },
    validateNotEmpty(rule, value, callback) {
      if (value === '') {
        callback(new Error('内容不可以为空'));
      }
      callback();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
}

.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 385px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle
  }
}
</style>
