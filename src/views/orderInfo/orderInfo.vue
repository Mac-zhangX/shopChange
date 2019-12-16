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
                <el-form-item label="客户手机号:">
                    <el-input
                        v-model="filters.mobile"
                        size="small"
                        placeholder="客户手机号"
                        icon="circle-close"
                        :on-icon-click="handleOrderIconClick"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="订单编号:">
                    <el-input
                        v-model="filters.orderId"
                        size="small"
                        placeholder="订单编号"
                        icon="circle-close"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="s=收货人姓名:">
                    <el-input
                        v-model="filters.orderId"
                        size="small"
                        placeholder="订单编号"
                        icon="circle-close"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="商城子编号:">
                    <el-input
                        v-model="filters.subOrderId"
                        size="small"
                        placeholder="订单编号"
                        icon="circle-close"
                        :on-icon-click="handleOrderIconClick"
                        @keyup.enter.native="search"
                    />
                </el-form-item>
                <el-form-item label="订单状态:">
                    <el-select v-model="filters.orderDealStatus" placeholder="请选择" @change="search">
                        <el-option v-for="item in orderDealStatus" :key="item.id" :label="item.label"
                                   :value="item.value">{{
                            item.label }}
                        </el-option>
                    </el-select>
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
                <el-form-item v-if="statusInfo == 1">
                    <el-button type="primary" icon="el-icon-download" @click="downLoad()">下载物流模板</el-button>
                </el-form-item>
                <el-form-item v-if="statusInfo == 1">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        multiple
                        :http-request="orderIn"
                        :file-list="fileIn"
                    >
                        <el-button type="primary" icon="el-icon-upload2">订单导入</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-download" @click="orderOut()">订单导出</el-button>
                </el-form-item>
                <el-form-item v-if="statusInfo == 1">
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        multiple
                        :http-request="allGoods"
                        :file-list="fileList"
                    >
                        <el-button type="primary" icon="el-icon-upload2">批量发货</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item v-if="statusInfo == 1">
                    <el-button type="danger" v-show="checkedAll" icon="el-icon-delete" @click="allDelete()">批量删除
                    </el-button>
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
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                type="selection"
                width="55"
            />
            <el-table-column prop="orderId" label="订单编号" width="110"/>
            <el-table-column prop="subOrderId" label="商城子编号" width="110"/>
            <el-table-column prop="mobile" label="客户手机号" width="110"/>
            <el-table-column prop="sumPrice" label="积分值" width="80"/>
            <el-table-column prop="province" label="号码归属地" width="100"/>
            <el-table-column prop="acceptName" label="收货人姓名" width="100"/>
            <el-table-column prop="acceptMobile" label="收货手机号" width="110"/>
            <el-table-column prop="productDetails" label="商品信息" width="200"/>
            <el-table-column prop="logisticsNumber" label="快递单号"/>
            <el-table-column prop="logisticsCompany" label="配送方式" width="100"/>
            <el-table-column prop="address" label="配送地址" width="120"/>
            <el-table-column prop="placeTime" label="下单时间" width="140"/>
            <el-table-column prop="statusName" label="订单状态" width="80"/>
            <el-table-column prop="username" label="核销人" width="80"/>
            <el-table-column label="操作" width="220" align="center">
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top" v-if="scope.row.status === 1||scope.row.status === 0">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-edit"
                            circle
                            @click="handleEdit(scope.$index,scope.row)"
                        />
                    </el-tooltip>
                    <!--          <el-tooltip content="删除" placement="top" v-if="statusInfo == 1">-->
                    <!--            <el-button-->
                    <!--              size="mini"-->
                    <!--              type="danger"-->
                    <!--              icon="el-icon-delete"-->
                    <!--              circle-->
                    <!--              @click="handleDelete(scope.$index,scope.row)"-->
                    <!--            />-->
                    <!--          </el-tooltip>-->
                    <el-tooltip content="物流信息" placement="top" v-if="scope.row.status === 1">
                        <el-button
                            size="mini"
                            type="success"
                            icon="el-icon-message"
                            circle
                            @click="handleDetail(scope.$index,scope.row)"
                        />
                    </el-tooltip>
                    <el-tooltip content="申请退货" placement="top" v-if="scope.row.status == 0 || scope.row.status == 1">
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-check"
                            circle
                            @click="handlePost(scope.$index,scope.row)"
                        />
                    </el-tooltip>
                    <el-tooltip content="发货" placement="top" v-if="scope.row.status === 0">
                        <el-button
                            v-if="statusInfo == 1"
                            size="mini"
                            type="primary"
                            icon="el-icon-upload2"
                            circle
                            @click="handleReset(scope.$index,scope.row)"
                        />
                    </el-tooltip>
                    <el-tooltip content="取消订单" placement="top" v-if="statusInfo == 1">
                        <el-button
                            v-if="scope.row.status == 0 ||scope.row.status == 1 || scope.row.status == 2"
                            size="mini"
                            type="danger"
                            icon="el-icon-remove"
                            circle
                            @click="handleReturn(scope.$index,scope.row)"
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
            <el-col :offset="9" :span="3" style="margin-top: 1rem;line-height: 32px;">
                总积分：<span style="color: red">{{orderSums}}</span>
            </el-col>
        </el-row>

        <!--物流发货模态框-->
        <el-dialog
            width="40%"
            :close-on-click-modal="false"
            title="发货信息"
            center
            :visible.sync="dialogFormVisibleGoods"
            @close="closeDialog('goodsForm')"
        >
            <el-form ref="goodsForm" :model="goodsForm" :rules="goodsRule" label-width="100px" class="demo-ruleForm">
                <el-form-item label="订单编号:" prop="orderId" :label-width="formLabelWidth">
                    <el-input v-model="goodsForm.orderId" :disabled="true"/>
                </el-form-item>
                <el-form-item label="运单编号:" prop="logisticsNumber" :label-width="formLabelWidth">
                    <el-input v-model="goodsForm.logisticsNumber"/>
                </el-form-item>
                <el-form-item label="物流公司:" prop="logisticsCompany" :label-width="formLabelWidth">
                    <el-input v-model="goodsForm.logisticsCompany"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormGoods('goodsForm')">确 定</el-button>
      </span>
        </el-dialog>

        <!--    编辑模态框-->
        <el-dialog
            width="40%"
            :close-on-click-modal="false"
            title="编辑信息"
            center
            :visible.sync="dialogFormVisibleEdit"
            @close="closeDialog('editForm')"
        >
            <el-form ref="editForm" :model="editForm" :rules="editRule" label-width="100px" class="demo-ruleForm">
                <el-form-item label="收货人手机号:" prop="acceptMobile" :label-width="formLabelWidth">
                    <el-input v-model="editForm.acceptMobile"/>
                </el-form-item>
                <el-form-item label="收货人姓名:" prop="acceptName" :label-width="formLabelWidth">
                    <el-input v-model="editForm.acceptName"/>
                </el-form-item>
                <el-form-item label="配送地址:" prop="address" :label-width="formLabelWidth">
                    <el-input v-model="editForm.address"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditGoods('editForm')">确 定</el-button>
      </span>
        </el-dialog>

        <!--物流信息-->
        <el-dialog
            width="40%"
            :close-on-click-modal="false"
            title="物流信息"
            center
            class="wlInfo"
            :visible.sync="dialogFormVisibleDetail"
            @close="closeDialogDetail('infoForm')"
        >
            <el-timeline :reverse="reverse" v-if="haveInfo">
                <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.ftime"
                >
                    {{ activity.context }}
                </el-timeline-item>
            </el-timeline>
            <span v-else>暂无物流信息</span>
        </el-dialog>
    </div>
</template>

<script>
    import NProgress from 'nprogress'
    import moment from 'moment'
    import {formatDateTime} from '../../utils/index'
    import {
        orderList,
        GoodsAddress,
        orderDelete,
        downloadExcel,
        allGoods,
        orderExcelOut,
        backGoods,
        goodsInfo,
        orderExcelIn,
        unclearOrderList,
        unmatchedModel,
        unmatchedOrder,
        updateErrorList,
        returnGoods
    } from '../../api/modeList'

    export default {
        data() {
            var validatePass = (rule, value, callback) => {
                // 验证号码1，2
                // 手机号正则表达式
                const reg = /^1[3456789]\d{9}$/
                if (value === '') {
                    callback(new Error('号码不能为空'))
                } else if (!reg.test(value)) {
                    // 如果不符合手机号
                    callback(
                        new Error(
                            '请输入正确的手机号码'
                        )
                    )
                } else {
                    callback()
                }
            }
            return {
                filters: {
                    username: '',
                    mobile: null,
                    orderDealStatus: null,
                    startTime: null,
                    endTime: null,
                    orderId: null,
                    subOrderId: null
                },
                statusInfo: 0,
                userInfo: '',
                orderDealStatus: [
                    {
                        value: null,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '未发货'
                    }, {
                        value: 1,
                        label: '已发货'
                    },
                    {
                        value: 2,
                        label: '退货中'
                    },
                    {
                        value: 3,
                        label: '已退货'
                    }
                ],
                list: [],
                backNum: 0,
                // loading: false,
                listLoading: false,
                orderSum: 0,
                orderSums: 0,
                total: 0,
                size: 10,
                pageNo: 1,
                checkedAll: false, // 批量删除标识
                ids: [], // 批量删除id
                dialogFormVisibleGoods: false,
                goodsForm: {
                    orderId: '',
                    logisticsNumber: '',
                    logisticsCompany: ''
                },
                goodsRule: {
                    orderId: [
                        {required: true, message: '请输入订单编号', trigger: 'blur'},
                    ],
                    logisticsNumber: [
                        {required: true, message: '请输入运单编号', trigger: 'blur'}
                    ],
                    logisticsCompany: [
                        {required: true, message: '请输入物流公司', trigger: 'blur'}
                    ]
                },
                formLabelWidth: '120px',
                dialogFormVisibleEdit: false,
                editForm: {
                    orderId: '',
                    acceptMobile: '',
                    acceptName: '',
                    address: '',
                    placeTime: ''
                },
                editRule: {
                    acceptMobile: [
                        {required: true, message: '请输入收货人手机号'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    acceptName: [
                        {required: true, message: '请输入收货人姓名', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入配送地址', trigger: 'blur'}
                    ]
                },
                dialogFormVisibleDetail: false, // 物流模态框
                fileList: [], // 上传
                fileIn: [], // 导入
                reverse: false,
                activities: {
                    context: '',
                    ftime: ''
                },
                haveInfo: false,
                restaurants: [],
                sumPrice: 0, //总积分
                backPrice: 0,
            }
        },
        created() {

        },
        mounted() {
            this.statusInfo = sessionStorage.getItem('statusInfo');
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
            handleSelect(item) {

            },
            getList() { // 获取列标配数据
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
                    mobile: this.filters.mobile,
                    status: this.filters.orderDealStatus,
                    startTime: this.filters.startTime,
                    endTime: this.filters.endTime,
                    orderId: this.filters.orderId,
                    subOrderId: this.filters.subOrderId,
                    sysUserId: this.filters.sysUserId
                };
                NProgress.start();
                this.listLoading = true;
                orderList(param).then((res) => {
                    if (res.data.code === 0) {
                        const data = res.data.Data;
                        this.orderSums = (data.orderSum - data.declareSum) * 100;
                        this.list = data.page.records;
                        this.size = data.page.size;
                        this.total = data.page.total;
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
                            val.sumPrice = parseInt((val.sumAmount) * 100)
                            val.integralDeduction = parseInt((val.sumAmount) * 100) - parseInt(val.declareIntegral);
                            const placeTime = new Date(val.placeTime);
                            val.placeTime = formatDateTime(placeTime)
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

            handleEdit(index, row) { // 编辑
                this.dialogFormVisibleEdit = true;
                this.editForm = row
            },
            handlePost(index, row) { // 申请退货
                this.$confirm('此操作将申请退货, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const param = {
                        orderId: row.orderId,
                        status: 2
                    };
                    backGoods(param).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '退货成功',
                                duration: 1000
                            });
                            this.getList()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg,
                                duration: 1000
                            })
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退货'
                    })
                })
            },

            handleDelete(index, row) { // 删除订单
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const str = [];
                    str.push(row.orderId);
                    const param = {
                        orderIds: str
                    };
                    orderDelete(param).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 100
                            });
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg,
                                duration: 1000
                            })
                        }
                        this.getList()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },

            allDelete() { // 批量删除
                this.$confirm('此操作将永久删除当前选中申报记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const delAll = [];
                    this.multipleSelection.map(val => {
                        delAll.push(val.orderId)
                    });
                    const param = {
                        orderIds: delAll
                    }
                    orderDelete(param).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: res.data.msg,
                                duration: 1000
                            });
                            this.getList()
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg,
                                duration: 1000
                            })
                        }
                    })
                })
            },

            downLoad() { // 下载模板
                downloadExcel().then(response => {
                    const fileName = '物流模板';
                    const link = document.createElement('a');
                    const tourl = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
                    link.href = tourl;
                    link.target = '_blank';
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link)
                })
            },
            orderIn(e) { // 订单导入
                const formData = new FormData();
                formData.append('file', e.file);
                const rLoading = this.openLoading();
                orderExcelIn(formData).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '订单导入成功',
                            duration: 1000
                        })
                    } else if (res.data.code === 300) {
                        this.$confirm('订单未导入请查看订单是否重复', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '下载成功!'
                            });
                            let data = res.data.list;
                            let params = {
                                sysOrderEntitieList: data
                            }
                            unmatchedOrder(params).then((res) => {
                                const fileName = '未导入订单';
                                const link = document.createElement('a');
                                const tourl = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
                                link.href = tourl;
                                link.target = '_blank';
                                link.download = fileName;
                                document.body.appendChild(link);
                                link.click()
                                document.body.removeChild(link)
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消下载'
                            });
                        });
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
            orderOut() { // 订单导出
                const param = {
                    username: this.filters.username,
                    mobile: this.filters.mobile,
                    subOrderId: this.filters.subOrderId,
                    startTime: this.filters.startTime,
                    endTime: this.filters.endTime,
                    orderId: this.filters.orderId,
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
            allGoods(e) { // 批量发货
                const formData = new FormData();
                formData.append('file', e.file);
                const rLoading = this.openLoading();
                allGoods(formData).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '批量发货成功',
                            duration: 1000
                        })
                    } else if (res.data.code === 300) {
                        this.$confirm('数据异常或未匹配数据，请核对物流信息', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.$message({
                                type: 'success',
                                message: '下载成功!'
                            });
                            let data = res.data.list
                            let params = {
                                sysUserOrderEntityList: data
                            }
                            unmatchedModel(params).then((res) => {
                                const fileName = '异常物流反馈表';
                                const link = document.createElement('a');
                                const tourl = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
                                link.href = tourl;
                                link.target = '_blank';
                                link.download = fileName;
                                document.body.appendChild(link);
                                link.click()
                                document.body.removeChild(link)
                            })
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消下载'
                            });
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        })
                    }
                    rLoading.close();
                    this.getList();
                })
            },

            handleDetail(index, row) { // 查看物流信息
                this.dialogFormVisibleDetail = true;
                const param = {
                    orderId: row.orderId
                };
                goodsInfo(param).then((res) => {
                    if (res.data.code === 0) {
                        this.activities = res.data.Data;
                        this.haveInfo = true;
                    } else {
                        this.haveInfo = false;
                    }
                })
            },
            handleSelectionChange(val) {
                if (val.length > 0) {
                    this.checkedAll = true
                } else {
                    this.checkedAll = false
                }
                this.multipleSelection = val
            },
            handleReset(index, row) { // 发货
                this.goodsForm.orderId = row.orderId;
                this.dialogFormVisibleGoods = true
            },
            submitFormGoods(formName) { // 确定发货
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const param = {
                            orderId: this.goodsForm.orderId,
                            logisticsNumber: this.goodsForm.logisticsNumber,
                            logisticsCompany: this.goodsForm.logisticsCompany
                        };
                        GoodsAddress(param).then((res) => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '发货成功',
                                    duration: 1000
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg,
                                    duration: 1000
                                })
                            }
                            this.getList();
                            this.dialogFormVisibleGoods = false
                        })
                    } else {
                        return false;
                    }
                });
            },
            //编辑信息
            submitEditGoods(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const param = {
                            orderId: this.editForm.orderId,
                            acceptMobile: this.editForm.acceptMobile,
                            acceptName: this.editForm.acceptName,
                            address: this.editForm.address,
                            placeTime: moment(this.editForm.placeTime).format('YYYY-MM-DD HH:mm:ss'),
                        };
                        updateErrorList(param).then((res) => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功',
                                    duration: 1000
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg,
                                    duration: 2000
                                })
                            }
                            this.getList();
                            this.dialogFormVisibleEdit = false
                        })
                    } else {
                        return false;
                    }
                });
            },
            //订单取消
            handleReturn(index, row) {
                this.$confirm('此操作将取消订单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        orderId: row.orderId,
                        status: 3
                    };
                    returnGoods(params).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '订单取消成功',
                                duration: 2000
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg,
                                duration: 2000
                            })
                        }
                        this.getList();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    })
                })


            },
            closeDialog(formName) { // 关闭弹框
                this.dialogFormVisibleGoods = false;
                this.$refs[formName].resetFields()
            },
            closeDialogDetail() {
                this.dialogFormVisibleDetail = false;
                this.activities = '';
            },
            handleOrderIconClick() {
                this.filters.orderNo = ''
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
<style scoped lang="scss">

</style>
<style>
    .orderList .has-gutter tr th,
    .orderList .el-table--border th,
    .orderList .el-table__row td {
        text-align: center;
    }

    .orderList .el-table__row td:last-child {
        text-align: center;
    }

    .el-timeline-item {
        padding-bottom: 35px;
    }

    .el-timeline-item:first-child .el-timeline-item__node--normal {
        background-color: orange;
    }

    .wlInfo .el-dialog {

    }
</style>

