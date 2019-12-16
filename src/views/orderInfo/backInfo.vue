<template>
  <div style="padding: 1rem">
    <div>
      <el-row :gutter="20">
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <div class="div1">退货单号&nbsp;&nbsp;</div>
            <div class="div2"> <el-input v-model="filters.logisticsNumber" size="small" placeholder="RAM单号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="getList" /></div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <div class="div1">退货单状态&nbsp;&nbsp;</div>
            <div class="div2">   <el-select v-model="filters.status" size="small" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select></div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <div class="div1">商家系统单号&nbsp;&nbsp;</div>
            <div class="div2"> <el-input v-model="filters.businessNumber" size="small" placeholder="商家系统单号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="getList" /></div>
          </div>
        </el-col>
        <!-- <el-col :span="5"><div class="grid-content bg-purple">
          <div class="div1"> SKU编号&nbsp;&nbsp;</div>
          <div class="div2"> <el-input v-model="filters.SKUid" size="small" placeholder="SKU编号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="getList" /></div>

        </div>
        </el-col> -->
      </el-row>
      <el-row :gutter="20">

        <el-col :span="5">
          <div class="grid-content bg-purple">
            <div class="div1">退货创建时间&nbsp;&nbsp;</div>
            <div class="div2">
              <el-date-picker
                v-model="filters.startTime"
                size="small"
                class="input1"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="grid-content bg-purple">
            <div class="div3">到</div>
            <div class="div2">
              <el-date-picker
                v-model="filters.endTime"
                size="small"
                class="input1"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              />

            </div>
          </div>
        </el-col>
        <el-col :span="5"><div class="grid-content bg-purple">
          <el-button type="primary" size="small" icon="el-icon-search" @click="getList()">查询</el-button>
          <!-- <div class="div1"> SKU编号</div>
          <div class="div2"> <el-input v-model="filters.backCard" size="small" placeholder="SKU编号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="orderList" /></div> -->

        </div>
        </el-col>
      </el-row>
    </div>

    <el-col :span="24" class="toolbar" style="padding-bottom: 0">
      <!-- <el-form :inline="true" :model="filters">
        <el-form-item label="退货单号:">
          <el-input v-model="filters.backCard" size="small" placeholder="RAM单号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="orderList" />
        </el-form-item>
        <el-form-item label="订单编号:">
          <el-input v-model="filters.cardNo" size="small" placeholder="订单编号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="orderList" />
        </el-form-item>
        <el-form-item label="退货单状态:">
          <el-input v-model="filters.status" size="small" placeholder="RAM单号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="orderList" />
        </el-form-item>
        <el-form-item label="SKU编号:">
          <el-input v-model="filters.backCard" size="small" placeholder="SKU编号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="orderList" />
        </el-form-item>
        <el-form-item label="商家系统单号:">
          <el-input v-model="filters.backCard" size="small" placeholder="商家系统单号" icon="circle-close" :on-icon-click="handleOrderIconClick" @keyup.enter.native="orderList" />
        </el-form-item>
        <el-form-item label="退货创建时间:">
          <el-date-picker
            v-model="filters.StartTime"
            size="small"
            class="input1"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          /> 到
          <el-date-picker
            v-model="filters.EndTime"
            size="small"
            class="input1"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="orderList()">查询</el-button>
        </el-form-item>
      </el-form> -->
    </el-col>

    <!--    列表-->
    <el-table size="small" :data="dataList" width="100%" border align="center">
      <el-table-column prop="logisticsNumber" label="运单编号" width="" align="center" />
      <el-table-column prop="orderId" label="订单编号" width="" align="center" />
      <el-table-column prop="mobile" label="手机号" width="" align="center" />
      <el-table-column prop="businessNumber" label="商家系统单号" width="" align="center" />
      <el-table-column prop="productDetails" label="商品" align="center" />
      <el-table-column prop="productNumber" label="商品编号" align="center" />
      <el-table-column prop="logisticsCompany" label="快递类型" align="center" />
      <el-table-column prop="productAbbreviat" label="规格" align="center" />
      <el-table-column prop="price" label="价格" align="center" />
      <el-table-column prop="acceptName" label="收货人姓名" align="center" />
      <el-table-column prop="acceptMobile" label="收货人手机号" align="center" />
      <el-table-column prop="returnTime" label="退货创建时间" align="center" />
      <el-table-column prop="auditTime" label="退货完结时间" align="center" />
      <el-table-column prop="statusName" label="退货状态" align="center" />
      <el-table-column align="center" prop="" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==2"
            size="mini"
            type="success"
            @click="sp(scope.row)"
          >审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-sizes="[10,20, 50, 100]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import { backGoodList, backGoods } from '@/api/modeList'
import Pagination from '../../components/Pagination'
import moment from 'moment'
export default {
  name: 'BackInfo',
  components: {
    Pagination
  },
  data() {
    return {
      filters: {
        currPage: null,
        pageSize: null,
        logisticsNumber: null, // 退货单号
        SKUid: null, // SKU编号
        businessNumber: null, // 商家系统编号
        status: null,
        startTime: null,
        endTime: null
      },
      dataList: [],
      options: [
        { name: '退货中', value: '2' },
        { name: '已退货', value: '3' }
      ],
      total: 0,
      listQuery: {
        limit: 10,
        page: 1
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      // 时间进行限制
      if (
        this.filters.startTime !== null &&
       this.filters.startTime !== '' &&
       this.filters.startTime !== undefined
      ) {
        this.filters.startTime = moment(this.filters.startTime).format('YYYY-MM-DD 00:00:00')
      }
      if (this.filters.endTime !== null && this.filters.endTime !== '' && this.filters.endTime !== undefined) {
        this.filters.endTime = moment(this.filters.endTime).format('YYYY-MM-DD 23:59:59')
      }
      this.filters.currPage = this.listQuery.page
      this.filters.pageSize = this.listQuery.limit
      const rLoading = this.openLoading()
      backGoodList(this.filters).then(res => {
        if (res.data.code === 0) {
          this.dataList = res.data.Data.records;
          this.dataList.map(val => {
            if (val.status === 0) {
              val.statusName = '未发货'
            } else if (val.status === 1) {
              val.statusName = '已发货'
            } else if (val.status === 2) {
              val.statusName = '退货中'
            } else if (val.status === 3) {
              val.statusName = '已退货'
            }
            if (val.returnTime !== '' && val.returnTime !== null) {
              val.returnTime = moment(val.returnTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (val.auditTime !== '' && val.auditTime !== null) {
              val.auditTime = moment(val.auditTime).format('YYYY-MM-DD HH:mm:ss')
            }
          })
          this.total = res.data.Data.total
          const len = this.dataList.length
          if (len === 0 && this.listQuery.page > 1) {
            this.listQuery.page -= 1
            this.getList()
          }
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
        rLoading.close()
      })
    },
    handleOrderIconClick() {
      this.filters.orderNo = ''
    },
    sp(data) { // 退货审批
      const obj = {
        status: 3,
        orderId: data.orderId
      };
      const rLoading = this.openLoading()
      backGoods(obj).then(res => {
        if (res.data.code === 0) {
          rLoading.close();
          this.$message({
            type: 'success',
            message: res.data.msg
          });
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      });
    },
    // 分页
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList()
    },
    // 分页显示条数
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
  .grid-content{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .div1{
      width: 55%;
      text-align:right;
    }
    .div3{
      width: 55%;
      text-align: center;
    }
    // .div.{
    //   width: 50%;
    // }
  }
  .el-row{
    margin-bottom: 1rem;
  }
  .input1{
    width: 145px;
  }
</style>
