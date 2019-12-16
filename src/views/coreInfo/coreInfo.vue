<template>
  <div style="padding:1rem">
    <div>
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button>
      <!-- <el-button v-if="checkedAll" size="small" class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button> -->
    </div>
    <el-table
      ref="multipleTable"
      size="small"
      border
      fit
      highlight-current-row
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 100%;margin-top:1rem"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="积分档次编号" width="400">
        <template slot-scope="scope">{{ scope.row.gid }}</template>
      </el-table-column>
      <el-table-column prop="gname" label="积分" width="400" />
      <el-table-column align="center" min-width="200" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="edit(scope.row)" />
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="del(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- 添加的模态框 -->
    <div>
      <el-dialog :close-on-click-modal="false" width="30%" :title="diaTitle" :visible.sync="dialogFormVisible" @close="close()">
        <el-form ref="coreEntity" :rules="rules2" :model="coreEntity">
          <!-- <el-form-item label="档次编号" :label-width="formLabelWidth">
            <el-input v-model="coreEntity.gid" style auto-complete="off" />
          </el-form-item> -->
          <el-form-item prop="gname" label="积分" :label-width="formLabelWidth">
            <el-input v-model="coreEntity.gname" auto-complete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination/index'
import { UrlHelper } from '../../api/urlHelper'
export default {
  components: {
    Pagination
  },
  data() {
    var validatePass = (rule, value, callback) => {
      // 进行数据的判断
      // console.log('this.coreEntity.gname', this.tempData.gname)
    //  console.log('value', value)
      if (value === undefined) {
        callback(new Error('积分档不能为空'))
        // callback()
        return
      }
      value = value.trim()
      if (value === '') {
        // callback()
        callback(new Error('积分档不能为空'))
      } else if ((value !== '' && this.diaTitle === '新增积分档') || (value !== '' && this.diaTitle === '修改积分档' && this.tempData.gname !== value)) {
        // 接口验证
        // console.log('value有值吗', value)
        // console.log(this.coreEntity)
        'http://192.168.0.102:8081/grade/existUserinfo'
        this.$axios.post(UrlHelper.coreInfo.checkExist, { gname: value })
          .then(val => {
            const data = val.data
            // console.log('---------', val)
            if (data > 0) {
              callback(new Error('该积分档已经存在'))
            } else {
              callback()
            }
          })
      } else if (value !== '' && this.diaTitle === '修改积分档' && this.tempData.gname === value) {
        // 如果与原来的值相同
        callback()
      }
    }
    return {
      total: 0,
      tableData3: [], // 页面列表数据
      rules2: {
        gname: [
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      tempData: '',
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      diaTitle: '',
      multipleSelection: [],
      checkedAll: false,
      // 进行添加的变量
      dialogFormVisible: false,
      isExist: '',
      coreEntity: {
        gid: '',
        gname: ''
      },
      formLabelWidth: '100px',
      isShow: false
    }
  },
  mounted() {
    this.queryData()
    this.init()
  },
  methods: {
    init() {
      const authorities = window.localStorage.getItem('authorities')
      if (authorities === 'admin') {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    queryData() {
      // console.log(' this.listQuery.limit', this.listQuery.limit)
      // console.log('this.listQuery.page', this.listQuery.page)
      this.$axios({
        method: 'post',
        url: UrlHelper.coreInfo.queryList,
        data: {
          page: this.listQuery.limit,
          begin: this.listQuery.page
        }
      }).then(val => {
      //  console.log('数据改变了吗')
        // console.log(this.listQuery)
        // console.log('列表', val.data.rows)
        // console.log('总数量', val.data.total)
        this.tableData3 = val.data.rows
        this.total = val.data.total
        // 解决删除bug
        const len = this.tableData3.length
        if (len === 0 && this.listQuery.page > 1) {
          this.listQuery.page -= 1
          this.queryData()
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
    //  console.log('全选触发了吗---', val)
      if (val.length > 0) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
      this.multipleSelection = val
    },
    addFun() {
      // 打开添加的模态框
      this.diaTitle = '新增积分档'
      this.dialogFormVisible = true
      // this.resetForm('coreEntity')
    },
    delAll() {
      // 删除所有
      // 给出提示
      this.$confirm('此操作将永久删除所有积分记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // doSomething
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    edit(data) {
      this.diaTitle = '修改积分档'
      // console.log(data)
      const d1 = data
      this.tempData = d1
      this.coreEntity = {
        gid: data.gid,
        gname: data.gname
      }
      this.dialogFormVisible = true
    },
    del(data) {
      // 删除当前积分档
      // 给出提示
      this.$confirm('此操作将永久删除该积分记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.post(UrlHelper.coreInfo.delCoreInfo, { gid: data.gid }).then(val => {
            // 如果删除成功的返回
            // console.log(val)
            if (val.data.code === 200) {
              this.$message({
                type: 'success',
                message: val.data.msg,
                duration: 1000
              })
              // console.log(this.listQuery)
              this.queryData()
            } else {
              this.$message({
                type: 'error',
                message: val.data.msg,
                duration: 1000
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            duration: 1000
          })
        })
    },
    cancel() {
      this.resetForm('coreEntity')
      this.dialogFormVisible = false
      this.coreEntity = {}
    },
    close() {
      // 关闭对话框
      this.resetForm('coreEntity')
      // console.log('close触发了吗')
      this.dialogFormVisible = false
      this.coreEntity = {}
    },
    // 进行分操作
    getList() {
      // console.log('一页显示数量', this.listQuery.limit)
      // console.log('当前页数', this.listQuery.page)
      this.$axios({
        method: 'post',
        url: UrlHelper.coreInfo.queryList,
        data: {
          page: this.listQuery.limit,
          begin: this.listQuery.page
        }
      }).then(val => {
      //  console.log(val.data.rows)
      //  console.log(val.data.total)
        this.tableData3 = val.data.rows
        this.total = val.data.total
      })
    },
    // 点击保存
    confirm() {
      // 进行验证
      this.$refs['coreEntity'].validate((valid) => {
        if (valid) {
          // 判断是否是编辑还是新增
          if (this.diaTitle === '新增积分档') {
            this.addScore()
          } else if (this.diaTitle === '修改积分档') {
            this.updateScore()
          }
        }
      })
    },
    // 新增积分档
    addScore() {
      this.$axios.post(UrlHelper.coreInfo.addCoreInfo, this.coreEntity).then(val => {
        if (val.data.code === 200) {
        //  console.log('成功了吗', val)
          this.dialogFormVisible = false
          this.$message({
            message: val.data.msg,
            type: 'success',
            duration: 1000
          })
          this.queryData()
        } else {
          this.$message({
            message: val.data.msg,
            type: 'error',
            duration: 1000
          })
        }
      })
    },
    // 修改积分档
    updateScore() {
    //  console.log('开始进行修改了吗')
      this.$refs['coreEntity'].validate((valid) => {
        if (valid) { // 如果验成功
          this.$axios.post(UrlHelper.coreInfo.editCoreInfo, this.coreEntity).then(val => {
            if (val.data.code === 200) {
              this.$message({
                message: val.data.msg,
                type: 'success',
                duration: 1000

              })
              this.queryData()
              this.dialogFormVisible = false
            } else {
              this.$message({
                message: val.data.msg,
                type: 'error',
                duration: 1000
              })
            }
          })
        }
      })
    },
    resetForm(formName) { // 清除验证
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    }
  }
}
</script>

<style>
</style>
