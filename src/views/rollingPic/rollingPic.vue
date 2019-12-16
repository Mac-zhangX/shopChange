
<template>
  <!-- 轮播图管理 -->
  <div style="padding:1rem">
    <div>
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button>
      <!-- <el-button v-if="checkedAll" size="mini" class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button> -->
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
      <el-table-column label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="轮播图">
        <template slot-scope="scope">
          <img style="height: 50px;width: 80px" :onerror="defaultImg" :src="scope.row.iimg" @click="scal(scope.row.iimg)">
        </template>
      </el-table-column>
      <el-table-column prop="xstandUpAndDown" label="状态" />
      <el-table-column align="center" label="上架/下架" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.isTrue" class="item" effect="dark" content="已上架" placement="top">
            <el-button type="success" size="mini" icon="el-icon-check" circle @click="start(scope.row)" />
          </el-tooltip>
          <el-tooltip v-if="!scope.row.isTrue" class="item" effect="dark" content="已下架" placement="top">
            <el-button type="danger" size="mini" icon="el-icon-error" circle @click="start(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <!-- 无需修改 -->
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
        <el-form ref="silderEntity" :model="silderEntity">
          <el-form-item label="轮播图" prop="iid" :label-width="formLabelWidth">
            <el-upload
              ref="upload"
              action="http://192.168.0.102/commity/getadd"
              :class="{hide:hideUpload}"
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
            <!-- <el-input v-model="goodsEntity.goodsImg" auto-complete="off"></el-input> -->
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 弹出图片 -->
    <div>
      <el-dialog
        center
        title="详细图片"
        :visible.sync="imgVisible"
        width="40%"
      >
        <div style="text-align:center">
          <img style="width: 500px" :src="thisGoodsImg">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="imgVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 输出这个富文本编辑器 -->
    <!-- 弹出图片 -->
    <div>
      <el-dialog
        center
        title="编辑器"
        :visible.sync="wangVisible"
        width="40%"
      >
        <div style="text-align:center">
          <div id="wangedit" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="imgVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>
<script>
import Pagination from '@/components/Pagination/index'
import { UrlHelper } from '@/api/urlHelper'
import WangEditor from 'wangeditor'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      defaultImg: 'this.src="' + require('../../assets/image/null.png') + '"',
      tableData3: [],
      iid: '', // 图片id
      iids: [], // 图片的id集合
      diaTitle: '', // 是新增还是修改
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
      silderEntity: {
        id: '',
        iid: '',
        standUpAndDown: '' // 状态
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
      hideUpload: false,
      wangVisible: false
    }
  },
  mounted() {
    // 以上为测试信息
    this.getList()
    // this.goodsEntity.goodsType = this.goodsTypes[0].value
    this.coupons = this.coupons1
  },
  methods: {

    getList() {
      // console.log('----')
      this.$axios.post(UrlHelper.silder.getList,
        {
          page: this.listQuery.limit,
          begin: this.listQuery.page
        }).then(val => {
        if (val.status === 200) {
          console.log(val)
          this.tableData3 = val.data.rows
          for (let i = 0; i < this.tableData3.length; i++) {
            this.tableData3[i].iimg = UrlHelper.picUrl + this.tableData3[i].iimg
            if (this.tableData3[i].standUpAndDown === 2) {
              this.tableData3[i].isTrue = false
            } else if (this.tableData3[i].standUpAndDown === 1) {
              this.tableData3[i].isTrue = true
            }
          }
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
      this.diaTitle = '新增轮播图'
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
      //  console.log(data)
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
      this.$confirm('此操作将永久删除该轮播图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除的方法
          this.$axios.post(UrlHelper.silder.delslideshow, {
            id: data.id
          }).then(val => {
            console.log(val)
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
      // 清空图片
      this.$refs.upload.clearFiles()

      this.hideUpload = false
      this.silderEntity = {
        id: '',
        iid: '',
        standUpAndDown: '' // 状态

      }
      // this.$refs['goodsEntity'].resetFields()
      this.resetForm('goodsEntity')
    },
    scal(imgUrl) {
      // 放大图片
    //  console.log()
      this.imgVisible = true
      this.thisGoodsImg = imgUrl
    },
    // 移除图片进行删除
    handleRemove(file, fileList) {
      if (this.diaTitle === '新增商品') {
        this.$axios.post(UrlHelper.uploadFile.delFile, { iid: this.imgInfo.iid }).then(val => {
          if (val.data.code === 200) {
            this.$message({
              type: 'success',
              message: val.data.msg,
              duration: 1000
            })
            this.goodsEntity.iid = null
          } else {
            this.$message({
              type: 'error',
              message: val.data.msg,
              duration: 1000
            })
          }
        })
      } else if (this.diaTitle === '修改商品') {
        this.goodsEntity.iid = null
      }
      this.hideUpload = fileList.length >= this.limitCount
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
    upLoadFile(a) {
      // console.log('上传开始了吗')
      // console.log(a.file)
      // 进行限制图片的大小
      const size_M = a.file.size / (1024 * 1024)
      if (size_M > 9) {
        this.$message({
          type: 'error',
          message: '上传图片过大',
          duration: 2000
        })
        this.ad_url_list = []
        this.hideUpload = false
        return
      }
      const formData = new FormData()
      formData.append('file', a.file)
      formData.append('uuid', a.file.uid)
      this.imgData = { uuid: a.file.uid }
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // console.log('uuid', a.file.uid)
      // 文件上传的
      this.$axios.post(UrlHelper.uploadFile.uoload, formData, config).then(val => {
        if (val.status === 200) {
        //  console.log('返回了图片id了吗')
          // console.log(val)
          this.silderEntity.iid = val.data // 进行赋值操作
          this.$message({
            type: 'success',
            message: '上传成功',
            duration: 1000
          })
        }
      })
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
    wang() {
      this.wangVisible = false
      this.editor = new WangEditor('#wangedit') // 这个地方传入div元素的id 需要加#号
      // 配置 onchange 事件
      this.editor.change = function() { // 这里是change 不是官方文档中的 onchange
      // 编辑区域内容变化时，实时打印出当前内容
        console.log(this.txt.html())
      }
      this.editor.create() // 生成编辑器
      this.editor.txt.html('<p>输入内容...</p>') // 注意：这个地方是txt  不是官方文档中的$txt
    },
    confirm() {
      // 点击确认之前进行验证
      if (this.diaTitle === '新增轮播图') {
        this.$axios.post(UrlHelper.silder.getadd, this.silderEntity).then(val => {
          //  console.log(val)
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
        //  console.log()
      }
    },
    resetForm(formName) { // 清除验证
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // 点击启用或者停用
    start(boo) {
      // 如果是true就修改成2
      if (boo.isTrue === true) {
        console.log('2')
        boo.standUpAndDown = 2
      } else if (boo.isTrue === false) {
        console.log('1')
        boo.standUpAndDown = 1
      }

      console.log(boo)
      this.$axios.post(UrlHelper.silder.update, {
        id: boo.id,
        standUpAndDown: boo.standUpAndDown
      }).then(val => {
        console.log(val.data)
        if (val.data.code === 200) {
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
    }
  }
}
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>
