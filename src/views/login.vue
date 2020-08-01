<template>
  <div class="login-wrapper">
    <div class="login">
      <el-row class="login-content">
        <el-col :span="12" class="left">
          <el-carousel trigger="click" class="left-content" height="388px">
            <el-carousel-item v-for="item in 4" :key="item" class="carousel-item">
<!--              <img src="../assets/img/login_move.png">-->
            </el-carousel-item>
          </el-carousel>
        </el-col>
        <el-col :span="12" class="right">
          <div class="content right-content">
            <div class="logo" ref="logoF">
<!--              <img :src="companyInfo.logoCompany" alt="logo" width="240" ref="logoImg" @load="imgload">-->
               <img src="../assets/logo.png" alt="logo" width="240" v-cloak ref="logoImg" @load="imgload" @error="imgerr">
            </div>
            <el-form :model="user" status-icon :rules="rules" ref="login" class="demo-ruleForm"
                     style="{'width':'270px'}">
              <el-form-item prop="loginName" class="loginName">
                <el-input v-model="user.loginName" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password" v-model="user.password" prefix-icon="el-icon-lock" placeholder="请输入密码"
                          @keyup.enter.native='login' show-password></el-input>
              </el-form-item>
              <el-checkbox v-model="checked">
                <el-button type="text" @click="dialogTableVisible = true" class="read">我已阅读并同意《用户协议》及相关服务政策</el-button>
              </el-checkbox>
              <el-form-item>
                <el-button type="primary" @click="login()" class="button" round>
                  <span>开始工作</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog :modal-append-to-body='false' v-dialogDrag title="用户隐私权政策1.0" :visible.sync="dialogTableVisible"
               append-to-body>
      <iframe src="https://www.86xc.net/UserAgreement/UserPrivacyPolicy.html" style="width:100%" height="500">
      </iframe>
    </el-dialog>
    <div class="bottom-wrapper">
      <bottom :wxMerchantName="companyInfo.systemType"/>
    </div>
  </div>
</template>

<script>
  import bottom from '../components/bottom/index.vue'

  export default {
    data() {
      return {
        companyInfo: {
          logoCompany: "../assets/logo.png",
          systemType: "管理系统"
        },
        loading: false,
        checked: true,
        dialogTableVisible: false,
        rules: {//验证规则
          loginName: [
            {required: true, message: '用户名不能为空', trigger: 'blur'},
            {min: 1, max: 20, message: '用户名长度为 1 到 20 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur',},
            {min: 1, max: 20, message: '密码长度为 1 到 20 个字符', trigger: 'blur',}
          ],
        },
        user: {
          loginName: 'admin',
          password: 'admin',
        },
        // user: {
        //   loginName: '',
        //   password: '',
        // },
        showUserName: false,
        showPassword: false,
        MenuData: '',
        // co: '',
        authoritySwitch: '',
      }
    },
    watch: {
      // $route(to, from) {
      //   this.co = to.params.co
      //   sessionStorage.setItem('co', this.co)
      // },
    },
    computed: {},
    components: {
      bottom
    },
    created() {
      //window.location.assign("http://www.fangzhizun.com") 页面跳转
      //this.$router.push('/notfind404') //路由跳转
    },
    mounted() {
    },
    methods: {
      imgload() {//监听图片是否加载完成
        if (this.$refs.logoImg.height > 160) {
          console.log('高度溢出')
          this.$refs.logoImg.width = 180
          this.$refs.logoF.style.paddingBottom = 0
        }
      },
      imgerr() {
        console.log('加载失败')
      },
      //表单验证
      submitForm(formName) {
        let state = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            state = true
          } else {
            state = false
          }
        })
        return state
      },
      resetForm(formName) {
        setTimeout(() => {
          // this.$refs[formName].resetFields();//清除name
          this.$refs[formName].clearValidate();//不清除name
        }, 1)
      },
      log() {//获取日志信息
        let obj = {}
        //获取分辨率
        obj.resolvingPower = `${window.screen.width} x ${window.screen.height}`
        //获取ip地址、地区
        obj.ipAddress = window.returnCitySN ? window.returnCitySN.cip : '127.0.0.1'
        obj.region = window.returnCitySN ? window.returnCitySN.cname : '获取地址异常'
        obj.loginName = this.user.loginName
        obj.password = this.user.password
        obj.userType = 'pc用户'
        obj.loginTime = new Date().getTime()
        return obj

      },
      // 网页初始请求
      login() {
        if (!this.checked) {
          this.$message.warning("请阅读用户协议")
          return
        }
        if (this.submitForm('login')) {
          this.loading = true
          this.$axios({
            method: 'post',
            url: '/restboot/login',
            data: this.log()
          }).then(res => {
            this.loading = false
            sessionStorage.setItem("token", res.data.result.token);
            sessionStorage.setItem("loginName", res.data.result.loginName);
            sessionStorage.setItem("userName", res.data.result.username);
            sessionStorage.setItem("systemType", res.data.result.systemType);
            sessionStorage.setItem("describe", res.data.result.describe);
            sessionStorage.setItem("spId", 1);
            this.$router.push({name: "main"});
          }).catch(err => {
            this.loading = false
            this.isError(err, this)
          })
        }
      },
    }
  };
</script>


<style lang="scss" scoped>
  a {
    text-decoration: none;
    color: rgb(166, 166, 166);
    line-height: 12px;
    font-size: 12px;
  }

  .login-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #2d3a4b;
    min-height: 700px;
    max-width: 3000px;
    min-width: 1200px;

    .login {
      position: absolute;
      top: 45%;
      left: 50%;
      -webkit-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      width: 55%;
      height: 55%;
      // height: 50%;
      max-width: 100%;
      margin: 0 auto;
      // margin: 0 auto;
      overflow: hidden;
      background: white;
      border-radius: 10px !important;
      // background-clip:content-box;
      // .login-content{
      //   border-radius: 10px !important;
      // }
      // width: 416px;
      // height: 216px;
      .left-content {
        margin: 0 auto;
        width: 386px;
        // height: 400px;
      }

      // .left-content{
      //   margin: 0 auto;
      // }
      .left, .right {
        height: 100%;
        position: relative;
        display: flex;
        align-items: center;
        justify-items: center;
      }

      .right-content {
        width: 300px;
        // height: 350px;
      }

      .login-content {
        // width: 830px;
        // height: 430px;
        height: 100%;

        .left {
          img {
            height: 100%;
          }
        }

        .right {
          // height: 100%;
          .content {
            // width: 300px;
            margin: 0 auto;

            .logo {
              padding-bottom: 40px;
              padding-top: 10px;

              img {
                margin: 0 auto;
                display: block;
              }
            }

            .loginName {
              padding-bottom: 16px;
            }

            ::v-deep .el-form-item__error {
              padding-left: 30px;
              padding-top: 3px;
            }

            .el-form-item {
              ::v-deep input {
                height: 30px;
              }
            }

            .read {
              font-size: 10px;
              color: rgb(192, 192, 192);
            }

            ::v-deep .el-input__inner {
              border: none;
              border-bottom: 1px solid rgb(179, 179, 179);
              width: 300px;
            }

            .button {
              width: 100%;
              background-color: rgb(15, 95, 218);
              margin-top: 30px;
            }
          }
        }
      }
    }

    .bottom-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgb(238, 238, 238);
    }
  }

</style>
