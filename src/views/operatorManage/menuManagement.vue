<template>
  <div style="padding: 1rem">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0">
      <el-form :inline="true">
        <el-form-item>
          <el-button size="small" icon="el-icon-plus" type="primary" @click="addMenu()">添加</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-table :data="menuData" size="small" width="100%" tooltip-effect="dark" border>
      <el-table-column type="index" width="50"/>
      <el-table-column prop="menuName" label="菜单名称"/>
      <el-table-column prop="com" label="组件路径"/>
      <el-table-column prop="url" label="菜单路径"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleEnter(scope.$index, scope.row)"
          >二级菜单
          </el-button>
          <el-button
            size="mini"
            @click="handleEdit(1, scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
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
    <el-dialog
      width="40%"
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogFormVisible"
      @close="closeDialog('ruleForm')"
    >
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="menuName">
          <el-input v-model="ruleForm.menuName" style/>
        </el-form-item>
        <el-form-item label="组件路径" :label-width="formLabelWidth" prop="com">
          <el-input v-model="ruleForm.com" style/>
        </el-form-item>
        <el-form-item label="访问路径" :label-width="formLabelWidth" prop="url">
          <el-input v-model="ruleForm.url" style/>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth" prop="menuType">
          <el-select v-model="ruleForm.menuType" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
    import {menuList, addMenueOp, getMenue, delMenue, updateMenue} from '../../api/modeList'
    import Pagination from '@/components/Pagination/index'
    import qs from 'qs'

    export default {
        name: 'MenuManagement',
        components: {
            Pagination
        },
        data() {
            return {
                total: 0, // 总条数
                listQuery: {
                    page: 1,
                    limit: 10
                },
                title: '', // 模态框标题
                menuData: [],
                // 模态框
                dialogFormVisible: false,
                diaTitle: '添加菜单',
                ruleForm: {
                    menuName: '',
                    com: '',
                    url: '',
                    menuType: '0'
                },
                formLabelWidth: '100px',
                rules: {
                    menuName: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    com: [
                        {required: true, message: '请输入菜单组件', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入菜单路径', trigger: 'blur'}
                    ],
                    menuType: [
                        {required: true, message: '请输选择类型', trigger: 'blur'}
                    ]
                },
                options: [
                    {name: '目录', value: '0'},
                    {name: '菜单', value: '1'},
                    {name: '按钮', value: '3'}
                ]
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                // 获取所有的列表
                const obj = {
                    currPage: this.listQuery.page,
                    pageSize: this.listQuery.limit,
                    parentId: 0
                };
                const rLoading = this.openLoading();
                getMenue(obj).then(res => {
                    if (res.data.code === 0) {
                        this.menuData = res.data.menus.records;
                        this.total = res.data.menus.total
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

            addMenu() {
                this.title = '添加菜单';
                this.ruleForm.menuName = '';
                this.ruleForm.com = '';
                this.ruleForm.url = '';
                this.dialogFormVisible = true
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.title === '添加菜单') {
                            const obj = {
                                menuName: this.ruleForm.menuName,
                                com: this.ruleForm.com,
                                parentId: 0,
                                menuType: 0,
                                url: this.ruleForm.url
                            };
                            const rLoading = this.openLoading();
                            addMenueOp(obj).then(res => {
                                if (res.data.code === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: res.data.msg,
                                        duration: 1000
                                    })
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.data.msg,
                                        duration: 1000
                                    })
                                }
                                rLoading.close()
                            })
                        } else if (this.title === '编辑菜单') {
                            const obj = {
                                menuId: this.ruleForm.menuId,
                                menuName: this.ruleForm.menuName,
                                com: this.ruleForm.com,
                                parentId: 0,
                                menuType: 0,
                                url: this.ruleForm.url
                            }
                            const rLoading = this.openLoading();
                            updateMenue(obj).then(res => {
                                if (res.data.code === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: res.data.msg,
                                        duration: 1000
                                    });
                                    this.dialogFormVisible = false;
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
                    } else {
                        console.log('error submit!!');
                        return false
                    }
                })
            },
            closeDialog(formName) {
                this.dialogFormVisible = false;
                this.ruleForm.menuName = '';
                this.ruleForm.com = '';
                this.ruleForm.url = '';
                this.$refs[formName].resetFields();
            },
            handleDelete(index, data) {
                this.$confirm('此操作将永久删除当前菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        const arr = [];
                        arr.push(data.menuId);
                        const obj = {
                            menuIds: arr
                        };
                        // 删除
                        const rLoading = this.openLoading();
                        delMenue(obj).then(res => {
                            if (res.data.code === 0) {
                                this.$message({
                                    type: 'success',
                                    message: res.data.msg
                                });
                                this.dialogFormVisible = false;
                                this.getList()
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.msg
                                })
                            }
                            rLoading.close()
                        })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            editForm(formName) {
                this.dialogFormVisible = false
            },
            handleEnter(index, row) {
                console.log(row.menuId);
                this.$router.push({path: 'menuManage', query: {menuId: row.menuId}})
            },
            handleEdit(index, row) {
                this.dialogFormVisible = true;
                this.title = '编辑菜单';
                this.ruleForm.menuId = row.menuId;
                this.ruleForm.menuName = row.menuName;
                this.ruleForm.com = row.com;
                this.ruleForm.url = row.url;
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

<style scoped>
  .pagination-container {
    padding: 0 0;
  }

  .toolbar {
    padding-bottom: 1px !important;
  }
</style>
