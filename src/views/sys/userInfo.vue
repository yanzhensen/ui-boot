<template>
  <div class="box-card" v-loading="loading">
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="mini" @click="addUserDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <template>
        <el-table :data="userData" style="width: 100%" height="650px" highlight-current-row
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
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "userInfo",
    data() {
      return {
        loading: false,
        userData: [],
        userPage: {//用户信息数据
          limit: 10,
          cursor: 1,
          total: 0,
          pages: 0,
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
        },
      }
    },
    created() {
      this.getUserPage()
    },
    methods: {
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
          this.userData = res.data.result.records;
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
        this.editUserDialogVisible = true;
        this.editLoadUserById(row.uid)
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
