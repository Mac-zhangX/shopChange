<template>
  <div style="padding:1rem">
    <!-- 运营商下级代理 -->
    <div>
      <el-button size="small" icon="el-icon-back" type="primary" @click="back()">返回</el-button>
    </div>
    <el-table
      ref="multipleTable"
      size="small"
      border
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 1rem"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID">
        <template slot-scope="scope">{{ scope.row.Id }}</template>
      </el-table-column>
      <el-table-column prop="Account" label="用户名" />
      <el-table-column prop="Phone" label="电话号码" />
      <el-table-column prop="TypeName" label="类型" />
      <el-table-column prop="AuditName" label="Audit" />
      <el-table-column prop="StatusName" label="状态" />
      <el-table-column prop="Nickname" label="昵称" />
      <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="下级列表" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-view"
              circle
              @click="lowUser(scope.row)"
            />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="折扣设置" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-edit"
              circle
              @click="editDiscount(scope.row)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.Audit===1" class="item" effect="dark" content="审核" placement="top">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-zoom-in"
              circle
              @click="check(scope.row)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.Status===1" class="item" effect="dark" content="单击启用" placement="top">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-check"
              circle
              @click="open(scope.row)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.Status===2" class="item" effect="dark" content="单击禁用" placement="top">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-close"
              circle
              @click="open(scope.row)"
            />
          </el-tooltip>
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
      <el-dialog
        :close-on-click-modal="false"
        width="40%"
        :title="diaTitle"
        :visible.sync="dialogFormVisible"
        @close="close()"
      >
        <el-form ref="userEntity" :rules="rules" :model="userEntity">
          <el-form-item prop="phone" label="电话号码" :label-width="formLabelWidth">
            <el-input
              v-model="userEntity.phone"
              style
              auto-complete="off"
              @input="queryPhone(userEntity.phone)"
            />
          </el-form-item>
          <el-form-item prop="province" label="归属地（省）" :label-width="formLabelWidth">
            <el-input
              id="province"
              v-model="userEntity.province"
              disabled
              style
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item prop="city" label="归属地（市）" :label-width="formLabelWidth">
            <el-input id="city" v-model="userEntity.city" disabled style auto-complete="off" />
          </el-form-item>
          <el-form-item prop="commission" label="佣金余额" :label-width="formLabelWidth">
            <el-input
              v-model="userEntity.commission"
              type="number"
              min="0"
              style
              auto-complete="off"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination/index'
import { UrlHelper } from '@/api/urlHelper'

export default {
  components: {
    Pagination
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error('用户名不能为空'))
        return
      }
      value = value.toString().trim()
      if (value === '') {
        callback(new Error('用户名不能为空'))
        return
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error('电话号码不能为空'))
        return
      }
      value = value.toString().trim()
      if (value === '') {
        callback(new Error('电话号码不能为空'))
        return
      } else {
        const reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          callback(new Error('请填写正确的电话号码'))
          return
        } else {
          const newArray = this.tableData3.filter(val => {
            if (this.userEntity.id !== val.id && val.phone === value) {
              return true
            } else {
              return false
            }
          })
          if (newArray.length > 0) {
            callback(new Error('电话号码已经存在'))
          } else {
            callback()
          }
        }
      }
    }
    var validatePass3 = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error('vercode不能为空'))
        return
      }
      value = value.toString().trim()
      if (value === '') {
        callback(new Error('vercode不能为空'))
        return
      } else {
        callback()
      }
    }
    return {
      tableData3: [],
      userEntity: {
        id: '',
        img: '',
        openid: '',
        phone: '',
        username: '',
        vercode: '',
        vercodeTime: '',
        commission: 0,
        province: '',
        city: ''
      },
      dhNumbers: [], // 所有的兑换号码
      packages: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      diaTitle: '', // 是新增还是修改
      multipleSelection: [],
      checkedAll: false,
      // 进行添加的变量
      dialogFormVisible: false,
      imgInfo: { uuid: '', iid: '' }, // 存放当前的图片信息
      formLabelWidth: '100px',
      imgData: {},
      // 用于图片的上传
      dialogImageUrl: '',
      dialogVisible: false,
      ad_url_list: [],
      limitCount: 1,
      hideUpload: false,
      rules: {
        username: [{ validator: validatePass, trigger: 'blur' }],
        phone: [
          { required: true, message: '电话号码不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        vercode: [
          { required: true, message: 'vercode不能为空', trigger: 'blur' },
          { validator: validatePass3, trigger: 'blur' }
        ],
        commission: [
          { required: true, message: '佣金余额不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取所有的兑换号码
    getAllChargeNum() {
      this.$axios.post(UrlHelper.orderInfo.allChargeNum).then(val => {
        this.dhNumbers = val.data
      })
    },
    // 获取所有的套餐
    getPackage() {
      this.$axios.post(UrlHelper.declInfo.queryPackageClass).then(val => {
        this.packages = val.data
      })
    },
    getList() {
      const Fid = this.$route.query.Fid
      const formData = new FormData()
      formData.append('Fid', Fid)
      this.$axios
        .post(UrlHelper.agentManage.getList, formData)
        .then(val => {
          if (val.data.Code === 200) {
            this.tableData3 = val.data.Data
            // 进行判断
            for (let i = 0; i < this.tableData3.length; i++) {
              if (this.tableData3[i].Type === 1) {
                this.tableData3[i].TypeName = '推广渠道'
              } else if (this.tableData3[i].Type === 2) {
                this.tableData3[i].TypeName = '操作员'
              }

              if (this.tableData3[i].Audit === 1) {
                this.tableData3[i].AuditName = '未审核'
              } else if (this.tableData3[i].Audit === 2) {
                this.tableData3[i].AuditName = '审核通过'
              }
              if (this.tableData3[i].Status === 1) {
                this.tableData3[i].StatusName = '未启用'
              } else if (this.tableData3[i].Status === 2) {
                this.tableData3[i].StatusName = '已启用'
              }
            }
            // alert('查询下级列表成功')
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
      if (val.length > 0) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
      this.multipleSelection = val
    },
    addFun() {
      // 打开添加的模态框
      this.diaTitle = '添加用户'
      this.dialogFormVisible = true
      // this.userEntity.commission = 0
      // this.$refs['userEntity'].resetFields()
      // this.resetForm('userEntity')
      // this.$refs['userEntity'].resetFields()
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
            message: '删除成功!',
            duration: 1000
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除!',
            duration: 1000
          })
        })
    },
    edit(data) {
      // 编辑进行回显
      this.diaTitle = '修改用户'
      // console.log(data)
      // const num = data.phone
      this.userEntity = {
        id: data.id,
        img: data.img,
        openid: data.openid,
        phone: data.phone,
        username: data.username,
        vercode: data.vercode,
        vercodeTime: data.vercodeTime,
        commission: data.commission,
        province: data.province,
        city: data.city
      }
      // console.log(this.userEntity)
      this.dialogFormVisible = true
    },
    del(data) {
      // 删除当前积分档
      // 给出提示
      this.$confirm('此操作将永久删除该用户记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除的方法
          this.$axios
            .post(UrlHelper.userManage.delIncar, {
              id: data.id,
              phone: data.phone
            })
            .then(val => {
              //  console.log(val)
              if (val.data.code === 200) {
                // 删除成功
                this.$message({
                  type: 'success',
                  message: val.data.msg,
                  duration: 1000
                })
                this.getList()
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
    // 点击确定调用的方法
    confirm() {
      this.$refs['userEntity'].validate(valid => {
        // 进行验证规则的验证
        // console.log(valid)
        if (valid) {
          if (this.diaTitle === '添加用户') {
            // 如果是新增则进行提交的接口调用
            this.$axios
              .post(UrlHelper.userManage.getadd, this.userEntity)
              .then(val => {
                if (val.data.code === 200) {
                  // 如果请求成功
                  this.$message({
                    type: 'success',
                    message: val.data.msg,
                    duration: 1000
                  })
                  this.dialogFormVisible = false
                  this.userEntity = {}
                  this.getList()
                } else {
                  this.$message({
                    type: 'error',
                    message: val.data.msg,
                    duration: 1000
                  })
                }
              })
          } else if (this.diaTitle === '修改用户') {
            // 如果是修改则进行编辑的接口调用
            this.$axios
              .post(UrlHelper.userManage.update, this.userEntity)
              .then(val => {
                if (val.data.code === 200) {
                  // 如果请求成功
                  this.$message({
                    type: 'success',
                    message: val.data.msg,
                    duration: 1000
                  })
                  this.getList()
                  this.dialogFormVisible = false
                } else {
                  this.$message({
                    type: 'error',
                    message: val.data.msg,
                    duration: 1000
                  })
                }
              })
          }
        }
      })
    },

    close() {
      // 关闭对话框
      //  console.log('close触发了吗')
      this.dialogFormVisible = false
      this.userEntity = {
        id: '',
        img: '',
        openid: '',
        phone: '',
        username: '',
        vercode: '',
        vercodeTime: '',
        commission: 0
      }
      this.resetForm('userEntity')
      // this.$refs['userEntity'].resetFields()
    },
    // 复选框全选
    queryPhone(num) {
      // console.log('清空了')
      this.userEntity.province = ''
      this.userEntity.city = ''
      const reg = /^1[3456789]\d{9}$/
      if (!reg.test(num)) {
        return
      }
      // 获取所在地
      this.$axios
        .get('/api/dianhua_api/open/location?tel=' + num)
        .then(val2 => {
          if (val2.status === 200) {
            //   console.log('val2')
            //  console.log(val2)
            if (
              val2.data.response[num].detail !== null &&
              val2.data.response[num].detail !== ''
            ) {
              this.userEntity.province =
                val2.data.response[num].detail.province
              //  console.log(this.userEntity.province)
              this.userEntity.city =
                val2.data.response[num].detail.area[0].city
              //  console.log(this.userEntity.city)
              const domCity = document.getElementById('city').value
              const domProvince = document.getElementById('province').value
              if (domCity === '') {
                document.getElementById('city').value = this.userEntity.city
              }
              if (domProvince === '') {
                document.getElementById(
                  'province'
                ).value = this.userEntity.province
              }
            }
          }
        })
    },
    resetForm(formName) {
      // 清除验证
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    back() {
      this.$router.push({ path: 'operatorManage' })
    },
    // 点击审核进行触发
    check(data) {
      let formData = new FormData()
      formData.append('Uid', data.Id)
      this.$axios.post(UrlHelper.operatorManage.userAudit, formData).then(val => {
        if (val.data.Code === 200) { // 请求成功
          this.$message({
            type: 'success',
            message: val.data.Msg,
            duration: 1000
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: val.data.Msg,
            duration: 1000
          })
        }
        formData = {}
      })
    },
    // 点击审核进行触发
    open(data) {
      let formData = new FormData()
      formData.append('Uid', data.Id)
      this.$axios.post(UrlHelper.operatorManage.userStatus, formData).then(val => {
        if (val.data.Code === 200) { // 请求成功
          this.$message({
            type: 'success',
            message: val.data.Msg,
            duration: 1000
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: val.data.Msg,
            duration: 1000
          })
        }
        formData = {}
      })
    }
  }
}
</script>

<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
</style>
