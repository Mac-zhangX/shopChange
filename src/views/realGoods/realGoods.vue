<template>
  <div style="padding:1rem">
    <div>
      <!-- 实物商品管理-->
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
      <el-table-column prop="Title" label="名称" />
      <el-table-column prop="Identify" label="商品编号" />
      <el-table-column prop="Score" label="积分" />
      <!-- <el-table-column prop="Brokerage" label="佣金" /> -->
      <!-- <el-table-column label="二维码">
        <template slot-scope="scope">
          <img style="height: 50px;width: 80px" :onerror="defaultImg" :src="scope.row.photoUrl" @click="scal(scope.row.photoUrl)">
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img style="height: 50px;width: 80px" :onerror="defaultImg" :src="scope.row.photoUrl0" @click="scal(scope.row.photoUrl0)">
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="Score" label="积分" />
      <el-table-column prop="Content" label="内容" />

      <el-table-column prop="Timeline" label="时间" />
      <el-table-column prop="Url" label="链接" /> -->
      <!-- <el-table-column prop="StatusName" label="状态" /> -->
      <!-- <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip content="编辑" effect="dark" placement="top">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="edit(scope.row)" />
          </el-tooltip>
          <el-tooltip v-if="scope.row.Status===0" class="item" effect="dark" content="单击启用" placement="top" @click="open()">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-check"
              circle
              @click="open(scope.row)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.Status===1" class="item" effect="dark" content="单击禁用" placement="top" @click="open()">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-close"
              circle
              @click="open(scope.row)"
            />
          </el-tooltip>
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

    <el-dialog
      :close-on-click-modal="false"
      width="45%"
      :title="diaTitle"
      :visible.sync="dialogFormVisible"
      @close="close()"
    >
      <el-form ref="goodsEntity" :rules="rules" :model="goodsEntity">
        <el-form-item label="商品名称" prop="Name" :label-width="formLabelWidth">
          <el-input v-model="goodsEntity.Name" placeholder="请输入商品名称" style auto-complete="off" />
        </el-form-item>
        <el-form-item label="商品编号" prop="Identify" :label-width="formLabelWidth">
          <el-input v-model="goodsEntity.Identify" placeholder="请输入商品编号" style auto-complete="off" />
        </el-form-item>
        <el-form-item label="积分" prop="Score" :label-width="formLabelWidth">
          <el-input v-model="goodsEntity.Score" placeholder="请输入可选积分" style auto-complete="off" />
        </el-form-item>
        <!-- <el-form-item label="兑换链接" prop="Url" :label-width="formLabelWidth">
          <el-input v-model="goodsEntity.Url" style auto-complete="off" />
        </el-form-item> -->
        <!-- <el-form-item label="短信内容" prop="Content" :label-width="formLabelWidth">
          <el-input v-model="goodsEntity.Content" style auto-complete="off" />
        </el-form-item> -->
        <!-- <el-form-item label="积分" prop="Score" :label-width="formLabelWidth">
          <el-input v-model="goodsEntity.Score" style auto-complete="off" />
        </el-form-item>
        <el-form-item label="佣金" prop="Brokerage" :label-width="formLabelWidth">
          <el-input v-model="goodsEntity.Brokerage" style auto-complete="off" />
        </el-form-item> -->
        <!-- <el-form-item v-if="diaTitle!=='修改兑换通道'" label="商品类型" prop="Fid" :label-width="formLabelWidth">
            <el-select v-model="goodsEntity.Fid" style="width: 100%" placeholder="请选择">
              <el-option
                v-for="item in goodsTypes"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id"
              />
            </el-select>
          </el-form-item> -->

        <!-- <el-form-item label="商品图片" prop="iid" :label-width="formLabelWidth">
          <el-upload
            ref="upload0"

            :class="{hide:hideUpload0}"
            action="http://192.168.0.102/commity/getadd"
            :http-request="upLoadFile0"
            list-type="picture-card"
            :file-list="ad_url_list0"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove0"
            :on-change="handleImgChange0"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item> -->

        <!-- <el-form-item label="二维码" prop="iid" :label-width="formLabelWidth">
          <el-upload
            ref="upload"
            :class="{hide:hideUpload}"
            action="http://192.168.0.102/commity/getadd"
            :http-request="upLoadFile"
            list-type="picture-card"
            :file-list="ad_url_list"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="handleImgChange"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog
            :append-to-body="true"
            :visible.sync="dialogVisible"
          >
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 弹出图片 -->
    <div>
      <el-dialog
        center
        title="详细图片"
        :visible.sync="imgVisible"
        width="40%"
      >
        <div style="text-align:center">
          <img style="width: 300px" :src="thisGoodsImg">
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
    var validatePass2 = (rule, value, callback) => {
      if (value === undefined) {
        callback(new Error('商品名称不能为空'))
        return
      }
      // console.log(typeof value)
      value = value.toString().trim()
      // console.log('当前的value', value)
      if (value === '') {
        callback(new Error('商品名称不能为空'))
      } else {
      //  console.log('当前的value', value)
        if (this.diaTitle === '修改商品') {
          // 不进行验证
          callback()
        } else {
          // 如果不为空则进行失焦验证
          this.$axios.post(UrlHelper.goodsInfo.checkName, {
            cname: value
          }).then(val => {
            if (val.data === 0) {
              //   console.log('val', val)
              callback()
            } else {
              callback(new Error('商品名称已存在'))
            }
          })
        }
      }
    }
    var validatePass3 = (rule, value, callback) => {
      // console.log('商品的状态', value)
      if (value === undefined) {
        callback(new Error('商品状态不能为空'))
        return
      }
      value = value.toString().trim()
      if (value === '') {
        callback(new Error('商品状态不能为空'))
      } else {
        callback()
      }
    }
    // var validatePass4 = (rule, value, callback) => {
    //   callback()
    // }
    return {
      formData: {}, // 文件对象
      tableData3: [],
      iid: '', // 图片id
      iids: [], // 图片的id集合
      diaTitle: '', // 是新增还是修改
      defaultImg: 'this.src="' + require('../../assets/image/null.png') + '"',
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
        Id: '',
        Name: '',
        Url: '',
        Content: '',
        Score: '',
        Brokerage: '',
        Photo: '',
        Timeline: '',
        Identify: '' // 商品编号

      },
      rules: { // 定义一个验证规则
        cname: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        goodsType: [
          { required: true, message: '商品类型不能为空', trigger: 'blur' }

        ],
        //
        goodsTypeCoupon: [
          { required: true, message: '商品不能为空', trigger: 'blur' }

        ],

        // 商品名称
        cflag: [
          { required: true, message: '商品状态不能为空', trigger: 'blur' },
          { validator: validatePass3, trigger: 'change' }]// 商品状态
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
      ad_url_list0: [], // 商品图片存放列表
      ad_url_list: [], // 二维码图片存放列表
      limitCount: 1,
      hideUpload0: false,
      hideUpload: false,
      wangVisible: false,
      goodsTypes: [] // 商品类型
    }
  },
  mounted() {
    // 以上为测试信息
    this.getList()
    // this.getGoodsType() // 商品类型
  },
  methods: {
    // 获取商品类型
    getGoodsType() {
      this.$axios.post(UrlHelper.integralChannel.getList).then(val => {
        if (val.data.Code === 200) {
          this.goodsTypes = val.data.Data
        }
      })
    },
    getList() {
      const formData = new FormData()
      formData.append('Page', this.listQuery.page)
      formData.append('Num', this.listQuery.limit)
      this.$axios.post(UrlHelper.realGoods.query, formData).then(val => {
        if (val.data.Code === 200) {
          this.tableData3 = val.data.Data
          for (let i = 0; i < this.tableData3.length; i++) {
            this.tableData3[i].photoUrl = UrlHelper.picUrl + this.tableData3[i].Photo
            this.tableData3[i].photoUrl0 = UrlHelper.picUrl + this.tableData3[i].Image
            if (this.tableData3[i].Status === 0) {
              this.tableData3[i].StatusName = '禁用'
            } else if (this.tableData3[i].Status === 1) {
              this.tableData3[i].StatusName = '启用'
            }
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
      this.diaTitle = '新增实物商品'
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
      this.formData = new FormData()
      this.diaTitle = '修改实物商品'
      // console.log(data)
      this.goodsEntity = {
        Id: data.Id,
        Name: data.Name,
        Url: data.Url,
        Content: data.Content,
        Score: data.Score,
        Brokerage: data.Brokerage,
        Photo: data.Photo,
        Timeline: data.Timeline,
        Fid: data.Fid

      }
      this.ad_url_list = []
      const obj = { name: '', url: '' }
      obj.name = data.Name + '.jpg'// 图片名称
      obj.url = data.photoUrl
      this.ad_url_list.push(obj)
      const obj0 = { name: '', url: '' }
      obj0.name = data.Id + '.jpg'
      obj0.url = data.photoUrl0
      this.ad_url_list0.push(obj0)
      this.dialogFormVisible = true
      this.hideUpload = true
      this.hideUpload0 = true
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
          this.$axios.post(UrlHelper.goodsInfo.delGoodsInfo, {
            cid: data.cid
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
      // this.$refs.upload0.clearFiles()
      // this.$refs.upload.clearFiles()
      this.ad_url_list0 = []
      this.ad_url_list = []
      this.hideUpload = false
      this.hideUpload0 = false
      this.goodsEntity = {
        Id: '',
        Name: '',
        Url: '',
        Content: '',
        Score: '',
        Brokerage: '',
        Photo: '',
        Image: '',
        Timeline: '',
        Identify: ''
      }
      this.resetForm('goodsEntity')
    },
    scal(imgUrl) {
      this.imgVisible = true
      this.thisGoodsImg = imgUrl
    },
    handleRemove0(file, fileList) {
      this.hideUpload0 = fileList.length >= this.limitCount
    },
    handleImgChange0(file, fileList) {
      this.hideUpload0 = fileList.length >= this.limitCount
    },
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    handleImgChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    upLoadFile0(a) { // 添加商品图片
      this.formData.append('Image', a.file)
    },
    upLoadFile(a) { // 追加二维码
      this.formData.append('Photo', a.file)
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
      this.$refs['goodsEntity'].validate((valid) => {
        // console.log(valid)
        if (valid) {
          // 点击确认
          if (this.diaTitle === '新增实物商品') {
            // this.formData.append('Url', this.goodsEntity.Url)
            // this.formData.append('Content', this.goodsEntity.Content)
            this.formData.append('Score', this.goodsEntity.Score) // 可选积分
            // this.formData.append('Brokerage', this.goodsEntity.Brokerage)
            this.formData.append('Title', this.goodsEntity.Name) // 标题
            this.formData.append('Identify', this.goodsEntity.Identify) // 商品编号
            // this.formData.append('Fid', this.goodsEntity.Fid)
            this.$axios.post(UrlHelper.realGoods.insert, this.formData).then(val => {
              if (val.data.Code === 200) {
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
            })
          } else if (this.diaTitle === '修改实物商品') {
            // this.goodsEntity.iid = this.imgInfo.iid
            this.formData.append('Url', this.goodsEntity.Url)
            this.formData.append('Content', this.goodsEntity.Content)
            this.formData.append('Score', this.goodsEntity.Score)
            this.formData.append('Brokerage', this.goodsEntity.Brokerage)
            this.formData.append('Name', this.goodsEntity.Name)
            this.formData.append('Sid', this.goodsEntity.Id)
            // this.formData.append('Fid', this.goodsEntity.Fid)
            // 修改商品信息
            this.$axios.post(UrlHelper.realGoods.update, this.formData).then(val => {
              if (val.data.Code === 200) {
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
              this.formData = {}
            })
          //  console.log()
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
    },
    // 启用或者禁用
    open(data) {
      const formData = new FormData()
      if (data.Status === 0) {
        formData.append('Status', 1)
      } else if (data.Status === 1) {
        formData.append('Status', 0)
      }
      formData.append('Oid', data.Id)
      this.$axios.post(UrlHelper.realGoods.open, formData).then(val => {
        if (val.data.Code === 200) {
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
