<template>
  <div style="padding:1rem">
    <el-row type="flex">
      <el-col :span="8">
        <div style="font-size:24px;color:">
          申报订单统计
        </div>

      </el-col>
      <el-col :span="16">
        <div>
          起始日期
          <el-date-picker v-model="startingTime" style="width:150px" size="small" :picker-options="pickerOptions" type="date" placeholder="选择日期" />&nbsp;&nbsp;&nbsp;&nbsp;
          结束日期
          <el-date-picker v-model="endTime" style="width:150px" size="small" :picker-options="pickerOptions2" type="date" placeholder="选择日期" />&nbsp;&nbsp;&nbsp;&nbsp;

          <!-- <el-input v-model="userphone" size="small" style="width:140px" clearable placeholder="输入申报手机号" /> -->
          &nbsp;&nbsp;&nbsp;&nbsp;<el-button type="primary" size="small" icon="el-icon-search" @click="getList()">搜索</el-button>
          <el-button type="primary" size="small" icon="el-icon-upload2" @click="exportExcel()">导出</el-button>
        </div>
      </el-col>

      <!-- <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button> -->
      <!-- <el-button v-if="checkedAll" size="mini" class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button> -->
    </el-row>
    <el-row type="flex" style="margin-top: 21px">
      <el-col :span="8">
        <div class="box">
          <div class="box-card">
            <el-card class="card1">
              <div class="colTow">
                <div class="text item" style="width: 75%">
                  <el-form class="">
                    <el-form-item label="总条数" :label-width="formLabelWidth">
                      <span class="num">
                        <countTo :start-val="startVal" :end-val="declOrderTotal" :decimals="2" :duration="duration" />
                      </span>
                    </el-form-item>
                    <!-- 总面额 -->
                    <el-form-item label="总金额" :label-width="formLabelWidth">
                      <span class="num">
                        <countTo :start-val="startVal" :end-val="declOrderAccount" :decimals="2" :duration="duration" />
                      </span>
                    </el-form-item>
                  </el-form>
                </div>
                <div style="width: 25%">
                  <el-form>
                    <el-form-item>
                      <img style="width: 90px;margin-top:-20px;" src="../../assets/image/duihuan.png">
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div>
          <el-table
            :data="tableData"
            border
            stripe
            size="small"
            style="width: 100%;"
          >
            <el-table-column
              prop="declaratNumber"
              label="申报号码"
            />
            <el-table-column
              prop="changeNumber"
              label="兑换号码"
            />
            <el-table-column
              prop="money"
              label="金额"
            />

            <el-table-column
              prop="oder"
              label="订单号"
            />
            <el-table-column
              prop="createDate"
              label="创建时间"
            />
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </div>

      </el-col>

    </el-row>

  </div>
</template>
<script>

import { UrlHelper } from '@/api/urlHelper'
import Pagination from '@/components/Pagination/index'
import moment from 'moment'
import countTo from 'vue-count-to'
export default {
  components: {
    Pagination,
    countTo
  },
  data() {
    return {
      startingTime: '',
      endTime: '',
      declOrderTotal: 0, // 申报订单总条数
      declOrderAccount: 0, // 申报订单总金额
      userphone: '',
      // 需要滚动的时间
      duration: 1000,
      // 初始值
      startVal: 0,
      totalCount: 0,
      totalScore: 0,
      formLabelWidth: '100px',
      tableData: [],
      totalData: [], // 所有的数据
      goods: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10
      },
      pickerOptions: {
        // 起始时间不能大于结束时间
        disabledDate: (time) => {
          if (this.endTime) {
            // 开始时间不能大于结束时间
            return time.getTime() > this.endTime
          } else {
            // 开始时间不能为今天以后
            return time.getTime() > Date.now() // 不可以选择今天以后的时间
          }
        }
      },
      pickerOptions2: {
        // 结束时间不能小于开始时间，并且不能超过今天
        disabledDate: (time) => {
          if (this.startingTime) {
            // 如果有开始时间则不能小于起始时间，并且不能大于今天
            return time.getTime() < this.startingTime || time.getTime() > Date.now()
          }
          //   return time.getTime() > Date.now() - 8.64e7 // 不可选择今天以后的包括今天
          return time.getTime() > Date.now() // 不可以选择今天以后的时间
        }
      }

    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      if (this.startingTime === null) {
        this.startingTime = ''
      }
      if (this.userphone === null) {
        this.userphone = ''
      }
      if (this.endTime === null) {
        this.endTime = ''
      }
      if (this.endTime !== null && this.endTime !== '') {
        this.endTime = moment(this.endTime).format('YYYY-MM-DD 23:59:59')
      }
      if (this.startingTime !== null && this.startingTime !== '') {
        this.startingTime = moment(this.startingTime).format('YYYY-MM-DD HH:mm:ss')
      }
      // 获取申报信息
      this.$axios
        .post(UrlHelper.statics.declOrderStic, {
          page: this.listQuery.limit,
          begin: this.listQuery.page,
          startingTime: this.startingTime,
          endTime: this.endTime
        })
        .then(val => {
          // 如果请求成功
          console.log('申报信息获取成功')
          console.log(val)
          if (val.status === 200) {
            this.tableData = val.data.rows

            this.totalData = val.data.rowss
            this.declOrderTotal = val.data.total
            this.declOrderAccount = val.data.totals
            this.tableData.map(val => {
              if (val.createDate !== null && val.createDate !== undefined && val.createDate !== '') {
                val.createDate = moment(val.createDate).format('YYYY-MM-DD HH:mm:ss')
              }
            })
            this.totalData.map(val => {
              if (val.createDate !== null && val.createDate !== undefined && val.createDate !== '') {
                val.createDate = moment(val.createDate).format('YYYY-MM-DD HH:mm:ss')
              }
            })
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
    // 导出
    // 导出的方法
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../excel/Export2Excel')
        const tHeader = ['申报号码', '兑换号码', '金额', '订单号', '创建时间']
        // 上面设置Excel的表格第一行的标题
        const filterVal = ['declaratNumber', 'changeNumber', 'money', 'oder', 'createDate']
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.totalData // 把data里的tableData存到list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '申报订单')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }

  }
}
</script>

<style scoped lang="scss">
    .box{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .box-card{
        width: 380px;
        height: 200px;
        box-sizing: border-box;
    }
    .statics{
        margin-left: 3%;
        font-size: 20px;
        color: black;
    }
    .el-form-item{
        margin-bottom: 0.5rem;
    }
    .colTow{
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        }
        .card1{
            background: -webkit-linear-gradient(right top, #64D9D6 , #93f3d3); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(top right, #64D9D6, #93f3d3); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(top right, #64D9D6, #93f3d3); /* Firefox 3.6 - 15 */
            background: linear-gradient(to top right, #64D9D6 , #93f3d3); /* 标准的语法 */
            color: #fff;

        }
        /deep/ .el-form-item__label{
             color: #fff;
             font-size: 13px;
        }
        .el-card:hover{
            border: 1px solid #93f3d3;
            box-shadow: 0 0 4px #93f3d3;
            -webkit-box-shadow: 0 0 10px #93f3d3;
        }
        .num{
            font-size: 30px;
        }
        /deep/ .el-card__body {
            height: 200px;
        }

</style>
