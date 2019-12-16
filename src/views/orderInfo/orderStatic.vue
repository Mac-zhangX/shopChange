<template>
  <div style="padding:1rem">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0">
      <el-form :inline="true" :model="filters">
        <el-form-item label="账户查询:">
          <el-autocomplete
            v-model="filters.username"
            :fetch-suggestions="querySearchAsync"
            size="small"
            @select="handleSelect"
            icon="circle-close"
            :on-icon-click="handleOrderIconClick"
            @keyup.enter.native="search"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="下单时间:">
          <el-date-picker
            v-model="filters.startTime"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
          -
          <el-date-picker
            v-model="filters.endTime"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button type="primary" icon="el-icon-download" @click="orderOut()">订单导出</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </el-col>
    <el-table
      v-loading="listLoading"
      :data="list"
      align="center"
      header-align="center"
      class="orderList01 orderList"
      size="small"
      style="margin-top: 1rem"
      tooltip-effect="dark"
      border
    >
      <el-table-column type="index" width="100" label="序号"/>
      <el-table-column prop="username" label="用户名"/>
      <!--      <el-table-column prop="payTime" label="下单时间"/>-->
      <el-table-column prop="size" label="订单总条数"/>
      <el-table-column prop="phCount" label="号码总条数"/>
      <el-table-column prop="totalSum" label="总积分"/>
      <el-table-column prop="returnIntegral" label="退货积分"/>
      <el-table-column prop="newPrice" label="实际积分"/>
    </el-table>
    <el-row style="margin-bottom: 2rem;">
      <el-col :span="12" class="toolbar">
        <el-pagination
          :page-sizes="[10,20, 50, 100]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import NProgress from 'nprogress'
  import moment from 'moment'
  import {getDateStr} from '../../utils/auth'
  import {integralStatistics, unclearOrderList} from '../../api/modeList'

  export default {
    name: "orderStatic",
    data() {
      return {
        filters: {
          username: '',
          startTime: null,
          endTime: null,
          sysUserId: null,
          orderId: null
        },
        list: [],
        listLoading: false,
        total: 0,
        size: 10,
        pageNo: 1,
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      search() {
        // 搜索 根据当前后台的逻辑搜索的时候永远将页码置于1
        this.pageNo = 1;
        this.getList()
      },
      querySearchAsync(queryString, cb) {
        let param = {
          username: this.filters.username
        };
        unclearOrderList(param).then((res) => {
          if (res.data.code === 0) {
            this.restaurants = res.data.Data;
            this.restaurants.map((val) => {
              val.value = val.username
            });
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(this.restaurants);
            }, 1000 * Math.random());
          } else {
            this.filters.sysUserId = null
          }
        })
      },
      getList() {
        if (this.filters.startTime != null) {
          this.filters.startTime = moment(this.filters.startTime).format('YYYY-MM-DD 00:00:00')
        }
        if (this.filters.endTime != null) {
          this.filters.endTime = moment(this.filters.endTime).format('YYYY-MM-DD 23:59:59')
        }
        const param = {
          currPage: this.pageNo,
          pageSize: this.size,
          username: this.filters.username,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime
        };
        NProgress.start();
        this.listLoading = true;
        integralStatistics(param).then((res) => {
          if (res.data.code === 0) {
            const data = res.data.data;
            this.list = data.records;
            this.size = data.size;
            this.total = data.total;
            this.list.map((val) => {
              val.newPrice = parseInt(val.totalSum - val.returnIntegral);
              val.payTime = getDateStr(-1)
            });
            const len = this.list.length;
            if (len === 0 && this.pageNo > 1) {
              this.pageNo -= 1;
              this.getList()
            }
          } else {
            this.total = 0;
            this.list = [];
            this.$message({
              type: 'error',
              message: res.data.msg,
              duration: 1000
            });
          }
          NProgress.done();
          this.listLoading = false
        })
      },
      orderOut() { // 订单导出
        const param = {
          username: this.filters.username,
          startTime: this.filters.startTime,
          endTime: this.filters.endTime,
          sysUserId: this.filters.sysUserId,
        };
        orderExcelOut(param).then((res) => {
          const fileName = '订单列表';
          const link = document.createElement('a');
          const tourl = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
          link.href = tourl;
          link.target = '_blank';
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link)
        })
      },

      closeDialogDetail() {

      },
      handleSelect() {

      },
      handleOrderIconClick() {
        this.filters.orderNo = '';
        this.filters.username = ''
      },
      // 分页
      handleCurrentChange(val) {
        this.pageNo = val;
        this.getList();
      },
      // 分页显示条数
      handleSizeChange(val) {
        this.size = val;
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
<style>
  .orderList01 .el-table__row td:last-child {
    text-align: center;
  }
</style>

