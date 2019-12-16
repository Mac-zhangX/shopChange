<template>
    <div style="padding:1rem">
        <div>
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button>
             <el-button v-if="checkedAll" size="mini" class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button>
        </div>
        <el-table
            ref="multipleTable"
            size="small"
            border
            class="orderList_goods"
            :data="list"
            tooltip-effect="dark"
            style="width: 100%;margin-top: 1rem"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55"/>
            <el-table-column prop="name" label="平台名称" width="200"/>
            <el-table-column prop="xgoodsType" label="平台图片地址" width="200"/>
            <el-table-column label="商品图片" width="200">
                <template slot-scope="scope">
                    <img style="height: 50px;width: 80px" :onerror="defaultImg" :src="scope.row.img" @click="scal(scope.row.img)">
                </template>
            </el-table-column>
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
            <el-dialog :close-on-click-modal="false" width="40%" :title="diaTitle" :visible.sync="dialogFormVisible"
                       @close="close()">
                <el-form ref="goodsForm" :rules="rules" :model="goodsForm">
                    <el-form-item label="平台名称" prop="name" :label-width="formLabelWidth">
                        <el-input v-model="goodsForm.name" style/>
                    </el-form-item>
                    <el-form-item label="平台Logo" prop="file" :label-width="formLabelWidth">
                        <el-upload
                            ref="upload"
                            :class="{hide:hideUpload}"
                            action="http://192.168.0.120/commity/getadd"
                            :http-request="upLoadFile"
                            list-type="picture-card"
                            :file-list="ad_url_list"
                            :limit="1"
                            :data="imgData"
                            :on-preview="handlePictureCardPreview"
                            :on-remove="handleRemove"
                            :on-change="handleImgChange"
                        >
                            <i class="el-icon-plus"/>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt>
                        </el-dialog>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="close()">取 消</el-button>
                    <el-button type="primary" @click="confirm()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
        <!-- 弹出图片 -->
        <div>
            <el-dialog
                center
                title="详细图片"
                :visible.sync="imgVisible"
                width="40%"
            >
                <div style="text-align:center">
                    <img style="width: 500px" :src="thisGoodsImg">
                </div>
                <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="imgVisible = false">确 定</el-button>
          </span>
            </el-dialog>
        </div>
        <!-- 输出这个富文本编辑器 -->
        <!-- 弹出图片 -->
        <div>
            <el-dialog
                center
                title="编辑器"
                :visible.sync="wangVisible"
                width="40%"
            >
                <div style="text-align:center">
                    <div id="wangedit"/>
                </div>
                <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="imgVisible = false">确 定</el-button>
          </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {findPage, addOne, updateOne, deleteList,imgIp} from "../../api/modeList";
    import {formatDateTime} from "../../utils";

    export default {
        data() {
            var validatePass4 = (rule, value, callback) => {
                // 验证提交的iid
                if (this.goodsForm.file === '' || this.goodsForm.file === undefined || this.goodsForm.file === null) {
                    callback(new Error('图片不能为空'))
                } else {
                    callback()
                }
                callback()
            };
            return {
                list: [],
                files: [], // 图片的id集合
                diaTitle: '', // 是新增还是修改
                defaultImg: 'this.src="' + require('../../assets/image/null.png') + '"',
                goodsForm: {
                    name: '',
                    file: '',
                    id:''
                },
                rules: { // 定义一个验证规则
                    name: [
                        {required: true, message: '平台名称不能为空', trigger: 'blur'}

                    ],
                    // file: [
                    //     {required: true, message: '图片不能为空', trigger: 'change'},
                    //     {validator: validatePass4, trigger: 'change'}] // 商品状态
                },
                imgVisible: false, // 打开放大
                thisGoodsImg: '', // 放大图片路径
                imgData: {},
                imgInfo: {file:''},
                total: 0,
                size: 10,
                pageNo: 1,
                multipleSelection: [],
                checkedAll: false,
                // 进行添加的变量
                dialogFormVisible: false,
                formLabelWidth: '100px',
                // 用于图片的上传
                dialogImageUrl: '',
                dialogVisible: false,
                ad_url_list: [],
                limitCount: 1,
                hideUpload: false,
                wangVisible: false
            }
        },
        mounted() {
            // 以上为测试信息
            this.getList();
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
                };
                findPage(params).then((res) => {
                    if (res.data.code === 0) {
                        this.list = res.data.data.records;
                        this.size = res.data.data.size;
                        this.total = res.data.data.total;
                        this.list.map(val =>{
                            const createTime = new Date(val.createTime);
                            const updateTime = new Date(val.updateTime);
                            val.createTime = formatDateTime(createTime);
                            val.updateTime = formatDateTime(updateTime);
                            val.img = imgIp+val.img;
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
            handleSelectionChange(val) {
                //  console.log('全选触发了吗---', val)
                if (val.length > 0) {
                    this.checkedAll = true
                } else {
                    this.checkedAll = false
                }
                this.multipleSelection = val
            },
            addFun() {
                // 打开添加的模态框
                this.diaTitle = '新增商品';
                this.dialogFormVisible = true
            },

            //批量删除
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
                    // const param = {
                    //     ids: delAll
                    // };
                    let ids = delAll;

                    deleteList(ids).then((res) => {
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
            //单挑删除
            del(index, row) {
                // 删除当前积分专区
                // 给出提示
                this.$confirm('此操作将永久删除当前选中积分专区, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const str = [];
                    str.push(row.id);
                    let ids = str;
                    deleteList(ids).then((res) => {
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
            //修改商品
            edit(row) {
                this.diaTitle = '修改商品';
                this.goodsForm = {
                    name: row.name,
                    file: row.file,
                    id: row.id,
                };
                this.dialogFormVisible = true;
                if(row.img == null) {
                   this.hideUpload = true;
                } else {
                    this.imgInfo.file = row.file;
                    this.ad_url_list = [];
                    const obj = {};
                    obj.name = row.name + '.jpg'// 图片名称
                    obj.url = row.img;
                    this.ad_url_list.push(obj);
                    this.hideUpload = true
                }
            },


            close() {
                // 关闭对话框
                this.dialogFormVisible = false;
                // 清空图片
                this.$refs.upload.clearFiles();
                this.hideUpload = false;
                this.goodsForm = {
                    name: '', // 商品名称
                    file: '', // 商品图片id
                };
                this.resetForm('goodsForm')
            },
            scal(imgUrl) {
                console.log(imgUrl,33333)
                // 放大图片
                this.imgVisible = true;
                this.thisGoodsImg = imgUrl
            },
            // 移除图片进行删除
            handleRemove(file, fileList) {
                // 移除时候调用
                // 调用删除图片的接口
                this.hideUpload = fileList.length >= this.limitCount
            },
            handlePictureCardPreview(file) {
                // 预览的方法
                this.dialogImageUrl = file.url;
                this.dialogVisible = true
            },
            handleImgChange(file, fileList) {
                // 当改变了
                this.hideUpload = fileList.length >= this.limitCount
            },
            upLoadFile(a) {
                console.log(a,2121);
                // 进行限制图片的大小
                const size_M = a.file.size / (1024 * 1024);
                if (size_M > 9) {
                    this.$message({
                        type: 'error',
                        message: '上传图片过大',
                        duration: 2000
                    });
                    this.ad_url_list = [];
                    this.hideUpload = false;
                    return
                }
                this.goodsForm.file = a.file;
            },

            confirm() {
                // 点击确认之前进行验证
                this.$refs['goodsForm'].validate((valid) => {
                    if (valid) {
                        // 点击确认
                        if (this.diaTitle === '新增商品') {
                            const formData = new FormData();
                            formData.append('name',this.goodsForm.name);
                            formData.append('file',this.goodsForm.file)
                            console.log(formData)
                            addOne(formData).then((res) => {
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
                        } else if (this.diaTitle === '修改商品') {
                            // 修改商品信息
                            const formData = new FormData();
                            formData.append('name',this.goodsForm.name)
                            formData.append('file',this.goodsForm.file)
                            formData.append('id',this.goodsForm.id)
                            updateOne(formData).then((res) => {
                                if (res.data.code === 0) {
                                    this.dialogFormVisible = false
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
            resetForm(formName) { // 清除验证
                if (this.$refs[formName] !== undefined) {
                    this.$refs[formName].resetFields()
                }
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
