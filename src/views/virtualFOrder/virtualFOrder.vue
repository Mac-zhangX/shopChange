<template>
  <div style="padding:1rem">
    <!-- 虚拟已完成订单 -->
    <div class="filter">
      <div>
        手机号&nbsp;&nbsp;
        <el-input v-model="Search" size="small" class="input1" placeholder="请输入内容" />
      </div>
      <div>
        开始时间&nbsp;&nbsp;
        <el-date-picker
          v-model="Start"
          size="small"
          class="input1"
          format="yyyy-MM-dd 00:00:00"
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
          format="yyyy-MM-dd 23:59:59"
          type="date"
          placeholder="选择日期"
        />
      </div>
      <div>
        状态&nbsp;&nbsp;
        <el-select v-model="Status" size="small" class="input1" placeholder="请选择">
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
    </div>
    <div>
      <el-button type="primary" size="small" icon="el-icon-upload2" @click="exportExcel()">导出</el-button>
    </div>
    <div>
      <el-button v-if="checkedAll" size="small" class="el-icon-edit" type="danger" @click="hexiao()">批量核销</el-button>
      <el-button v-if="checkedAll" size="small" class="el-icon-edit" type="warning" @click="shenhe()">批量审核</el-button>
    </div>
    <div style="margin-top:1rem">
      <div class="mine">
        <!-- 表格 -->
        <el-table
          ref="multipleTable"
          :data="tableData"
          size="small"
          border
          style="width: 100%"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column width="70" prop="Name" label="积分商品" />
          <el-table-column width="70" prop="Money" label="商品面额" />
          <el-table-column prop="Phone" label="兑换人手机号" />
          <el-table-column prop="Tel" label="申报人手机号" />
          <el-table-column prop="Nickname" label="上报人名称" />
          <el-table-column width="55" prop="Fid" label="一级" />
          <el-table-column prop="Ordernumber" label="订单编号" />
          <el-table-column prop="Disone" label="一级返佣" />
          <el-table-column prop="Distwo" label="二级返佣" />
          <el-table-column prop="Discountone" label="一级折扣%" />
          <el-table-column prop="Discounttwo" label="二级折扣%" />
          <el-table-column width="70" prop="StatusName" label="状态" />
          <el-table-column prop="Timeline" label="创建时间" />
          <!-- <el-table-column prop="xflag" label="提交状态" /> -->
          <el-table-column align="center" prop="handle" label="操作" class="make">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="审核" placement="top">
                <el-button
                  size="mini"
                  type="warning"
                  icon="el-icon-zoom-in"
                  circle
                  @click="check(scope.row)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="核销" placement="top">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-info"
                  circle
                  @click="hx(scope.row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>

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
          :model="ruleForm"
          :rules="rules1"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="申报号码" prop="sbnumbe">
            <el-input v-if="diaTitle==='新增申报信息'" v-model="ruleForm.sbnumbe" placeholder="请输入申报号码" />
            <el-input
              v-if="diaTitle==='编辑申报信息'"
              v-model="ruleForm.sbnumbe"
              disabled
              placeholder="请输入申报号码"
            />
          </el-form-item>
          <el-form-item label="兑换号码" prop="dhnumbe">
            <el-input v-model="ruleForm.dhnumbe" placeholder="请输入兑换号码" />
          </el-form-item>
          <el-form-item label="积分名称" prop="gid">
            <el-select v-model="ruleForm.gid" placeholder="请选择积分档">
              <el-option
                v-for="item in coreLevel"
                :key="item.id"
                :label="item.gname"
                :value="item.gid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="套餐名称" prop="sid">
            <el-select v-model="ruleForm.sid" placeholder="请选择套餐名称">
              <el-option
                v-for="item1 in packages"
                :key="item1.id"
                :label="item1.sname"
                :value="item1.sid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否提交" prop="sflag">
            <!-- 1是未提交2是提交 -->
            <el-radio v-model="ruleForm.sflag" :label="1">申报</el-radio>
            <el-radio v-model="ruleForm.sflag" :label="2">申报中</el-radio>
            <el-radio v-model="ruleForm.sflag" :label="3">申报失败</el-radio>
            <el-radio v-model="ruleForm.sflag" :label="4">申报成功</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDialog()">取 消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 1 -->
  </div>
</template>

<script>
/* eslint-disable */
import { UrlHelper } from "../../api/urlHelper";
import Pagination from "../../components/Pagination";
import moment from "moment";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      console.log("验证触发了吗", value);
      // 验证号码1，2
      // 手机号正则表达式
      const reg = /^1[3456789]\d{9}$/;
      if (value === "") {
        callback(new Error("号码不能为空"));
      } else if (!reg.test(value)) {
        // 如果不符合手机号
        callback(
          new Error(
            "请输入正确的手机号码                                                                   "
          )
        );
      } else {
        callback();
      }
    };
    return {
      checkedAll: false,
      input: "",
      diaTitle: "",
      tableData: [],
      coreLevel: [], // 积分档数据
      packages: [], // 获取套餐当
      multipleSelection: [],
      currentPage4: 4,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id"
      },
      // 模态框
      dialogFormVisible: false,
      ruleForm: {
        dhnumbe: "",
        sbnumbe: "",
        gid: "",
        sid: "",
        sflag: ""
      },
      rules1: {
        dhnumbe: [
          { required: true, message: "兑换号码不能为空" },
          { validator: validatePass, trigger: "blur" }
        ],
        sbnumbe: [
          { required: true, message: "申报号码不能为空" },
          { validator: validatePass, trigger: "blur" }
        ],
        gid: [{ required: true, message: "积分名称不能为空" }],
        sid: [{ required: true, message: "套餐名称不能为空" }],
        sflag: [{ required: true, message: "提交状态不能为空" }]
      },
      Start: "", //起始时间
      End: "", // 结束时间
      Search: "", //查询手机号
      Status: "", //状态
      options: [
        { value: "1", label: "核销中" },
        { value: "2", label: "核销通过" },
          { value: "3", label: "核销失败" },
            { value: "4", label: "审核通过" }
      ]
    };
  },
  mounted() {
    this.init();
  //  this.getList();
    // this.getCoreLevel();
    // this.getPackageName();
  },
  methods: {
    // 初始化时间
    init() {
      // 初始化时间
      const date = new Date();
      this.Start = moment(date).format("YYYY-MM-DD 00:00:00");
      this.End = moment(date).format("YYYY-MM-DD 23:59:59");
    },
    // 获取积分档
    getCoreLevel() {
      this.$axios.post(UrlHelper.declInfo.queryCoreLevel).then(val => {
        if (val.status === 200) {
          this.coreLevel = val.data; // 积分档
        }
      });
    },
    // 获取套餐名称
    getPackageName() {
      this.$axios.post(UrlHelper.declInfo.queryPackageClass).then(val => {
        this.packages = val.data; // 套餐档
      });
    },
    // 分页
    getList() {
      if (
        this.Start !== null &&
        this.Start !== "" &&
        this.Start !== undefined
      ) {
        this.Start = moment(this.Start).format("YYYY-MM-DD 00:00:00");
      }
      if (this.Start == null) {
        this.Start = "";
      }
      if (this.End == null) {
        this.End = "";
      }
      if (this.End !== null && this.End !== "" && this.End !== undefined) {
        this.End = moment(this.End).format("YYYY-MM-DD 23:59:59");
      }
      const formData = new FormData();
      formData.append("Search", this.Search);
      formData.append("Start", this.Start);
      formData.append("End", this.End);
      formData.append("Status", this.Status);
      formData.append("Page", this.listQuery.page);
      formData.append("Num", this.listQuery.limit);
      this.$axios.post(UrlHelper.orderList.getList, formData).then(val => {
        if (val.data.Code === 200) {
          this.tableData = val.data.Data.data;
          this.total = val.data.Data.total;
          this.tableData.map(val => {
            if (val.Status === 1) {
              val.StatusName = "核销中";
            } else if (val.Status === 2) {
              val.StatusName = "核销通过";
            } else if (val.Status === 3) {
              val.StatusName = "核销失败";
            } else if (val.Status === 4) {
              val.StatusName = "审核通过";
            }
          });
          const len = this.tableData.length;
          if (len === 0 && this.listQuery.page > 1) {
            this.listQuery.page -= 1;
            this.getList();
          }
        }
      });
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
        this.checkedAll = true
      } else {
        this.checkedAll = false
      }
      this.multipleSelection = val
    },
    addMessage() {
      this.diaTitle = "新增申报信息";
      this.dialogFormVisible = true;
      // this.$refs['ruleForm'].resetFields();
      // this.resetForm('ruleForm')
    },
    submitForm(formName) {
      // 提交之前验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 验证通过之后进行提交或者编辑
          if (this.diaTitle === "新增申报信息") {
            this.$axios
              .post(UrlHelper.declInfo.declInfoAdd, this.ruleForm)
              .then(val => {
                if (val.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: val.data.msg,
                    duration: 1000
                  });
                  this.getList();
                  this.dialogFormVisible = false;
                } else {
                  this.$message({
                    type: "error",
                    message: val.data.msg,
                    duration: 1000
                  });
                }
              });
          } else if (this.diaTitle === "编辑申报信息") {
            this.$axios
              .post(UrlHelper.declInfo.declIOnfoEdit, this.ruleForm)
              .then(val => {
                if (val.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: val.data.msg,
                    duration: 1000
                  });
                  this.getList();
                  this.dialogFormVisible = false;
                } else {
                  this.$message({
                    type: "error",
                    message: val.data.msg,
                    duration: 1000
                  });
                }
              });
          }
        } else {
          return false;
        }
      });
    },
    edit(data) {
      this.diaTitle = "编辑申报信息";
      this.ruleForm = {
        did: data.did,
        dhnumbe: data.dhnumbe,
        sbnumbe: data.sbnumbe,
        gid: data.gid,
        sid: data.sid,
        sflag: data.sflag
      };
      this.dialogFormVisible = true;
    },
    //清空验证的方法
    closeDialog() {
      //关闭模态框事件
      this.ruleForm = {
        did: "",
        dhnumbe: "",
        sbnumbe: "",
        gid: "",
        sid: "",
        sflag: ""
      }; // 清空模态框数据
      //  this.$refs['ruleForm'].resetFields();
      this.resetForm("ruleForm");
      this.dialogFormVisible = false;
    },
    resetForm(formName) {
      // 清除验证
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
    },
    // 核销
    hexiao(){
      // 获取所有选择的id
      console.log(this.multipleSelection)
      let Oid = ''
      const len = this.multipleSelection.length
      this.multipleSelection.map((val,index)=>{
        if(len==(index+1)){
           Oid = Oid + val.Id
        }else{
             Oid = Oid + val.Id + ','
        }
       
      })
      const format = new FormData()
      format.append('Oid',Oid)
      this.$axios.post(UrlHelper.orderList.audit,format).then(val=>{
        if(val.data.Code===200){
              this.$message({
                    type: "success",
                    message: val.data.Msg,
                    duration: 1000
                  });
                    this.getList()
        }else {
            this.$message({
                    type: "error",
                    message: val.data.Msg,
                    duration: 1000
                  });
        }
      })
    },
    shenhe(){
         console.log(this.multipleSelection)
      let Oid = ''
      const len = this.multipleSelection.length
      this.multipleSelection.map((val,index)=>{
        if(len==(index+1)){
           Oid = Oid + val.Id
        }else{
             Oid = Oid + val.Id + ','
        }
       
      })
      const format = new FormData()
      format.append('Oid',Oid)
    //  this.$axios.post(UrlHelper.orderList. orderWrite)
         this.$axios.post(UrlHelper.orderList.write,format).then(val=>{
        if(val.data.Code===200){
              this.$message({
                    type: "success",
                    message: val.data.Msg,
                    duration: 1000
                  });
                  this.getList()
        }else {
            this.$message({
                    type: "error",
                    message: val.data.Msg,
                    duration: 1000
                  });
        }
      })
    },
    check(data){ // 单击审核
          const format = new FormData()
      format.append('Oid',data.Id)
    //  this.$axios.post(UrlHelper.orderList. orderWrite)
         this.$axios.post(UrlHelper.orderList.write,format).then(val=>{
        if(val.data.Code===200){
              this.$message({
                    type: "success",
                    message: val.data.Msg,
                    duration: 1000
                  });
                  this.getList()
        }else {
            this.$message({
                    type: "error",
                    message: val.data.Msg,
                    duration: 1000
                  });
        }
      })
    },
    hx(data){  // 单击核销
        const format = new FormData()
      format.append('Oid',data.Id)
      this.$axios.post(UrlHelper.orderList.audit,format).then(val=>{
        if(val.data.Code===200){
              this.$message({
                    type: "success",
                    message: val.data.Msg,
                    duration: 1000
                  });
                    this.getList()
        }else {
            this.$message({
                    type: "error",
                    message: val.data.Msg,
                    duration: 1000
                  });
        }
      })
    },
        // 导出
    // 导出的方法
    exportExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require('../../excel/Export2Excel')
        const tHeader = 
        ['积分商品',
         '商品面额', 
         '兑换人手机号', 
         '申报人手机号',
          '上报人名称',
          '一级',
          '订单编号',
          '一级返佣',
          '二级返佣',
          '一级折扣',
          '二级折扣',
           '状态',
           '创建时间',
          ]
        // 上面设置Excel的表格第一行的标题
        const filterVal = ['Name', 
        'Money', 
        'Phone',
         'Tel',
        'Nickname', 
        'Fid',
         'Ordernumber',
         'Disone', 
        'Distwo', 
        'Discountone',
         'Discounttwo', 
        'StatusName', 
        'Timeline',
         
         ]
        // 上面的index、nickName、name是tableData里对象的属性
        const list = this.tableData // 把data里的tableData存到list
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '虚拟已完成订单')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  // 分页
  components: {
    Pagination
  }
};
</script>
<style scoped lang="scss">
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
  margin-left: 5px;
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
  margin-bottom: 0.5rem;
  > div {
    margin-right: 1rem;
  }
}
.input1 {
  width: 200px;
}
</style>

