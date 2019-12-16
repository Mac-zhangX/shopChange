<template>
  <!-- 佣金记录 -->
  <div style="padding:1rem">
    <div>
      <!-- <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button> -->
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
      <el-table-column label="订单编号" width="200">
        <template slot-scope="scope">{{ scope.row.orderName }}</template>
      </el-table-column>
      <el-table-column prop="declaratPhone" label="申报手机号" width="200" />
      <el-table-column prop="changePhone" label="兑换手机号" width="200" />
      <el-table-column prop="commissionAmount" label="佣金金额" width="200" />
      <el-table-column prop="createTime" label="返佣时间" width="200" />
      <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="edit(scope.row)" /> -->
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
      <el-dialog :close-on-click-modal="false" width="40%" :title="diaTitle" :visible.sync="dialogFormVisible" @close="close()">
        <el-form ref="goodsEntity" :model="goodsEntity">
          <el-form-item label="商品名称" prop="cname" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.cname" style auto-complete="off" />
          </el-form-item>

          <el-form-item label="商品类型" prop="goodsType" :label-width="formLabelWidth">
            <el-select v-model="goodsEntity.goodsType" style="width: 100%" placeholder="请选择" @input="change(goodsEntity.goodsType)">
              <el-option
                v-for="item in goodsTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商品" prop="goodsTypeCoupon" :label-width="formLabelWidth">
            <el-select v-model="goodsEntity.goodsTypeCoupon" style="width: 100%" placeholder="请选择">
              <el-option
                v-for="item in coupons"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="发货状态" prop="cflag" :label-width="formLabelWidth">
            <el-select v-model="goodsEntity.cflag" style="width: 100%" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
import moment from 'moment'
import { UrlHelper } from '@/api/urlHelper'
export default {
  components: {
    Pagination
  },
  data() {
    // eslint-disable-next-line
    // var validatePass = (rule, value, callback) => {
    //   if (value === undefined) {
    //     callback(new Error('商品名称不能为空'))
    //     return
    //   }
    //   console.log(typeof value)
    //   value = value.toString().trim()
    //   if (value === '') {
    //     callback(new Error('商品名称不能为空'))
    //   } else {
    //     console.log('当前的value', value)
    //     if (this.diaTitle === '修改商品') {
    //       callback()
    //     } else {
    //     }
    //   }
    // }
    // eslint-disable-next-line
    return {
      tableData3: [],
      iid: '', // 图片id
      iids: [], // 图片的id集合
      diaTitle: '', // 是新增还是修改
      commissionEntity: { // 佣金实体
        dhNumbe: '',
        dhNumber: '',
        id: '',
        createTime: ''
      },
      options: [
        // 商品的两种状态
        {
          label: '直冲',
          value: 1
        },
        {
          label: '发码',
          value: 2
        }
      ],
      goodsTypes: [// 商品的类型
        {
          label: '美团',
          value: 1
        },
        {
          label: '喜马拉雅',
          value: 2
        }
      ],
      coupons: [],
      coupons1: [ // 美团 优惠卷面额
        {
          label: '5元面值',
          value: 5
        },
        {
          label: '10元面值',
          value: 10
        },
        {
          label: '20元面值',
          value: 20
        }
      ],
      coupons2: [ // 测试数据 喜马拉雅
        {
          label: '会员1个月',
          value: 1
        },
        {
          label: '会员6个月',
          value: 6
        }
      ],
      goodsEntity: {
        cid: '', // 商品id
        cname: '', // 商品名称
        cflag: '', // 商品状态
        iid: '', // 商品图片id
        goodsType: '', // 商品类型
        goodsTypeCoupon: ''
      },
      imgVisible: false, // 打开放大
      thisGoodsImg: '', // 放大图片路径
      total: 0,
      imgData: {},
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      imgInfo: { uuid: '', iid: '' }, // 存放当前的图片信息
      multipleSelection: [],
      checkedAll: false,
      // 进行添加的变量
      dialogFormVisible: false,
      coreEntity: {
        level: '',
        core: ''
      },
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
    this.getList()
    // this.goodsEntity.goodsType = this.goodsTypes[0].value
    this.coupons = this.coupons1
  },
  methods: {
    getList() {
      // console.log('----')
      this.$axios.post(UrlHelper.getCommission.getAllTbCommissionRecord,
        {
          page: this.listQuery.limit,
          begin: this.listQuery.page
        }).then(val => {
        if (val.status === 200) {
          this.tableData3 = val.data.rows
          this.tableData3.map(value => {
            value.createTime = moment(value.createTime).format('YYYY-MM-DD HH:mm:ss')
          })
          this.total = val.data.total
          // 解决删除bug
          const len = this.tableData3.length
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
      // console.log(this.total)
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
      // console.log('全选触发了吗---', val)
      if (val.length > 0) {
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
      this.multipleSelection = val
    },
    addFun() {
      // 打开添加的模态框
      this.diaTitle = '新增商品'
      this.dialogFormVisible = true
      // this.$refs['goodsEntity'].resetFields()
      // this.resetForm('goodsEntity')
    },
    delAll() {
      // 删除所有
      // 给出提示
      this.$confirm('此操作将永久删除所有商品记录, 是否继续?', '提示', {
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
            message: '已取消删除',
            duration: 1000
          })
        })
    },
    edit(data) {
      this.diaTitle = '修改商品'
      // console.log(data)
      const typeNum = data.goodsType // 商品类型
      if (typeNum === 1) {
        this.coupons = this.coupons1
      } else if (typeNum === 2) {
        this.coupons = this.coupons2
      }
      this.goodsEntity = {
        cid: data.cid,
        cflag: data.cflag,
        cname: data.cname,
        flag: data.flag,
        iid: data.iid,
        goodsType: data.goodsType,
        goodsTypeCoupon: data.goodsTypeCoupon // 商品备注

      }

      this.imgInfo.iid = data.iid
      this.ad_url_list = []
      const obj = {}
      obj.name = data.cname + '.jpg'// 图片名称
      obj.url = data.iimg
      this.ad_url_list.push(obj)
      this.dialogFormVisible = true
      this.hideUpload = true
    },
    del(data) {
      // 删除当前积分档
      // 给出提示
      this.$confirm('此操作将永久删除该佣金记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除的方法
          this.$axios.post(UrlHelper.getCommission.delAllTbCommissionRecord, {
            id: data.id
          }).then(val => {
          //  console.log(val)
            if (val.data.code === 200) { // 删除成功
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

    close() {
      // 关闭对话框
      // console.log('close触发了吗')
      this.dialogFormVisible = false
      // console.log('当前文件列表')
      // console.log(this.ad_url_list)
      // console.log(this.hideUpload)
      this.hideUpload = false
      this.goodsEntity = {
        cname: '', // 商品名称
        cflag: '', // 商品状态
        iid: '', // 商品图片id
        goodsType: '', // 商品类类型
        goodsTypeCoupon: ''

      }
      // this.$refs['goodsEntity'].resetFields()
      this.resetForm('goodsEntity')
    },
    scal(imgUrl) {
      // 放大图片
      // console.log()
      this.imgVisible = true
      this.thisGoodsImg = imgUrl
    },
    handlePictureCardPreview(file) {
      // 预览的方法
      // console.log('handlePictureCardPreview调用了吗')
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImgChange(file, fileList) {
      // 当改变了
      // console.log('this.ad_url_list', this.ad_url_list)
      this.hideUpload = fileList.length >= this.limitCount
    },
    change(num) {
      // 如果是1则是美团
      if (num === 1) {
        this.coupons = this.coupons1
        this.goodsEntity.goodsTypeCoupon = this.coupons1[0].value
      } else if (num === 2) {
        this.coupons = this.coupons2
        this.goodsEntity.goodsTypeCoupon = this.coupons2[0].value
      }
    },
    confirm() {
      // 点击确认之前进行验证

      this.$refs['goodsEntity'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          // 点击确认
          if (this.diaTitle === '新增商品') {
            this.goodsEntity.iid = this.imgInfo.iid // 将图片的id传递给后台
            this.$axios.post(UrlHelper.goodsInfo.addGoodsInfo, this.goodsEntity).then(val => {
              // console.log(val)
              if (val.data.code === 200) {
                // console.log('请求成功', val)
                this.$message({
                  type: 'success',
                  message: val.data.msg,
                  duration: 1000
                })
                this.dialogFormVisible = false
                this.getList()// 刷新页面
              } else {
                this.$message({
                  type: 'error',
                  message: val.data.msg,
                  duration: 1000
                })
              }
            })
          } else if (this.diaTitle === '修改商品') {
            this.goodsEntity.iid = this.imgInfo.iid
            // 修改商品信息
            this.$axios.post(UrlHelper.goodsInfo.editGoodsInfo, this.goodsEntity).then(val => {
              if (val.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: val.data.msg,
                  duration: 1000
                })
                this.dialogFormVisible = false
                this.getList()// 刷新页面
              } else {
                this.$message({
                  type: 'error',
                  message: val.data.msg,
                  duration: 1000
                })
              }
            })
            // console.log()
          }
        } else {
          return false
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
.hide .el-upload--picture-card {
  display: none;
}
</style>
