<template>
  <div style="padding:1rem">
    <el-col>
      <el-form :inline="true" :model="filters">
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
        <el-form-item label="审核状态:">
          <el-select v-model="filters.orderDealStatus" placeholder="请选择" @change="search">
            <el-option v-for="item in orderDealStatus" :key="item.id" :label="item.label" :value="item.value">{{
              item.label }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table
      v-loading="listLoading"
      :data="list"
      align="center"
      class="orderListItem"
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
      <el-table-column prop="orderId" label="订单号" align="center" />
      <el-table-column prop="declarePhone" label="申报手机号" align="center" />
      <el-table-column prop="declareTime" label="核销日期" align="center" />
      <el-table-column prop="remark" label="反馈信息" align="center"  />
      <el-table-column prop="declareTypeName" label="申报状态" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
              @click="handleUpdate(scope.$index,scope.row)"
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
      title="审核原因"
      center
      :visible.sync="dialogFormVisibleEdit"
      @close="closeDialog('editForm')"
    >
      <el-form ref="editForm" :model="editForm" :rules="editRule" label-width="100px" class="demo-ruleForm">
        <el-form-item label="审核原因:" prop="remark" :label-width="formLabelWidth">
          <span class="circle"></span><span class="text">限制 {{remnant}} / 50 字以内</span>
          <el-input type="textarea" v-model="editForm.remark" maxlength="50" @input = "descInput"></el-input>
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
    import {completeList,completeExamine} from '../../api/modeList'
    export default {
        name: "declError",
        data() {
            return {
                filters: {
                    mobile: null,
                    orderDealStatus: 1,
                },
                orderDealStatus: [
                    {
                        value: 1,
                        label: '审核中'
                    }, {
                        value: 2,
                        label: '审核完成'
                    },
                ],
                listLoading: false,
                list: [],
                checkedAll: false,
                total: 0,
                size: 10,
                pageNo: 1,
                dialogFormVisibleEdit: false,
                editForm:{
                    remark:'',
                },
                editRule:{
                    remark: [
                        {required: true, message: '请输入审核原因', trigger: 'blur'},
                    ],
                },
                formLabelWidth: '100px',
                remnant:50,//倒计数
            }
        },
        mounted() {
            this.statusInfo = sessionStorage.getItem('statusInfo');
            console.log(this.statusInfo)
            this.getList()
        },
        methods: {
            search() {
                // 搜索 根据当前后台的逻辑搜索的时候永远将页码置于1
                this.pageNo = 1;
                this.getList()
            },
            getList() {
                let params = {
                    currPage: this.pageNo,
                    pageSize: this.size,
                    declarePhone: this.filters.mobile,
                    status: this.filters.orderDealStatus,

                };
                completeList(params).then((res) => {
                    if (res.data.code === 0) {
                        const data = res.data.list;
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
                                case 1:
                                    val.declareTypeName = '审核中';
                                    break;
                                case 2:
                                    val.declareTypeName = '申报完成';
                                    break;
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
            //编辑
            handleUpdate(index,row) {
                this.dialogFormVisibleEdit = true;
                this.editForm.declareId = row.declareId;
            },
            //倒计数
            descInput(){
                var txtVal = this.editForm.remark.length;
                this.remnant = 50-txtVal;
            },
            //编辑审核原因
            submitEditGoods(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const param = {
                            remark: this.editForm.remark,
                            declareId: this.editForm.declareId,
                            status:2
                        };
                        completeExamine(param).then((res) => {
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
            closeDialog(formName) { // 关闭弹框
                this.dialogFormVisibleEdit = false;
                this.$refs[formName].resetFields()
            },
            handleSelectionChange() {

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

<style scoped>

</style>
<style>
  .orderListItem .el-table__body tbody tr td:nth-child(5)  {
    color: red;
  }
</style>
