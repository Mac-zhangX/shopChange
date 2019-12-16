<template>
    <div style="padding:1rem">
        <div class="filter">
            <div>
                手机号&nbsp;&nbsp;
                <el-input v-model="Search" size="small" class="input1" placeholder="请输入内容"/>
            </div>
            <div>
                开始时间&nbsp;&nbsp;
                <el-date-picker
                    v-model="Start"
                    size="small"
                    class="input1"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                />
            </div>
            <div>
                结束时间&nbsp;&nbsp;
                <el-date-picker
                    v-model="End"
                    size="small"
                    class="input1"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                />
            </div>
            <div>
                核销日期&nbsp;&nbsp;
                <el-date-picker
                    v-model="declareTime"
                    size="small"
                    class="input1"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                />
            </div>
            <div>
                状态&nbsp;&nbsp;
                <el-select v-model="Status" size="small" class="input1" placeholder="请选择" @change="getList">
                    <el-option

                        key=""
                        label="全部"
                        value=""
                    />
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </div>
            <div>
                <el-button type="primary" size="small" icon="el-icon-search" @click="getList()">查询</el-button>
            </div>
            <div v-if="isShow">
                运营商&nbsp;&nbsp;
                <el-select v-model="Uid" size="small" class="input1" placeholder="请选择">
                    <el-option
                        key=""
                        label="全部"
                        value=""
                    />
                    <el-option
                        v-for="item in yylist"
                        :key="item.Id"
                        :label="item.Account"
                        :value="item.Id"
                    />
                </el-select>
            </div>
        </div>
        <el-form :inline="true">
            <el-form-item>
                <el-button v-if="checkedAll" size="small" class="el-icon-delete" type="danger" @click="delAll()">批量删除
                </el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-plus" @click="addDecl()">申报</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-download" @click="testExport()">导出</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" icon="el-icon-download" @click="exportE()">下载模板</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-refresh" @click="allSame()">批量同步</el-button>
            </el-form-item>
            <el-form-item>
                <el-upload
                    icon="el-icon-download"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :http-request="importE"
                    :on-change="handleChange"
                    :file-list="fileList"
                    :show-file-list="false"
                >
                    <el-button size="small" icon="el-icon-upload2" type="primary">导入</el-button>
                </el-upload>
            </el-form-item>
            <br>
            <el-form-item style="color: red">
                <p style="padding: 0;margin: 0">注意事项：</p>
                <span>1、核销时间即为用户兑换时间，申报号码即为兑换号码（强调下不是收货号码）</span>
                <br>
                <span>2、当天兑换成功的号码，必须在第二天上午11点之前申报进系统</span>
                <br>
                <span>3、上午11点后，未申报成功号码将进入申报号码异常记录列表，请及时查询，可在下午15点前做出修改重新申报</span>
            </el-form-item>
        </el-form>
        <div style="margin-top:1rem">
            <div class="mine">
                <!-- 表格 -->
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    size="small"
                    center
                    border
                    style="width: 100%"
                    tooltip-effect="dark"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" align="center"/>
                    <!--          <el-table-column prop="declareOrderNumber" label="申报订单号" />-->
                    <el-table-column prop="declarePhone" label="申报手机号" align="center"/>
                    <el-table-column prop="declareStartTime" label="申报时间" align="center"/>
                    <el-table-column prop="declareUpdateTime" label="修改时间" align="center"/>
                    <el-table-column prop="declareTypeName" label="申报状态" align="center"/>
                    <el-table-column prop="declareTime" label="核销日期" align="center"/>
                    <el-table-column prop="endTime" label="结束时间" align="center"/>
                    <el-table-column prop="username" label="操作人" align="center"/>
                    <el-table-column align="center" prop="handle" label="操作" class="make">
                        <template slot-scope="scope">

                            <el-tooltip v-if="scope.row.declareType!=2" content="编辑" placement="top">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-edit"
                                    circle
                                    @click="edit(scope.row)"
                                />
                            </el-tooltip>

                            <el-tooltip v-if="scope.row.declareType!=2" content="删除" placement="top">
                                <el-button
                                    size="mini"
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle
                                    @click="del(scope.row)"
                                />
                            </el-tooltip>
                            <el-tooltip v-if="scope.row.declareType ==1 || scope.row.declareType == 3" content="同步"
                                        placement="top">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-refresh"
                                    circle
                                    @click="sameOrder(scope.row)"
                                />
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-pagination
                :page-sizes="[10,20, 50, 100]"
                :page-size="listQuery.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
            <!-- 修改编辑状态 -->
            <div class="show">
                <el-dialog
                    width="40%"
                    :close-on-click-modal="false"
                    :title="diaTitle"
                    :visible.sync="dialogFormVisible"
                    @close="closeDialog"
                >
                    <el-form
                        ref="ruleForm"
                        :model="goods"
                        :rules="rules1"
                        label-width="100px"
                        class="demo-ruleForm"
                    >
                        <el-form-item label="申报号码" prop="declarePhone">
                            <el-input v-model="goods.declarePhone" placeholder="请输入申报手机号"/>
                        </el-form-item>
                        <br>
                        <el-form-item label="核销日期" prop="declareTime">
                            <el-date-picker
                                v-model="goods.declareTime"
                                format="yyyy-MM-dd"
                                type="date"
                                placeholder="选择核销日期"
                            />
                        </el-form-item>
                        <!--            <br>-->
                        <!--            <el-form-item label="修改内容" prop="declarePhone">-->
                        <!--              <el-input v-model="goods.reviseContent" placeholder="请输入申报手机号" />-->
                        <!--            </el-form-item>-->
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="closeDialog()">取 消</el-button>
                        <el-button type="primary" @click="confirm('ruleForm')">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
            <!-- 1 -->
            <!-- 显示模态框 -->
            <el-dialog :title="declT" width="40%" :visible.sync="tableVisible">
                <div class="tbStyle">
                    <el-table size="mini" height="400" :data="tableData2">
                        <el-table-column property="declarePhone" label="手机号"/>
                        <el-table-column property="declareTime" label="核销日期"/>
                    </el-table>
                </div>
                <div v-if="declT=='申报详情'" style="margin-top: 1rem;">总条数：<span style="color:red"> {{ totalCount }}</span>
                </div>
                <el-row>
                    <el-col :span="8" v-if="declT=='异常数据'" style="margin-top: 1rem;">
                       异常数据总条数：<span style="color:red"> {{ totalCount }}</span>
                    </el-col>
                    <el-col :span="16" v-if="msgShow" style="margin-top: 1rem;">
                        导入失败原因：<span style="color: red;font-weight: 600">{{msgInfo}}</span>
                    </el-col>
                </el-row>


                <div slot="footer" class="dialog-footer">
                    <el-button @click="tableVisible = false">取 消</el-button>
                    <el-button v-if="declT=='申报详情'" type="primary" @click="declSubmit()">提交</el-button>
                    <el-button v-if="declT=='异常数据'" type="primary" @click="downLoad()">下载excel</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>

    import {UrlHelper} from '../../api/urlHelper'
    import Pagination from '../../components/Pagination'
    import moment from 'moment'
    import {getDateDiff, donateTimeDiff, getform} from '../../api/config'
    import {
        decl,
        updateDecl,
        delDecl,
        downloadMB,
        uploadEx,
        declAll,
        declList,
        sbExcel,
        tbExcel,
        errorExcelDow
    } from '../../api/modeList'

    export default {
        // 分页
        components: {
            Pagination
        },
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
                declT: '', // 申报标题
                declData: [],
                totalCount: 0,
                tableVisible: false, // 表格的model
                checkedAll: false, // 批量标识
                checkedAll2: false, // 批量标识

                yylist: [],
                input: '',
                diaTitle: '',
                tableData2: [], // 导入列表的数据
                tableData: [],
                coreLevel: [], // 积分档数据
                packages: [], // 获取套餐当
                multipleSelection: [],
                multipleSelection2: [], // 批量同步
                currentPage4: 4,
                total: 0,
                listQuery: {
                    page: 1,
                    limit: 10,
                    importance: undefined,
                    title: undefined,
                    type: undefined,
                    sort: '+id'
                },
                // 模态框
                dialogFormVisible: false,
                ruleForm: {
                    dhnumbe: '',
                    sbnumbe: '',
                    gid: '',
                    sid: '',
                    sflag: ''
                },
                rules1: {
                    declarePhone: [
                        {required: true, message: '申报手机号不能为空'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    declareTime: [
                        {required: true, message: 'h核销日期不能为空', trigger: 'blur'}
                    ]
                },
                Start: null, // 起始时间
                End: null, // 结束时间
                Search: null, // 查询手机号
                Status: null, // 状态
                declareTime: null, // 核销日期
                Uid: '', // 运营商唯一id
                options: [
                    {value: '1', label: '申报中'},
                    {value: '2', label: '申报成功'},
                    {value: '3', label: '申报失败'}
                ],
                isShow: false,
                fileList: [],
                goods: { // 申报商品
                    declarePhone: '', // 申报号码
                    declareTime: '', // 核销日期
                    reviseContent: '',  //修改内容
                },
                msgInfo: '',
                msgShow: false,


            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            // 初始化时间
            init() {
                // 初始化时间
                const date = new Date()
                this.Start = moment(date).format('YYYY-MM-DD 00:00:00')
                this.End = moment(date).format('YYYY-MM-DD 23:59:59')
                this.declareTime = moment(date).format('YYYY-MM-DD')
                // 获取用户的权限
                const authorities = window.localStorage.getItem('authorities')
                if (authorities === 'admin') {
                    this.getyylist()
                    this.isShow = true
                } else {
                    this.isShow = false
                }
            },
            // 获取所有的运营商信息
            getyylist() {
                // 查询所有的订单信息
                this.$axios.post(UrlHelper.operatorManage.getList).then(val => {
                    if (val.data.Code === 200) {
                        // 如果请求成功
                        this.yylist = val.data.Data
                    } else {
                        this.$message({
                            type: 'error',
                            message: val.data.Msg
                        })
                    }
                })
            },
            // 获取积分档
            getCoreLevel() {
                this.$axios.post(UrlHelper.declInfo.queryCoreLevel).then(val => {
                    if (val.status === 200) {
                        this.coreLevel = val.data // 积分档
                    }
                })
            },
            // 获取套餐名称
            getPackageName() {
                this.$axios.post(UrlHelper.declInfo.queryPackageClass).then(val => {
                    this.packages = val.data // 套餐档
                })
            },
            // 分页
            getList() {
                let startTime = ''
                let endTime = ''
                let declareTime = ''
                if (this.Start !== null && this.Start !== '' && this.Start !== undefined) {
                    startTime = moment(this.Start).format('YYYY-MM-DD 00:00:00')
                }
                if (this.Start == null) {
                    startTime = ''
                }
                if (this.End == null) {
                    endTime = ''
                }
                if (this.End !== null && this.End !== '' && this.End !== undefined) {
                    endTime = moment(this.End).format('YYYY-MM-DD 23:59:59')
                }
                if (this.declareTime == null) {
                    declareTime = ''
                }
                if (this.declareTime !== null && this.declareTime !== '' && this.declareTime !== undefined) {
                    declareTime = moment(this.declareTime).format('YYYY-MM-DD')
                }
                const obj = {
                    currPage: this.listQuery.page,
                    pageSize: this.listQuery.limit,
                    declareType: this.Status,
                    declarePhone: this.Search,
                    beginTime: startTime,
                    endTime: endTime,
                    declareTime: declareTime
                }
                const rLoading = this.openLoading()
                this.tableData = []
                declList(obj).then(res => {
                    if (res.data.code === 0) {
                        res.data.list.map(val => {
                            if (val.declareStartTime !== '' && val.declareStartTime !== null) {
                                val.declareStartTime = moment(val.declareStartTime).format('YYYY-MM-DD HH:mm:ss')
                            }
                            if (val.declareUpdateTime !== '' && val.declareUpdateTime !== null) {
                                val.declareUpdateTime = moment(val.declareUpdateTime).format('YYYY-MM-DD HH:mm:ss')
                            }
                            if (val.declareType === 1) {
                                val.declareTypeName = '申报中'
                                val.timeId = setInterval(() => {
                                    // 开始时间
                                    const first = new Date(val.declareTime).getTime()
                                    // 当前时间
                                    const now = new Date().getTime()
                                    // 设置时长
                                    const long = 41 * 60 * 60 * 1000
                                    // 距离结束
                                    const len = long - (now - first)

                                    if (len <= 1000) {
                                        clearInterval(val.timeId)
                                    } else {
                                        val.endTime = getform(len)
                                    }
                                }, 1000)
                            } else if (val.declareType === 2) {
                                val.declareTypeName = '申报成功'
                            } else if (val.declareType === 3) {
                                val.declareTypeName = '申报失败'
                            }
                            this.tableData.push(val)
                        })
                        this.total = res.data.total;
                        const len = this.tableData.length;
                        if (len === 0 && this.listQuery.page > 1) {
                            this.listQuery.page -= 1;
                            this.getList()
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        })
                    }
                    rLoading.close()
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
                if (val.length > 0) {
                    this.checkedAll = true;
                    this.checkedAll2 = true
                } else {
                    this.checkedAll = false;
                    this.checkedAll2 = false
                }
                this.multipleSelection = val;
                this.multipleSelection2 = val
            },
            addMessage() {
                this.diaTitle = '新增申报信息';
                this.dialogFormVisible = true
            },
            edit(data) {
                this.diaTitle = '编辑申报信息';
                this.goods = {
                    declareId: data.declareId,
                    declarePhone: data.declarePhone, // 申报号码
                    declareTime: data.declareTime // 核销日期
                }
                this.dialogFormVisible = true
            },
            // 清空验证的方法
            closeDialog() {
                // 关闭模态框事件
                this.goods = {
                    declareId: '',
                    declarePhone: '', // 申报号码
                    declareTime: '' // 核销日期
                } // 清空模态框数据
                this.resetForm('ruleForm')
                this.dialogFormVisible = false
            },
            resetForm(formName) {
                // 清除验证
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields()
                }
            },
            handleChange() {

            },
            importE(e) { // 导入文件的方法
                this.msgInfo = '';
                this.msgShow = false;
                const formData = new FormData()
                formData.append('file', e.file)
                const rLoading = this.openLoading()
                uploadEx(formData).then(res => {
                    if (res.data.code === 0) {
                        this.declT = '申报详情'
                        // this.$message({
                        //   type: 'success',
                        //   message: res.data.msg,
                        //   duration: 3000
                        // })
                        this.tableVisible = true
                        this.tableData2 = res.data.Data
                        this.totalCount = res.data.Data.length
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            showClose: true,
                            duration: 0
                        })
                    }
                    rLoading.close()
                })
            },
            testExport() {
                let startTime = ''
                let endTime = ''
                if (
                    this.Start !== null &&
                    this.Start !== '' &&
                    this.Start !== undefined
                ) {
                    startTime = moment(this.Start).format('YYYY-MM-DD 00:00:00')
                }
                if (this.Start == null) {
                    startTime = ''
                }
                if (this.End == null) {
                    endTime = ''
                }
                if (this.End !== null && this.End !== '' && this.End !== undefined) {
                    endTime = moment(this.End).format('YYYY-MM-DD 23:59:59')
                }
                const param = {
                    beginTime: startTime,
                    endTime: endTime,
                    declareType: this.Status
                }
                sbExcel(param).then((res) => {
                    const fileName = '申报表';
                    const link = document.createElement('a')
                    const tourl = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
                    link.href = tourl;
                    link.target = '_blank';
                    link.download = fileName;
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                })
            },
            addDecl() {
                this.diaTitle = '申报';
                this.dialogFormVisible = true
            },
            confirm(formName) { // 提交申报信息
                // 确认申报之前进行验证
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.diaTitle === '申报') {
                            const rLoading = this.openLoading()
                            const param = {
                                declarePhone: this.goods.declarePhone,
                                declareTime: moment(this.goods.declareTime).format('YYYY-MM-DD') // 核销日期
                            }
                            decl(param).then(res => {
                                if (res.data.code === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: res.data.msg,
                                        duration: 2000
                                    })
                                    this.getList()
                                    this.dialogFormVisible = false
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.data.msg,
                                        duration: 3000
                                    })
                                }
                                rLoading.close()
                            })
                        } else if (this.diaTitle === '编辑申报信息') {
                            const rLoading = this.openLoading()
                            updateDecl(this.goods).then(res => {
                                if (res.data.code === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: res.data.msg,
                                        duration: 1000
                                    })
                                    this.dialogFormVisible = false
                                    this.getList()
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.data.msg,
                                        duration: 1000
                                    })
                                }
                                rLoading.close()
                            })
                        }
                    }
                })
            },
            del(data) { // 单条件删除
                this.$confirm('此操作将永久删除当前申报记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        const obj = {
                            declareIds: [data.declareId]
                        }
                        const rLoading = this.openLoading()
                        delDecl(obj).then(res => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.data.msg,
                                    duration: 1000
                                })
                                this.getList()
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg,
                                    duration: 1000
                                })
                            }
                            rLoading.close()
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            delAll() { // 批量删除
                this.$confirm('此操作将永久删除当前选中申报记录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    .then(() => {
                        const arr = []
                        this.multipleSelection.map(val => {
                            arr.push(val.declareId)
                        })
                        const obj = {
                            declareIds: arr
                        }
                        const rLoading = this.openLoading()
                        delDecl(obj).then(res => {
                            if (res.data.code === 0) {
                                rLoading.close()
                                this.$message({
                                    type: 'success',
                                    message: res.data.msg,
                                    duration: 1000
                                })
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
                        message: '已取消删除'
                    })
                })
            },

            // 同步
            sameOrder(row) {
                const param = {
                    listDeclare: [{
                        declarePhone: row.declarePhone,
                        declareTime: row.declareTime,
                        sysUserId: row.sysUserId,
                    }]
                }
                tbExcel(param).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.Data == false) {
                            this.$message({
                                type: 'error',
                                message: '同步失败',
                                duration: 1000
                            })
                        } else {
                            this.$message({
                                type: 'success',
                                message: '同步成功',
                                duration: 1000
                            })
                        }
                        this.getList()
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        })
                        this.getList()
                    }
                })
            },
            allSame() {
                const sameAll = [];
                this.multipleSelection2.map(val => {
                    let obj = {
                        declarePhone: val.declarePhone,
                        declareTime: val.declareTime,
                        sysUserId: val.sysUserId,
                    };
                    sameAll.push(obj)
                });
                const param = {
                    listDeclare: sameAll
                };
                tbExcel(param).then((res) => {
                    if (res.data.code === 0) {
                        if (res.data.Data === false) {
                            this.$message({
                                type: 'error',
                                message: '同步失败',
                                duration: 1000
                            })
                        } else {
                            this.$message({
                                type: 'success',
                                message: '同步成功',
                                duration: 1000
                            })
                        }
                        this.getList()
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        })
                        this.getList()
                    }
                })
            },
            exportE() {
                const rLoading = this.openLoading()
                downloadMB().then(response => {
                    rLoading.close()
                    const fileName = '申报模板'
                    const link = document.createElement('a')
                    const tourl = window.URL.createObjectURL(new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
                    link.href = tourl
                    link.target = '_blank'
                    link.download = fileName
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                })
            },
            declSubmit() {
                const arr = []
                this.tableData2.map(val => {
                    const obj = {
                        declarePhone: '',
                        declareTime: ''
                    }
                    obj.declarePhone = val.declarePhone;
                    obj.declareTime = val.declareTime;
                    arr.push(obj)
                })
                const rLoading = this.openLoading();
                declAll(arr).then(res => {
                    if (res.data.code === 0) {
                        rLoading.close();
                        this.tableVisible = false;
                        this.getList()
                    } else if (res.data.code === 300) {
                        this.getList()
                        this.tableVisible = false
                        rLoading.close()
                        this.$confirm('已申报的号码当天不能重复申报', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.msgShow = true;
                            this.msgInfo = res.data.msg

                            this.declT = '异常数据';
                            // 出现300进行提示
                            this.tableVisible = true
                            this.tableData2 = res.data.errorData.concat(res.data.repetitionData)
                            this.totalCount = res.data.errorData.length + res.data.repetitionData.length
                            const data = res.data.errorData
                            const repetitionListDeclare = res.data.repetitionData
                            this.declData = {
                                listDeclare: data,
                                repetitionListDeclare: repetitionListDeclare
                            }
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 2000
                        })
                        this.tableVisible = false;
                        this.getList()
                    }
                })
            },
            // 分页
            handleCurrentChange(val) {
                this.listQuery.page = val
                this.getList()
            },
            // 分页显示条数
            handleSizeChange(val) {
                this.listQuery.limit = val
                this.getList()
            },
            downLoad() {
                const rLoading = this.openLoading()
                console.log(this.declData, this.tableData2)
                const data = this.declData
                errorExcelDow(data).then((res) => {
                    const fileName = '异常数据列表'
                    const link = document.createElement('a')
                    const tourl = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
                    link.href = tourl
                    link.target = '_blank'
                    link.download = fileName
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    rLoading.close()
                    this.tableVisible = false
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .pagination-container {
        padding: 0 0;
    }

    .ulItem li {
        list-style: none;
    }

    // 主要内容
    .mine {
        height: 100%;
        background: #fff;
        margin: 15px 15px 0px 0px;
        border-radius: 5px;
    }

    // 按钮
    .btn .el-button {
        margin-top: 20px;
        // margin-left: 5px;
        span:first-child {
            font-size: 18px;
            font-weight: 700;
            margin-right: 3px;
        }

        span:last-child {
            font-size: 14px;
        }
    }

    // 表格
    .el-table {
        width: 100%;
    }

    // 模态框
    .el-select {
        width: 100%;
    }

    .cell span {
        color: rgb(132, 132, 204);
        cursor: pointer;
    }

    .filter {
        display: flex;
        flex-direction: row;
        margin-bottom: 1rem;

        > div {
            margin-right: 1rem;
        }
    }

    .input1 {
        width: 140px;
    }

    .info1 {
        display: flex;
        justify-content: flex-start;

        .el-button {
            margin-right: 1rem;
        }

    }

    .el-button + .el-button {
        margin-left: 0px;
    }

    /deep/ .el-dialog__body {
        padding: 10px 20px;
    }

    /deep/ .el-form-item {
        margin-bottom: 0px;
    }

</style>

