<template>
  <div style="padding:1rem">
    <div>
      手机号
      <el-input v-model="phoneNumber" style="width: 200px" size="small" placeholder="请输入内容" prefix-icon="el-icon-search" />
      &nbsp;&nbsp;&nbsp;&nbsp;
      红包类型
      <el-select v-model="denominations" size="small" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="getList()">搜索</el-button>
      &nbsp; &nbsp; &nbsp; &nbsp;<span style="color: #909399;font-size: 14px">（说明：例如 15288795834 查询记录 选择对应的记录即可重新发货
      </span></div>
    <!-- <div style="margin-top: 21px">
      <el-table
        ref="multipleTable"
        size="small"
        border
        :data="tableData3"
        style="width: 100%;"
      >
        <el-table-column label="ID" width="100">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column prop="convertPhone" label="兑换手机号" width="120" />

        <el-table-column prop="transformTime" label="创建时间" width="150">
          <template slot-scope="scope">{{ scope.row.transformTime }}</template>
        </el-table-column>
        <el-table-column prop="declarationId" label="申报ID" width="100" />

        <el-table-column prop="himalayaRequestStatusName" label="喜马拉雅请求状态" width="180" />

        <el-table-column prop="ip" label="IP地址" width="100" />
        <el-table-column prop="meituanRequestStatusName" label="美团请求状态" width="120" />
        <el-table-column prop="orderName" label="订单编号" width="180" />
        <el-table-column prop="uniqueMarks" label="订单唯一标识" width="180" />
        <el-table-column align="center" min-width="60" label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="点击将手动重新发货" placement="top">
              <el-button size="mini" type="success" icon="el-icon-info" circle @click="edit(scope.row)" />
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
    </div> -->
  </div>
</template>
<script>
// import Pagination from '@/components/Pagination/index'
import { UrlHelper } from '@/api/urlHelper'
// import moment from 'moment'
export default {
  // components: {
  //   Pagination
  // },
  data() {
    return {
      phoneNumber: '', // 手机号
      denominations: '', // 面额
      tableData3: [],
      drawEntity: {
        uid: '',
        did: '', // 兑换号码对应的id
        wid: '', // 提现id
        withdrawMoney: '1', // 提现金额
        withdrawTime: '', // 提现时间
        withdrawWay: '', // 提现方式
        withdrawStatus: '', // 提现状态
        withdrawAlipayName: '',
        withdrawAlipayPhone: ''

      },
      dhNumbers: [], // 所有的兑换号码
      usernames: [],
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
      options: [
        { name: '5元红包', value: 5 },
        { name: '10元红包', value: 10 },
        { name: '20元红包', value: 20 }
      ],
      diaTitle: '', // 是新增还是修改
      multipleSelection: [],
      checkedAll: false,
      // 进行添加的变量
      dialogFormVisible: false,

      formLabelWidth: '100px',

      // 用于图片的上传
      dialogImageUrl: '',
      dialogVisible: false,
      ad_url_list: [],
      limitCount: 1,
      hideUpload: false

    }
  },
  mounted() {

  },
  methods: {
    getList() {
      this.$axios({
        method: 'post',
        url: UrlHelper.mtSupply.reissue,
        params: {
          exchangePhone: this.phoneNumber,
          channelType: this.denominations
        }
      }).then(val => {
        if (val.data.code === 200) {
          console.log(val)
          this.tableData3 = val.data.data
          this.$message({
            type: 'success',
            message: val.data.msg,
            duration: 1000
          })
          // this.tableData3.map(val => {
          //   if (val.himalayaRequestStatus === 1) {
          //     val.himalayaRequestStatusName = '未请求'
          //   } else if (val.himalayaRequestStatus === 2) {
          //     val.himalayaRequestStatusName = '已请求'
          //   }
          //   if (val.meituanRequestStatus === 1) {
          //     val.meituanRequestStatusName = '未请求'
          //   } else if (val.meituanRequestStatus === 2) {
          //     val.meituanRequestStatusName = '已请求'
          //   }
          //   val.transformTime = moment(val.createTime).format('YYYY-MM-DD HH:mm:ss')
          // })
        } else {
          this.$message({
            type: 'error',
            message: val.data.msg
          })
        }
      })
    },
    addFun() {
      this.diaTitle = '新增提现记录'
      this.dialogFormVisible = true
    },
    delAll() {
      this.$confirm('此操作将永久删除所有提现记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 1000
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
    edit(data) { // 编辑进行回显
      this.$confirm('此操作将补发美团商品记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: UrlHelper.mtSupply.reissue,
          data: data
        }).then(val => {
          if (val.data.code === 200) {
            this.$message({
              type: 'success',
              message: val.data.msg,
              duration: 1000
            })
          } else {
            this.$message({
              type: 'error',
              message: val.data.msg,
              duration: 1000
            })
          }
        })
      })
    },
    del(data) {
      this.$confirm('此操作将永久删除该积分记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            duration: 1000
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
      this.$refs['drawEntity'].validate((valid) => { // 进行验证规则的验证
        if (valid) {
          // console.log('进来了吗')
          if (this.diaTitle === '新增提现记录') {
            // 如果是新增则进行提交的接口调用
            this.$axios.post(UrlHelper.drawMoney.getAdd, this.drawEntity).then(val => {
            //  console.log(val)
              if (val.data.code === 200) { // 如果请求成功
                this.$message({
                  type: 'success',
                  message: val.data.msg,
                  duration: 1000
                })
                this.dialogFormVisible = false
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: val.data.msg,
                  duration: 1000
                })
              }
            })
          } else if (this.diaTitle === '修改提现记录') {
          //  console.log(this.drawEntity)
            // 如果是修改则进行编辑的接口调用
            this.$axios.post(UrlHelper.drawMoney.update, this.drawEntity).then(val => {
              if (val.data.code === 200) { // 如果请求成功
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
      // console.log('close触发了吗')
      this.dialogFormVisible = false
      this.drawEntity = {
        withdrawId: '', // 提现时间
        uid: '', // 兑换号码对应的id
        withdrawMoney: '', // 提现金额
        withdrawAlipayPhone: '', // 支付宝账号
        withdrawAlipayName: '', // 支付宝名称
        withdrawTime: '', // 提现时间
        withdrawWay: '', // 提现方式
        withdrawStatus: '' // 提现状态
        // id: '',
        // did: '', // 兑换号码对应的id
        // wid: '', // 提现id
        // wmoney: '', // 提现金额
        // dhnumbe: '', // 申报人
        // wtime: '', // 提现时间
        // wway: '', // 提现方式
        // wstatus: '' // 提现状态

      }
      this.resetForm('drawEntity')
    },
    // 复选框全选

    handleCheckedCitiesChange(value) {
      // const checkedCount = value.length
    //  console.log('是当前选中的吗', value)
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

</style>
