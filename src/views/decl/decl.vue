<template>
  <div style="padding:1rem">
    <!-- <div>
    手机号&nbsp;&nbsp;
    <el-input v-model="Search" size="small" class="input1" placeholder="请输入内容" />
    </div> -->
    <div class="maiD">
      <el-form
        ref="ruleForm"
        :model="goods"
        :rules="rules1"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div style="text-align: center;font-weight:bold;margin-bottom: 1rem;">
          申报
        </div>

        <!-- <el-form-item label="商品名称" prop="Uid">
          <el-select v-model="goods.Uid" placeholder="请选商品名称" @input="changeItem(goods.Uid)">
            <el-option
              v-for="item in AllGoods"
              :key="item.Id"
              :label="item.Title"
              :value="item.Id"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="商品名称" prop="commodityName">
          <el-input v-model="goods.commodityName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品编号" prop="commodityCode">
          <el-input v-model="goods.commodityCode" placeholder="请输入商品编号" />
        </el-form-item>
        <el-form-item label="积分" prop="commodityIntegral">
          <el-input v-model="goods.commodityIntegral" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="申报号码" prop="declarePhone">
          <el-input v-model="goods.declarePhone" placeholder="请输入申报手机号" />
        </el-form-item>
        <el-form-item label="申报订单号" prop="declareOrderNumber">
          <el-input v-model="goods.declareOrderNumber" placeholder="请输入申报订单号" />
        </el-form-item>
        <!-- <el-form-item label="积分" prop="Score">
          <el-select v-model="goods.Score" placeholder="请选择积分">
            <el-option
              v-for="item in Scores"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="手机号" prop="Phone">
          <el-input v-model="goods.Phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="订单号" prop="Order">
          <el-input v-model="goods.Order" placeholder="订单号" />
        </el-form-item> -->
        <el-form-item>
          <el-button style="width:100%" type="primary" size="small" @click="confirm()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { UrlHelper } from '../../api/urlHelper'
// import Pagination from '../../components/Pagination'
import { decl } from '@/api/modeList.js'
import moment from 'moment'
export default {
  // 分页
  components: {
    // Pagination
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
      AllGoods: [],
      input: '',
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
      goods: { // 申报商品
        commodityName: '', // 商品名称
        commodityCode: '', // 商品编号
        commodityIntegral: '', // 积分
        declarePhone: '', // 申报号码
        declareOrderNumber: '' // 申报订单号

      },
      rules1: {
        dhnumbe: [
          { required: true, message: '兑换号码不能为空' },
          { validator: validatePass, trigger: 'blur' }
        ],
        sbnumbe: [
          { required: true, message: '申报号码不能为空' },
          { validator: validatePass, trigger: 'blur' }
        ],
        gid: [{ required: true, message: '积分名称不能为空' }],
        sid: [{ required: true, message: '套餐名称不能为空' }],
        sflag: [{ required: true, message: '提交状态不能为空' }]
      },
      Start: '', // 起始时间
      End: '', // 结束时间
      Search: '', // 查询手机号
      Status: '', // 状态
      Uid: '', // 运营商唯一id
      options: [
        { value: '1', label: '申报中' },
        { value: '2', label: '申报完成' }
      ],
      isShow: false,
      Scores: [] // 当前对应下级的所有积分
    }
  },
  mounted() {
    // this.init()
    // this.getList()
    // this.getAllGoods()

    // this.getCoreLevel();
    // this.getPackageName();
  },
  methods: {
    // 初始化时间
    init() {
      // 初始化时间
      const date = new Date()
      this.Start = moment(date).format('YYYY-MM-DD 00:00:00')
      this.End = moment(date).format('YYYY-MM-DD 23:59:59')
      // 获取用户的权限
      const authorities = window.localStorage.getItem('authorities')
      if (authorities === 'admin') {
        // this.AllGoods()
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    // 获取所有的运营商信息
    getyylist() {
      // console.log('----')
      // 查询所有的订单信息
      this.$axios.post(UrlHelper.operatorManage.getList).then(val => {
        if (val.data.Code === 200) {
          // 如果请求成功
          this.yylist = val.data.Data
        } else {
          this.$message({
            type: 'error',
            message: val.data.Msg
          })
        }
      })
    },
    // 获取积分档
    getCoreLevel() {
      this.$axios.post(UrlHelper.declInfo.queryCoreLevel).then(val => {
        if (val.status === 200) {
          this.coreLevel = val.data // 积分档
        }
      })
    },
    // 获取套餐名称
    getPackageName() {
      this.$axios.post(UrlHelper.declInfo.queryPackageClass).then(val => {
        this.packages = val.data // 套餐档
      })
    },
    // 分页
    getList() {
      if (
        this.Start !== null &&
        this.Start !== '' &&
        this.Start !== undefined
      ) {
        this.Start = moment(this.Start).format('YYYY-MM-DD 00:00:00')
      }
      if (this.Start == null) {
        this.Start = ''
      }
      if (this.End == null) {
        this.End = ''
      }
      if (this.End !== null && this.End !== '' && this.End !== undefined) {
        this.End = moment(this.End).format('YYYY-MM-DD 23:59:59')
      }
      const formData = new FormData()
      formData.append('Search', this.Search)
      formData.append('Start', this.Start)
      formData.append('End', this.End)
      formData.append('Status', this.Status)
      formData.append('Page', this.listQuery.page)
      formData.append('Num', this.listQuery.limit)
      formData.append('Uid', this.Uid)

      this.$axios.post(UrlHelper.declInfo.getList, formData).then(val => {
        if (val.data.Code === 200) {
          this.tableData = val.data.Data.data
          this.total = val.data.Data.total
          const len = this.tableData.length
          if (len === 0 && this.listQuery.page > 1) {
            this.listQuery.page -= 1
            this.getList()
          }
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
    closeDialog() {
      // 关闭模态框事件
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
    resetForm(formName) {
      // 清除验证
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    confirm() { // 提交申报信息
      // Title Uid  Identify  Score
      decl(this.goods).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: res.data.Msg,
            duration: 1000
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data.Msg,
            duration: 1000
          })
        }
      })
    },
    getAllGoods() {
      this.$axios.post(UrlHelper.realGoods.query).then(val => {
        if (val.data.Code === 200) {
          this.AllGoods = val.data.Data
          // 遍历集合
          this.AllGoods.map(val => {
            if (val.Score !== '') {
              val.ScoreList = val.Score.split(',')
            } else {
              val.ScoreList = []
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: val.data.msg,
            duration: 1000
          })
        }
      })
    },
    changeItem(id) {
      this.AllGoods.map(val => {
        if (val.Id === id) {
          this.goods.Title = val.Title
          this.goods.Identify = val.Identify
          // 获取当前选项的数组
          this.Scores = val.ScoreList
          this.goods.Score = this.Scores[0]
        }
      })
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
.filter {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  > div {
    margin-right: 1rem;
  }
}
.input1 {
  width: 150px;
}
.maiD{
    width: 500px;
    margin: 0 auto;
    margin-top: 50px;
}
</style>

