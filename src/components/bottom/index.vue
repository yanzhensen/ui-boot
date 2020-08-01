<template>
  <div class="bottom">
      <el-row class="content">
          <el-col :span="24">
              <el-row>
                <el-col :span="24">******公司<span class="line">|</span><span v-html="wxMerchantName"></span></el-col>
            </el-row>
            <el-row>
                <el-col :span="24">Copyrigth ©2016-2020 版权所有
                    <span class="line">|</span><a href="http://beian.miit.gov.cn/" target="_blank">粤 ICP 备*****号</a>
                    <span class="line">|</span>
                    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=****" target="_blank">
                        <img class="icon" src="../../assets/img/bottom_icon.png" width="14px" height="14px"/>粤公网安备*******号
                    </a>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">技术服务，不良信息举报电话：0755-25609945</el-col>
            </el-row>
          </el-col>
      </el-row>
  </div>
</template>

<script>
export default {
    props: {
        wxMerchantName: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="scss" scoped>
a{
text-decoration:none;
color:#333;
}
.bottom{
    height: 82px;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    color: rgb(49, 59, 76);
    display: flex;
    justify-content: center;
    align-items: center;
    .line{
        padding: 0 12px;
        color: black;
    }
    .content{
      ::v-deep.el-row {
        margin-top: 6px;
        .icon{
          display: inline-block;
          vertical-align: bottom;
          margin-right: 2px;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      ::v-deep.el-row:nth-of-type(1) {
        margin-top: 0;
      }
    }
}
</style>
