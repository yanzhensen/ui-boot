<template>
  <el-container style="height: 100vh">
    <el-menu
        router
        :default-active="this.$route.path"
        unique-opened
        class="el-menu-vertical-demo"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#FFFFFF"
        active-text-color=" #409eff"
    >
      <!--侧边栏-->
      <el-menu-item
          index="/welcome"
          style="font-size: 20px;font-weight: 700;line-height: 45px; height: 50px; z-index: 999;background: #1f2d3d;text-align: center">
        <span>Sam测试系统</span>
      </el-menu-item>

      <!-- 测试 -->
      <el-submenu v-for="item in menuList" :key="item.alias" :index="item.menuName">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.menuName}}</span>
        </template>
        <el-menu-item v-show="item2.menuType !== 0" v-for="item2 in item.childrens" :key="item2.alias"
                      :index="item2.router" @click="submenuClick(item2.router)">{{item2.menuName}}
        </el-menu-item>
        <el-submenu v-show="item2.menuType == 0" v-for="item2 in item.childrens" :index="item2.menuName"
                    :key="item2.alias + '1'">
          <template slot="title">
            <i :class="item2.icon"></i>
            <span slot="title">{{item2.menuName}}</span>
          </template>
          <el-menu-item v-for="item3 in item2.childrens" :key="item3.alias" :index="item3.router"
                        @click="submenuClick(item3.router)">{{item3.menuName}}
          </el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>


    <el-container>
      <!--头部-->
      <el-header style="margin-bottom:5px;">
        <el-row class="header">
          <el-col :span="2" class="col-left-btn">
            <el-button style="float:left" :icon="icon" v-model="isCollapse" @click="qiehuan"></el-button>
          </el-col>

          <el-col :span="17" style="text-align: center;" class="col-center-span">
            <span>{{userName}}，{{text}}，欢迎使用{{systemType}}。</span>
          </el-col>

          <el-col :span="5" size="mini">

            <el-dropdown trigger="click" style="float:right;width:50px;height:50px">
              <div class="hoverbox" style="height:100%;width:60px;right:30px;position:absolute;cursor: pointer;">
                <img src="https://pic-static.fangzhizun.com/images/headPortrait.gif" alt=""
                     style="height:42px;width:42px;border-radius:8px;float:left;margin:4px 0 0 4px">
                <i class="el-icon-caret-bottom" style="float:right;margin-top:32px;color:#fff;"></i>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="attendanceClick" icon="el-icon-date">上下班打卡</el-dropdown-item>
                <el-dropdown-item @click.native="logOut" icon="el-icon-switch-button">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div v-if="full" class="hoverbox"
                 style="height:100%;width:30px;float:right;margin:0 55px 0 0;color:#5a5e66;">
              <svg xmlns="http://www.w3.org/2000/svg" @click="screen" viewBox="0 0 128 128"
                   style="cursor: pointer;width:20px;float:left;margin-top:15px;">
                <title>退出全屏</title>
                <path fill="#FFFFFF"
                      d="M49.217 41.329l-.136-35.24c-.06-2.715-2.302-4.345-5.022-4.405h-3.65c-2.712-.06-4.866 2.303-4.806 5.016l.152 19.164-24.151-23.79a6.698 6.698 0 0 0-9.499 0 6.76 6.76 0 0 0 0 9.526l23.93 23.713-18.345.074c-2.712-.069-5.228 1.813-5.64 5.02v3.462c.069 2.721 2.31 4.97 5.022 5.03l35.028-.207c.052.005.087.025.133.025l2.457.054a4.626 4.626 0 0 0 3.436-1.38c.88-.874 1.205-2.096 1.169-3.462l-.262-2.465c0-.048.182-.081.182-.136h.002zm52.523 51.212l18.32-.073c2.713.06 5.224-1.609 5.64-4.815v-3.462c-.068-2.722-2.317-4.97-5.021-5.04l-34.58.21c-.053 0-.086-.021-.138-.021l-2.451-.06a4.64 4.64 0 0 0-3.445 1.381c-.885.868-1.201 2.094-1.174 3.46l.27 2.46c.005.06-.177.095-.177.141l.141 34.697c.069 2.713 2.31 4.338 5.022 4.397l3.45.006c2.705.062 4.867-2.31 4.8-5.026l-.153-18.752 24.151 23.946a6.69 6.69 0 0 0 9.494 0 6.747 6.747 0 0 0 0-9.523L101.74 92.54v.001zM48.125 80.662a4.636 4.636 0 0 0-3.437-1.382l-2.457.06c-.05 0-.082.022-.137.022l-35.025-.21c-2.712.07-4.957 2.318-5.022 5.04v3.462c.409 3.206 2.925 4.874 5.633 4.814l18.554.06-24.132 23.928c-2.62 2.626-2.62 6.89 0 9.524a6.694 6.694 0 0 0 9.496 0l24.155-23.79-.155 18.866c-.06 2.722 2.094 5.093 4.801 5.025h3.65c2.72-.069 4.962-1.685 5.022-4.406l.141-34.956c0-.05-.182-.082-.182-.136l.262-2.46c.03-1.366-.286-2.592-1.166-3.46h-.001zM80.08 47.397a4.62 4.62 0 0 0 3.443 1.374l2.45-.054c.055 0 .088-.02.143-.028l35.08.21c2.712-.062 4.953-2.312 5.021-5.033l.009-3.463c-.417-3.211-2.937-5.084-5.64-5.025l-18.615-.073 23.917-23.715c2.63-2.623 2.63-6.879.008-9.513a6.691 6.691 0 0 0-9.494 0L92.251 26.016l.155-19.312c.065-2.713-2.097-5.085-4.802-5.025h-3.45c-2.713.069-4.954 1.693-5.022 4.406l-.139 35.247c0 .054.18.088.18.136l-.267 2.465c-.028 1.366.288 2.588 1.174 3.463v.001z">
                </path>
              </svg>
            </div>
            <div v-else class="hoverbox" style="height:100%;width:30px;float:right;margin:0 55px 0 0;color:#5a5e66;">
              <svg xmlns="http://www.w3.org/2000/svg" alt="全屏" @click="screen"
                   style="display:block;cursor: pointer;width:20px;float:left;padding:15px 2px;" viewBox="0 0 128 128">
                <title>全屏</title>
                <path fill="#FFFFFF"
                      d="M38.47 52L52 38.462l-23.648-23.67L43.209 0H.035L0 43.137l14.757-14.865L38.47 52zm74.773 47.726L89.526 76 76 89.536l23.648 23.672L84.795 128h43.174L128 84.863l-14.757 14.863zM89.538 52l23.668-23.648L128 43.207V.038L84.866 0 99.73 14.76 76 38.472 89.538 52zM38.46 76L14.792 99.651 0 84.794v43.173l43.137.033-14.865-14.757L52 89.53 38.46 76z">
                </path>
              </svg>
            </div>
            <div style="float:right;margin-right: 10px;" class='hidden-md-and-down'>
              <span style="color: #fff;font-size: 13px;">主题色:</span>
              <ThemePicker></ThemePicker>
            </div>
          </el-col>
        </el-row>
        <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container"
                      @wheel.native.prevent="handleScroll">
          <el-row ref="scrollRow" class="headerTag">
            <el-col :span="24" style="padding-left:5px;">
              <el-tag @click="welcomeVue" @contextmenu.prevent.native="rightClick(1,$event)" :effect="dark" :type="info"
                      style="cursor: pointer;">
                欢迎使用
              </el-tag>
              <el-tag
                  v-for="(tag,i) in this.tagList"
                  :key="i"
                  closable
                  :ref="tag.fileName"
                  @contextmenu.prevent.native="rightClick(tag,$event)"
                  :disable-transitions="true"
                  @close="handleClose(i,tag.pathTo,tag.fileName)"
                  @click="tagClick(tag)"
                  :effect="tag.effect"
                  :type="tag.info"
                  style="margin:0 0 0 5px;
                cursor: pointer">
                {{tag.name}}
              </el-tag>
              <!-- :effect="path==tag.pathTo?'dark':'plain'"
              :type="path==tag.pathTo?'success':'info'"  -->
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-header>
      <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <li @click="refashClick">刷新</li>
        <li @click="closeSelf" v-if="this.selectedTag!==1">关 闭</li>
        <li @click="closeOthers">关闭其他</li>
        <li @click="closeAll">关闭所有</li>
      </ul>
      <el-main style="padding:0">
        <div class="elMain">
          <keep-alive :include="catchList">
            <router-view v-if="isRouterAlive"></router-view>
          </keep-alive>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import ThemePicker from "../components/color"
  import {mapState, mapActions} from 'vuex';

  export default {
    provide() {//刷新当前页面
      return {
        reload: this.reload
      }
    },
    components: {
      ThemePicker
    },
    data() {
      return {
        // isCollapse: false,
        // icon: "el-icon-s-fold",
        // time: "600",
        systemType: sessionStorage.getItem('systemType'),
        describe: sessionStorage.getItem('describe'),
        userName: sessionStorage.getItem('userName'),
        menu: sessionStorage.getItem('menu'),
        full: false,
        info: 'info',
        visible: false,
        logout: false,
        top: 0,
        isRouterAlive: true,//刷新当前页面
        left: 0,
        dark: 'plain',
        catchList: [],
        selectedTag: '',
        isCollapse: false,
        icon: 'el-icon-s-fold',
        editableTabsValue: 'first',
        time: 600,
        text: '',
        tagList: [],
        tagAllList: [],//所有的标签页
        pathList: [],
        // path:'',
      };
    },
    watch: {
      $route(to, from) {
        if (this.tagAllList.length == 4) {
          for (let men of this.menuList) {//tag栏标签
            for (let chi of men.childrens) {
              this.tagAllList.push({
                effect: "plain",
                fileName: chi.router.substr(1),
                info: "info",
                name: chi.menuName,
                pathTo: chi.router
              })
              this.pathList.push(chi.router)
              if (chi.childrens.length > 0) {
                for (let lit of chi.childrens) {
                  this.tagAllList.push({
                    effect: "plain",
                    fileName: lit.router.substr(1),
                    info: "info",
                    name: lit.menuName,
                    pathTo: lit.router
                  })
                  this.pathList.push(lit.router)
                }
              }
            }
          }
        }
        // this.path=to.fullPath
        if (to.fullPath == '/welcome' || this.$route.path == '/main') {
          console.log(123231232)
          this.info = "success"
          this.dark = 'dark'
        } else if (this.pathList.indexOf(this.$route.path) > -1) {
          this.info = 'info'
          this.dark = 'plain'
          let obj = {}
          for (let y of this.tagAllList) {//循环tagAllList数组，获取当前点击的一项
            if (y.pathTo === to.fullPath) {
              obj = y
            }
          }
          let flag = true
          if (this.tagList != []) {//验重
            flag = this.tagList.some(function (item, index, array) {
              return item.name == obj.name;
            });
          } else {
            flag = false
          }
          if (flag || this.pathList.indexOf(to.fullPath) == -1) {
          } else {
            this.tagList.push(obj)
          }
          for (let i in this.tagList) {//给当前点击的标签切换激活状态
            this.tagList[i].info = 'info'
            this.tagList[i].effect = 'plain'
            if (to.fullPath == this.tagList[i].pathTo) {
              this.tagList[i].info = 'success'
              this.tagList[i].effect = 'dark'
            }
            if (this.catchList.indexOf(this.tagList[i].fileName) == -1) {
              this.catchList.push(this.tagList[i].fileName)
              console.log(this.catchList, 123)
            }
          }
          this.$nextTick(() => { //点击导航栏tag标签切换
            let key = this.catchList.indexOf(obj.fileName)
            let scrollLength = this.$refs[this.catchList[key]][0].$el.offsetLeft
            let tagWidth = this.$refs[this.catchList[key]][0].$el.offsetWidth
            if (scrollLength > (this.$refs.scrollRow.$el.offsetWidth - tagWidth)) {
              this.scrollWrapper.scrollLeft = scrollLength - this.$refs.scrollRow.$el.offsetWidth + tagWidth
            } else if (scrollLength - this.$refs.scrollRow.$el.offsetWidth < 0) {
              this.scrollWrapper.scrollLeft = -scrollLength
            }
          })
        } else {
          this.tagList = []
        }
        for (let i in this.tagList) {
          this.tagList[i].info = 'info'
          this.tagList[i].effect = 'plain'
          if (this.tagList[i].pathTo == to.fullPath) {
            this.tagList[i].info = "success"
            this.tagList[i].effect = 'dark'
          } else {
            this.tagList[i].info = 'info'
          }
        }
        if (this.pathList.indexOf(from.fullPath) == -1 && from.fullPath != '/welcome') {//退出倒计时
          this.time = 600
          // this.timeDown()
        }
      },
      visible(value) {//tag栏右击
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      },
      time(val) {//退出倒计时
        if (val) {
          document.body.addEventListener('mousemove', this.timeFrash)
          document.body.addEventListener('click', this.timeFrash)
          document.body.addEventListener('keyup', this.timeFrash)
        }
        if (this.time === 0) {
          this.logOut()
        }
      }
    },
    computed: {
      ...mapState(['menuList']),
      scrollWrapper() {//tag滑动条
        return this.$refs.scrollContainer.$refs.wrap
      }
    },
    created() {
      let hour = Number(new Date().getHours())
      if (6 < hour && hour < 11) {
        this.text = '上午好'
      } else if (11 < hour && hour < 13) {
        this.text = '中午好'
      } else if (13 < hour && hour < 19) {
        this.text = '下午好'
      } else {
        this.text = '晚上好'
      }
      this.getMenu()
      this.getAuthority()
      this.getPageAuth()
    },
    mounted() {
      for (let men of this.menuList) {//tag栏标签
        for (let chi of men.childrens) {
          this.tagAllList.push({
            effect: "plain",
            fileName: chi.router.substr(1),
            info: "info",
            name: chi.menuName,
            pathTo: chi.router
          })
          this.pathList.push(chi.router)
          if (chi.childrens.length > 0) {
            for (let lit of chi.childrens) {
              this.tagAllList.push({
                effect: "plain",
                fileName: lit.router.substr(1),
                info: "info",
                name: lit.menuName,
                pathTo: lit.router
              })
              this.pathList.push(lit.router)
            }
          }
        }
      }
      // this.path=this.$route.path
      if (this.$route.path == '/welcome' || this.$route.path == '/main') {
        this.info = 'success'
        this.dark = 'dark'
      } else if (this.pathList.indexOf(this.$route.path) > -1) {
        for (let y of this.tagAllList) {//循环tagAllList数组，获取当前点击的一项
          if (y.pathTo === this.$route.path) {
            var obj = y
          }
        }
        this.tagList.push(obj)
        if (this.$route.path == this.tagList[0].pathTo) {
          this.tagList[0].info = 'success'
          this.tagList[0].effect = 'dark'
        }
        if (this.catchList.indexOf(this.tagList[0].fileName) == -1) {
          this.catchList.push(this.tagList[0].fileName)
        }
      } else {
        this.tagList = []
      }
      if (this.pathList.indexOf(this.$route.path) > -1 || this.$route.path == '/welcome') {
        this.time = 600
        this.timeDown()
      }
    },
    methods: {
      ...mapActions(["getMenu", "getAuthority", "getPageAuth"]),
      qiehuan() {
        if (this.label == true) {
          this.icon = "el-icon-s-fold";
          this.isCollapse = false;
          this.label = false;
        } else {
          this.icon = "el-icon-s-unfold";
          this.isCollapse = true;
          this.label = true;
        }
      },
      welcomeVue() {//欢迎页面路由跳转
        this.$router.push('welcome')
      },
      rightClick(tag, e) {//tag右击事件
        const left = e.clientX   // 15: margin right
        const maxLeft = document.body.clientWidth
        this.left = left
        this.top = e.clientY + 15
        this.visible = true
        this.selectedTag = tag
        if (left + 100 > maxLeft) {
          this.left = left - 50
          this.top = e.clientY + 15
        } else {
          this.left = left
          this.top = e.clientY + 15
          this.visible = true
          this.selectedTag = tag
        }
      },
      closeMenu() {//右击弹窗关闭
        this.visible = false
      },
      addClick(e) {//点击当前导航菜单动态添加tag标签
        console.log(e)
        for (let y of this.tagAllList) {//循环tagAllList数组，获取当前点击的一项
          if (y.pathTo === e.index) {
            var obj = y
            console.log(obj)
          }
        }
        if (this.tagList != []) {//验重
          var flag = this.tagList.some(function (item) {
            return item.name == obj.name;
          });
        } else {
          flag = false
        }
        if (flag || e.index == '/saas' || e.index == '/' || e.index == '' || e.index == '/saas') {
          console.log(123)
        } else {
          this.tagList.push(obj)
        }
        for (let i in this.tagList) {//给当前点击的标签切换激活状态
          this.tagList[i].info = 'info'
          this.tagList[i].effect = 'plain'
          if (e.index == this.tagList[i].pathTo) {
            this.tagList[i].info = 'success'
            this.tagList[i].effect = 'dark'
          }
          if (this.catchList.indexOf(this.tagList[i].fileName) == -1) {
            this.catchList.push(this.tagList[i].fileName)
          }
        }
        this.$nextTick(() => { //点击导航栏tag标签切换
          let key = this.catchList.indexOf(obj.fileName)
          let scrollLength = this.$refs[this.catchList[key]][0].$el.offsetLeft
          let tagWidth = this.$refs[this.catchList[key]][0].$el.offsetWidth
          if (scrollLength > (this.$refs.scrollRow.$el.offsetWidth - tagWidth)) {
            this.scrollWrapper.scrollLeft = scrollLength - this.$refs.scrollRow.$el.offsetWidth + tagWidth
          } else if (scrollLength - this.$refs.scrollRow.$el.offsetWidth < 0) {
            this.scrollWrapper.scrollLeft = -scrollLength
          }
        })
      },
      tagClick(e) {//点击标签跳转路由
        this.$router.push(e.pathTo)
      },
      closeSelf() {//右击关闭当前标签
        for (let i in this.tagList) {
          if (this.tagList[i].pathTo == this.selectedTag.pathTo && this.tagList.length > 1 && this.$route.path != this.selectedTag.pathTo) {
            this.tagList.splice(i, 1)
          } else if (this.tagList[i].pathTo == this.selectedTag.pathTo && this.tagList.length > 1 && i != this.tagList.length - 1 && this.$route.path == this.selectedTag.pathTo) {
            this.tagList.splice(i, 1)
            this.$router.push(this.tagList[i].pathTo)
          } else if (this.selectedTag.pathTo == this.tagList[this.tagList.length - 1].pathTo && this.tagList.length == 1) {
            this.tagList.splice(i, 1)
            this.$router.push('/welcome')
          } else if (this.tagList[i].pathTo == this.selectedTag.pathTo && i == this.tagList.length - 1 && this.tagList.length > 1 && this.$route.path == this.selectedTag.pathTo) {
            this.tagList.splice(i, 1)
            this.$router.push(this.tagList[i - 1].pathTo)
          }
        }
        for (let k in this.catchList) {
          if (this.catchList[k] == this.selectedTag.fileName) {
            this.catchList.splice(k, 1)
          }
        }
      },
      handleClose(i, pathTo, fileName) {//close事件删除标签
        for (let k in this.catchList) {
          if (this.catchList[k] == fileName) {
            this.catchList.splice(k, 1)
          }
        }
        if (pathTo == this.tagList[this.tagList.length - 1].pathTo && this.tagList.length > 1 && this.$route.path != pathTo) {
          this.tagList.splice(this.tagList.length - 1, 1)
          this.$router.push(this.tagList[this.tagList.length - 1].pathTo)
        } else if (pathTo == this.tagList[this.tagList.length - 1].pathTo && this.tagList.length == 1) {
          this.$router.push('/welcome')
          this.tagList.splice(i, 1)
        } else if (pathTo == this.tagList[this.tagList.length - 1].pathTo && this.tagList.length > 1 && this.$route.path == pathTo) {
          this.tagList.splice(this.tagList.length - 1, 1)
          this.$router.push(this.tagList[this.tagList.length - 1].pathTo)
        } else if (pathTo != this.tagList[this.tagList.length - 1].pathTo && this.tagList.length > 1 && this.$route.path == pathTo) {
          this.$router.push(this.tagList[i + 1].pathTo)
          this.tagList.splice(i, 1)
        } else {
          this.tagList.splice(i, 1)
        }

      },
      closeOthers() {//右击关闭其他标签
        let obj = {
          pathTo: this.selectedTag.pathTo,
          info: 'success',
          name: this.selectedTag.name,
          effect: "dark"
        }
        let flags = this.tagList.some(function (item) {
          return item.name == obj.name;
        })
        if (flags) {
          this.tagList = []
          this.tagList.push(this.selectedTag)
          this.catchList = []
          this.catchList.push(this.selectedTag.fileName)
          this.$router.push(this.selectedTag.pathTo)
        }
        if (this.selectedTag === 1) {
          this.closeAll()
        }
      },
      closeAll() {//右击关闭所有标签
        this.tagList = []
        this.catchList = []
        this.$router.push('/welcome')
      },
      refashClick() {//右击刷新按钮
        for (let i = 0; i < this.catchList.length; i++) {
          if (this.catchList[i] == this.selectedTag.fileName) {
            this.catchList.splice(i, 1)
          }
        }
        this.reload()
        setTimeout(() => {
          this.$router.push(this.selectedTag.pathTo)
          this.catchList.push(this.selectedTag.fileName)
        }, 1)
        if (this.selectedTag === 1) {
          this.$router.push('/welcome')
        }
      },
      reload() {//右击刷新当前页面
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      },
      handleScroll(e) {//鼠标滚轮事件
        const eventDelta = e.wheelDelta || -e.deltaY * 40
        const $scrollWrapper = this.scrollWrapper
        $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
      },
      logOut() {//退出
        this.$axios.post('/restboot/logout').then(res => {
          this.catchList = []
          sessionStorage.clear('token')
          this.$router.replace(`/saas`)
        })
      },
      timeDown() {//退出倒计时
        clearInterval(time_s)
        var time_s = setInterval(() => {
          this.time -= 1
          if (this.time < 1 || this.$route.path === `/saas/${this.co}`) {
            clearInterval(time_s)
          }
        }, 1000)
      },
      timeFrash() {//恢复时间
        this.time = 600
      },
      debounce(func, wait) {//事件防抖
        let timeout;
        return function () {
          let context = this;
          let args = arguments;

          if (timeout) clearTimeout(timeout);

          timeout = setTimeout(() => {
            func.apply(context, args)
          }, wait);
        }
      },
      screen() {//全屏按钮
        let element = document.documentElement;
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen();
            this.full = false
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
            this.full = false
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
            this.full = false
          } else if (document.msExitFullscreen) {
            this.full = false
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen()
            this.full = true
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen()
            this.full = true
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
            this.full = true
          } else if (element.msRequestFullscreen) {
            // IE11
            this.full = true
            element.msRequestFullscreen()
          }
        }
        this.fullscreen = !this.fullscreen
      },
      submenuClick(val) {
        console.log(val)
      },
      attendanceClick() {//上下班打卡按钮
        this.$message.success('打卡成功')
        // this.$axios.post('/restboot/attendanceRecords').then(res => {
        //   this.$message.success(`${res.data.result.workTime || ''} ${res.data.result.suWorkState || ''}`)
        // }).catch(err => {
        //   this.isError(err)
        // })
      },
    },

  }
</script>
<style lang="scss" scoped>
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 999999999999;
    position: absolute;
    list-style-type: none;
    padding: 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;

    li {
      margin: 0;
      text-align: center;
      padding: 0px 16px;
      line-height: 25px;
      // padding: 0;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }

    .hoverbox {
      &:hover {
        background: rgb(249, 249, 249);
        // background: red;
      }
    }
  }
</style>
<style lang="scss">
  html, body {
    padding: 0;
    margin: 0;
    border: none;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    -moz-user-select: none; /* Firefox私有属性 */
    -webkit-user-select: none; /* WebKit内核私有属性 */
    -ms-user-select: none; /* IE私有属性(IE10及以后) */
    -khtml-user-select: none; /* KHTML内核私有属性 */
    -o-user-select: none; /* Opera私有属性 */
    user-select: none; /* CSS3属性 */

    .el-table th.gutter {
      display: table-cell !important
    }
  }

  //最大适应1200px 小于这个就变形
  .elMain {
    min-width: 1200px;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  //滚动条的滑块
  ::-webkit-scrollbar-thumb {
    background-color: #a1a3a9;
    border-radius: 5px;
  }

  .el-container {

    .el-header {
      height: 89px !important;
      padding: 0;

      .header {
        line-height: 50px;
        // box-shadow: 0 1px 2px 1px #eee;
        // margin-bottom: 4px;
        background: #1f2d3d;
      }

      .scroll-container {
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid #ddd;
        background: #fff;
        padding-top: 4px;

        /deep/ {
          .el-scrollbar__bar {
            bottom: 0px;
          }

          .el-scrollbar__wrap {
            // height:41px;
            height: 44px;
          }

          .el-tag {
            border-radius: 0;
          }
        }
      }

      .col-left-btn {
        .el-button {
          border: 0;
          border-radius: 0;
          height: 50px;
          margin-left: -1px;
          background: #1f2d3d;
          color: #fff;
          font-size: 16px;
        }
      }

      .col-center-span {
        font-size: 16px;
        font-weight: 600;
        color: #fff;
      }
    }
  }

  .el-container .el-aside .el-menu li {
    background-color: #1f2d3d !important;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-width: 210px;
    min-height: 400px;
  }

  .el-menu {
    overflow-y: auto;
    overflow-x: hidden;
    // margin: 0;
  }

  .el-menu-item {
    min-width: 210px;
  }

  .el-menu--collapse {
    width: 65px !important;
  }

  .el-menu-vertical-demo {
    width: 200px;
    min-height: 100%;

    .el-submenu {
      i {
        color: #fff
      }

      .el-menu-item {
        height: 50px;
        line-height: 50px;
        padding: 0 45px;
        min-width: 210px;
      }
    }
  }

  .input {
    font-size: 13px;
    color: #363738;
    padding: 5px 5px 3px;
    // margin-top: -5px;
    margin-bottom: 3px;
    box-shadow: 0 1px 2px 1px #dfdfdf;

    .screen {
      .el-form {
        margin: 0;

        .el-form-item {
          margin: 0;
          padding: 0;
        }
      }
    }
  }

  .headerTag .el-tag {
    font-size: 14px;
  }

  .el-tag--dark.el-tag--success {
    background-color: #64d9d6 !important;
    border-color: #64d9d6 !important;
  }

  .el-form {
    margin: 0;

    .el-form-item__label {
      color: #000;
      // font-weight: bold;
    }

    .el-form-item .el-form-item__error {
      line-height: 0 !important;
    }

    .el-form--inline {
      .el-form-item {
        margin: 0;
        padding: 0;
      }
    }

    .textarea {
      .el-form-item__error {
        padding-top: 7px !important;
      }
    }

    .el-form-item {
      margin: 0;
      padding-bottom: 3px;

      .el-form-item__label {
        padding: 0 5px 0 0;
      }

      .el-form-item__content {
        position: relative;
      }

      .el-form-item__error {
        line-height: 0;
        padding-top: 2px;
        font-size: 10px;
        position: absolute;
        top: 100%;
        left: 0;
      }
    }

    .el-form-item--mini.el-form-item {
      margin-bottom: 10px !important;

      .el-form-item__error {
        line-height: 1 !important;
      }
    }
  }

  .el-table .success-row {
    background: rgba(88, 250, 130, 0.5);
  }

  .el-table .info-row {
    background: rgba(202, 218, 201, 0.5);
  }

  .el-table .hidden-row {
    overflow: hidden;
    display: none;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: rgba(0, 158, 250, 0.1) !important;
  }

  .current-row > td {
    background: rgba(0, 158, 250, 0.2) !important;
  }

  .el-dialog {
    /deep/
    .el-dialog__body {
      padding: 10px 20px;
      // background: #FAFBFC;
      // border-top: 1px #ddd solid;
      // border-bottom: 1px #ddd solid;
      .el-form-item {
        p {
          margin: 0;
        }
      }
    }

    .el-dialog__footer {
      padding-top: 0;
    }
  }

  .switchStyle .el-switch__label {
    position: absolute;
    display: none;
    text-align: center;
    color: #fff !important;

    span {
      font-size: 10px;
      // background: #999;
    }
  }

  /*打开时文字位置设置*/
  .switchStyle .el-switch__label--right {
    z-index: 1;
    right: 5px;
  }

  /*关闭时文字位置设置*/
  .switchStyle .el-switch__label--left {
    z-index: 1;
    left: 7px;
  }

  /*显示文字*/
  .switchStyle .el-switch__label.is-active {
    display: block;
  }

  .switchStyle.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 60px !important;
  }

  .transferStyle .el-transfer-panel {
    height: 380px;
    width: 330px;
  }

  .transferStyle .el-transfer-panel__list.is-filterable {
    height: 270px;
  }

  .transferStyle .el-transfer-panel__item {
    display: block;
  }

  .littleTitle { //弹框小标题
    line-height: 10px;
    color: #64d9d6;
  }

  .el-input-group__append, .el-input-group__prepend {
    padding: 0 7px !important;
  }

  .el-step.is-simple .el-step__title {
    max-width: 100% !important;
  }

  .el-step.is-simple:not(:last-of-type) .el-step__title {
    max-width: 100% !important;
  }

  .el-input.is-disabled .el-input__inner {
    color: #666 !important;
  }

  .el-image-viewer__close {
    color: #fff !important;
  }

  .Part .el-button--mini {
    margin: 5px !important;
    font-size: 16px;
  }

  .switchStyle .el-switch__label {
    position: absolute;
    display: none;
    text-align: center;
    color: #fff !important;

    span {
      font-size: 10px;
      // background: #999;
    }
  }

  /*打开时文字位置设置*/
  .switchStyle .el-switch__label--right {
    z-index: 1;
    right: 5px;
  }

  /*关闭时文字位置设置*/
  .switchStyle .el-switch__label--left {
    z-index: 1;
    left: 7px;
  }

  /*显示文字*/
  .switchStyle .el-switch__label.is-active {
    display: block;
  }

  .switchStyle.el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 60px !important;
  }

  .el-table .hidden-row {
    overflow: hidden;
    display: none;
  }

  .inset .el-upload--picture-card {
    display: none;
  }

  .tableOfPrint {
    // border: 1px solid #888;
    // border-collapse: collapse;
    // width: 600px;
    // margin-left:8px;
    // table-layout: fixed;
    text-align: center;
    border-top: 1px solid #888;
    border-left: 1px solid #888;
    width: 768px;
    font-size: 13px;
    margin: 0 10px;
    color: #000;
    // height: 200px;
    td {
      border: 1px solid #888;
      border-left: none;
      border-top: none;
      white-space: nowrap;
      padding: 2px;
      font-size: 13px;
      height: 17px;
    }

    th {
      border: 1px solid #888;
      border-left: none;
      border-top: none;
      white-space: nowrap;
      padding: 2px;
      font-size: 13px;
      height: 18px;
    }

    // tr{
    //   text-align: center;
    //   th{
    //     // width: 125px;
    //     border-collapse:collapse;
    //     border: 1px solid #888;
    //     height:30px;
    //   }
    //   td{
    //     border-collapse:collapse;
    //     border: 1px solid #666;
    //     width: 182px;
    //     height:30px;
    //   }
    // }
  }

  .istyle {
    text-decoration: underline;
    font-style: normal;
    color: #222;
  }

  .littleTitle {
    line-height: 10px;
    color: #64d9d6;
  }

  .tableSp {
    border: 1px solid #888;
    border-collapse: collapse;
    // width: 600px;
    margin-left: 8px;
    // height: 200px;
    tr {
      text-align: center;

      th {
        // width: 125px;
        border-collapse: collapse;
        border: 1px solid #888;
        height: 30px;
      }

      td {
        border-collapse: collapse;
        border: 1px solid #888;
        width: 182px;
        height: 30px;
      }
    }
  }

  .el-cascader-panel .el-radio {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 10px;
    right: -10px;
  }

  .el-cascader-panel .el-radio__input {
    visibility: hidden; //隐藏单选框，不隐藏就不用设置
  }

  .el-cascader-panel .el-cascader-node__postfix {
    top: 10px;
  }

  .box-card {
    margin-left: 20px;
    margin-top: 10px;
    width: 95%;
    height: 800px;
  }

  //去掉element-ui的drawer标题选中状态
  .el-drawer__header span:focus {
    outline: 0 !important;
  }

  //去掉element-ui的drawer选中状态
  .el-drawer {
    outline: 0 !important;
  }
</style>
