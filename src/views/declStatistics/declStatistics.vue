<template>
  <div style="padding:1rem">
    <el-row type="flex">
      <el-col :span="8">
        <div style="font-size:24px;color:">
          申报统计
          <!-- <el-button type="primary" size="small" icon="el-icon-search" @click="getList()">搜索</el-button> -->
        </div>
      </el-col>
      <el-col :span="16">
        <div>
          起始日期
          <el-date-picker v-model="startingTime" style="width:150px" :picker-options="pickerOptions" size="small" type="date" placeholder="选择日期" />&nbsp;&nbsp;&nbsp;&nbsp;
          结束日期
          <el-date-picker v-model="endTime" style="width:150px" :picker-options="pickerOptions2" size="small" type="date" placeholder="选择日期" />&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input v-model="userphone" size="small" style="width:140px" clearable placeholder="输入申报手机号" />
          &nbsp;&nbsp;&nbsp;&nbsp;<el-button type="primary" size="small" icon="el-icon-search" @click="getNewList()">搜索</el-button>
        </div>
      </el-col>

      <!-- <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button> -->
      <!-- <el-button v-if="checkedAll" size="mini" class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button> -->
    </el-row>
    <el-row type="flex">
      <el-col :span="8">
        <div style="margin-top: 2rem" class="box">
          <div class="box-card">
            <el-card class="card1">
              <div class="colTow">
                <div class="text item" style="width:75%">
                  <!-- <div>
              <span>成功总条数:</span> 10000
            </div>
            <div>
              <span>总积分:</span> 10000
            </div> -->
                  <el-form class="">
                    <!-- 总条数 -->
                    <el-form-item :label="title1" :label-width="formLabelWidth">
                      <span class="num">
                        <!-- {{ totalCount }} -->
                        <countTo :start-val="startVal" :end-val="totalCount" :decimals="2" :duration="duration" />
                      </span>
                    </el-form-item>
                    <!-- 总积分 -->
                    <el-form-item :label="title2" :label-width="formLabelWidth">
                      <span class="num">
                        <countTo :start-val="startVal" :end-val="totalScore" :decimals="2" :duration="duration" />
                        <!-- {{ totalScore }} -->
                      </span>
                    </el-form-item>
                    <!-- 总面额 -->
                    <el-form-item :label="title3" :label-width="formLabelWidth">
                      <span class="num">
                        <countTo :start-val="startVal" :end-val="totalDenomination " :decimals="2" :duration="duration" />
                        <!-- {{ totalScore }} -->
                      </span>
                    </el-form-item>
                  </el-form>
                </div>
                <div style="margin-top:1px;width:25%">
                  <el-form>
                    <el-form-item>
                      <img style="width: 90px;margin-top:-20px" src="../../assets/image/duihuan.png">
                    </el-form-item>
                  </el-form>

                </div>
              </div>
            </el-card>
          </div>

        </div>

      </el-col>
      <el-col :span="16">
        <div style="margin-top: 1rem">
          <el-tabs v-model="activeName" @tab-click="handleClick">

            <el-tab-pane label="未请求" name="1">
              <el-table
                :data="tableData"
                stripe
                border
                size="small"
                style="width: 100%;margin-top: 1rem"
              >
                <el-table-column
                  prop="declarePhone"
                  label="申报手机号"
                />
                <el-table-column
                  prop="phone"
                  label="兑换手机号"
                />
                <el-table-column
                  prop="cname"
                  label="商品名称"
                />
                <el-table-column
                  prop="score"
                  label="积分"
                />
                <el-table-column
                  prop="amount"
                  label="面值"
                />
                <el-table-column
                  prop="xstatus"
                  label="状态"
                />
                <el-table-column
                  prop="createTime"
                  label="创建时间"
                />
                <!-- <el-table-column
                  prop="sname"
                  label="套餐"
                />
                <el-table-column
                  prop="otime"
                  label="创建时间"
                /> -->
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="已请求" name="2">
              <el-table
                :data="tableData"
                stripe
                border
                size="small"
                style="width: 100%;margin-top: 1rem"
              >
                <el-table-column
                  prop="declarePhone"
                  label="申报手机号"
                />
                <el-table-column
                  prop="phone"
                  label="兑换手机号"
                />
                <el-table-column
                  prop="cname"
                  label="商品名称"
                />
                <el-table-column
                  prop="score"
                  label="积分"
                />
                <el-table-column
                  prop="amount"
                  label="面值"
                />
                <el-table-column
                  prop="xstatus"
                  label="状态"
                />
                <el-table-column
                  prop="createTime"
                  label="创建时间"
                />
              </el-table>
            </el-tab-pane>

            <!-- <el-tab-pane label="申报成功" name="4">

              <el-table
                :data="tableData"
                stripe
                border
                size="small"
                style="width: 100%;margin-top: 1rem"
              >
                <el-table-column
                  prop="did"
                  label="申报编号"
                  width="80"
                />
                <el-table-column
                  prop="sbnumbe"
                  label="申报号码"
                  width="120"
                />
                <el-table-column
                  prop="dhnumbe"
                  label="兑换号码"
                  width="120"
                />
                <el-table-column
                  prop="gname"
                  label="积分"
                  width="80"
                />
                <el-table-column
                  prop="xflag"
                  label="申报状态"
                  width="100"
                />
                <el-table-column
                  prop="sname"
                  label="套餐"
                />
                <el-table-column
                  prop="otime"
                  label="创建时间"
                />
              </el-table>

            </el-tab-pane>
            <el-tab-pane label="申报失败" name="3">
              <el-table
                :data="tableData"
                stripe
                border
                size="small"
                style="width: 100%;margin-top: 1rem"
              >
                <el-table-column
                  prop="did"
                  label="申报编号"
                  width="80"
                />
                <el-table-column
                  prop="sbnumbe"
                  label="申报号码"
                  width="120"
                />
                <el-table-column
                  prop="dhnumbe"
                  label="兑换号码"
                  width="120"
                />
                <el-table-column
                  prop="gname"
                  label="积分"
                  width="80"
                />
                <el-table-column
                  prop="xflag"
                  label="申报状态"
                  width="100"
                />
                <el-table-column
                  prop="sname"
                  label="套餐"
                />
                <el-table-column
                  prop="otime"
                  label="创建时间"
                />
              </el-table>

            </el-tab-pane>
            <el-tab-pane label="申报中" name="2">
              <el-table
                :data="tableData"
                stripe
                border
                size="small"
                style="width: 100%;margin-top: 1rem"
              >
                <el-table-column
                  prop="did"
                  label="申报编号"
                  width="80"
                />
                <el-table-column
                  prop="sbnumbe"
                  label="申报号码"
                  width="120"
                />
                <el-table-column
                  prop="dhnumbe"
                  label="兑换号码"
                  width="120"
                />
                <el-table-column
                  prop="gname"
                  label="积分"
                  width="80"
                />
                <el-table-column
                  prop="xflag"
                  label="申报状态"
                  width="100"
                />
                <el-table-column
                  prop="sname"
                  label="套餐"
                />
                <el-table-column
                  prop="otime"
                  label="创建时间"
                />
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="申报" name="1">
              <el-table
                :data="tableData"
                stripe
                border
                size="small"
                style="width: 100%;margin-top: 1rem"
              >
                <el-table-column
                  prop="did"
                  label="申报编号"
                  width="80"
                />
                <el-table-column
                  prop="sbnumbe"
                  label="申报号码"
                  width="120"
                />
                <el-table-column
                  prop="dhnumbe"
                  label="兑换号码"
                  width="120"
                />
                <el-table-column
                  prop="gname"
                  label="积分"
                  width="80"
                />
                <el-table-column
                  prop="xflag"
                  label="申报状态"
                  width="100"
                />
                <el-table-column
                  prop="sname"
                  label="套餐"
                />
                <el-table-column
                  prop="otime"
                  label="创建时间"
                />
              </el-table>
            </el-tab-pane> -->
          </el-tabs>
        </div>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
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
      userphone: '',
      title1: '总条数',
      title2: '总积分',
      title3: '总面额',
      // 需要滚动的时间
      duration: 1000,
      // 初始值
      startVal: 0,
      activeName: '1',
      startingTime: '',
      endTime: '',
      totalCount: 0, // 总条数
      totalScore: 0, // 总积分
      totalDenomination: 0, // 总面额
      formLabelWidth: '100px',
      tableData: [],
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
    // this.getList()
    this.getNewList()
  },
  methods: {

    getNewList() {
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
      this.$axios.post(UrlHelper.statics.delSataic, {
        page: this.listQuery.limit,
        begin: this.listQuery.page,
        startingTime: this.startingTime,
        endTime: this.endTime,
        status: this.activeName,
        declarePhone: this.userphone
      }).then(val => {
        if (val.status === 200) {
          // console.log(val)
          this.totalCount = val.data.total
          this.total = val.data.total
          this.totalScore = val.data.integral
          this.totalDenomination = val.data.count
          this.tableData = val.data.rows
          this.tableData.map(val => {
            val.createTime = moment(val.createTime).format('YYYY-MM-DD HH:mm:ss')
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

    getList() {
      if (this.startingTime === null) {
        this.startingTime = ''
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
      this.$axios.post(UrlHelper.statics.reportingStatistics, {
        page: this.listQuery.limit,
        begin: this.listQuery.page,
        startingTime: this.startingTime,
        endTime: this.endTime,
        sflag: this.activeName
      }).then(val => {
        if (val.status === 200) {
          this.totalCount = val.data.totalCount
          this.total = val.data.totalCount
          this.totalScore = val.data.total
          this.tableData = val.data.rows
        }
        // console.log('请求成功')
      //  console.log(val.data)
      })
    },
    handleClick(tab, event) {
      if (this.activeName === '1') {
        this.title1 = '未请求'
      } else if (this.activeName === '2') {
        this.title1 = '已请求'
      }
      // if (this.activeName === '1') {
      //   this.title1 = '申报总条数'
      // } else if (this.activeName === '2') {
      //   this.title1 = '申报中总条数'
      // } else if (this.activeName === '3') {
      //   this.title1 = '失败总条数'
      // } else if (this.activeName === '4') {
      //   this.title1 = '成功总条数'
      // }
      // console.log(tab)
      // this.getList()
      this.getNewList()
    }
  }
}
</script>

<style scoped lang="scss">
    .box{
        margin-top: 1rem;
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
            background: -webkit-linear-gradient(right top, #399EF3 , #97CAF5); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(top right, #399EF3, #97CAF5); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(top right, #399EF3, #97CAF5); /* Firefox 3.6 - 15 */
            background: linear-gradient(to top right, #399EF3 , #97CAF5); /* 标准的语法 */
            color: #fff;

        }
        /deep/ .el-form-item__label{
             color: #fff;
             font-size: 13px;
        }
          /deep/ .el-card__body {
            height: 200px;

        }
        .el-card:hover{
            border: 1px solid #399EF3;
            box-shadow: 0 0 4px #399EF3;
            -webkit-box-shadow: 0 0 10px #399EF3;
        }
        .num{
            font-size: 30px;
        }
       /deep/ .el-tabs__content{
          margin-top: -20px;
        }
</style>
