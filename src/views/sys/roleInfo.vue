<template>
  <div class="box-card" v-loading="loading">
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="mini" @click="addRoleDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <template>
        <el-table :data="roleData" style="width: 100%" height="650px" highlight-current-row>
          <el-table-column type="index"></el-table-column>
          <el-table-column align="center" prop="roleName" label="角色名"></el-table-column>
          <el-table-column align="center" prop="remark" label="备注"></el-table-column>
          <el-table-column align="center" prop="updateTime" label="修改时间"></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column align="center" label="分配权限">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="addPerMisHandleOpen(scope.row.rid)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="rolePageSizeChange" @current-change="rolePageCurrentChange" align='center'
                       background
                       :current-page="rolePage.cursor" :page-sizes="[5, 10, 20, 50]" :page-size="rolePage.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="rolePage.total">
        </el-pagination>
      </template>

      <!--添加角色-->
      <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" @close="addRoleHandleClose" v-dialogDrag
                 width="700px" :modal-append-to-body='false' :close-on-click-modal="false" v-loading="loading">
        <div>
          <el-form ref="addRoleRef" :model="addRoleForm" label-width="75px" inline>
            <el-form-item label="角色名" prop="roleName"
                          :rules="[{ required: true, message: '请输入角色名',trigger: ['blur','change']}]">
              <el-input size="mini" style="width:180px" v-model="addRoleForm.roleName" clearable></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input size="mini" style="width:180px" v-model="addRoleForm.remark" clearable></el-input>
            </el-form-item>
            <el-form-item label="分配权限">
              <el-button type="primary" size="mini" @click="addPerMisDialogVisible=true">分配权限</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleHandle">确 定</el-button>
        </div>
      </el-dialog>

      <!--分配角色权限-->
      <el-drawer :with-header="false" direction="rtl" size="400px"
                 :visible.sync="addPerMisDialogVisible" :before-close="addPerMisHandleClose">
        <!--分配角色-->
        <div style="margin-left: 10px;margin-top: 10px">
          <div>
            <span>分配权限</span>
          </div>
          <div style="margin-top: 10px;margin-bottom: 10px">
            <el-button type="primary" size="mini">保存</el-button>
          </div>
          <el-tree
              :data="perMisData"
              show-checkbox
              node-key="mid"
              ref="perMisRef"
              :default-checked-keys="perMisCheckedItem"
              :props="defaultProps">
          </el-tree>
        </div>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "roleInfo",
    data() {
      return {
        loading: false,
        addRoleDialogVisible: false,
        addPerMisDialogVisible: false,
        roleData: [],
        rolePage: {//角色信息数据
          limit: 10,
          cursor: 1,
          total: 0,
          pages: 0,
        },
        addRoleForm: {
          roleName: '',
          remark: '',
          premiss: [],
        },
        perMisData: [],
        perMisCheckedItem: [],
        defaultProps: {
          label: 'menuName',
          children: 'childrens'
        },
      }
    },
    created() {
      this.getRolePage()
      this.getPerMenu()
    },
    methods: {
      getRolePage() {
        this.loading = true
        this.$axios({
          method: "get",
          url: "/restboot/roles",
          params: {
            limit: this.rolePage.limit,
            cursor: this.rolePage.cursor,
          }
        }).then(res => {
          this.roleData = res.data.result.records;
          this.rolePage.total = res.data.result.total
          this.loading = false;
        }).catch(err => {
          this.isError(err)
          this.loading = false;
        });
      },
      //选择数据条数
      rolePageSizeChange(pageSize) {
        this.rolePage.limit = pageSize;
        this.getRolePage();
      },
      //具体那一页
      rolePageCurrentChange(current) {
        this.rolePage.cursor = current;
        this.getRolePage();
      },
      addRoleHandleClose() {
        Object.assign(this.$data.addRoleForm, this.$options.data().addRoleForm)//清空输入框
        this.clearForm(['addRoleRef'])//清空表单校验
      },
      addRoleHandle() {
        this.loading = true;
        if (!this.submitForm(['addRoleRef'])) {
          this.loading = false
          return
        }
        this.$axios({
          method: "post",
          url: "/restboot/roles",
          data: this.addRoleForm
        }).then(res => {
          this.$message.success('添加成功')
          this.addRoleDialogVisible = false;
          this.getRolePage()
        }).catch(err => {
          this.loading = false
          this.isError(err)
        });
      },
      //获取所有菜单列表树
      getPerMenu() {
        this.$axios({
          method: "get",
          url: "/restboot/menus/trees",
        }).then(res => {
          this.perMisData = res.data.result
        }).catch(err => {
          this.isError(err)
        })
      },
      //获取角色激活项
      getRoleActivity(roleId) {
        this.$axios({
          method: "get",
          url: "/restboot/roleMenu/" + roleId,
        }).then(res => {
          this.perMisCheckedItem = res.data.result
        }).catch(err => {
          this.isError(err)
        })
      },
      //打开分配权限
      addPerMisHandleOpen(rid) {
        this.getRoleActivity(rid)
        this.addPerMisDialogVisible = true;
      },
      //关闭分配权限
      addPerMisHandleClose() {
        this.perMisCheckedItem = []
        this.$refs.perMisRef.setCheckedKeys([]);
        this.addPerMisDialogVisible = false;
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
