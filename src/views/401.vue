<template>
  <div>
    <div class="box">
      <div class="pbox">
        <p>糟糕!</p>
        <p>你没有开通该页面权限</p>
        <p>请联系管理员</p>
        <ul data-v-35ca77fc="" class="list-unstyled">
          <li data-v-35ca77fc="">或者你可以去:</li>
          <li data-v-35ca77fc="" class="link-type"><a data-v-35ca77fc="" href="#/welcome" class="">回首页</a></li>
        </ul>
      </div>
      <div class="imgbox">
        <!-- <img src="https://pic-static.fangzhizun.com/images/401.089007e7.gif" alt="">-->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "notAllow"
  }
</script>

<style lang="scss" scoped>
  .box {
    height: 85vh;
    margin: 0 auto;
    // padding-top: 10%;
    width: 80%;
    display: flex;
    // justify-content: center;
    align-items: center;

    .imgbox {
      flex: 2;
      padding-left: 180px;

      img {
        width: 55%;
      }
    }

    .pbox {
      flex: 1;
      padding-left: 70px;

      p:nth-child(1) {
        font-size: 60px;
        font-weight: 700;
        color: #484848;
      }

      p:nth-child(2) {
        display: block;
        font-size: 1.5em;
        margin-block-start: 0.83em;
        margin-block-end: 0.83em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
      }

      p:nth-child(3) {
        display: block;
        font-size: 0.67em;
        margin-block-start: 2.33em;
        margin-block-end: 2.33em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
      }

      .list-unstyled[data-v-35ca77fc] {
        font-size: 14px;
      }

      .list-unstyled a[data-v-35ca77fc] {
        color: #008489;
        text-decoration: none;
      }
    }
  }
</style>
