<template>
  <div>
    <div>
      <el-button type="primary" size="mini">保存</el-button>
    </div>
    <!--
      default-expanded-keys：默认展开行
      default-expand-all：默认展开所有
      render-after-expand：是否在第一次展开某个树节点后才渲染其子节点
      default-checked-keys：默认选中
      props：默认参数配置
    -->
    <el-tree
        :data="treeData"
        show-checkbox
        node-key="mid"
        ref="treeRef"
        :default-expanded-keys="[1]"
        :default-checked-keys="checkedItem"
        :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>

  export default {
    name: "roleManager",
    data() {
      return {
        treeData: [],
        checkedItem: [],
        defaultProps: {
          label: 'menuName',
          children: 'childrens'
        }
      }
    },
    created() {
      this.getTreeData()
      this.getRoleActivity(1)
    },
    methods: {
      getTreeData() {
        this.$axios({
          method: "get",
          url: "/restboot/menus/trees",
        }).then(res => {
          this.treeData = res.data.result
        }).catch(err => {
          this.isError(err)
        })
      },
      getRoleActivity(roleId) {
        this.$axios({
          method: "get",
          url: "/restboot/roleMenu/" + roleId,
        }).then(res => {
          this.checkedItem = res.data.result
        }).catch(err => {
          this.isError(err)
        })
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>
