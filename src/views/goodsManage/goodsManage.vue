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
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 1rem"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="ID" width="55">
        <template slot-scope="scope">{{ scope.row.cid }}</template>
      </el-table-column>
      <el-table-column prop="cname" label="商品名称" />
      <el-table-column label="商品图片" width="120">
        <template slot-scope="scope">
          <img style="height: 50px;width: 80px" :onerror="defaultImg" :src="scope.row.iimg" @click="scal(scope.row.iimg)">
        </template>
      </el-table-column>
      <el-table-column label="二维码" width="120">
        <template slot-scope="scope">
          <img style="height: 50px;width: 80px" :onerror="defaultImg" :src="scope.row.xiimg" @click="scal(scope.row.xiimg)">
        </template>
      </el-table-column>

      <el-table-column prop="goodsTypeCoupon" label="面额" />
      <el-table-column prop="creditsExchange" label="积分额度" />
      <el-table-column prop="xstatis" label="状态" />
      <el-table-column prop="convertibilityZone" label="可兑换区域" />
      <el-table-column prop="mobileMallLink" label="移动商城链接" />
      <el-table-column prop="smsExchangeMethod" label="短信兑换方式" />
      <el-table-column align="center" min-width="120" label="上架/下架" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.isTrue" class="item" effect="dark" content="已上架" placement="top">
            <el-button type="success" size="mini" icon="el-icon-check" circle @click="start(scope.row)" />
          </el-tooltip>
          <el-tooltip v-if="!scope.row.isTrue" class="item" effect="dark" content="已下架" placement="top">
            <el-button type="danger" size="mini" icon="el-icon-error" circle @click="start(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
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
      <el-dialog :close-on-click-modal="false" width="50%" :title="diaTitle" :visible.sync="dialogFormVisible" @close="close()">
        <el-form ref="goodsEntity" :model="goodsEntity">
          <el-form-item label="商品名称" prop="cname" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.cname" style auto-complete="off" />
          </el-form-item>

          <el-form-item label="面额" prop="goodsType" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.goodsTypeCoupon" style auto-complete="off" />
          </el-form-item>
          <el-form-item label="积分额度" prop="goodsTypeCoupon" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.creditsExchange" style auto-complete="off" />
          </el-form-item>

          <el-form-item label="商品图片" prop="iid" :label-width="formLabelWidth">
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

          <!-- 二维码 -->
          <el-form-item label="二维码" prop="iid" :label-width="formLabelWidth">
            <el-upload
              ref="upload"
              :class="{hide:hideUpload1}"
              action="http://192.168.0.102/commity/getadd"
              :http-request="upLoadErweima"
              list-type="picture-card"
              :file-list="ad_url_list2"
              :limit="1"
              :data="imgData"
              :on-preview="handlePictureCardPreview1"
              :on-remove="handleRemove1"
              :on-change="handleImgChange1"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <!-- 短信兑换方式 -->
          <el-form-item label="短信兑换方式" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.smsExchangeMethod" rows="3" type="textarea" />
          </el-form-item>

          <!-- 移动商城链接 -->
          <el-form-item label="移动商城链接" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.mobileMallLink" rows="3" type="textarea" />
          </el-form-item>
          <!-- 可兑换区域 -->
          <el-form-item label="可兑换区域" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.convertibilityZone" rows="3" type="textarea" />
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close()">取 消</el-button>
          <el-button type="primary" @click="confirm()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <el-dialog
        center
        title="商品详情"
        :visible.sync="wangeditorVisible"
        width="50%"
      >
        <div class="edit_container" style="height:400px">
          <quill-editor
            ref="myQuillEditor"
            v-model="content"
            style="height: 300px"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @change="onEditorChange($event)"
          />
        </div>
        <button @click="saveHtml">保存</button>
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
          <img style="width: 400px" :src="thisGoodsImg">
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

export default {
  components: {
    Pagination
  },
  data() {
    return {
      isTrue: true,
      content: `<p>hello world</p>`,
      editorOption: {},
      imguRL: '../assets/image/someone.jpg',
      defaultImg: 'this.src="' + require('../../assets/image/null.png') + '"',
      thisGoodsImg: '',
      isup: true, // 上架
      imgVisible: false, // 打开放大
      wangeditorVisible: false, // 编辑器
      tableData3: [],

      // 商品实体
      goodsEntity: {
        cid: '', // 商品id
        cname: '', // 商品名称
        cflag: '', // 商品状态
        iid: '', // 商品图片id

        smsImgid: '', // 二维码id
        mobileMallLink: '', // 商城链接
        smsExchangeMethod: '', // 短信兑换方式
        convertibilityZone: '', // 可兑换区域

        goodsType: '', // 商品类型
        goodsTypeCoupon: '', // 面额
        statis: '', // 上架还是下架
        creditsExchange: '', // 积分面额
        richText: ''
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
      ad_url_list: [], // 商品logo
      ad_url_list2: [], // 二维码
      limitCount: 1,
      hideUpload: false,
      hideUpload1: false

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    wangedit(data) {
      console.log(data)
      this.wangeditorVisible = true
    },
    getList() {
      this.$axios.post(UrlHelper.goodsManage.getList, {
        page: this.listQuery.limit,
        begin: this.listQuery.page
      }).then(val => {
        console.log(val)
        if (val.status === 200) { // 如果请求成功
          this.tableData3 = val.data.rows
          for (let i = 0; i < this.tableData3.length; i++) {
            this.tableData3[i].iimg = UrlHelper.picUrl + this.tableData3[i].iimg
            this.tableData3[i].xiimg = UrlHelper.picUrl + this.tableData3[i].xiimg
            if (this.tableData3[i].statis === 2) {
              this.tableData3[i].isTrue = false
            } else if (this.tableData3[i].statis === 1) {
              this.tableData3[i].isTrue = true
            }
          }
          // 解决删除一页最后一条数据的bug
          // 如果是大于一页并且列表没有数据，就查询上一页
          const len = this.tableData3.length
          if (len === 0 && this.listQuery.page > 1) {
            this.listQuery.page -= 1
            this.getList()
          }
          this.total = val.data.total
        } else {
          this.$message({
            type: 'error',
            message: val.data.msg,
            duration: 1000
          })
        }
      })
    },
    // 移除图片进行删除
    handleRemove(file, fileList) {
      if (this.diaTitle === '添加商品') {
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
        // this.goodsEntity.iid = null
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

    // 二维码图片上传触发

    // 移除图片进行删除
    handleRemove1(file, fileList) {
      if (this.diaTitle === '添加商品') {
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
        // this.goodsEntity.iid = null
      }
      this.hideUpload1 = fileList.length >= this.limitCount
    },
    handlePictureCardPreview1(file) {
      // 预览的方法
      // console.log('handlePictureCardPreview调用了吗')
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImgChange1(file, fileList) {
      // 当改变了
      // console.log('this.ad_url_list', this.ad_url_list)
      this.hideUpload1 = fileList.length >= this.limitCount
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
      this.diaTitle = '添加商品'
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
    edit(data) { // 编辑进行回显
      this.diaTitle = '修改商品'
      console.log(data)
      // const num = data.phone
      this.goodsEntity = {
        cid: data.cid,
        cname: data.cname,
        convertibilityZone: data.convertibilityZone,
        creditsExchange: data.creditsExchange,
        goodsTypeCoupon: data.goodsTypeCoupon,
        iid: data.iid,
        iimg: data.iimg,
        mobileMallLink: data.mobileMallLink,
        smsExchangeMethod: data.smsExchangeMethod,
        smsImgid: data.smsImgid,
        statis: data.statis,
        xstatis: data.xstatis
      }
      // this.imgInfo.iid = data.iid
      this.ad_url_list = []
      this.ad_url_list2 = []
      const obj = {}
      obj.name = data.cname + '.jpg'// 图片名称
      obj.url = data.iimg
      this.ad_url_list.push(obj)

      const obj2 = {}
      obj2.name = data.smsImgid + '.jpg'// 图片名称
      obj2.url = data.xiimg
      this.ad_url_list2.push(obj2)
      this.hideUpload = true
      this.hideUpload1 = true
      // console.log(this.userEntity)
      this.dialogFormVisible = true
    },
    del(data) {
      // 删除当前积分档
      // 给出提示
      this.$confirm('此操作将永久删除该商品记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除的方法
          this.$axios.post(UrlHelper.goodsManage.delIncar, {
            cid: data.cid
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
    // 点击确定调用的方法
    confirm() {
      if (this.diaTitle === '添加商品') {
        // 如果是新增则进行提交的接口调用
        console.log(this.goodsEntity)
        this.$axios.post(UrlHelper.goodsManage.getadd, this.goodsEntity).then(val => {
          if (val.data.code === 200) { // 如果请求成功
            this.$message({
              type: 'success',
              message: val.data.msg,
              duration: 1000
            })
            this.dialogFormVisible = false
            this.goodsEntity = {}
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: val.data.msg,
              duration: 1000
            })
          }
        })
      } else if (this.diaTitle === '修改商品') {
        // 如果是修改则进行编辑的接口调用
        this.$axios.post(UrlHelper.goodsManage.update, this.goodsEntity).then(val => {
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
    },

    close() {
      // 关闭对话框
    //  console.log('close触发了吗')
      this.dialogFormVisible = false
      // 清空上传文件的窗口
      this.ad_url_list = []// 商品logo
      this.ad_url_list2 = [] // 二维码
      this.goodsEntity = {
        cid: '', // 商品id
        cname: '', // 商品名称
        cflag: '', // 商品状态
        iid: '', // 商品图片id

        smsImgid: '', // 二维码id
        mobileMallLink: '', // 商城链接
        smsExchangeMethod: '', // 短信兑换方式
        convertibilityZone: '', // 可兑换区域

        goodsType: '', // 商品类型
        goodsTypeCoupon: '', // 面额
        statis: '', // 上架还是下架
        creditsExchange: '', // 积分面额
        richText: ''
      }
      this.hideUpload = false
      this.hideUpload1 = false
      this.resetForm('userEntity')
      // this.$refs['userEntity'].resetFields()
    },

    resetForm(formName) { // 清除验证
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    // errorImg(img) {
    //   img.src = null
    // }
    onEditorBlur($event) {
      console.log($event)
    },
    onEditorFocus($event) {
      console.log($event)
    },
    onEditorChange($event) {
      console.log($event)
    },
    saveHtml() {
      console.log(this.content)
    },
    // 图片放大
    scal(imgUrl) {
      // 放大图片
    //  console.log()
      this.imgVisible = true
      this.thisGoodsImg = imgUrl
    },
    upLoadFile(a) {
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

      this.$axios.post(UrlHelper.uploadFile.uoload, formData).then(val => {
        if (val.status === 200) {
          console.log('上传之后的返回值', val)
          //   this.imgInfo.iid = val.data // 后台返回的id
          this.goodsEntity.iid = val.data // 进行赋值操作
          //   this.imgInfo.uuid = a.file.uid // 当前上传图片的唯一id
          this.$message({
            type: 'success',
            message: '上传成功',
            duration: 1000
          })
        }
      })
    },
    start(boo) {
      // 如果是true就修改成2
      if (boo.isTrue === true) {
        console.log('2')
        boo.statis = 2
      } else if (boo.isTrue === false) {
        console.log('1')
        boo.statis = 1
      }
      console.log(boo)
      this.$axios.post(UrlHelper.goodsManage.updateStandupanddown, boo).then(val => {
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
    },
    // 短信二维码上传
    upLoadErweima(a) {
      const size_M = a.file.size / (1024 * 1024)
      if (size_M > 9) {
        this.$message({
          type: 'error',
          message: '上传图片过大',
          duration: 2000
        })
        this.ad_url_list2 = []
        this.hideUpload1 = false
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

      this.$axios.post(UrlHelper.uploadFile.uoload, formData, config).then(val => {
        if (val.status === 200) {
        //   this.imgInfo.iid = val.data // 后台返回的id
          this.goodsEntity.smsImgid = val.data // 进行赋值操作
          //   this.imgInfo.uuid = a.file.uid // 当前上传图片的唯一id
          this.$message({
            type: 'success',
            message: '上传成功',
            duration: 1000
          })
        }
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
