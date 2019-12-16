<template>
  <div style="padding:1rem">
    <div>
      <!-- 运营商管理 -->
      <el-button size="small" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button>
    </div>
    <!--    列表-->
    <el-table :data="dataList" border size="small" tooltip-effect="dark" highlight-current-row v-loading="listLoading"
              style="width: 100%;margin-top: 1rem">
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column prop="name" label="角色名" width=""></el-table-column>
      <el-table-column prop="description" label="角色说明" width=""></el-table-column>
      <el-table-column prop="" label="操作" width="">
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
               title='添加角色'
               :visible.sync="dialogFormVisibleAdd"
               @close="closeDialog('addForm')">
      <el-form ref="addForm" :model="addForm" :rules="addRules" class="demo-ruleForm">
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addForm.name" style/>
        </el-form-item>
        <el-form-item label="角色说明" :label-width="formLabelWidth" prop="description">
          <el-input v-model="addForm.description" style/>
        </el-form-item>
        <el-tree
          :data="data1"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps">
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editAddForm('addForm')">取 消</el-button>
          <el-button type="primary" @click="submitFormAdd('addForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑模态窗-->
    <el-dialog width="40%"
               :close-on-click-modal="false"
               title='编辑角色'
               :visible.sync="dialogFormVisibleEdit"
               @close="editFormDialog('editForm')">
      <el-form ref="editForm" :model="editForm" :rules="editRules" class="demo-ruleForm">
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="editForm.name" style/>
        </el-form-item>
        <el-form-item label="角色说明" :label-width="formLabelWidth" prop="description">
          <el-input v-model="editForm.description" style/>
        </el-form-item>
        <el-tree
          :data="data1"
          show-checkbox
          node-key="id"
          ref="tree"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps">
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editFormDialog('editForm')">取 消</el-button>
          <el-button type="primary" @click="submitFormEdit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
    import {roleList, menuAll, saveRole,updateRole,deleteRole} from '../../api/modeList'

    export default {
        data() {
            return {
                dataList: [],
                listLoading: false,
                total: 0,
                size: 10,
                pageNo: 1,
                remark: [],
                dialogFormVisibleAdd: false,
                dialogFormVisibleEdit: false,
                addForm: {
                    name: '',
                    description: ''
                },
                addRules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    description: [
                        {required: true, message: '请输入角色说明', trigger: 'blur'},
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    defaultProps: [
                        {required: true, message: '请选择菜单列表', trigger: 'check'},
                    ]
                },
                editForm: {
                    name: '',
                    description: '',
                    id: ''
                },
                editRules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    description: [
                        {required: true, message: '请输入角色说明', trigger: 'blur'},
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    defaultProps: [
                        {required: true, message: '请选择菜单列表', trigger: 'check'},
                    ]
                },
                formLabelWidth: '100px',
                data1: [],
                data2: [],
                defaultProps: {
                    menuName: 'children',
                    label: 'label',
                }
            }
        },
        mounted() {
            this.getList();
            this.allMenu();
        },
        methods: {
            getList() {
                let param = {
                    currPage: this.pageNo,
                    pageSize: this.size,
                };
                roleList(param).then((res) => {
                    if (res.data.code === 0) {
                        let data = res.data.Data;
                        this.dataList = data.records;
                        this.size = data.size;
                        this.total = data.total;
                        // this.pageNo = data.pages;
                        const len = this.dataList.length;
                        if (len === 0 && this.pageNo > 1) {
                            this.pageNo -= 1;
                            this.getList()
                        }
                    }
                })
            },
            //获取所有菜单数据
            allMenu() {
                menuAll().then((res) => {
                    if (res.data.code === 0) {
                        this.data = res.data.menuList;
                        this.data1 = this.makeTree(this.data);
                    }
                })
            },
            //添加
            addFun() {
                this.dialogFormVisibleAdd = true;
            },
            submitFormAdd(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let param = {
                            name: this.addForm.name,
                            description: this.addForm.description,
                            menuIdList: this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()),
                        };
                        saveRole(param).then((res) => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功',
                                    duration: 1000
                                });
                                this.getList();
                                this.dialogFormVisibleAdd = false;
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg,
                                    duration: 1000
                                });
                                this.getList();
                                this.dialogFormVisibleAdd = false;
                            }
                        })

                    } else {
                        return false;
                    }
                });
            },
            //取消新增
            editAddForm(formName) {
                this.dialogFormVisibleAdd = false;
                this.$refs[formName].resetFields();
            },
            editFormDialog(formName) {
                this.dialogFormVisibleEdit = false;
                this.$refs[formName].resetFields();
                this.addForm.name = '';
                this.addForm.description = '';
                this.allMenu();
            },
            //编辑
            handleEdit(index,row) {
                this.dialogFormVisibleEdit = true;
                this.editForm.name = row.name;
                this.editForm.description = row.description;
                this.editForm.id = row.id;

                const _this = this;
                setTimeout(function () {
                    row.menuIdList.forEach((value)=>{
//1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false）如果全部选中setCheckedKeys
                        _this.$refs.tree.setChecked(value,true,false)
                    })
                },100);
            },
            submitFormEdit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let param = {
                            id: this.editForm.id,
                            name: this.editForm.name,
                            description: this.editForm.description,
                            menuIdList: this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()),
                        };
                        updateRole(param).then((res) =>{
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功',
                                    duration: 1000
                                });
                                this.getList();
                                this.dialogFormVisibleEdit = false;
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            //删除
            handleDelete(index,row) {
                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let str = [ ];
                    str.push(row.id);
                    let param = {
                        menuIdList: str
                    };
                    deleteRole(param).then((res) => {
                        if(res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 1000
                            });
                        }else {
                            this.$message({
                                type: 'error',
                                message: res.data.msg,
                                duration: 1000
                            });
                        }
                        this.getList();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            closeDialog(formName) {
                if(formName == 'editForm') {
                    this.dialogFormVisibleEdit = false;
                    this.addForm.name = '';
                    this.addForm.description = '';
                    this.allMenu();
                }else {
                    this.dialogFormVisibleAdd = false;
                    this.addForm.name = '';
                    this.addForm.description = '';
                }
            },
            //分页
            handleCurrentChange(val) {
                this.pageNo = val;
                this.getList();
            },
            //分页显示条数
            handleSizeChange(val) {
                this.size = val;
                this.getList();
            },
            makeTree(menuList) {
                const accessedRouters = menuList.filter(route => {
                    route.label = route.menuName;
                    route.id = route.menuId;
                    if (route.list && route.list.length) {
                        route.children = this.makeTree(route.list)
                    }
                    return true
                });
                return accessedRouters
            }
        }
    }
</script>

<style lang="scss" scope>
  .el-pagination {
    margin-top: 1rem;
  }
</style>
