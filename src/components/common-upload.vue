<template>
  <div>
    <el-dialog :modal-append-to-body='false' v-dialogDrag width="680px" title="查看图片" v-loading='loading'
               @close='dialogImgPathClose' :visible.sync="dialogImgPath" :close-on-click-modal="false" append-to-body>
      <div style="width:100%;height:400px;overflow-y:auto">
        <el-row style="margin-buttom:10px">
          <el-button size='small' @click="photoUpByPhone" type="primary">手机上传</el-button>
          <el-button size='small' @click="photoReflash" type="primary">刷新</el-button>
          <el-dialog :modal-append-to-body='false' v-dialogDrag width="280px" title="微信扫一扫上传" @close='dialogPhoneClose'
                     :visible.sync="dialogPhone" :close-on-click-modal="false" append-to-body>
            <el-row type="flex" class="row-bg" justify="space-around">
              <el-col :span="24" align='center'>
                <!-- <canvas id="QRCode"></canvas> -->
                <vue-qr :text="phoneUrl" :margin='0' colorDark="#333" colorLight="#fff" :size="200"></vue-qr>
              </el-col>
            </el-row>
          </el-dialog>
          <!-- <span>{{'图片'+imgNum+'张'+' '+'文件'+fileNum+'个'}}</span> -->
          <!--name="file" 默认为file :data为额外字段 -->
        </el-row>
        <el-upload
            class="upload-demo uploadPhoto"
            action="http://localhost:8888/restboot/common/upload"
            :data="picData"
            :file-list="fileList"
            :before-remove='beforeRemove'
            :before-upload="beforeUpload"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :on-preview="downloadText"
            multiple
        >
        </el-upload>
        <el-upload
            class="upload-demo uploadText"
            action="http://localhost:8888/restboot/common/upload"
            :data="picData"
            :file-list="photoList"
            list-type="picture-card"
            :before-remove='beforeRemove'
            :before-upload="beforeUpload"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :on-preview="seeBigPhotos"
            multiple
        >
          <el-button slot="trigger" size="small" type="primary">本地上传</el-button>
        </el-upload>
        <el-dialog :modal-append-to-body='false' v-dialogDrag :visible.sync="dialogBigImg" append-to-body>
          <img width="100%" :src="bigImgUrl"/>
        </el-dialog>
      </div>
      <div slot="footer" v-show='needSavePhoto'>
        <el-button @click="dialogImgPath=false">取消</el-button>
        <el-button @click='savePhotos' type="primary">保存</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  // import QRCode from "qrcode"; //引入生成二维码插件
  /**
   * 父传子，大小写不敏感故不是驼峰命名,
   * 依次绑定为弹窗,
   * 保存按钮,
   * 上传图片外表id ,
   * 随机数,
   * 上传图片外表类型 ,
   * 上传图片类型（公有||私有）
   * 传参可优化，dialog不必要
   * 接收可优化，watch不必要，
   */
  export default {

    props: ['dialog', 'save', 'photoid', 'photorandom', 'phototype', 'bucket'],
    data() {
      return {
        textUrl: require('../assets/img/text.jpg'),
        loading: false,
        dialogBigImg: false,//查看大图弹框
        dialogImgPath: false,//查看图片弹框
        dialogPhone: false,//手机上传弹框
        delIdStr: '',//删除图片id集合
        delInfoStr: '',//删除图片名称集合
        bigImgUrl: '',//大图url路径
        fileNum: 0,//文件数量
        imgNum: 0,//图片数量
        fileList: [],//文件数组
        photoList: [],//所有图片显示数组
        photoList2: [],//查原有图片显示数组
        phoneUrl: '',//手机上传二维码
        picData: {//上传图片前的格式
          token: "",
          "x:photoRandom": '', //十二位随机数
          "x:photoTableType": '', //审批，任务
          "x:photoMimeType": "", //文件，图片
          "x:photoBucket": "" //公有，私有
        },
        photoBucket: '私有', //默认私有
        photoTableId: '',//外表id保存的时候传
        needSavePhoto: false,//false代表不需要保存图片
        imgDelId: [],//删除图片id集合
      }
    },

    watch: {
      // 通过监听获取数据
      // phoneUrl(val) {
      //   console.log(1)
      //   setTimeout(()=>{
      //     console.log(2)
      //     // 获取页面的canvas
      //     let msg = document.getElementById("QRCode");
      //     // 将获取到的数据（val）画到msg（canvas）上
      //     QRCode.toCanvas(msg, val, function(error) {
      //       console.log(error);
      //     });
      //   },1000)
      // },
      dialog(val) {
        console.log(val)
        this.dialogImgPath = val
      },
      save(val) {
        console.log(val)
        this.needSavePhoto = val
      },
      photoid(val) {
        console.log(val)
        this.photoTableId = val
      },
      photorandom(val) {
        console.log(val)
        this.picData["x:photoRandom"] = val
      },
      phototype(val) {
        console.log(val)
        this.picData["x:photoTableType"] = val
      },
      bucket(val) {
        this.photoBucket = val ? '公有' : '私有'
        console.log(val, 1, this.photoBucket)
      }
    },
    created() {
      this.dialogImgPath = this.dialog
      this.needSavePhoto = this.save
      this.photoTableId = this.photoid
      this.picData["x:photoRandom"] = this.photorandom
      this.picData["x:photoTableType"] = this.phototype
      this.photoBucket = this.bucket ? '公有' : '私有'
      this.photoReflash()
    },
    methods: {
      getToken() {//获取token
        return this.$axios({
          url: "/restboot/photo/token/callback",
          method: "get",
          params: {
            bucket: this.photoBucket
          }
        }).then(res => {
          return res.data.result;
        });
      },
      getDownloadUrl(url) {//下载凭证获取图片路径
        return this.$axios({//下载凭证获取图片路径
          method: 'get',
          // url: '/restboot/photo/getDownloadUrl',
          url: '/restboot/photo/download',
          params: {
            baseUrls: url
          }
        }).then(res => {
          return res.data.result[0].original
        })
      },
      async beforeUpload(file) {//上传前
        console.log(file)
        try {
          let getToken = await this.getToken();//上传前先获取token
          this.picData.token = getToken;
          if (file.type == "image/jpeg" || file.type == "image/jpg" || file.type === "image/gif" || file.type == "image/png" || file.type == "image/bmp") {
            this.picData["x:photoMimeType"] = "图片"
          } else {
            this.picData["x:photoMimeType"] = "文件"
          }
          // this.picData["x:photoRandom"]=this.photoRandom
          // this.picData["x:photoTableType"]=this.photoTableType
          this.picData["x:filename"] = file.name;
          this.picData["x:photoBucket"] = this.photoBucket;
          // this.picData["x:photoTableId"] = this.homeRow.popId;
        } catch (err) {
          console.log(err);
        }
      },
      handleAvatarSuccess(res, file, fileList) {//上传成功后
        this.photoList = fileList
        console.log(res, file, fileList)
      },
      seeBigPhotos(file) {//查看大图
        this.bigImgUrl = file.url;
        this.dialogBigImg = true;
      },
      downloadText(file) {//下载文件
        window.open(file.url)
      },
      beforeRemove(file, fileList) {//删除前
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleRemove(file, fileList) {//删除后（走接口真删除）
        console.log(1, file)
        if (this.needSavePhoto) {
          this.imgDelId.push(file.response.result);
          this.$axios({
            url: `/restboot/photo/failure/${file.response.result}`,
            method: "put"
          }).then(res => {
          });
        } else {
          this.$axios({
            method: 'delete',
            url: '/restboot/photo',
            params: {
              photoIds: file.response.result
            }
          }).then(res => {
            this.$message.success('删除成功')
          }).catch(err => {
            this.isError(err)
          })
        }
      },

      deletePhotos(id) {//删除图片
        this.$axios({
          method: 'delete',
          url: '/restboot/photo',
          params: {
            photoIds: id.join(',')
          }
        }).then(res => {
          this.dialogImgPath = false
          this.$message.success('保存成功')
          this.imgDelId = []
        }).catch(err => {
          this.isError(err)
        })
      },
      recoverImg() {//恢复图片
        if (!this.photoTableId) {
          return
        }
        this.$axios({
          url: `/restboot/photo/recovery/${this.photoTableId}`,
          method: "put",
          params: {
            photoTableType: this.picData["x:photoTableType"]
          }
        });
      },
      photoUpByPhone() {//手机上传
        this.dialogPhone = true
        this.$axios({
          method: 'get',
          url: '/restboot/photo/getMobUploadUrl',
          params: {
            photoBucket: this.photoBucket,
            photoMimeType: '图片',
            photoRandom: this.picData["x:photoRandom"],
            photoTableType: this.picData["x:photoTableType"],
          }
        }).then(res => {
          this.phoneUrl = res.data.result
          //   // 获取页面的canvas
          // let msg = document.getElementById("QRCode");
          //   // 将获取到的数据（val）画到msg（canvas）上
          // QRCode.toCanvas(msg,res.data.result, function(error) {
          //   console.log(error);
          // });
        }).catch(err => {
          this.isError(err)
        })
      },
      async photoReflash() {//查询已有照片和临时照片&&刷新按钮
        this.imgNum = 0
        this.fileNum = 0
        this.photoList = []
        this.fileList = []
        // this.loading=true
        if (this.photoTableId) {//true表示要查已有的图片
          this.getPhotoByTableId()
        }
        await this.$axios({//通过随机数查临时图片
          method: 'get',
          url: '/restboot/photo',
          params: {
            photoRandom: this.picData["x:photoRandom"],
            photoTableType: this.picData["x:photoTableType"],
            photoStatus: '临时'
          }
        }).then(async res => {
          this.loading = false
          let imgdata = res.data.result;
          if (res.data.result.length == 0) {
            return
          }
          for (let i = 0; i < imgdata.length; i++) {//将图片拼接为element识别格式
            let obj = {
              photoStatus: imgdata[i].photoStatus,
              photoMimeType: imgdata[i].photoMimeType,
              name: imgdata[i].photoName,
              // url: await this.getDownloadUrl(imgdata[i].photoUrl),
              url: imgdata[i].photoUrl,
              response: {
                result: imgdata[i].photoId
              }
            };
            if (imgdata[i].photoMimeType == '图片') {
              this.photoList.push(obj);
            } else if (imgdata[i].photoMimeType == '文件') {
              this.fileList.push(obj);
            }

          }
        }).catch(err => {
          this.loading = false
          this.isError(err)
        })

      },
      async getPhotoByTableId() {//通过外表id查已有图片
        await this.$axios({
          method: 'get',
          url: '/restboot/photo',
          params: {
            photoTableId: this.photoTableId,
            photoTableType: this.picData["x:photoTableType"],
            photoStatus: '正常'
          }
        }).then(async res => {
          if (res.data.result.length == 0) {
            return
          }
          let imgdata = res.data.result;
          for (let i = 0; i < imgdata.length; i++) {//将图片拼接为element识别格式

            let obj = {
              photoStatus: imgdata[i].photoStatus,
              photoMimeType: imgdata[i].photoMimeType,
              name: imgdata[i].photoName,
              // url: await this.getDownloadUrl(imgdata[i].photoUrl),
              url: imgdata[i].photoUrl,
              response: {
                result: imgdata[i].photoId
              }
            };
            if (imgdata[i].photoMimeType == '图片') {
              this.photoList.push(obj);
            } else if (imgdata[i].photoMimeType == '文件') {
              this.fileList.push(obj);
            }
          }
          console.log(this.photoList, 2)
        })
      },
      dialogPhoneClose() {//手机上传弹窗关闭
        this.photoReflash()
      },
      savePhotos() {//保存按钮，所有新上传的图片有保存按钮不点保存都不会真上传，无保存按钮的传随机数给后台保存
        let flag = this.photoList.some(item => {//判断有无新增照片
          console.log(item, 2)
          return item.photoStatus != '正常'
        })
        let flag2 = this.fileList.some(item => {//判断有无新增照片
          console.log(item, 2)
          return item.photoStatus != '正常'
        })
        console.log(flag, 3)
        if ((!flag || this.photoList.length == 0) && (!flag2 || this.fileList.length == 0) && this.imgDelId.length == 0) {
          this.$message.warning('没有新增照片，无需保存')
          return
        }
        if (this.imgDelId.length > 0) {//判断有无删除图片
          this.deletePhotos(this.imgDelId)
        }
        if ((!flag || this.photoList.length == 0) && (!flag2 || this.fileList.length == 0)) {
          return
        }
        this.loading = true
        this.$axios({
          method: 'post',
          url: '/restboot/photo',
          params: {
            photoRandom: this.picData["x:photoRandom"],
            photoTableId: this.photoTableId,
            photoTableType: this.picData["x:photoTableType"]
          }
        }).then(res => {
          this.loading = false
          this.dialogImgPath = false
          this.$message.success('保存成功')
        }).catch(err => {
          this.loading = false
          this.isError(err)
        })

      },
      dialogImgPathClose() {
        if (this.photoTableId) {
          this.recoverImg()
          this.imgDelId = []
          this.photoList = []
        }
        this.$emit('listenEvent', false)
      },
    }
  }
</script>

<style lang="scss">
  .el-upload-list__item {
    transition: none !important;
  }

  .uploadPhoto {

    .el-upload--picture-card {
      display: none
    }
  }

  .uploadText {
    .el-upload--picture-card {
      border: none;
      line-height: 0px;
      width: 0px;
      height: 0px;
      background-color: #fff;
    }

    .el-upload {
      position: absolute;
      top: 63px;
      left: 186px;
    }
  }

</style>
