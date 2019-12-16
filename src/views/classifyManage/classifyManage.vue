<template>
  <div style="padding:1rem">
    <div>
      <!-- 商品兑换通道-->
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
      <el-table-column prop="Name" label="名称" />
      <el-table-column prop="Brokerage" label="佣金" />
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img style="height: 50px;width: 80px" :onerror="defaultImg" :src="scope.row.photoUrl" @click="scal(scope.row.photoUrl)">
        </template>
      </el-table-column>
      <el-table-column prop="Score" label="积分" />
      <el-table-column prop="Timeline" label="时间" />
      <el-table-column prop="Url" label="链接" />
      <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="edit(scope.row)" />
          <!-- <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="del(scope.row)" /> -->
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
    <div>
      <el-dialog :close-on-click-modal="false" width="40%" :title="diaTitle" :visible.sync="dialogFormVisible" @close="close()">
        <el-form ref="goodsEntity" :rules="rules" :model="goodsEntity">
          <el-form-item label="商品名称" prop="Name" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.Name" style auto-complete="off" />
          </el-form-item>
          <el-form-item label="兑换链接" prop="Url" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.Url" style auto-complete="off" />
          </el-form-item>
          <el-form-item label="短信内容" prop="Content" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.Content" style auto-complete="off" />
          </el-form-item>
          <el-form-item label="积分" prop="Score" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.Score" style auto-complete="off" />
          </el-form-item>
          <el-form-item label="佣金" prop="Brokerage" :label-width="formLabelWidth">
            <el-input v-model="goodsEntity.Brokerage" style auto-complete="off" />
          </el-form-item>
          <el-form-item v-if="diaTitle!=='修改兑换通道'" label="商品类型" prop="Fid" :label-width="formLabelWidth">
            <el-select v-model="goodsEntity.Fid" style="width: 100%" placeholder="请选择">
              <el-option
                v-for="item in goodsTypes"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="二维码" prop="iid" :label-width="formLabelWidth">
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
        Timeline: ''
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
      ad_url_list: [],
      limitCount: 1,
      hideUpload: false,
      wangVisible: false,
      goodsTypes: [] // 商品类型
    }
  },
  mounted() {
    // 以上为测试信息
    this.getList()
    this.getGoodsType()
  },
  methods: {
    // 获取商品类型
    getGoodsType() {
      this.$axios.post(UrlHelper.integralList.getList).then(val => {
        if (val.data.Code === 200) {
          this.goodsTypes = val.data.Data
        }
      })
    },
    getList() {
      // console.log('----')
      this.$axios.post(UrlHelper.exchangeWay.getList).then(val => {
        if (val.data.Code === 200) {
          this.tableData3 = val.data.Data
          for (let i = 0; i < this.tableData3.length; i++) {
            this.tableData3[i].photoUrl = UrlHelper.picUrl + this.tableData3[i].Photo
            // this.total = val.data.total
            // 解决删除bug
            // const len = this.tableData3.length
            // if (len === 0 && this.listQuery.page > 1) {
            //   this.listQuery.page -= 1
            //   this.getList()
            // }
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
      this.diaTitle = '新增兑换通道'
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
      this.diaTitle = '修改兑换通道'
      //  console.log(data)
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
      const obj = {}
      obj.name = data.Name + '.jpg'// 图片名称
      obj.url = data.photoUrl
      this.ad_url_list.push(obj)
      this.dialogFormVisible = true
      this.hideUpload = true
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
      this.$refs.upload.clearFiles()
      this.hideUpload = false
      this.goodsEntity = {
        Id: '',
        Name: '',
        Url: '',
        Content: '',
        Score: '',
        Brokerage: '',
        Photo: '',
        Timeline: ''

      }
      this.resetForm('goodsEntity')
    },
    scal(imgUrl) {
      this.imgVisible = true
      this.thisGoodsImg = imgUrl
    },
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleImgChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    upLoadFile(a) {
      // 追加文件
      this.formData.append('Photo', a.file)
    //   const size_M = a.file.size / (1024 * 1024)
    //   if (size_M > 9) {
    //     this.$message({
    //       type: 'error',
    //       message: '上传图片过大',
    //       duration: 2000
    //     })
    //     this.ad_url_list = []
    //     this.hideUpload = false
    //     return
    //   }
    //   const formData = new FormData()
    //   formData.append('file', a.file)
    //   formData.append('uuid', a.file.uid)
    //   this.imgData = { uuid: a.file.uid }
    //   const config = {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   }
    //   this.$axios.post(UrlHelper.uploadFile.uoload, formData, config).then(val => {
    //     if (val.status === 200) {
    //       this.imgInfo.iid = val.data // 后台返回的id
    //       this.goodsEntity.iid = val.data // 进行赋值操作
    //       this.imgInfo.uuid = a.file.uid // 当前上传图片的唯一id
    //       this.$message({
    //         type: 'success',
    //         message: '上传成功',
    //         duration: 1000
    //       })
    //       // 重新进行验证规则
    //       this.$refs['goodsEntity'].validate((valid) => {
    //         if (valid) {
    //         //  console.log('验证成功')
    //         } else {
    //         //  console.log('校验不通过')
    //         }
    //       })
    //     }
    //   })
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
          if (this.diaTitle === '新增兑换通道') {
            this.formData.append('Url', this.goodsEntity.Url)
            this.formData.append('Content', this.goodsEntity.Content)
            this.formData.append('Score', this.goodsEntity.Score)
            this.formData.append('Brokerage', this.goodsEntity.Brokerage)
            this.formData.append('Name', this.goodsEntity.Name)
            this.formData.append('Fid', this.goodsEntity.Fid)
            this.$axios.post(UrlHelper.exchangeWay.add, this.formData).then(val => {
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
          } else if (this.diaTitle === '修改兑换通道') {
            // this.goodsEntity.iid = this.imgInfo.iid
            this.formData.append('Url', this.goodsEntity.Url)
            this.formData.append('Content', this.goodsEntity.Content)
            this.formData.append('Score', this.goodsEntity.Score)
            this.formData.append('Brokerage', this.goodsEntity.Brokerage)
            this.formData.append('Name', this.goodsEntity.Name)
            this.formData.append('Sid', this.goodsEntity.Id)
            // this.formData.append('Fid', this.goodsEntity.Fid)
            // 修改商品信息
            this.$axios.post(UrlHelper.exchangeWay.update, this.formData).then(val => {
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
    }
  }
}
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>
