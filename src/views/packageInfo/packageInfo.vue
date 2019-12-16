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
      <el-table-column label="套餐编号" width="100">
        <template slot-scope="scope">{{ scope.row.sid }}</template>
      </el-table-column>
      <el-table-column prop="gname" label="积分名称" width="200" />
      <el-table-column prop="packageDetail" label="商品名称" width="250" />
      <el-table-column prop="sname" label="套餐名称" width="250" />
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
      <el-dialog width="45%" :close-on-click-modal="false" :title="diaTitle" :visible.sync="dialogFormVisible" @close="close()">
        <el-form ref="packageEntity" :rules="rules" :model="packageEntity">
          <el-form-item label="积分名称" prop="gid" :label-width="formLabelWidth">
            <el-select v-model="packageEntity.gid" style="width: 100%" placeholder="请选择">
              <el-option
                v-for="item in coreInfo"
                :key="item.value"
                :label="item.gname"
                :value="item.gid"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="goodsNames" label="商品名称" :label-width="formLabelWidth">
            <div class="colorText">（单个商品不超过5个）</div>
            <div style="height: 300px;overflow-y:auto ">
              <el-checkbox-group
                v-model="packageEntity.goodsNames"
                @change="handleCheckedCitiesChange"
              >
                <div class="checkTest">
                  <div v-for="good in goods" :key="good.id" class="cheDiv">
                    <div><el-checkbox :label="good.cname" @change="singleChange($event,good)">{{ good.cname }}</el-checkbox></div>
                    <div> <el-input-number v-if="good.isShow" v-model="good.rCount" style="width:5rem" size="mini" controls-position="right" :min="1" :max="5" @change="handleChange" /></div>
                  </div>
                </div>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item prop="sname" label="套餐名称" :label-width="formLabelWidth">
            <el-input v-model="packageEntity.sname" style auto-complete="off" />
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
import { UrlHelper } from '../../api/urlHelper'
export default {
  components: {
    Pagination
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
    //  console.log('当前的值为')
      if (value === undefined) {
        callback(new Error('积分档不能为空'))
        return
      }
      value = value.toString().trim()// 清除前后空格
      if (value === '') {
        callback(new Error('积分档不能为空'))
      } else {
        callback()
      }
    }

    var validatePass2 = (rule, value, callback) => {
      // console.log('当前的值为', value)
      // if (value === undefined) {
      //   callback(new Error('商品不能为空'))
      //   return
      // }
      // value = value.toString().trim()// 清除前后空格
      // if (value === '') {
      //   callback(new Error('商品不能为空'))
      // } else {
      //   console.log('验证结果')
      //   console.log(value)
      //   const arr = value.split(',')
      //   if (arr.length > 5) {
      //     callback(new Error('商品不能超过五种'))
      //     return
      //   }
      //   let sum = 0
      //   this.goods.map(val => {
      //     if (val.isShow) {
      //       sum += val.rCount
      //     }
      //   })
      //   console.log('sum', sum)
      //   if (sum > 5) {
      //     callback(new Error('商品总件数不超过五件'))
      //     return
      //   }
      //   console.log(this.goods)
      //   callback()
      // }
      callback()
    }
    var validatePass3 = (rule, value, callback) => {
    //  console.log('当前的值为')
      if (value === undefined) {
        callback(new Error('套餐不能为空'))
        return
      }
      value = value.toString().trim()// 清除前后空格
      if (value === '') {
        callback(new Error('套餐不能为空'))
      } else {
        callback()
      }
    }
    return {
      tableData3: [],
      coreInfo: [], // 获取所i有的积分信息
      packageEntity: {
        gid: '', // 积分id
        gname: '', // 积分名称
        goodsNames: [],
        sname: '' // 套餐名称
      },
      goods: [], // 所有的商品
      allGoodsInfo: [],
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
        gid: [{ validator: validatePass1, trigger: 'change' }], // 失焦验证吧
        goodsNames: [{ validator: validatePass2, trigger: 'blur' }],
        sname: [{ validator: validatePass3, trigger: 'blur' }]
      },
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
    this.getAllCores()
    this.getAllGoods()
  },
  methods: {
    // 获取所有的商品
    getAllGoods() {
      this.$axios.post(UrlHelper.packageInfo.getAllGoods).then(val => {
        if (val.status === 200) {
        //  console.log('所有的商品信息')
        //  console.log(val.data)
          val.data.map(ite => {
            ite.isShow = false
            ite.rCount = ''
          })
          this.goods = val.data
        //  console.log(this.goods)
        }
      })
    },
    // 查询所有的积分信息
    getAllCores() {
      this.$axios.post(UrlHelper.packageInfo.getAllCores).then(val => {
        if (val.status === 200) {
          //   console.log('所有的积分信息')
          //   console.log(val.data)
          this.coreInfo = val.data
        }
      })
    },
    // 分页查询
    getList() {
      // console.log('----')
      this.$axios.post(UrlHelper.packageInfo.getList, {
        begin: this.listQuery.page,
        page: this.listQuery.limit
      }).then(val => {
      //  console.log(val)
        if (val.status === 200) {
          this.total = val.data.total
          // 将每个套餐的商品进行整合
          val.data.rows.map(value => {
            const v = value.strName.join(',')
            value.packageDetail = v
          })
          this.tableData3 = val.data.rows
          // console.log('当前列表信息')
          //  console.log(val.data.rows)
          // 解决删除bug
          const len = this.tableData3.length
          if (len === 0 && this.listQuery.page > 1) {
            this.listQuery.page -= 1
            this.getList()
          }
        } else {
          this.$message({
            type: 'error',
            message: '查询失败'
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
      this.diaTitle = '新增套餐'
      this.dialogFormVisible = true
      // this.$refs['packageEntity'].resetFields()
      // this.resetForm('packageEntity')
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
            message: '已取消删除',
            duration: 1000
          })
        })
    },
    edit(data) { // 编辑进行回显
      this.diaTitle = '修改套餐'
      //  console.log(data)
      this.packageEntity = data
      const rNames = data.rName
      this.packageEntity = {
        sid: data.sid,
        gid: data.gid, // 积分id
        gname: data.gname, // 积分名称
        sname: data.sname,
        goodsNames: rNames
      }
      // this.packageEntity.goodsNames = rNames
      this.dialogFormVisible = true
      const rIds = data.rId

      const rCounts = data.rCount
      rIds.map((val, index) => {
        this.goods.map(val1 => {
          if (val === val1.cid) {
            val1.isShow = true
            val1.rCount = rCounts[index]
          }
        })
      })
    },
    del(data) {
      // 删除当前积分档
      // 给出提示
      this.$confirm('此操作将永久删除该积分记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$axios.post(UrlHelper.packageInfo.delPackage, { sid: data.sid }).then(val => {
          //  console.log(val)
            if (val.data.code === 200) {
              this.$message({
                type: 'success',
                message: val.data.msg,
                duration: 1000
              })
              this.getList()
            } else {
              this.$message({
                type: 'success',
                message: val.data.msg,
                duration: 1000
              })
            }
          })
          // doSomething
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '已取消删除'
          })
        })
    },

    close() {
      // 关闭对话框
    //  console.log('close触发了吗')
      this.dialogFormVisible = false
      this.packageEntity = {
        goodsNames: []
      }
      // this.$refs['packageEntity'].resetFields()
      this.resetForm('packageEntity')
      this.getAllGoods() // 重置good，列表
    },
    // 复选框全选

    handleCheckedCitiesChange(value) {
      // const checkedCount = value.length
    // console.log('是当前选中的吗')
      // console.log(this.packageEntity.goodsNames)
      // 清除所有的在进行渲染
      // 将选中的存放在数组中
      // this.goods.map(val => {
      //   this.packageEntity.goodsNames.map(val2 => {
      //     if (val2 === val.cname) {
      //       val.isShow = true
      //     } else {
      //       val.isShow = false
      //     }
      //   })
      // })
      this.packageEntity.goodsNames.map(val => {
        this.goods.map(val2 => {
          if (val === val2.cname) { // 如果数组中有相等的就进行重新渲染
            val2.isShow = true
          }
        })
      })

    //  console.log('当前选中的所有商品信息')
    //  console.log(this.goods)
    },
    singleChange(val, good) {
    //  console.log('单个数据变化')
    //  console.log(val)
      good.isShow = val
      // console.log(this.packageEntity.goodsNames)// 当前所选中的数量
      // this.goods.map(val1 => {
      //   console.log(val1)
      // })
    },
    handleChange(val) { // 点击计数器就开始触发
    // 每次触发都进行数据校验
    //  console.log(val)
    },
    confirm() {
      this.$refs['packageEntity'].validate((valid) => {
        if (valid) {
          if (this.diaTitle === '新增套餐') { // 新增套餐
            const obj = {}
            obj.sname = this.packageEntity.sname // 套餐名称
            obj.gid = this.packageEntity.gid // 积分id
            obj.sid = this.packageEntity.sid
            const sgangpin = this.goods.filter(val => {
              if (val.rCount === '' || val.rCount === 0 || val.isShow === false) {
                return false
              } else {
                return true
              }
            })
            // console.log('所有的商品', sgangpin)
            const arr = []
            sgangpin.map(val => {
              let str = ''
              str = val.cid + '、' + val.rCount
              arr.push(str)
            })
            // console.log('商品拼接的数组')
            // console.log(arr)
            const arr2 = arr.join(';')
            // console.log(arr2)
            // const arr3 = []
            // arr3.push(arr2)
            obj.gather = arr2
            // console.log(obj)
            this.$axios.post(UrlHelper.packageInfo.addPackage, obj).then(value => {
              console.log('-----------------', value)
              if (value.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: value.data.msg,
                  duration: 1000
                })
                this.getList()
                this.dialogFormVisible = false
              } else {
                this.$message({
                  type: 'error',
                  message: value.data.msg,
                  duration: 1000
                })
              }
            })
          } else if (this.diaTitle === '修改套餐') { // 修改套餐
            // 修改套餐
            const obj = {}
            obj.sname = this.packageEntity.sname // 套餐名称
            obj.gid = this.packageEntity.gid // 积分id
            obj.sid = this.packageEntity.sid
            const sgangpin = this.goods.filter(val => {
              if (val.rCount === '' || val.rCount === 0 || val.isShow === false) {
                return false
              } else {
                return true
              }
            })
            // console.log('所有的商品', sgangpin)
            const arr = []
            sgangpin.map(val => {
              let str = ''
              str = val.cid + '、' + val.rCount
              arr.push(str)
            })
            // console.log('商品拼接的数组')
            // console.log(arr)
            const arr2 = arr.join(';')
            // console.log(arr2)
            // const arr3 = []
            // arr3.push(arr2)
            obj.gather = arr2
            // console.log(obj)
            this.$axios.post(UrlHelper.packageInfo.editPackage, obj).then(val => {
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

<style lang="scss" scoped>

.hide .el-upload--picture-card {
  display: none;
}
.checkTest{
  display: flex;
 flex-direction: row;
 flex-wrap: wrap;

}
.cheDiv{
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  div{
    width: 50%;
  }
}
.colorText{
  color: #9e9999;
}
</style>
