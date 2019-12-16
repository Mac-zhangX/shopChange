<template>
    <div style="padding: 1rem">
        <div>
            <el-button icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button>
            <el-button v-if="checkedAll"  class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button>
        </div>
        <el-table
            ref="multipleTable"
            size="small"
            border
            class="orderList_goods"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%;margin-top: 1rem"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="startScope" label="积分开始范围" />
            <el-table-column prop="endScope" label="积分结束范围" />
            <el-table-column prop="createTime" label="创建时间"/>
            <el-table-column prop="updateTime" label="修改时间"/>
            <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="edit(scope.row)"/>
                    <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="del(scope.$index,scope.row)"/>
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
        <!-- 添加的模态框 -->
        <div>
            <el-dialog :close-on-click-modal="false" width="36%" :title="diaTitle" :visible.sync="dialogFormVisible"
                       @close="close()">
                <el-form ref="addForm" :rules="rules" :model="addForm">
                    <el-form-item label="积分范围" prop="scope" :label-width="formLabelWidth">
                        <el-input-number v-model="addForm.startScope" controls-position="right" @change="handleChangeAdd"  style="width: 40%"></el-input-number> -
                        <el-input-number v-model="addForm.endScope" controls-position="right" @change="handleChangeCut"  style="width: 40%"></el-input-number>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="close()">取 消</el-button>
                    <el-button type="primary" @click="confirm()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import {scopePage, scopeAdd, scopeUpdate, scopeDelete,scopeArea, goodsType} from "../../api/modeList";
    import {formatDateTime} from "../../utils";
    import moment from "moment";

    export default {
        name: "goodsTable",
        data() {
            return {

                checkedAll: false,
                total: 0,
                size: 10,
                pageNo: 1,
                list: [],
                dialogFormVisible: false,
                formLabelWidth: '100px',
                diaTitle: '', // 是新增还是修改
                addForm: {
                    startScope: '',
                    endScope: '',
                    id:'',
                },
                integralArea: [],
                rules: {
                    startScope: [
                        {required: true, message: '积分范围不能为空', trigger: 'change'},
                        { type: 'number', message: '只能输入数字', trigger: 'blur' },
                    ],
                    endScope: [
                        {required: true, message: '积分范围不能为空', trigger: 'change'},
                        { type: 'number', message: '只能输入数字', trigger: 'blur' },
                    ],
                },
                num: 1,
            }
        },
        mounted() {
            this.getList();
            this.typeList();

        },
        methods: {
            getList() {
                let params = {
                    currPage: this.pageNo,
                    pageSize: this.size,
                };
                scopePage(params).then((res) =>{
                    if (res.data.code === 0) {
                        this.list = res.data.data.records;
                        this.size = res.data.data.size;
                        this.total = res.data.data.total;
                        this.list.map(val => {
                            const createTime = new Date(val.createTime);
                            const updateTime = new Date(val.updateTime);
                            val.createTime = formatDateTime(createTime);
                            val.updateTime = formatDateTime(updateTime);
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
                })
            },
            //商品类别
            typeList(){
                goodsType().then((res) =>{
                    if (res.data.code === 0) {
                        this.goodsList = res.data.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        });
                    }
                })
            },
            addFun() {
                // 打开添加的模态框
                this.diaTitle = '新增范围';
                this.dialogFormVisible = true
            },
            confirm() {
                // 点击确认之前进行验证
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        // 点击确认
                        if (this.diaTitle === '新增范围') {
                            console.log(this.addForm.startScope,this.addForm.startScope)
                            if (this.addForm.startScope == null || this.addForm.startScope == undefined) {
                                this.addForm.startScope = null
                            }
                            if (this.addForm.endScope == null || this.addForm.endScope == undefined) {
                                this.addForm.endScope = null
                            }

                            if ((this.addForm.startScope == null || this.addForm.startScope == undefined) && (this.addForm.endScope == null || this.addForm.endScope == undefined)) {
                                console.log(333)
                                this.$message({
                                    type: 'error',
                                    message: '积分范围不能为空',
                                    duration: 1000
                                });
                                return
                            }
                            if(this.addForm.startScope != null && this.addForm.endScope != null){
                                if(this.addForm.endScope < this.addForm.startScope) {
                                    console.log(444)
                                    this.$message({
                                        type: 'error',
                                        message: '积分范围错误',
                                        duration: 1000
                                    });
                                    return
                                }
                            }
                            if(this.addForm.endScope < this.addForm.startScope) {
                                console.log(222);
                                this.$message({
                                    type: 'error',
                                    message: '积分范围错误',
                                    duration: 1000
                                });
                                return
                            }
                            let params = {
                                startScope: this.addForm.startScope,
                                endScope: this.addForm.endScope,
                                id: this.addForm.id,
                            };
                            console.log(params);
                            scopeAdd(params).then((res) => {
                                if (res.data.code === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: res.data.msg,
                                        duration: 1000
                                    });
                                    this.dialogFormVisible = false;
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.data.msg,
                                        duration: 1000
                                    });
                                }
                                this.getList();
                            })
                        } else if (this.diaTitle === '修改范围') {
                            // 修改商品信息
                            if (this.addForm.startScope == null || this.addForm.startScope == undefined) {
                                this.addForm.startScope = null
                            }
                            if (this.addForm.endScope == null || this.addForm.startScope == undefined) {
                                this.addForm.endScope = null
                            }
                            if (this.addForm.startScope == null && this.addForm.endScope == null) {
                                this.$message({
                                    type: 'error',
                                    message: '积分范围不能为空',
                                    duration: 1000
                                });
                            }
                            let params = {
                                startScope:  this.addForm.startScope,
                                endScope: this.addForm.endScope,
                                id: this.addForm.id,
                            };
                            scopeUpdate(params).then((res) => {
                                if (res.data.code === 0) {
                                    this.dialogFormVisible = false;
                                    this.getList()// 刷新页面
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: res.data.msg,
                                        duration: 1000
                                    });
                                }
                            })
                        }
                    } else {
                        return false
                    }
                })
            },
            del(index,row) {
                // 给出提示
                this.$confirm('此操作将永久删除当前选中积分专区, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const str = [];
                    str.push(row.id);
                    let ids = str;
                    scopeDelete(ids).then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!',
                                duration: 1000
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
            delAll() {
                this.$confirm('此操作将永久删除当前选中积分专区, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const delAll = [];
                    this.multipleSelection.map(val => {
                        delAll.push(val.id)
                    });
                    let ids = delAll;
                    scopeDelete(ids).then((res) => {
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
            edit(row) {
                this.diaTitle = '修改范围';
                this.addForm = {
                    startScope: row.startScope,
                    endScope: row.endScope,
                    id: row.id,
                };
                this.dialogFormVisible = true;
            },
            handleChangeAdd(value) {

            },
            handleChangeCut(value) {

            },
            close() {
                // 关闭对话框
                this.dialogFormVisible = false;
                this.addForm = {
                    startScope: '',
                    endScope: '',
                };
                this.resetForm('addForm')
            },
            resetForm(formName) { // 清除验证
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields()
                }
            },
            handleSelectionChange(val) {
                //  console.log('全选触发了吗---', val)
                if (val.length > 0) {
                    this.checkedAll = true
                } else {
                    this.checkedAll = false
                }
                this.multipleSelection = val
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
        },
    }
</script>

<style scoped>

</style>
<style>
    .hide .el-upload--picture-card {
        display: none;
    }

    .orderList_goods .has-gutter tr th,
    .orderList_goods .el-table--border th,
    .orderList_goods .el-table__row td {
        text-align: center;
    }
</style>
