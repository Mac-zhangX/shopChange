<template>
  <div style="padding: 1rem">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0">
      <el-form :inline="true" :model="filters">
        <el-form-item label="订单号查询:">
          <el-input
            v-model="filters.orderId"
            size="small"
            placeholder="订单号"
            icon="circle-close"
            :on-icon-click="handleOrderIconClick"
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item label="客户手机号:">
          <el-input
            v-model="filters.mobile"
            size="small"
            placeholder="手机号"
            icon="circle-close"
            :on-icon-click="handleOrderIconClick"
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item label="修改时间:">
          <el-date-picker
            v-model="filters.startUpTime"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
          -
          <el-date-picker
            v-model="filters.endUpTime"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search()">查询</el-button>
        </el-form-item>
        <br>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-download" @click="orderOut()">订单导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      v-loading="listLoading"
      :data="list"
      align="center"
      class="orderList"
      size="small"
      style="margin-top: 1rem"
      tooltip-effect="dark"
      border
    >
      <el-table-column
        type="selection"
        width="55"
        label="序号"
      />
      <el-table-column prop="orderId" label="订单号"/>
      <el-table-column prop="mobile" label="客户手机号"/>
      <el-table-column prop="acceptMobile" label="收货手机号"/>
      <el-table-column prop="logisticsNumber" label="快递单号"/>
      <el-table-column prop="acceptName" label="收货人"/>
      <el-table-column prop="logisticsUpTime" label="修改时间"/>
      <el-table-column prop="address" label="配送地址"/>
      <el-table-column prop="statusName" label="订单状态"/>
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
    import {LogisticsUpPage, unclearOrderList,exportLogisticsUp} from '../../api/modeList'
    export default {
        name: "goodsRecord",
        data() {
            return {
                filters: {
                    orderId: null,
                    mobile: null,
                    logisticsUpTime: null,
                    startUpTime:null,
                    endUpTime: null,
                },
                listLoading: false,
                list: [],
                total: 0,
                size: 10,
                pageNo: 1,
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            search() {
                // 搜索 根据当前后台的逻辑搜索的时候永远将页码置于1
                this.pageNo = 1;
                this.getList()
            },
            querySearchAsync(queryString, cb) {
                let param = {
                    orderId: this.filters.orderId
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
                    }
                })
            },
            getList() {
                if (this.filters.startUpTime != null) {
                    this.filters.startUpTime = moment(this.filters.startUpTime).format('YYYY-MM-DD 00:00:00')
                }
                if (this.filters.endUpTime != null) {
                    this.filters.endUpTime = moment(this.filters.endUpTime).format('YYYY-MM-DD 23:59:59')
                }
                const param = {
                    currPage: this.pageNo,
                    pageSize: this.size,
                    orderId: this.filters.orderId,
                    mobile: this.filters.mobile,
                    logisticsStatus: 1,
                    startUpTime: this.filters.startUpTime,
                    endUpTime: this.filters.endUpTime
                };
                NProgress.start();
                this.listLoading = true;
                LogisticsUpPage(param).then((res) => {
                    if (res.data.code === 0) {
                        const data = res.data.data;
                        this.list = data.records;
                        this.size = data.size;
                        this.total = data.total;
                        const len = this.list.length;
                        if (len === 0 && this.pageNo > 1) {
                            this.pageNo -= 1;
                            this.getList()
                        }
                        this.list.map(val => {
                            switch (val.status) {
                                case 0:
                                    val.statusName = '未发货';
                                    break;
                                case 1:
                                    val.statusName = '已发货';
                                    break;
                                case 2:
                                    val.statusName = '退货中';
                                    break;
                                case 3:
                                    val.statusName = '已退货';
                                    break
                            }
                        })
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
            //物流导出
            orderOut() {
                const param = {
                    orderId: this.filters.orderId,
                    mobile: this.filters.mobile,
                };
                exportLogisticsUp(param).then((res) => {
                    const fileName = '物流修改列表';
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
            handleOrderIconClick() {
                this.filters.orderId = ''
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
