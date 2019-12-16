<template>
  <div style="padding:1rem">
    <el-col>
      <el-form :inline="true" :model="filters">
        <el-form-item label="账户查询:">
          <el-autocomplete
            @input="selectInput"
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
            v-model="filters.declarePhone"
            size="small"
            placeholder="客户手机号"
            icon="circle-close"
            :on-icon-click="handleOrderIconClick"
            @keyup.enter.native="search"
          />
        </el-form-item>
        <el-form-item label="核销日期:">
          <el-date-picker
            v-model="filters.beginTime"
            size="small"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
          -
          <el-date-picker
            v-model="filters.endTime"
            size="small"
            format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search()">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-refresh" @click="allSame()">批量同步</el-button>
        </el-form-item> -->

        <el-form-item style="margin-bottom: 0px">
          <el-button type="primary" size="small" icon="el-icon-download" @click="testExport()">导出</el-button>
        </el-form-item>

        <el-form-item style="color: red">
          <p style="padding: 0;margin: 0">注意事项：</p>
          <span>1、请查看手机号是否正确，确定请按操作的同步按钮</span><br>
          <span>2、如果对手机号未匹配有疑问，请到修改按钮处填写订单号再按操作的申请审核按钮，等待管理员审核，反馈未匹配原因</span><br>
          <span>3、上午11点后，未申报成功号码将进入申报号码异常记录列表，请及时查询，可在下午15点前做出修改重新申报</span>
        </el-form-item>
      </el-form>
    </el-col>

    <el-table
      v-loading="listLoading"
      :data="list"
      align="center"
      class="orderList declErrorTable"
      size="small"
      style="margin-top: 1rem"
      tooltip-effect="dark"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        width="55"
        type="selection"
      />
      <el-table-column prop="orderId" label="订单号"/>
      <el-table-column prop="declarePhone" label="申报手机号"/>
      <el-table-column prop="declareTime" label="核销日期"/>
      <el-table-column prop="remark" label="反馈信息"/>
      <el-table-column prop="declareTypeName" label="申报状态"/>
      <el-table-column prop="statusType" label="审核状态"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="更新" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.$index,scope.row)"
            />
          </el-tooltip>
          <el-tooltip v-if="scope.row.status !== 1 &&scope.row.status !== 2" content="审核申请" placement="top">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-check"
              circle
              @click="handleApply(scope.$index,scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="同步" placement="top">
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

    <!--    编辑模态框-->
    <el-dialog
      width="40%"
      :close-on-click-modal="false"
      title="更新信息"
      center
      :visible.sync="dialogFormVisibleEdit"
      @close="closeDialog('editForm')"
    >
      <el-form ref="editForm" :model="editForm" :rules="editRule" label-width="100px" class="demo-ruleForm">
        <el-form-item label="申报手机号:" prop="declarePhone" :label-width="formLabelWidth">
          <el-input v-model="editForm.declarePhone"/>
        </el-form-item>
        <el-form-item label="订单号:" prop="declareId" :label-width="formLabelWidth">
          <el-input v-model="editForm.orderId"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditGoods('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import NProgress from 'nprogress'
    import moment from 'moment'
    import {
        tbExcel,
        getAllError,
        declareExamine,
        synchronizationDeclare,
        updateDeclare,
        abnormalExc,
        unclearOrderList
    } from '../../api/modeList'

    export default {
        name: 'DeclError',
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
                    declarePhone: null,
                    beginTime: null,
                    endTime: null,
                    username: '',
                    sysUserId: null
                },
                listLoading: false,
                list: [],
                checkedAll: false,
                multipleSelection: [],
                multipleSelection2: [], // 批量同步
                total: 0,
                size: 10,
                pageNo: 1,
                dialogFormVisibleEdit: false,
                formLabelWidth: '100px',
                editForm: {
                    declareId: '',
                    declarePhone: '',
                    orderId: ''
                },
                editRule: {
                    declarePhone: [
                        {required: true, message: '请输入申报手机号'},
                        {validator: validatePass, trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            this.statusInfo = sessionStorage.getItem('statusInfo')
            this.getList()
        },
        methods: {
            search() {
                // 搜索 根据当前后台的逻辑搜索的时候永远将页码置于1
                this.pageNo = 1;
                this.getList();
            },
            querySearchAsync(queryString, cb) {
                let param = {
                    username: this.filters.username
                };
                unclearOrderList(param).then((res) => {
                    if (res.data.code === 0) {
                        this.restaurants = res.data.Data;
                        this.restaurants.map((val) => {
                            val.value = val.username;
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
                this.filters.sysUserId = item.id;
            },
            selectInput() {
                if (this.filters.username == '') {
                    this.filters.sysUserId = null
                }
            },
            getList() {
                if (this.filters.sysUserId == null) {
                    this.filters.sysUserId = null
                }
                if (this.filters.beginTime != null) {
                    this.filters.beginTime = moment(this.filters.beginTime).format('YYYY-MM-DD')
                }
                if (this.filters.endTime != null) {
                    this.filters.endTime = moment(this.filters.endTime).format('YYYY-MM-DD')
                }
                const params = {
                    currPage: this.pageNo,
                    pageSize: this.size,
                    username: this.filters.username,
                    beginTime: this.filters.beginTime,
                    endTime: this.filters.endTime,
                    declarePhone: this.filters.declarePhone,
                    sysUserId: this.filters.sysUserId
                };
                getAllError(params).then((res) => {
                    if (res.data.code === 0) {
                        const data = res.data.data
                        this.list = data.records
                        this.size = data.size
                        this.total = data.total
                        const len = this.list.length
                        if (len === 0 && this.pageNo > 1) {
                            this.pageNo -= 1
                            this.getList()
                        }
                        this.list.map(val => {
                            switch (val.declareType) {
                                case 1:
                                    val.declareTypeName = '申报中'
                                    break
                                case 2:
                                    val.declareTypeName = '申报成功'
                                    break
                                case 3:
                                    val.declareTypeName = '申报失败'
                                    break
                            }
                            switch (val.status) {
                                case 1:
                                    val.statusType = '审核中'
                                    break
                                case 2:
                                    val.statusType = '审核完成'
                                    break
                            }
                        })
                    } else {
                        this.total = 0
                        this.list = []
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        })
                    }
                    NProgress.done()
                    this.listLoading = false
                })
            },
            // 更新
            handleUpdate(index, row) {
                this.dialogFormVisibleEdit = true
                this.editForm.declareId = row.declareId
                this.editForm.declarePhone = row.declarePhone
                this.editForm.declareTime = row.declareTime
            },
            submitEditGoods(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const param = {
                            orderId: this.editForm.orderId,
                            declareId: this.editForm.declareId,
                            declarePhone: this.editForm.declarePhone,
                            declareTime: this.editForm.declareTime
                        }
                        updateDeclare(param).then((res) => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '更新成功',
                                    duration: 1000
                                })
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg,
                                    duration: 2000
                                })
                            }
                            this.getList()
                            this.dialogFormVisibleEdit = false
                        })
                    } else {
                        return false
                    }
                })
            },
            closeDialog(formName) { // 关闭弹框
                this.dialogFormVisibleEdit = false
                this.$refs[formName].resetFields()
            },
            // 审核申请
            handleApply(index, row) {
                const params = {
                    declareId: row.declareId,
                    status: 1,
                    declareTime: row.declareTime
                }
                declareExamine(params).then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            type: 'success',
                            message: res.data.msg,
                            duration: 2000
                        })
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 2000
                        })
                    }
                    this.getList()
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
                                duration: 2000
                            })
                        } else {
                            this.$message({
                                type: 'success',
                                message: '同步成功',
                                duration: 2000
                            })
                        }
                        this.getList()
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 2000
                        })
                        this.getList()
                    }
                })
            },
            // //批量同步
            // sameOrder() {
            //     const sameAll = [];
            //     this.multipleSelection2.map(val => {
            //         sameAll.push(val.declarePhone);
            //         sameAll.push(val.declareTime);
            //     });
            //     const param = {
            //         declarePhoneList: sameAll
            //     };
            //     tbExcel(param).then((res) => {
            //         if (res.data.code === 0) {
            //             if (res.data.Data === false) {
            //                 this.$message({
            //                     type: 'error',
            //                     message: '同步失败',
            //                     duration: 1000
            //                 })
            //             } else {
            //                 this.$message({
            //                     type: 'success',
            //                     message: '同步成功',
            //                     duration: 1000
            //                 })
            //             }
            //             this.getList()
            //         } else {
            //             this.$message({
            //                 type: 'error',
            //                 message: res.data.msg,
            //                 duration: 1000
            //             });
            //             this.getList()
            //         }
            //     })
            // },
            handleSelectionChange(val) {
                if (val.length > 0) {
                    this.checkedAll = true
                } else {
                    this.checkedAll = false
                }
                this.multipleSelection2 = val
            },
            handleOrderIconClick() {
                this.filters.username = '';
                this.filters.sysUserId = ''
            },
            // 分页
            handleCurrentChange(val) {
                this.pageNo = val
                this.getList()
            },
            // 分页显示条数
            handleSizeChange(val) {
                this.size = val
                this.getList()
            },
            // 申报异常导出
            testExport() {
                if (this.filters.sysUserId == null) {
                    this.filters.sysUserId = null
                }
                if (this.filters.beginTime != null) {
                    this.filters.beginTime = moment(this.filters.beginTime).format('YYYY-MM-DD')
                }
                if (this.filters.endTime != null) {
                    this.filters.endTime = moment(this.filters.endTime).format('YYYY-MM-DD')
                }
                console.log(this.filters.sysUserId)
                const param = {
                    beginTime: this.filters.beginTime,
                    endTime: this.filters.endTime,
                    declarePhone: this.filters.declarePhone,
                    sysUserId: this.filters.sysUserId
                };
                abnormalExc(param).then((res) => {
                    const fileName = '申报号码异常记录'
                    const link = document.createElement('a')
                    const tourl = window.URL.createObjectURL(new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}))
                    link.href = tourl
                    link.target = '_blank'
                    link.download = fileName
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                })
            }
        }
    }
</script>

<style scoped>

</style>
<style>
  .declErrorTable .el-table__body tbody tr td:nth-child(5) {
    color: red;
  }
</style>
