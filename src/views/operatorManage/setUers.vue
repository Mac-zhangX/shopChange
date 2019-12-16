<template>
  <div style="padding: 1rem">
    <!--  工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
      <el-form v-model="filters" :inline="true">
        <el-form-item label="用户名:">
          <el-input v-model="filters.username" size="small" placeholder="用户名" icon="circle-close"
                    :on-icon-click="handleOrderIconClick" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" v-if="{}" v-on:click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-plus" type="primary" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--    列表-->
    <el-table :data="dataList" border size="small" tooltip-effect="dark" highlight-current-row v-loading="listLoading"
              style="width: 100%;margin-top: 1rem">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="用户名" width="100"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
      <el-table-column prop="roleType" label="角色类型" width="150"></el-table-column>
      <el-table-column prop="statusName" label="账户状态" width="100"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleReset(scope.$index, scope.row)">重置密码
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar" style="margin-bottom: 2rem">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10,20, 50, 100]"
        :page-size=size
        layout="total, sizes, prev, pager, next, jumper"
        :total=total>
      </el-pagination>
    </el-col>

    <!--模态窗-->
    <el-dialog width="40%"
               :close-on-click-modal="false"
               title='添加用户'
               :visible.sync="dialogFormVisibleAdd"
               @close="closeDialog('addForm')">
      <el-form ref="addForm" :model="addForm" :rules="addRules" class="demo-ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username" style/>
        </el-form-item>
        <el-form-item label="用户手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" style/>
        </el-form-item>
        <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" style/>
        </el-form-item>
        <el-form-item label="账户状态" :label-width="formLabelWidth" prop="status">
          <el-select placeholder="请选择" v-model="addForm.status" >
            <el-option v-for="item in Status" :label="item.label" :value="item.value">{{item.label}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="type">
          <el-select placeholder="请选择" v-model="addForm.type" >
            <el-option v-for="item in type" :label="item.description" :value="item.id">{{item.description}}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editAddForm('addForm')">取 消</el-button>
          <el-button type="primary" @click="submitFormAdd('addForm')">确 定</el-button>
      </span>
    </el-dialog>

<!--编辑-->
    <el-dialog width="40%"
               :close-on-click-modal="false"
               title='编辑用户'
               :visible.sync="dialogFormVisibleEdit"
               @close="closeDialog('ruleForm')">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="ruleForm.username" style/>
        </el-form-item>
        <el-form-item label="用户手机号" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="ruleForm.mobile" style/>
        </el-form-item>
        <el-form-item label="账户状态" :label-width="formLabelWidth" prop="status">
          <el-select placeholder="请选择" v-model="ruleForm.status" >
            <el-option v-for="item in Status" :key="item.id" :label="item.label" :value="item.value">{{item.label}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="type">
<!--          <el-select placeholder="请选择" v-model="ruleForm.type" :disabled="isDisabled">-->
<!--            <el-option v-for="item in type" :key="item.id" :label="item.description" :value="item.id">{{item.description}}-->
<!--            </el-option>-->
<!--          </el-select>-->
          <el-input v-model="ruleForm.typeName" :disabled="true" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editReviseForm('ruleForm')">取 消</el-button>
          <el-button type="primary" @click="submitFormEdit('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>

<!--重置密码-->
    <el-dialog width="40%"
               :close-on-click-modal="false"
               title='重置密码'
               center
               :visible.sync="dialogFormVisibleReset"
               @close="closeDialog('resetForm')">
      <span>临时密码：</span> {{resetPassword}}
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFormReset('resetForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<script>
    import NProgress from 'nprogress'
    import {userBtnList, userOrderList,addUser,updateUser,delUser,resetPsd,roleAll} from "../../api/modeList";
    import {formatDateTime} from '../../utils/index'

    export default {
        name: "setUers",

        data() {
            var validatePass = (rule, value, callback) => {
                console.log('验证触发了吗', value)
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
            };
            return {
                filters: {
                    mobile: '',
                    createTime: '',
                    updateTime: '',
                    status: '',
                },
                userMenu: [],
                dataList: [],
                listLoading: false,
                total: 0,
                size: 10,
                pageNo: 1,
                dialogFormVisibleAdd: false,
                dialogFormVisibleEdit: false,  //编辑
                dialogFormVisibleReset: false, //重置
                resetPassword: '',
                //编辑
                ruleForm: {
                    id:'',
                    username: '',
                    mobile: '',
                    status: '',
                    type:'',
                    typeName: ''
                },
                //添加用户
                addForm: {
                    username: '',
                    mobile: '',
                    password: '',
                    status: '',
                    type:'',
                },
                Status: [    //超级管理员
                    {
                        value: '0',
                        label: '禁用'
                    }, {
                        value: '1',
                        label: '启用'
                    }
                ],
               type:[],
                isDisabled: false,
                rules: {
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                    ],
                    mobile: [
                        { required: true, message: '请输入用户手机号', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择用户状态', trigger: 'change' },
                    ],
                    type: [
                        { required: true, message: '请选择角色类型', trigger: 'change' },
                    ],
                },
                addRules: {
                    username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                    ],
                    mobile: [
                        { required: true, message: '请输入用户手机号', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }

                    ],
                    password: [
                        { required: true, message: '请输入用户密码', trigger: 'blur' },
                    ],
                    status: [
                        { required: true, message: '请选择用户状态', trigger: 'change' },
                    ],
                    type: [
                        { required: true, message: '请选择角色类型', trigger: 'change' },
                    ],
                },
                formLabelWidth: '100px',
            }
        },
        methods: {
            BtnList() {
                const formData = new FormData();
                const btnId = window.localStorage.getItem('btnId');
                formData.append('menuId', btnId);
                userBtnList(formData).then((res) => {

                })
            },
            getAllRole() {
                roleAll().then((res) => {
                    if(res.data.code === 0) {
                        this.type = res.data.roles;
                    }
                })
            },
            search(){
                //搜索 根据当前后台的逻辑搜索的时候永远将页码置于1
                this.pageNo =1;
                this.orderList();
            },
            orderList() {
                const formData = new FormData();
                formData.append('currPage', this.pageNo);
                formData.append('pageSize', this.size);
                let param = {
                    currPage: this.pageNo,
                    pageSize: this.size,
                    username: this.filters.username,
                };
                NProgress.start();
                this.listLoading = true;
                userOrderList(param).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.Data;
                        this.dataList = data.records;
                        this.dataList.map(val => {
                            switch (val.status) {
                                case 0:
                                    val.statusName = '禁用';
                                    break;
                                case 1:
                                    val.statusName = '启用';
                                    break;
                            }
                            switch (val.type) {
                                case 1:
                                    val.typeName = '超级管理员';
                                    break;
                                case 2:
                                    val.typeName = '代理';
                                    break;
                                case 3:
                                    val.typeName = '操作员';
                                    break;
                            }
                            let createTime =  new Date(val.createTime);
                            val.createTime = formatDateTime(createTime);
                            let updateTime =  new Date(val.updateTime);
                            val.updateTime = formatDateTime(updateTime)
                        });
                        this.size = data.size;
                        this.total = data.total;
                        // this.pageNo = data.pages;
                        const len = this.dataList.length;
                        if (len === 0 && this.pageNo > 1) {
                            this.pageNo -= 1;
                            this.getList()
                        }
                    }
                    this.listLoading = false;
                    NProgress.done();
                })
            },
            //添加
            handleAdd() {
                this.dialogFormVisibleAdd = true;
            },
            //取消添加
            editAddForm(formName) {  //取消
                this.dialogFormVisibleAdd = false;
                this.$refs[formName].resetFields();
            },
            //添加
            submitFormAdd(formName) {  //确定
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let param = {
                            username: this.addForm.username,
                            mobile: this.addForm.mobile,
                            password: this.addForm.password,
                            status: parseInt(this.addForm.status),
                            type: this.addForm.type
                        };
                        addUser(param).then((res) => {
                            if(res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功',
                                    duration: 1000
                                });
                                this.orderList();
                                this.dialogFormVisibleAdd = false;
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg,
                                    duration: 1000
                                });
                            }
                        })

                    } else {
                        return false;
                    }
                });
            },
            //编辑
            handleEdit(index, row) {
                this.dialogFormVisibleEdit = true;
                this.ruleForm.id = row.id;
                this.ruleForm.username = row.username;
                this.ruleForm.mobile = row.mobile;
                this.ruleForm.status = row.status +'';
                this.ruleForm.type = row.type;
                switch (row.type) {
                    case 1:
                        this.ruleForm.typeName = '超级管理员';
                        break;
                    case 2:
                        this.ruleForm.typeName = '代理';
                        break;
                    case 3:
                        this.ruleForm.typeName = '操作员';
                        break;
                }
            },
            //确认编辑
            submitFormEdit(formName) {  //确定
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let param = {
                            id: this.ruleForm.id,
                            username: this.ruleForm.username,
                            mobile: this.ruleForm.mobile,
                            status: parseInt(this.ruleForm.status),
                            type: parseInt(this.ruleForm.type)
                        };
                        updateUser(param).then((res) => {
                            if(res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功',
                                    duration: 1000
                                });
                                this.orderList();
                                this.dialogFormVisibleEdit = false;
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg,
                                    duration: 1000
                                });
                                this.orderList();
                                this.dialogFormVisibleEdit = false;
                            }
                        })

                    } else {
                        return false;
                    }
                });
            },
            //取消编辑
            editReviseForm(formName) {
                this.dialogFormVisibleEdit = false;
                this.ruleForm.username = '';
                this.ruleForm.mobile = '';
                this.ruleForm.status = '';
                this.ruleForm.type = '';
                this.$refs[formName].resetFields();
            },
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let str = [ ];
                    str.push(row.id);
                    let param = {
                        userIds: str
                    };
                    delUser(param).then((res) => {
                        if(res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 100
                            });
                            this.orderList();
                        }else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg,
                                duration: 100
                            });
                            this.orderList();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //重置密码
            handleReset(idnex, row) {
                this.dialogFormVisibleReset = true;
                let param = {
                    id: row.id
                };
                resetPsd(param).then((res) => {
                    if (res.data.code === 0) {
                        this.resetPassword = res.data.psd
                    }
                })
            },
            submitFormReset() {
                this.dialogFormVisibleReset = false;
            },
            handleOrderIconClick() {

            },
            closeDialog(formName) {  //关闭
                this.dialogFormVisible = false;
                this.$refs[formName].resetFields();
                this.ruleForm.username = '';
                this.ruleForm.mobile = '';
                this.ruleForm.status = '';
                this.ruleForm.type = '';
            },

            //分页
            handleCurrentChange(val) {
                this.pageNo = val;
                this.orderList();
            },
            //分页显示条数
            handleSizeChange(val) {
                this.size = val;
                this.orderList();
            },
        },
        mounted() {
            this.BtnList();
            this.orderList();
            this.getAllRole();
        }
    }
</script>

<style scoped>
  .el-pagination {
    margin-top: 1rem;
  }
</style>
