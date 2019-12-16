<template>
  <div style="padding:1rem">
    <div>
      <!-- <el-button type="primary" size="small" icon="el-icon-plus" @click="addMessage()">新增</el-button> -->
      <!-- <el-button v-if="checkedAll" size="small" class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button> -->
    </div>
    <div style="margin-top:1rem">
      <!-- <Breadcrumb
        v-bind:parentName="parentName"
        v-bind:childName="childName"
      ></Breadcrumb>-->
      <!-- 主要内容 -->
      <div class="mine">
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          size="small"
          border
          style="width: 100%"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <!-- <el-table-column prop="did" label="ID"> -->
          <!-- <template slot-scope="scope">{{ scope.row.date }}</template>s -->
          <!-- </el-table-column> -->
          <el-table-column prop="phone" label="申报人手机号" />
          <el-table-column prop="declarePhone" label="兑换人" />
          <el-table-column prop="cname" label="商品名称" />
          <el-table-column prop="amount" label="面额" />
          <el-table-column prop="score" label="积分" />
          <!-- <el-table-column prop="orderid" label="订单编号" /> -->
          <el-table-column prop="xstatus" label="状态" />
          <el-table-column prop="xthirdType" label="商品来源" />
          <el-table-column prop="createTime" label="时间" />
          <!-- <el-table-column align="center" prop="handle" label="操作" class="make">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="edit(scope.row)" />
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <!-- 分页 -->

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>

    <!-- 修改编辑状态 -->
    <div class="show">
      <el-dialog width="40%" :close-on-click-modal="false" :title="diaTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules1"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="申报号码" prop="sbnumbe">
            <el-input v-if="diaTitle==='新增申报信息'" v-model="ruleForm.sbnumbe" placeholder="请输入申报号码" />
            <el-input v-if="diaTitle==='编辑申报信息'" v-model="ruleForm.sbnumbe" disabled placeholder="请输入申报号码" />
          </el-form-item>
          <el-form-item label="兑换号码" prop="dhnumbe">
            <el-input v-model="ruleForm.dhnumbe" placeholder="请输入兑换号码" />
          </el-form-item>
          <el-form-item label="积分名称" prop="gid">
            <el-select v-model="ruleForm.gid" placeholder="请选择积分档">
              <el-option
                v-for="item in coreLevel"
                :key="item.id"
                :label="item.gname"
                :value="item.gid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="套餐名称" prop="sid">
            <el-select v-model="ruleForm.sid" placeholder="请选择套餐名称">
              <el-option
                v-for="item1 in packages"
                :key="item1.id"
                :label="item1.sname"
                :value="item1.sid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否提交" prop="sflag">
            <!-- 1是未提交2是提交 -->
            <el-radio v-model="ruleForm.sflag" :label="1">申报</el-radio>
            <el-radio v-model="ruleForm.sflag" :label="2">申报中</el-radio>
            <el-radio v-model="ruleForm.sflag" :label="3">申报失败</el-radio>
            <el-radio v-model="ruleForm.sflag" :label="4">申报成功</el-radio>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog()">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 1 -->
  </div>
</template>

<script>

import { UrlHelper } from '../../api/urlHelper'
import Pagination from '../../components/Pagination'
import moment from 'moment'
export default {
  // 分页
  components: {
    Pagination
  },
  data() {
    var validatePass = (rule, value, callback) => {
      console.log('验证触发了吗', value)
      // 验证号码1，2
      // 手机号正则表达式
      const reg = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('号码不能为空'))
      } else if (!reg.test(value)) {
        // 如果不符合手机号
        callback(
          new Error(
            '请输入正确的手机号码                                                                   '
          )
        )
      } else {
        callback()
      }
    }
    return {
      diaTitle: '',
      tableData: [],
      coreLevel: [], // 积分档数据
      packages: [], // 获取套餐当
      multipleSelection: [],
      currentPage4: 4,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      // 模态框
      dialogFormVisible: false,
      ruleForm: {
        dhnumbe: '',
        sbnumbe: '',
        gid: '',
        sid: '',
        sflag: ''
      },
      rules1: {
        dhnumbe: [
          { required: true, message: '兑换号码不能为空' },
          { validator: validatePass, trigger: 'blur' }],
        sbnumbe: [
          { required: true, message: '申报号码不能为空' },
          { validator: validatePass, trigger: 'blur' }],
        gid: [{ required: true, message: '积分名称不能为空' }],
        sid: [{ required: true, message: '套餐名称不能为空' }],
        sflag: [{ required: true, message: '提交状态不能为空' }]
      }
    }
  },
  mounted() {
    this.getList()
    // this.getCoreLevel();
    // this.getPackageName();
  },
  methods: {
    // 分页
    getList() {
      // 获取申报信息
      this.$axios
        .post(UrlHelper.declTable.getList, {
          page: this.listQuery.limit,
          begin: this.listQuery.page
        })
        .then(val => {
          if (val.status === 200) {
            // 如果请求成功
          //  console.log("申报信息获取成功");
            this.tableData = val.data.rows
            this.tableData.map(val => {
              val.createTime = moment(val.createTime).format('YYYY-MM-DD HH:mm:ss')
            })
            console.log(val.data.total)
            this.total = val.data.total
            // 解决删除bug
            const len = this.tableData.length
            if (len === 0 && this.listQuery.page > 1) {
              this.listQuery.page -= 1
              this.getList()
            }
          } else {
            this.$message({
              type: 'error',
              message: val.data.msg,
              duration: 1000
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
      this.multipleSelection = val
    },
    addMessage() {
      this.diaTitle = '新增申报信息'
      this.dialogFormVisible = true
      // this.$refs['ruleForm'].resetFields();
      // this.resetForm('ruleForm')
    },
    submitForm(formName) {
      // 提交之前验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过之后进行提交或者编辑
          if (this.diaTitle === '新增申报信息') {
            this.$axios
              .post(UrlHelper.declInfo.declInfoAdd, this.ruleForm)
              .then(val => {
                if (val.data.code === 200) {
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
          } else if (this.diaTitle === '编辑申报信息') {
            this.$axios
              .post(UrlHelper.declInfo.declIOnfoEdit, this.ruleForm)
              .then(val => {
                if (val.data.code === 200) {
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
        } else {
          return false
        }
      })
    },
    edit(data) {
      this.diaTitle = '编辑申报信息'
      this.ruleForm = {
        did: data.did,
        dhnumbe: data.dhnumbe,
        sbnumbe: data.sbnumbe,
        gid: data.gid,
        sid: data.sid,
        sflag: data.sflag
      }
      this.dialogFormVisible = true
    },
    // 清空验证的方法
    closeDialog() { // 关闭模态框事件
      this.ruleForm = {
        did: '',
        dhnumbe: '',
        sbnumbe: '',
        gid: '',
        sid: '',
        sflag: ''
      } // 清空模态框数据
      //  this.$refs['ruleForm'].resetFields();
      this.resetForm('ruleForm')
      this.dialogFormVisible = false
    },
    resetForm(formName) { // 清除验证
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    }
  }
}
</script>
<style scoped lang="scss">
// 主要内容
.mine {
  height: 100%;
  background: #fff;
  margin: 15px 15px 0px 0px;
  border-radius: 5px;
}
// 按钮
.btn .el-button {
  margin-top: 20px;
  margin-left: 5px;
  span:first-child {
    font-size: 18px;
    font-weight: 700;
    margin-right: 3px;
  }
  span:last-child {
    font-size: 14px;
  }
}
// 表格
.el-table {
  width: 100%;
}
// 模态框
.el-select {
  width: 100%;
}
.cell span {
  color: rgb(132, 132, 204);
  cursor: pointer;
}
</style>

