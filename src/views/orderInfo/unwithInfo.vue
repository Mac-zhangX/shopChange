<template>
  <div style="padding:1rem">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0">
      <el-form :inline="true" :model="filters">
        <el-form-item label="订单编号:">
          <el-input
            v-model="filters.orderId"
            size="small"
            placeholder="商城子编号"
            icon="circle-close"
            :on-icon-click="handleOrderIconClick"
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item label="商城子编号:">
          <el-input
            v-model="filters.subOrderId"
            size="small"
            placeholder="商城子编号"
            icon="circle-close"
            :on-icon-click="handleOrderIconClick"
            @keyup.enter.native="search"
          />
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
        <br>
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            multiple
            :http-request="orderIn"
            :file-list="fileIn"
          >
            <el-button type="primary" icon="el-icon-upload2">导入申报信息</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download" @click="orderOut()">订单导出</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      v-loading="listLoading"
      :data="list"
      align="center"
      class="orderList"
      size="small"
      width="100%"
      style="margin-top: 1rem"
      tooltip-effect="dark"
      border
    >
      <el-table-column
        type="index"
        width="50" label="序号">
      </el-table-column>
      <el-table-column prop="orderId" label="订单编号" width="150"/>
      <el-table-column prop="subOrderId" label="商城子编号" width="180"/>
      <el-table-column prop="mobile" label="手机号" width="130"/>
      <el-table-column prop="productDetails" label="商品"/>
      <el-table-column prop="price" label="商品金额" width="100"/>
      <el-table-column prop="sumPrice" label="订单总积分" width="100"/>
      <el-table-column prop="freight" label="运费" width="100"/>
      <el-table-column prop="sumAmount" label="订单金额" width="100"/>
      <el-table-column prop="placeTime" label="下单时间" width="180"/>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-tooltip content="同步" placement="top" style="text-align: center">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-refresh"
              circle
              @click="handleSome(scope.$index,scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
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
      <el-col :offset="6" :span="3" style="margin-top: 1rem;line-height: 32px;">
        总积分：<span style="color: red">{{orderSums}}</span>
      </el-col>
      <el-col :span="3" style="margin-top: 1rem;line-height: 32px">
        总金额：<span style="color: red">{{orderSum}}</span> 元
      </el-col>
    </el-row>

  </div>
</template>

<script>
    import NProgress from 'nprogress'
    import {formatDateTime} from '../../utils/index'
    import moment from 'moment'
    import {unOrderList, sameCheck, unclearOrderList, unOrderOut, orderInExcel} from '../../api/modeList'
    // <!--待发货订单-->
    export default {
        name: "waitInfo",
        data() {
            return {
                filters: {
                    orderId: null,   //订单编号
                    subOrderId: null,  //商城子编号
                    orderDealStatus: null,
                    startTime: null,
                    endTime: null
                },
                list: [],
                listLoading: false,
                total: 0,
                size: 10,
                pageNo: 1,
                orderSum: 0,
                orderSums: 0,
                restaurants: [],

                fileIn: [], // 导入
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            search() {
                //搜索 根据当前后台的逻辑搜索的时候永远将页码置于1
                this.pageNo = 1;
                this.getList();
            },
            // querySearchAsync(queryString, cb) {
            //     let param = {
            //         username: this.filters.username
            //     };
            //     unclearOrderList(param).then((res) => {
            //         if (res.data.code === 0) {
            //             this.restaurants = res.data.Data;
            //             this.restaurants.map((val) => {
            //                 val.value = val.username
            //             });
            //             clearTimeout(this.timeout);
            //             this.timeout = setTimeout(() => {
            //                 cb(this.restaurants);
            //             }, 1000 * Math.random());
            //         } else {
            //             this.$message({
            //                 type: 'error',
            //                 message: res.data.msg,
            //                 duration: 1000
            //             })
            //         }
            //     })
            //
            // },
            handleSelect(item) {
                console.log(item)
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
                    orderId: this.filters.orderId,
                    subOrderId: this.filters.subOrderId,
                    startTime: this.filters.startTime,
                    endTime: this.filters.endTime
                };
                NProgress.start();
                this.listLoading = true;
                unOrderList(param).then((res) => {   //未核销订单列表
                    if (res.data.code === 0) {
                        let data = res.data.Data;
                        this.orderSum = data.orderSum;
                        this.orderSums = (data.orderSum) * 100;
                        this.list = data.page.records;
                        this.size = data.page.size;
                        this.total = data.page.total;
                        //this.pageNo = data.current;
                        const len = this.list.length;
                        if (len === 0 && this.pageNo > 1) {
                            this.pageNo -= 1;
                            this.getList()
                        }
                        this.list.map(val => {
                            val.sumPrice = (val.sumAmount) * 100;
                            let placeTime = new Date(val.placeTime);
                            val.placeTime = formatDateTime(placeTime);
                        });
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
                });
            },
            handleSome(index, row) {  //同步
                let param = {
                    subOrderId: row.subOrderId
                };
                sameCheck(param).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.Data == false) {
                            this.$message({
                                type: 'error',
                                message: '同步失败',
                                duration: 1000
                            });
                        } else {
                            this.$message({
                                type: 'success',
                                message: '同步成功',
                                duration: 1000
                            });
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        });
                    }
                    this.getList();
                })
            },
            orderIn(e) {  //导入
                const formData = new FormData()
                formData.append('file', e.file)
                const rLoading = this.openLoading()
                orderInExcel(formData).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '订单导入成功',
                            duration: 1000
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            showClose: true,
                            duration: 0
                        })
                    }
                    rLoading.close();
                    this.getList()
                })
            },
            orderOut() {  //导出
                const param = {
                    orderId: this.filters.orderId,
                    startTime: this.filters.startTime,
                    endTime: this.filters.endTime,
                    subOrderId: this.filters.subOrderId,
                };
                unOrderOut(param).then((res) => {
                    const fileName = '未核销订单';
                    const link = document.createElement('a')
                    const tourl = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
                    link.href = tourl
                    link.target = '_blank'
                    link.download = fileName
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                })
            },
            handleOrderIconClick() {
                this.filters.orderId = ''
            },
            // 分页
            handleCurrentChange(val) {
                this.pageNo = val;
                this.getList()
            },
            // 分页显示条数
            handleSizeChange(val) {
                this.size = val;
                this.getList()
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
