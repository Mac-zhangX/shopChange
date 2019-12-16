<template>
    <div style="padding:1rem">
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item label="礼品名称：">
                    <el-input
                        v-model="filters.name "
                        placeholder="礼品名称"
                        icon="circle-close"
                        @keyup.enter.native="search"/>
                </el-form-item>
                <el-form-item label="商品类别：">
                    <el-select v-model="filters.goodsList" placeholder="请选择" @change="search">
                        <el-option v-for="item in goodsList" :key="item.id" :label="item.name" :value="item.id">{{
                            item.name}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="积分范围：">
                    <el-select v-model="filters.scopeData" placeholder="请选择" @change="getScope(filters.scopeData)">
                        <el-option v-for="item in scopeData" :key="item.id" :label="item.scope" :value="item.id">{{
                            item.scope}}
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="积分区间：">
                    <el-input  style="width: 200px"
                        v-model="filters.startScope"
                        placeholder=""
                        icon="circle-close"/> -
                        <el-input style="width: 200px"
                            v-model="filters.endScope"
                            placeholder=""
                            icon="circle-close"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                </el-form-item>
                <br>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-plus" @click="addFun()">添加</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button v-if="checkedAll" class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button>
                </el-form-item>
            </el-form>
        </el-col>
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
            <el-table-column prop="name" label="礼品名称" width="200"/>
            <el-table-column prop="code" label="礼品编码" width="200"/>
            <el-table-column label="图片" width="200">
                <template slot-scope="scope">
                    <img style="height: 50px;width: 80px" :onerror="defaultImg" :src="scope.row.img"
                         @click="scal(scope.row.img)">
                </template>
            </el-table-column>
            <el-table-column prop="brand" label="礼品品牌"/>
            <el-table-column prop="integral" label="积分"/>
            <el-table-column prop="createTime" label="创建时间"/>
            <el-table-column prop="updateTime" label="修改时间"/>
            <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="edit(scope.row)"/>
                    <el-button size="mini" type="danger" icon="el-icon-delete" circle
                               @click="del(scope.$index,scope.row)"/>
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
                <el-form ref="addForm" :rules="rules" :model="addForm">
                    <el-form-item label="礼品名称" prop="name" :label-width="formLabelWidth">
                        <el-input v-model="addForm.name" style/>
                    </el-form-item>
                    <el-form-item label="礼品编码" prop="code" :label-width="formLabelWidth">
                        <el-input v-model="addForm.code" style/>
                    </el-form-item>
                    <el-form-item label="商品链接" prop="link" :label-width="formLabelWidth">
                        <el-input v-model="addForm.link" style/>
                    </el-form-item>
                    <el-form-item label="礼品品牌" prop="brand" :label-width="formLabelWidth">
                        <el-input v-model="addForm.brand" style/>
                    </el-form-item>
                    <el-form-item label="区域" prop="area" :label-width="formLabelWidth">
                        <el-input v-model="addForm.area" style/>
                    </el-form-item>
                    <el-form-item label="商品类型" prop="categoryId" :label-width="formLabelWidth">
                        <el-select placeholder="请选择" v-model="addForm.categoryId">
                            <el-option v-for="item in categoryId" :label="item.name" :value="item.id">{{item.name}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="积分专区" prop="integralPrecinctId" :label-width="formLabelWidth">
                        <el-select placeholder="请选择" v-model="addForm.integralPrecinctId">
                            <el-option v-for="item in integralPrecinctId" :label="item.name" :value="item.id">
                                {{item.name}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="积分" prop="integral" :label-width="formLabelWidth">
                        <el-input v-model="addForm.integral" style/>
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
    import {
        goodsPage,
        goodsAdd,
        findAll,
        goodsDelete,
        goodsUpdate,
        imgIp,
        goodsType,
        scopeArea
    } from "../../api/modeList";
    import {formatDateTime} from "../../utils";

    export default {
        data() {
            var validatePass4 = (rule, value, callback) => {
                // 验证提交的iid
                if (this.addForm.file === '' || this.addForm.file === undefined || this.addForm.file === null) {
                    callback(new Error('图片不能为空'))
                } else {
                    callback()
                }
                callback()
            };
            return {
                filters: {
                    name: '',
                    goodsList: '',
                    startScope: '',
                    endScope: '',
                    scopeData: '',
                },
                goodsList: [],
                scopeData: [],
                list: [],
                diaTitle: '', // 是新增还是修改
                defaultImg: 'this.src="' + require('../../assets/image/null.png') + '"',
                addForm: {
                    name: '',
                    code: '',
                    link: '',
                    brand: '',
                    area: '',
                    ruleId: '',
                    category: '',
                    id: '',
                    integralArea: '',
                    integralPrecinctId: '',
                    categoryId: '',
                    integral: '',
                    file: ''
                },
                integralPrecinctId: [],
                categoryId: [],
                rules: { // 定义一个验证规则
                    name: [
                        {required: true, message: '礼品名称不能为空', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '礼品编码不能为空', trigger: 'blur'}

                    ],
                    // link: [
                    //     {required: true, message: '商品链接不能为空', trigger: 'blur'}
                    //
                    // ],
                    brand: [
                        {required: true, message: '礼品品牌不能为空', trigger: 'blur'}

                    ],
                    integralPrecinctId: [
                        {required: true, message: '积分专区不能为空', trigger: 'blur'}

                    ],
                    categoryId: [
                        {required: true, message: '商品类型不能为空', trigger: 'blur'}

                    ],
                    integral: [
                        {required: true, message: '积分不能为空', trigger: 'blur'}

                    ],
                    // file: [
                    //     {required: true, message: '图片不能为空', trigger: 'change'},
                    //     {validator: validatePass4, trigger: 'change'}] // 商品状态
                },
                imgVisible: false, // 打开放大
                thisGoodsImg: '', // 放大图片路径
                imgData: {},
                imgInfo: {file: ''},
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
            this.scopeList();
            this.typeList();
            this.scopeArea();
        },
        methods: {
            search() {
                // 搜索 根据当前后台的逻辑搜索的时候永远将页码置于1
                this.pageNo = 1;
                if(this.filters.startScope != null && this.filters.endScope !=null) {
                    if(this.filters.startScope>this.filters.endScope) {
                        let start = 0;
                        let end = 0;
                        end = this.filters.startScope;
                        start = this.filters.endScope;
                        this.filters.endScope = end;
                        this.filters.startScope = start;
                    }
                }
                this.getList()
            },
            getList() {
                let params = {
                    currPage: this.pageNo,
                    pageSize: this.size,
                    name: this.filters.name,
                    categoryId: this.filters.goodsList,
                    startScope: this.filters.startScope,
                    endScope: this.filters.endScope,
                };
                goodsPage(params).then((res) => {
                    if (res.data.code === 0) {
                        this.list = res.data.data.records;
                        this.size = res.data.data.size;
                        this.total = res.data.data.total;
                        this.list.map(val => {
                            const createTime = new Date(val.createTime);
                            const updateTime = new Date(val.updateTime);
                            val.createTime = formatDateTime(createTime);
                            val.updateTime = formatDateTime(updateTime);
                            val.img = imgIp + val.img;
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
            scopeList() {
                findAll().then((res) => {
                    if (res.data.code === 0) {
                        this.integralPrecinctId = res.data.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        });
                    }
                })
            },
            typeList() {
                goodsType().then((res) => {
                    if (res.data.code === 0) {
                        this.categoryId = res.data.data;
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
            //积分区间
            scopeArea() {
                scopeArea().then((res) => {
                    if (res.data.code === 0) {
                        this.scopeData = res.data.data;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        });
                    }
                })
            },
            //获取积分
            getScope(item) {
                this.scopeData.map(val => {
                    if (val.id == item) {
                        this.filters.startScope = val.startScope;
                        this.filters.endScope = val.endScope
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

            edit(row) {
                this.diaTitle = '修改商品';
                this.addForm = {
                    name: row.name,
                    code: row.code,
                    link: row.link,
                    brand: row.brand,
                    area: row.rule.area,
                    ruleId: row.rule.id,
                    categoryId: row.categoryId,
                    integralPrecinctId: row.integralPrecinctId,
                    integral: row.integral,
                    file: row.file,
                    id: row.id,
                };
                this.dialogFormVisible = true;
                if (row.img == null) {
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
                    goodsDelete(ids).then((res) => {
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
            del(index, row) {
                // 给出提示
                this.$confirm('此操作将永久删除当前选中积分专区, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const str = [];
                    str.push(row.id);
                    let ids = str;
                    goodsDelete(ids).then((res) => {
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
            close() {
                // 关闭对话框
                this.dialogFormVisible = false;
                // 清空图片
                this.$refs.upload.clearFiles();
                this.hideUpload = false;
                this.addForm = {
                    name: '', // 商品名称
                    code: '',
                    link: '',
                    brand: '',
                    area: '',
                    categoryId: '',
                    integralPrecinctId: '',
                    integral: '',
                    file: '', // 商品图片id
                };
                this.resetForm('addForm')
            },
            scal(imgUrl) {
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
                console.log(a, 2121);
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
                this.addForm.file = a.file;
            },

            confirm() {
                // 点击确认之前进行验证
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        // 点击确认
                        if (this.diaTitle === '新增商品') {
                            const formData = new FormData();
                            formData.append('name', this.addForm.name);
                            formData.append('code', this.addForm.code);
                            formData.append('link', this.addForm.link);
                            formData.append('brand', this.addForm.brand);
                            formData.append('area', this.addForm.area);
                            formData.append('ruleId', this.addForm.ruleId);
                            formData.append('categoryId', this.addForm.categoryId);
                            formData.append('integralPrecinctId', this.addForm.integralPrecinctId);
                            formData.append('integral', this.addForm.integral);
                            formData.append('id', this.addForm.id);
                            formData.append('file', this.addForm.file);
                            console.log(formData);
                            goodsAdd(formData).then((res) => {
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
                            formData.append('name', this.addForm.name);
                            formData.append('code', this.addForm.code);
                            formData.append('link', this.addForm.link);
                            formData.append('brand', this.addForm.brand);
                            formData.append('area', this.addForm.area);
                            formData.append('ruleId', this.addForm.ruleId);
                            formData.append('categoryId', this.addForm.categoryId);
                            formData.append('integralPrecinctId', this.addForm.integralPrecinctId);
                            formData.append('integral', this.addForm.integral);
                            formData.append('id', this.addForm.id);
                            formData.append('file', this.addForm.file);
                            goodsUpdate(formData).then((res) => {
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
