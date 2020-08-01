import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

// import axios from './assets/request'
// axios.defaults.baseURL = '/api'
// axios.defaults.withCredentials = true
// axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

export default new Vuex.Store({

  state: {
    userName: [],
    menuList: [],//菜单列表
    authe: {},//权限
    pageAuth: {},//页面权限
    jciSpecialNumber:'',//路由跳转携带参数
    jhpType: '', //路由跳转携带参数
  },

  getters: { //这里是get方法

  },

  mutations: {
    getUserName: (state, userName) => {
      state.userName = userName
    },
    getMenuList(state,menuList){
      state.menuList = menuList
    },
    getAuthorityList(state,authe){
      state.authe = authe
    },
    getPageAuth(state,pageAuth){
      state.pageAuth = pageAuth
    },
    jciSpecialNumber(state,jciSpecialNumber){
      state.jciSpecialNumber=jciSpecialNumber
    },
    jhpType(state,jhpType){
      state.jhpType=jhpType
    },
  },

  actions: {
    //获取菜单列表
    getMenu(context){
      axios({
        url: '/restboot/menus',
        method: 'get',
      }).then(res => {
        let menuList = res.data.result
        context.commit('getMenuList',menuList)
      })
    },
    //获取权限列表
    getAuthority(context){
      axios({
        url: '/restboot/menus/buttons/aliases',
        method: 'get',
      }).then(res => {
        let authe = res.data.result
        context.commit('getAuthorityList',authe)
      })
    },
    //获取页面权限
    getPageAuth(context){
      axios({
        url: '/restboot/menus/obj',
        method: 'get',
      }).then(res => {
        console.log("获取页面权限成功");
        let pageAuth = res.data.result
        context.commit('getPageAuth',pageAuth)
      })
    },
  },

  modules: {

  }

})
