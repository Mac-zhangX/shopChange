<template>
  <div style="padding:1rem">
    <div>
      <!-- 积分通道 -->
      <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button>
    </div>
    <el-table
      ref="multipleTable"
      size="small"
      border
      :data="tableData3"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 1rem"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="Id" width="55">
        <template slot-scope="scope">{{ scope.row.Id }}</template>
      </el-table-column>
      <el-table-column prop="Content" label="提示内容" />
      <el-table-column prop="Timeline" label="创建时间" />
      <el-table-column prop="StatusName" label="状态" />

      <el-table-column align="center" min-width="120" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.Status===0"
            class="item"
            effect="dark"
            content="单击启用"
            placement="top"
          >
            <el-button
              size="mini"
              type="success"
              icon="el-icon-check"
              circle
              @click="open(scope.row)"
            />
          </el-tooltip>
          <el-tooltip
            v-if="scope.row.Status===1"
            class="item"
            effect="dark"
            content="单击禁用"
            placement="top"
          >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-close"
              circle
              @click="open(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <div>
      <el-dialog
        :close-on-click-modal="false"
        width="60%"
        :title="diaTitle"
        :visible.sync="dialogFormVisible"
        @close="close()"
      >
        <el-form ref="noticeEntity" :rules="rules" :model="noticeEntity">
          <el-form-item label="提示内容" prop="Content" :label-width="formLabelWidth">
            <el-input
              v-model="noticeEntity.Content"
              type="textarea"
              :rows="4"
              style
              auto-complete="off"
            />
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
      <el-dialog center title="详细图片" :visible.sync="imgVisible" width="40%">
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
      <el-dialog center title="编辑器" :visible.sync="wangVisible" width="40%">
        <div style="text-align:center">
          <div id="wangedit" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="imgVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import Pagination from "@/components/Pagination/index";
import { UrlHelper } from "@/api/urlHelper";
import WangEditor from "wangeditor";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      formData: {}, // 文件对象
      tableData3: [],
      iid: "", // 图片id
      iids: [], // 图片的id集合
      diaTitle: "", // 是新增还是修改
      defaultImg: 'this.src="' + require("../../assets/image/null.png") + '"',
      coupons: [],
      noticeEntity: {
        Content: "", // 提示内容
        Id: ""
      },
      rules: {
        // 定义一个验证规则
      },
      imgVisible: false, // 打开放大
      thisGoodsImg: "", // 放大图片路径
      total: 0,
      imgData: {},
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      imgInfo: { uuid: "", iid: "" }, // 存放当前的图片信息
      multipleSelection: [],
      checkedAll: false,
      // 进行添加的变量
      dialogFormVisible: false,
      formLabelWidth: "100px",

      // 用于图片的上传
      dialogImageUrl: "",
      dialogVisible: false,
      ad_url_list: [],
      limitCount: 1,
      hideUpload: false,
      wangVisible: false
    };
  },
  mounted() {
    // 以上为测试信息
    this.getList();
  },
  methods: {
    getList() {
      this.$axios.post(UrlHelper.noticeList.query).then(val => {
        if (val.data.Code === 200) {
          this.tableData3 = val.data.Data;
          // eslint-disable-next-line space-in-parens
          this.tableData3.map(val => {
            if (val.Status === 1) {
              val.StatusName = "启用";
            } else if (val.Status === 0) {
              val.StatusName = "禁用";
            }
          });
        } else {
          this.$message({
            type: "error",
            message: val.data.Msg,
            duration: 1000
          });
        }
      });
      // console.log(this.total)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      //  console.log('全选触发了吗---', val)
      if (val.length > 0) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
      this.multipleSelection = val;
    },
    addFun() {
      // 打开添加的模态框
      this.diaTitle = "新增提示语";
      this.dialogFormVisible = true;
      this.formData = new FormData();
    },
    delAll() {
      // 删除所有
      // 给出提示
      this.$confirm("此操作将永久删除所有商品记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // doSomething
          this.$message({
            type: "success",
            message: "删除成功!",
            duration: 1000
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },
    edit(data) {
      this.diaTitle = "修改商品";
      //  console.log(data)
      const typeNum = data.goodsType; // 商品类型
      if (typeNum === 1) {
        this.coupons = this.coupons1;
      } else if (typeNum === 2) {
        this.coupons = this.coupons2;
      }
      this.goodsEntity = {
        cid: data.cid,
        cflag: data.cflag,
        cname: data.cname,
        flag: data.flag,
        iid: data.iid,
        goodsType: data.goodsType,
        goodsTypeCoupon: data.goodsTypeCoupon // 商品备注
      };

      this.imgInfo.iid = data.iid;
      this.ad_url_list = [];
      const obj = {};
      obj.name = data.cname + ".jpg"; // 图片名称
      obj.url = data.iimg;
      this.ad_url_list.push(obj);
      this.dialogFormVisible = true;
      this.hideUpload = true;
    },
    del(data) {
      // 删除当前积分档
      // 给出提示
      this.$confirm("此操作将永久删除该商品记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除的方法
          this.$axios
            .post(UrlHelper.goodsInfo.delGoodsInfo, {
              cid: data.cid
            })
            .then(val => {
              console.log(val);
              if (val.data.code === 200) {
                // 删除成功
                this.$message({
                  type: "success",
                  message: val.data.msg,
                  duration: 1000
                });
                this.getList();
              } else {
                this.$message({
                  type: "error",
                  message: val.data.msg,
                  duration: 1000
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
            duration: 1000
          });
        });
    },

    close() {
      this.dialogFormVisible = false;
      this.$refs.upload.clearFiles();
      this.hideUpload = false;
      this.goodsEntity = {
        cname: "", // 商品名称
        cflag: "", // 商品状态
        iid: "", // 商品图片id
        goodsType: "", // 商品类类型
        goodsTypeCoupon: ""
      };
      this.resetForm("goodsEntity");
    },
    scal(imgUrl) {
      this.imgVisible = true;
      this.thisGoodsImg = imgUrl;
    },
    handleRemove(file, fileList) {
      // 上传文件
      //   this.formData = new FormData()
      //   this.formData.append('Photo', file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleImgChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
    },
    upLoadFile(a) {
      this.formData.append("Photo", a.file);
      console.log(a);
    },
    change(num) {
      // 如果是1则是美团
      if (num === 1) {
        this.coupons = this.coupons1;
        this.goodsEntity.goodsTypeCoupon = this.coupons1[0].value;
      } else if (num === 2) {
        this.coupons = this.coupons2;
        this.goodsEntity.goodsTypeCoupon = this.coupons2[0].value;
      }
    },
    wang() {
      this.wangVisible = false;
      this.editor = new WangEditor("#wangedit"); // 这个地方传入div元素的id 需要加#号
      // 配置 onchange 事件
      this.editor.change = function() {
        // 这里是change 不是官方文档中的 onchange
        // 编辑区域内容变化时，实时打印出当前内容
        console.log(this.txt.html());
      };
      this.editor.create(); // 生成编辑器
      this.editor.txt.html("<p>输入内容...</p>"); // 注意：这个地方是txt  不是官方文档中的$txt
    },
    confirm() {
      // 点击确认之前进行验证
      // 点击确认
      console.log(this.formData);
      if (this.diaTitle === "新增提示语") {
        // this.formData.append("Title", this.coreEntity.Title);
        let fromData = new FormData();
        fromData.append("Content", this.noticeEntity.Content);
        this.$axios.post(UrlHelper.noticeList.insert, fromData).then(val => {
          //  console.log(val)
          if (val.data.Code === 200) {
            //  console.log('请求成功', val)
            this.$message({
              type: "success",
              message: val.data.msg,
              duration: 1000
            });
            this.dialogFormVisible = false;
            this.getList(); // 刷新页面
          } else {
            this.$message({
              type: "error",
              message: val.data.msg,
              duration: 1000
            });
          }
          formData = {};
        });
        // eslint-disable-next-line no-unreachable
      } else if (this.diaTitle === "修改商品") {
        this.goodsEntity.iid = this.imgInfo.iid;
        // 修改商品信息
        this.$axios
          .post(UrlHelper.goodsInfo.editGoodsInfo, this.goodsEntity)
          .then(val => {
            if (val.data.code === 200) {
              this.$message({
                type: "success",
                message: val.data.msg,
                duration: 1000
              });
              this.dialogFormVisible = false;
              this.getList(); // 刷新页面
            } else {
              this.$message({
                type: "error",
                message: val.data.msg,
                duration: 1000
              });
            }
          });
        //  console.log()
      }
    },
    resetForm(formName) {
      // 清除验证
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    open(data) {
      const formData = new FormData();
      let status = "";
      if (data.Status == 1) {
        status = 0;
      } else if (data.Status == 0) {
        status = 1;
      }
      formData.append("Oid", data.Id);
      formData.append("Status",status);
      // 单击启用后者禁用之后
      this.$axios.post(UrlHelper.noticeList.update, formData).then(val => {
        if (val.data.Code === 200) {
          //请求成功
          this.$message({
            type: "success",
            message: val.data.Msg,
            duration: 1000
          });
          this.getList();
        } else {
          //请求成功
          this.$message({
            type: "error",
            message: val.data.Msg,
            duration: 1000
          });
        }
      });
    }
  }
};
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>
