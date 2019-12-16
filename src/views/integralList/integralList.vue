<template>
  <!-- 商品列表 -->
  <div style="padding:1rem">
    <div>
      <!-- 添加-->
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button>
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
      <el-table-column type="selection" />
      <el-table-column label="商品Id">
        <template slot-scope="scope">{{ scope.row.Id }}</template>
      </el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img
            style="height: 50px;width: 80px"
            :onerror="defaultImg"
            :src="scope.row.photoUrl"
            @click="scal(scope.row.photoUrl)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="Title" label="商品标题" />
      <el-table-column prop="Text" label="提示一" />
      <el-table-column prop="Intro" label="提示二" />
      <el-table-column prop="Area" label="区域" />
      <!-- <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="del(scope.row)" />
        </template>
      </el-table-column> -->
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
          <el-form-item label="商品标题" prop="Title" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.Title" style auto-complete="off" />
          </el-form-item>

          <el-form-item label="商品类型" prop="goodsType" :label-width="formLabelWidth">
            <el-select v-model="goodsEntity.goodsType" style="width: 100%" placeholder="请选择">
              <el-option
                v-for="item in goodsTypes"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="提示一" prop="Text" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.Text" type="textarea" :rows="2" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="提示二" prop="Intro" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.Intro" type="textarea" :rows="2" placeholder="请输入内容" />
          </el-form-item>

          <el-form-item label="区域" prop="area" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.area" type="textarea" :rows="2" placeholder="请输入内容" />
          </el-form-item>
          <el-form-item label="图片" prop="iid" :label-width="formLabelWidth">
            <el-upload
              ref="upload"
              :class="{hide:hideUpload}"
              action="http://192.168.0.102/commity/getadd"
              :http-request="upLoadFile"
              list-type="picture-card"
              :file-list="ad_url_list"
              :limit="1"
              :data="imgData"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleImgChange"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
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
/* eslint-disable */
import Pagination from '@/components/Pagination/index'
// import moment from 'moment'
import { UrlHelper } from '@/api/urlHelper'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      formData: {}, // 文件对象
      defaultImg: 'this.src="' + require('../../assets/image/null.png') + '"',
      goodsTypes: [], //商品分类
      tableData3: [],
      iid: '', // 图片id
      iids: [], // 图片的id集合
      diaTitle: '', // 是新增还是修改
      commissionEntity: { // 佣金实体
        dhNumbe: '',
        dhNumber: '',
        id: '',
        createTime: '',
        area: ''// 
      },
      coupons: [],
      goodsEntity: {
        cid: '', // 商品id
        Title: '', // 商品标题
        cname: '', // 商品名称
        cflag: '', // 商品状态
        iid: '', // 商品图片id
        goodsType: '', // 商品类型
        goodsTypeCoupon: '',
        area: '' ,// 商品区域
        Text: '', //提示语句1
        Intro: ''//提示语句2
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
    this.getGoodsType()
  },
  methods: {
    // 获取商品类型
      getGoodsType() {
        this.$axios.post(UrlHelper.integralChannel.getList).then(val => {
        if(val.data.Code === 200) {
          this.goodsTypes = val.data.Data
        }
        })
      },
    getList() {
      this.$axios.post(UrlHelper.integralList.getList).then(val => {
        if (val.data.Code === 200) {
          this.tableData3 = val.data.Data
          this.tableData3.map(value => {
            value.photoUrl = UrlHelper.picUrl + value.Photo
          })
          // this.total = val.data.total
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
      this.diaTitle = '新增商品'
      this.dialogFormVisible = true
      this.formData = new FormData()
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
      this.dialogFormVisible = false
      this.hideUpload = false
      this.goodsEntity = {
        cname: '', // 商品名称
        Title: '', // 商品标题
        cflag: '', // 商品状态
        iid: '', // 商品图片id
        goodsType: '', // 商品类类型
        goodsTypeCoupon: '',
        area: '' ,// 商品区域
        Text: '', //提示语句1
        Intro: ''//提示语句2
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
    handleRemove() {},
    // change(num) {
    //   // 如果是1则是美团
    //   if (num === 1) {
    //     this.coupons = this.coupons1
    //     this.goodsEntity.goodsTypeCoupon = this.coupons1[0].value
    //   } else if (num === 2) {
    //     this.coupons = this.coupons2
    //     this.goodsEntity.goodsTypeCoupon = this.coupons2[0].value
    //   }
    // },
    confirm() {
      // 点击确认之前进行验证
      this.$refs['goodsEntity'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          // 点击确认
          if (this.diaTitle === '新增商品') {
            this.formData.append('Cid',this.goodsEntity.goodsType)
            this.formData.append('Title',this.goodsEntity.Title)
            this.formData.append('Area',this.goodsEntity.area)
             this.formData.append('Text',this.goodsEntity.Text)
               this.formData.append('Intro',this.goodsEntity.Intro)
                 console.log(  this.formData)
            this.$axios.post(UrlHelper.integralList.add,  this.formData).then(val => {
              // console.log(val)
              if (val.data.Code === 200) {
                // console.log('请求成功', val)
                this.$message({
                  type: 'success',
                  message: val.data.Msg,
                  duration: 1000
                })
                this.dialogFormVisible = false
                this.getList()// 刷新页面
              } else {
                this.$message({
                  type: 'error',
                  message: val.data.Msg,
                  duration: 1000
                })
              }
               this.formData = new FormData()
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
               this.formData = {}
            })
            // console.log()
          }
        } else {
          return false
        }
      })
    },
    upLoadFile(a){
            this.formData.append('Photo', a.file)
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
