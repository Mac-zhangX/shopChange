<template>
  <div style="padding: 1rem">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0">
      <el-form :inline="true">
        <el-form-item>
          <el-button size="small" icon="el-icon-plus" type="primary" @click="addMenu()">添加</el-button>
          <el-button size="small" icon="el-icon-back" type="primary" @click="back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="menuData" size="small" width="100%" tooltip-effect="dark" border>
      <el-table-column type="index" width="50" />
      <el-table-column prop="menuName" label="菜单名称" />
      <el-table-column prop="com" label="组件路径" />
      <el-table-column prop="url" label="菜单路径" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(1, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="showBtn(scope.$index, scope.row)"
          >按钮管理
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    /> -->

    <el-pagination
      :page-sizes="[10,20, 50, 100]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      width="40%"
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="closeDialog('ruleForm')"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="menuName">
          <el-input v-model="ruleForm.menuName" style />
        </el-form-item>
        <el-form-item label="组件路径" :label-width="formLabelWidth" prop="com">
          <el-input v-model="ruleForm.com" style />
        </el-form-item>
        <el-form-item label="访问路径" :label-width="formLabelWidth" prop="url">
          <el-input v-model="ruleForm.url" style />
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="menuType">
          <el-select v-model="ruleForm.menuType" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="按钮权限" :label-width="formLabelWidth" prop="url">
          <el-checkbox-group v-model="btnList" size="small">
            <el-checkbox label="新增" border />
            <el-checkbox label="删除" border />
            <el-checkbox label="编辑" border />
            <el-checkbox label="查询" border />
          </el-checkbox-group>

        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 显示所有按钮信息 -->
    <el-dialog
      title="按钮信息"
      :visible.sync="btnDialogVisible"
      width="60%"
      @close="closefun()"
    >
      <!-- tab栏目 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按钮信息" name="first">
          <div class="flexT">
            <div class="div1">
              拥有按钮
              <ul>
                <li v-for="item in btnList" :key="item.id" class="btnStyle">
                  <el-tag
                    class="bacColor"
                    effect="dark"
                    closable
                    @click="detail(item)"
                    @close="delBtn(item)"
                  >
                    {{ item.menuName }}
                  </el-tag>
                  <!-- <el-button size="small" type="primary" @click="detail(item)">  {{ item.menuName }}</el-button>
                  <el-button size="small" type="danger" @click="delBtn(item)">删除</el-button> -->
                </li>

              </ul>
            </div>
            <div v-if="showDetail" class="div2">
              详细信息
              <ul>
                <li>
                  名称&nbsp;&nbsp;<el-input
                    v-model="btnEntity.menuName"
                    class="input1"
                    size="small"
                    placeholder="请输入内容"
                    clearable
                  />

                </li>
                <li>
                  权限&nbsp;&nbsp;<el-input
                    v-model="btnEntity.perms"
                    class="input1"
                    size="small"
                    placeholder="请输入内容"
                    clearable
                  />

                </li>
                <li>
                  备注&nbsp;&nbsp;<el-input
                    v-model="btnEntity.remark"
                    size="small"
                    class="input1"
                    placeholder="请输入内容"
                    clearable
                  />
                </li>
                <li class="saveBtn">
                  <el-button type="primary" size="small" @click="saveEdit()">保存</el-button>
                </li>

              </ul>
            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="新增按钮" name="second">
          <div style="width: 500px;margin: 0 auto">
            <el-form :label-position="labelPosition" label-width="80px" :model="addEntity">
              <el-form-item :label-width="formLabelWidth" label="名称">
                <el-input v-model="addEntity.menuName" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="权限">
                <el-input v-model="addEntity.perms" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth" label="备注">
                <el-input v-model="addEntity.remark" />
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-button style="width: 100%" type="primary" @click="submit('ruleForm')">创建</el-button>
                <!-- <el-button @click="reset('ruleForm')">重置</el-button> -->
              </el-form-item>
            </el-form>

          </div>

        </el-tab-pane>

      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { menuList, getMenue, addMenueOp, updateMenue, delMenue } from '../../api/modeList'
import Pagination from '@/components/Pagination/index'
export default {
  name: 'MenuManage',
  components: {
    Pagination
  },
  data() {
    return {

      labelPosition: 'right',
      activeName: 'first',
      showDetail: false,
      btnEntity: {
        menuId: '',
        menuName: '', // 名称
        perms: '', // 权限
        remark: '' // 备注
      },
      addEntity: {
        menuName: '', // 名称
        perms: '', // 权限
        remark: '', // 备注
        parentId: ''
      },
      btnDialogVisible: false, // 显示所有按钮信息
      title: '',
      btnList: [],
      menuData: [],
      parentId: '',
      // 模态框
      dialogFormVisible: false,
      diaTitle: '添加菜单',
      ruleForm: {
        menuName: '',
        com: '',
        url: '',
        menuType: '1'
      },
      formLabelWidth: '100px',
      rules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        com: [
          { required: true, message: '请输入菜单组件', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ]
      },
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      options: [
        // { name: '目录', value: '0' },
        { name: '菜单', value: '1' }
        // { name: '按钮', value: '3' }
      ]
    }
  },
  created() {
    console.log(this.$route.query.menuId)
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 删除按钮
    delBtn(data) {
      this.$confirm('此操作将永久删除当前按钮, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const arr = []
          arr.push(data.menuId)
          const obj = {
            menuIds: arr
          }
          // obj = qs.stringify(obj)
          // const obj = JSON.stringify(arr)
          // 删除
          delMenue(obj).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.dialogFormVisible = false
              this.getAllBtn({ menuId: this.addEntity.parentId })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 获取所有按钮信息
    getAllBtn(data) {
      const obj = {
        currPage: this.listQuery.page,
        pageSize: this.listQuery.limit,
        parentId: Number(data.menuId)
      }

      getMenue(obj).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.menus.records)
          console.log('所有的按钮')
          this.btnList = res.data.menus.records
          // this.total = res.data.menus.total
        }
      })
    },
    // 保存按钮编辑
    saveEdit() {
      const obj = {
        menuId: this.btnEntity.menuId,
        menuName: this.btnEntity.menuName,
        perms: this.btnEntity.perms,
        remark: this.btnEntity.remark,
        // parentId: this.btnEntity.menuId,
        menuType: 3
        // url: this.ruleForm.url
      }
      updateMenue(obj).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: res.data.msg,
            duration: 1000
          })
          this.dialogFormVisible = false
          this.getAllBtn({ menuId: this.addEntity.parentId })
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    submit(data) { // 提交
      // 新增按钮
      const obj = {
        menuName: this.addEntity.menuName,
        // com: this.addEntity.com, // perms
        perms: this.addEntity.perms,
        remark: this.addEntity.remark,
        parentId: this.addEntity.parentId,
        menuType: 3
        // url: this.ruleForm.url
      }
      addMenueOp(obj).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: res.data.msg,
            duration: 1000
          })
          // 跳到列表
          this.btnList = []
          this.getAllBtn({ menuId: this.addEntity.parentId })
          this.activeName = 'first'
          this.addEntity = {
            menuName: '', // 名称
            perms: '', // 权限
            remark: '', // 备注
            parentId: ''
          }
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg,
            duration: 1000
          })
        }
      })
    },
    reset(data) { // 重置

    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 关闭详情页
    closefun() {
      this.showDetail = false
      this.btnEntity.menuName = ''
      this.btnEntity.remark = ''
      this.btnEntity.perms = ''
    },
    // 按钮详细信息
    detail(data) {
      this.showDetail = true
      this.btnEntity.menuId = data.menuId
      this.btnEntity.menuName = data.menuName
      this.btnEntity.remark = data.remark
      this.btnEntity.perms = data.perms
    },
    showBtn(index, data) { // 显示所有的按钮信息true
      this.btnDialogVisible = true
      this.addEntity.parentId = Number(data.menuId)
      this.getAllBtn(data)
    },
    getList() {
      const menuId = this.$route.query.menuId
      this.parentId = this.$route.query.menuId
      const obj = {
        currPage: this.listQuery.page,
        pageSize: this.listQuery.limit,
        parentId: Number(menuId)
      }
      const rLoading = this.openLoading()
      getMenue(obj).then(res => {
        if (res.data.code === 0) {
          this.menuData = res.data.menus.records
          this.total = res.data.menus.total
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg,
            duration: 1000
          })
        }
        rLoading.close()
      })
    },
    addMenu() {
      this.title = '添加菜单'
      this.dialogFormVisible = true
      this.ruleForm.menuName = ''
      this.ruleForm.com = ''
      this.ruleForm.url = ''
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === '添加菜单') {
            const obj = {
              menuName: this.ruleForm.menuName,
              com: this.ruleForm.com,
              parentId: this.parentId,
              menuType: this.ruleForm.menuType,
              url: this.ruleForm.url
            }
            const rLoading = this.openLoading()
            addMenueOp(obj).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.data.msg,
                  duration: 1000
                })
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg,
                  duration: 1000
                })
              }
              rLoading.close()
            })
          } else if (this.title === '编辑菜单') {
            const obj = {
              menuId: this.ruleForm.menuId,
              menuName: this.ruleForm.menuName,
              com: this.ruleForm.com,
              parentId: this.parentId,
              menuType: this.ruleForm.menuType,
              url: this.ruleForm.url
            }
            const rLoading = this.openLoading()
            updateMenue(obj).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.data.msg,
                  duration: 1000
                })
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.msg,
                  duration: 1000
                })
              }
              rLoading.close()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeDialog(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    editForm() {
      this.dialogFormVisible = false
    },
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.title = '编辑菜单'
      this.ruleForm.menuId = row.menuId
      this.ruleForm.menuName = row.menuName
      this.ruleForm.com = row.com
      this.ruleForm.url = row.url
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除当前菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const arr = []
          arr.push(data.menuId)
          const obj = {
            menuIds: arr
          }
          // obj = qs.stringify(obj)
          // const obj = JSON.stringify(arr)
          // 删除
          const rLoading = this.openLoading()
          delMenue(obj).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.dialogFormVisible = false
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
            rLoading.close()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    back() { // 返回
      this.$router.push({ path: 'menuManagement' })
    },
    // 分页
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 分页显示条数
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    }
  }
}
</script>
<style>
.pagination-container{
  padding: 0 0;
}

</style>
<style scoped lang="scss">
.flexT{
  display: flex;
  justify-content: flex-start;
  ul{
    list-style: none;
    li{
      line-height: 4rem;
    }
  }
  .div1{
    width: 30%;
    margin-right: 15%;
  }
  .div2{
    width: 55%;
  }

}
.input1{
  width: 250px;
}
.toolbar{
  padding-bottom: 1px !important;
}
.btnStyle{
  text-align: right;
}
.saveBtn{
  .el-button{
      margin-left: 120px;
  }
}
.bacColor{
    background-color: #409EFF;
    color: #fff;
}
/deep/.el-tag .el-icon-close {
  color: #fff;
}
</style>
