<template>
  <div class="box">
    <div class="boxtop">
      <div class="topimg" @mouseenter="isEnter=true" @mouseleave="isEnter=false">
        <div class="topBox">
          <p>Hello World</p>
        </div>
<!--        <img :class="{img:isEnter,img2:!isEnter}" ref="img" :src="url2" alt/>-->
      </div>
      <div class="title">
        <p>欢迎使用{{systemType}}</p>
        <p class="second">{{describe}}</p>
      </div>
    </div>
    <div class="bottomImg">
<!--      <img class="bimg" :src="url1"/>-->
    </div>
  </div>
</template>

<script>
  import {mapActions, mapMutations} from "vuex";

  export default {
    data() {
      return {
        // url1: "https://pic-static.fangzhizun.com/images/character.gif",
        // url2: "https://pic-static.fangzhizun.com/images/headPortrait.gif",
        isEnter: false,
        systemType: sessionStorage.getItem('systemType` '),
        describe: sessionStorage.getItem('describe'),
      };
    },
    mounted() {
      // this.getCurrentUserList()
    },
    methods: {
      ...mapActions(['getCurrentUserList']),
      ...mapMutations(['getUserInfo']),
      getCurrentUserList() {//查询登录用户
        this.$axios({
          url: "/restboot/users/currentUser",
          method: "get"
        }).then(res => {
          console.log(res)
          this.getUserInfo(res.data.result)
        });
      },

    }
  };
</script>
<style lang="scss" scoped>
  html,
  body {
    padding: 0;
    margin: 0;
    height: 100vh;
    background: #e3e3e3;
  }

  .box {
    padding: 0;
    margin: 0;
    // height: 850px;
    height: 100vh;
    // box-sizing: border-box;
    display: flex;
    flex-direction: column;
    // text-align: center;
    color: #666;
    font-size: 19px;
    font-weight: 600;
    background: #e3e3e3;

    .boxtop {
      width: 100%;
      // flex:1;
      height: 200px;
      display: flex;
      margin-top: 48px;
      // justify-content:center;
      .title {
        font-size: 35px;
        color: #212121;
        // line-height: 50px;
        margin: 0 0 0 40px;

        .second {
          font-size: 20px;
        }
      }

      .topimg {
        z-index: 12;
        position: relative;
        box-sizing: border-box;
        height: 150px;
        width: 150px;
        font-size: 14px;
        margin-left: 75px;
        margin-top: 20px;
        border-radius: 50%;
        text-align: center;

        .topBox {
          height: 140px;
          width: 140px;
          z-index: 12;
          position: absolute;
          top: 0;
          left: 0;
          // line-height: 50px;
          border-radius: 50%;
          border: 5px solid #aaa;

          p {
            margin-top: 50px;
          }
        }

        .img2 {
          display: block;
          height: 100%;
          z-index: 12;
          width: 100%;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .img {
          z-index: 12;
          display: block;
          height: 100%;
          width: 100%;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          transform: rotate(-100deg);
          -ms-transform: rotate(-100deg);
          -webkit-transform: rotate(-100deg);
          -o-transform: rotate(-100deg);
          -moz-transform: rotate(-100deg);
          transform-origin: 95% 40%;
          -webkit-transform-origin: 95% 40%;
          transition: all 0.5s ease-in-out;
          -webkit-transition: all 0.5s ease-in-out;
        }
      }
    }

    .bottomImg {
      width: 100%;
      background: #e3e3e3;
      flex-grow: 2;

      .bimg {
        display: block;
        width: 45%;
        margin: 0 auto;
      }
    }
  }
</style>
