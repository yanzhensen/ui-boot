<template>
  <div class="box-card" v-loading="loading">
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="mini" @click="addUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <template>
        <el-table :data="userPage.userData" style="width: 100%" height="650px" highlight-current-row
                  @row-dblclick="userDataDbClick">
          <el-table-column type="index"></el-table-column>
          <el-table-column align="center" prop="username" label="姓名" width="200px"></el-table-column>
          <el-table-column align="center" prop="age" label="年龄" width="60px"></el-table-column>
          <el-table-column align="center" prop="phone" label="电话" width="200px"></el-table-column>
          <el-table-column align="center" prop="email" label="电子邮箱" width="240px"></el-table-column>
          <el-table-column align="center" prop="loginName" label="登录名"></el-table-column>
          <el-table-column align="center" prop="status" label="用户状态">
            <template slot-scope="scope">
              <el-tag
                  :type="scope.row.status ? 'primary' : 'danger'"
                  disable-transitions>{{scope.row.status?"正常":"异常"}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createTime" label="登记时间"></el-table-column>
        </el-table>
        <el-pagination @size-change="userPageSizeChange" @current-change="userPageCurrentChange" align='center'
                       background
                       :current-page="userPage.cursor" :page-sizes="[5, 10, 20, 50]" :page-size="userPage.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="userPage.total">
        </el-pagination>
      </template>
      <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" @close="addUserHandleClose" v-dialogDrag
                 width="700px" :modal-append-to-body='false' :close-on-click-modal="false" v-loading="loading">
        <div>
          <el-form ref="addUserRef" :model="addUserForm" label-width="75px" inline>
            <el-form-item label="姓名" prop="username"
                          :rules="[{ required: true, message: '请输入真实姓名',trigger: ['blur','change']},{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: ['blur','change'] }]">
              <el-input size="mini" style="width:180px" v-model="addUserForm.username" clearable></el-input>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input size="mini" style="width:180px" v-model="addUserForm.age" clearable></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input size="mini" style="width:180px" v-model="addUserForm.phone" clearable></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email"
                          :rules="[{ required: true, message: '请输入电子邮箱',trigger: ['blur','change']},{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
              <el-input size="mini" style="width:180px" v-model="addUserForm.email" clearable></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="loginName"
                          :rules="[{ required: true, message: '请输入登录名',trigger: ['blur','change']}]">
              <el-input size="mini" style="width:180px" v-model="addUserForm.loginName" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input size="mini" style="width:180px" type="password" v-model="addUserForm.password"
                        prefix-icon="el-icon-lock" clearable
                        show-password></el-input>
            </el-form-item>
            <el-form-item label="用户状态">
              <el-select size="mini" style="width:180px" v-model="addUserForm.status" placeholder="状态" clearable>
                <el-option label="正常" value="1"></el-option>
                <el-option label="异常" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button @click="addUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserHandle">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改用户" :visible.sync="editUserDialogVisible" width="30%" @close="editUserHandleClose"
                 v-dialog-drag v-loading="loading">
        <div style="margin: 0 auto 15px auto;" align="center">
          <div>
            <el-image style="width:150px;height:150px;" :src="editUserForm.url" @click="uploadPhotos">
              <div slot="error" class="image-slot">
                <img style="width:150px;height:150px;" src="../../assets/img/userImg.jpg"/>
              </div>
            </el-image>
          </div>
        </div>
        <div>
          <el-form ref="editUserRef" :model="editUserForm" label-width="80px">
            <el-form-item label="姓名" prop="username"
                          :rules="[{ required: true, message: '请输入真实姓名',trigger: ['blur','change']},{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: ['blur','change'] }]">
              <el-input v-model="editUserForm.username" clearable></el-input>
            </el-form-item>
            <el-form-item label="年龄">
              <el-input v-model="editUserForm.age" clearable></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="editUserForm.phone" clearable></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email"
                          :rules="[{ required: true, message: '请输入电子邮箱',trigger: ['blur','change']},{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
              <el-input v-model="editUserForm.email" clearable></el-input>
            </el-form-item>
            <el-form-item label="登录名" prop="loginName"
                          :rules="[{ required: true, message: '请输入登录名',trigger: ['blur','change']}]">
              <el-input v-model="editUserForm.loginName" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户状态" prop="status">
              <el-select v-model="editUserForm.status" placeholder="状态" clearable>
                <el-option label="正常" :value="1"></el-option>
                <el-option label="异常" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button @click="editUserDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserHandle">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 图片上传组件 -->
      <common-upload v-if='dialogImgPath' ref='upload' @listenEvent='dialogImgPathClose' :dialog="dialogImgPath"
                     :save='needSavePhoto' :photoid='photoTableId' :photorandom='photoRandom' :bucket='photoBucket'
                     :phototype='photoTableType'></common-upload>
      <!-- 双击弹出对话框   结束 -->
    </el-card>
  </div>
</template>

<script>
  import commonUpload from '../../components/common-upload'//  引入上传图片组件
  export default {
    name: "userInfo",
    components: {
      'common-upload': commonUpload,
    },
    data() {
      return {
        //上传图片
        dialogImgPath: false,
        needSavePhoto: false,
        photoTableId: '',
        photoTableType: '',
        photoRandom: '',
        photoBucket: '',

        loading: false,
        userPage: {//用户信息数据
          limit: 10,
          cursor: 1,
          total: 0,
          pages: 0,
          userData: [],
        },
        addUserDialogVisible: false,
        editUserDialogVisible: false,
        addUserForm: {
          username: '',
          loginName: '',
          password: '',
          age: '',
          phone: '',
          email: '',
          status: '',
        },
        editUserForm: {
          username: '',
          loginName: '',
          age: '',
          phone: '',
          email: '',
          status: '',
          url: "",
        },
      }
    },
    created() {
      this.getUserPage()
    },
    methods: {
      uploadPhotos() {//上传图片按钮
        this.needSavePhoto = true//需要保存按钮
        this.photoTableId = this.editUserForm.uid
        this.photoTableType = '用户'
        this.photoRandom = parseInt((Math.random() * 9 + 1) * 100000000000)
        this.dialogImgPath = true
      },
      dialogImgPathClose() {//上传图片弹窗关闭
        this.dialogImgPath = false
      },
      getUserPage() {
        this.loading = true
        this.$axios({
          method: "get",
          url: "/restboot/users",
          params: {
            limit: this.userPage.limit,
            cursor: this.userPage.cursor,
          }
        }).then(res => {
          this.userPage.userData = res.data.result.records;
          this.userPage.total = res.data.result.total
          this.loading = false;
        }).catch(err => {
          this.isError(err)
          this.loading = false;
        });
      },
      //选择数据条数
      userPageSizeChange(pageSize) {
        this.userPage.limit = pageSize;
        this.getUserPage();
      },
      //具体那一页
      userPageCurrentChange(current) {
        this.userPage.cursor = current;
        this.getUserPage();
      },
      addUserHandleClose() {
        Object.assign(this.$data.addUserForm, this.$options.data().addUserForm)//清空输入框
        this.clearForm(['addUserRef'])//清空表单校验
      },
      addUserHandle() {
        this.loading = true;
        if (!this.submitForm(['addUserRef'])) {
          this.loading = false
          return
        }
        this.$axios({
          method: "post",
          url: "/restboot/users",
          data: this.addUserForm
        }).then(res => {
          this.$message.success('添加成功')
          this.addUserDialogVisible = false;
          this.getUserPage()
        }).catch(err => {
          this.loading = false
          this.isError(err)
        });
      },
      userDataDbClick(row, column, event) {
        console.log(row)
        this.editUserDialogVisible = true
        this.editLoadUserById(row.uid)
        this.showPhoto(row.uid)
      },
      editLoadUserById(uid) {
        this.$axios({
          method: "get",
          url: `/restboot/users/${uid}`,
        }).then(res => {
          this.editUserForm = res.data.result;
        }).catch(err => {
          this.isError(err)
        });
      },
      showPhoto(uid) {
        this.$axios({
          method: 'get',
          url: '/restboot/photo',
          params: {
            photoTableId: uid,
            photoTableType: '用户',
            photoStatus: '正常'
          }
        }).then(res => {
          if (res.data.result.length == 0) {
            return
          }
          console.info(res)
          this.editUserForm.url = res.data.result[0].photoUrl
        })
      },
      editUserHandleClose() {
        Object.assign(this.$data.editUserForm, this.$options.data().editUserForm)//清空输入框
        this.clearForm(['editUserRef'])//清空表单校验
      },
      editUserHandle() {
        this.loading = true;
        if (!this.submitForm(['editUserRef'])) {
          this.loading = false
          return
        }
        this.$axios({
          method: "put",
          url: "/restboot/users",
          data: this.addUserForm
        }).then(res => {
          this.$message.success('修改成功')
          this.editUserDialogVisible = false;
          this.getUserPage()
        }).catch(err => {
          this.loading = false
          this.isError(err)
        });
      },
    }
  };
</script>
<style lang="scss" scoped>
  /*.userInfo {*/
  /*  width: 1500px;*/
  /*}*/
</style>
