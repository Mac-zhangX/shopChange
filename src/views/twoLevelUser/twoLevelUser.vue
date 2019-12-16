<template>
  <div style="padding:1rem">
    <div>
      <!-- 二级用户列表 -->
      <!-- <el-button size="small" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button> -->
    </div>
    <el-table
      ref="multipleTable"
      size="small"
      border
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 1rem"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column width="55" label="ID">
        <template slot-scope="scope">{{ scope.row.Id }}</template>
      </el-table-column>
      <el-table-column prop="Account" label="用户名" />
      <el-table-column prop="Phone" label="电话号码" />
      <el-table-column prop="TypeName" label="类型" />
      <el-table-column prop="AuditName" label="审核状态" />
      <el-table-column prop="StatusName" label="状态" />
      <el-table-column prop="Nickname" label="昵称" />
      <el-table-column prop="Lockmoney" label="今日收益" />
      <el-table-column prop="Money" label="总收益" />
      <el-table-column prop="Cash" label="申请提现" />
      <el-table-column prop="Cashmoney" label="已提现" />
      <el-table-column align="center" min-width="180" label="操作" show-overflow-tooltip>
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
          <el-form-item prop="Account" label="账号" :label-width="formLabelWidth">
            <el-input v-model="userEntity.Account" style auto-complete="off" />
          </el-form-item>
          <el-form-item prop="Password" label="密码" :label-width="formLabelWidth">
            <el-input
              id="Password"
              v-model="userEntity.Password"
              type="password"
              style
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item prop="ConfirmPassword" label="确认密码" :label-width="formLabelWidth">
            <el-input
              id="ConfirmPassword"
              v-model="userEntity.ConfirmPassword"
              type="password"
              style
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item prop="Nickname" label="姓名" :label-width="formLabelWidth">
            <el-input v-model="userEntity.Nickname" style auto-complete="off" />
          </el-form-item>
          <el-form-item prop="Phone" label="手机号" :label-width="formLabelWidth">
            <el-input v-model="userEntity.Phone" style auto-complete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 折扣设置 -->
    <div>
      <el-dialog
        :close-on-click-modal="false"
        width="40%"
        :title="diaTitle"
        :visible.sync="disCountVisible"
        @close="close()"
      >
        <div style="text-align:center">
          <el-form :model="userEntity">
            <el-form-item
              v-for="item in goodsList"
              :key="item.Id"
              :label="item.Title"
              :label-width="formLabelWidth"
            >
              <el-input
                v-model="item.Discount"
                min="0"
                size="medium"
                placeholder="请输入折扣"
                @keyup.native="proving($event)"
              >
                <template slot="prepend">折扣</template>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="confirmDiscount()">确 定</el-button>
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
        callback(new Error('手机号码不能为空'))
        return
      }
      value = value.toString().trim()
      if (value === '') {
        callback(new Error('手机号码不能为空'))
        return
      } else {
        const reg = /^[1]([3-9])[0-9]{9}$/
        if (!reg.test(value)) {
          callback(new Error('请填写正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    return {
      userId: '', // 当前的用户Id
      discount: '',
      tableData3: [],
      goodsList: [], // 所有商品列表
      disCountVisible: false, // 折扣设置
      userEntity: {
        Id: '', // Id
        Account: '', // 账户
        Password: '', // 密码
        Nickname: '', // 昵称
        ConfirmPassword: '', // 确认密码
        Phone: ''
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
      formLabelWidth: '100px',
      rules: {
        Account: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
          // { validator: validatePass, trigger: 'blur' }
        ],
        Password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
          // { validator: validatePass2, trigger: 'blur' }
        ],
        Nickname: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
          // { validator: validatePass3, trigger: 'blur' }
        ],
        ConfirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' }
        ],
        Phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getList()
    // this.getAllGoods()
  },
  methods: {
    // 获取所有的商品列表信息
    getAllGoods() {
      this.$axios.post(UrlHelper.integralList.getList).then(val => {
        if (val.data.Code === 200) {
          this.goodsList = val.data.Data
        }
      })
    },

    getList() {
      // console.log('----')
      // 查询所有的订单信息
      const formData = new FormData()
      formData.append('Page', this.listQuery.page)
      formData.append('Num', this.listQuery.limit)
      this.$axios.post(UrlHelper.getAllUser.getList, formData).then(val => {
        if (val.data.Code === 200) {
          // 如果请求成功
          this.tableData3 = val.data.Data.data
          this.total = val.data.Data.total
          // this.total = val.data.Data.length
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
        } else {
          this.$message({
            type: 'error',
            message: val.data.Msg
          })
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
      this.diaTitle = '添加用户'
      this.dialogFormVisible = true
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
      this.dialogFormVisible = true
    },
    // 折扣设置
    editDiscount(data) {
      this.disCountVisible = true
      this.diaTitle = '折扣设置'
      this.userId = data.Id // 当前的用户Id
      // 查询当前用户的折扣值
      const formData = new FormData()
      formData.append('Userid', data.Id)
      // formData.append('List', [])
      this.$axios
        .post(UrlHelper.operatorManage.setDiscount, formData)
        .then(val => {
          if (val.data.Code === 200) {
            this.goodsList = val.data.Data
            // alert('请求成功')
          }
        })
    },
    // 跳到下级用户界面
    lowUser(data) {
      console.log(data)
      this.$router.push({
        path: 'agentList',
        query: {
          Fid: data.Id
        }
      })
    },
    // 点击确定调用的方法
    confirm() {
      // 点击确定进行验证
      this.$refs['userEntity'].validate((valid) => {
        if (valid) {
          // 如果验证通过
          if (this.diaTitle === '添加用户') {
            // 如果是新增则进行提交的接口调用
            const formData = new FormData()
            formData.append('Account', this.userEntity.Account)
            formData.append('Password', this.userEntity.Password)
            formData.append('Nickname', this.userEntity.Nickname)
            formData.append('ConfirmPassword', this.userEntity.ConfirmPassword)
            formData.append('Phone', this.userEntity.Phone)
            this.$axios.post(UrlHelper.operatorManage.add, formData).then(val => {
              if (val.data.Code === 200) {
                // 如果请求成功
                this.$message({
                  type: 'success',
                  message: val.data.Msg,
                  duration: 1000
                })
                this.dialogFormVisible = false
                this.userEntity = {}
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: val.data.Msg,
                  duration: 1000
                })
              }
              this.formData = {}
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

    // 保存折扣设置
    confirmDiscount() {
      let formData = new FormData()
      const userId = this.userId // 当前用户Id
      const allData = this.goodsList // 所有的商品列表
      const list = []
      let a = 0
      let msg = ''
      allData.map(value => {
        if (String(value.Discount).indexOf('.') > -1) {
          a = 1
          msg = '折扣不能为小数'
        }
        if (value.Discount < 0) {
          a = 3
          msg = '折扣不能小于0'
        }
        if (value.Discount >= 100) {
          a = 3
          msg = '折扣不能大于100'
        }
        const obj = { Cid: '', Discount: '' }
        obj.Cid = value.Cid
        obj.Discount = value.Discount
        list.push(obj)
      })
      if (a === 1) {
        this.$message({
          type: 'error',
          message: msg,
          duration: 1000
        })
        return
      }
      if (a === 2) {
        this.$message({
          type: 'error',
          message: msg,
          duration: 1000
        })
        return
      }
      if (a === 3) {
        this.$message({
          type: 'error',
          message: msg,
          duration: 1000
        })
        return
      }
      console.log('所有的折扣i信息', list)
      formData.append('Userid', userId)
      formData.append('List', JSON.stringify(list))
      // 保存折扣
      this.$axios
        .post(UrlHelper.operatorManage.setDiscount, formData)
        .then(val => {
          if (val.data.Code === 200) {
            this.$message({
              type: 'success',
              message: val.data.Msg,
              duration: 1000
            })
            this.disCountVisible = false
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
    close() {
      this.dialogFormVisible = false
      this.disCountVisible = false
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
      // 清除用户折扣
      this.goodsList.map(val => {
        val.Discount = ''
      })

      this.resetForm('userEntity')
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
            if (
              val2.data.response[num].detail !== null &&
              val2.data.response[num].detail !== ''
            ) {
              this.userEntity.province =
                val2.data.response[num].detail.province
              this.userEntity.city =
                val2.data.response[num].detail.area[0].city
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
    // 禁止输入相关参数
    proving(e) {
      var keynum = window.event ? e.keyCode : e.which
      // var keyChar = String.fromCharCode(keynum) // 获取键盘码对应的字符
      if (
        keynum === 189 ||
        keynum === 190 ||
        keynum === 110 ||
        keynum === 109
      ) {
        e.target.value = ''
      }
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
