<template>
  <div style="padding:1rem">
    <div>
      <el-row type="flex">

        <el-col :span="16">
          <div>
            手机号 <el-input v-model="phoneNumber" size="small" style="width: 12rem" placeholder="请输入内容" prefix-icon="el-icon-search" />
            <el-button type="primary" size="small" icon="el-icon-search" @click="getList()">搜索</el-button>
          </div>
        </el-col>

      <!-- <el-button size="mini" icon="el-icon-plus" type="primary" @click="addFun()">添加</el-button> -->
      <!-- <el-button v-if="checkedAll" size="mini" class="el-icon-delete" type="danger" @click="delAll()">批量删除</el-button> -->
      </el-row>
      <el-row type="flex">
        <div style="margin-top:1rem;">
          查询结果：<span style="color:#827768"> {{ data }}</span>

        </div>
      </el-row>
    </div>

  </div>
</template>
<script>

import { UrlHelper } from '@/api/urlHelper'
// import Pagination from '@/components/Pagination/index'
// import moment from 'moment'

export default {
  components: {
    // Pagination

  },
  data() {
    return {
      data: '',
      phoneNumber: ''
    }
  },
  mounted() {
    // this.getList()
  },
  methods: {

    getList() {
      this.$axios.get(UrlHelper.getXIMALAYAlIST.getList + '?phone=' + this.phoneNumber).then(val => {
        // console.log(val.data.code)
        if (val.data.code === 200) {
        //  console.log(val.data.msg)
          this.$message({
            type: 'success',
            message: val.data.msg,
            duration: 1000
          })
          if (val.data.data === '') {
            this.data = val.data.data.errorMsg
          } else {
            this.data = val.data.data
          }

        //   console.log('data', val.data.data.data)
        //   if (val.data.data.success === false) {
        //     this.data = {
        //       code: val.data.data.errorCode,
        //       msg: val.data.data.errorMsg
        //     }
        //   }
        } else {
          this.$message({
            type: 'error',
            message: val.data.msg,
            duration: 1000
          })
        }
      })
    }

  }
}
</script>

<style scoped lang="scss">
    .box{
        margin-top: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
    .box-card{
        width: 380px;
        height: 200px;
        box-sizing: border-box;
    }
    .statics{
        margin-left: 3%;
        font-size: 20px;
        color: black;
    }
    .el-form-item{
        margin-bottom: 0.5rem;
    }
    .colTow{
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        }
        .card1{
            background: -webkit-linear-gradient(right top, #ffd705 , #EBDFA1); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(top right, #ffd705, #EBDFA1); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(top right, #ffd705, #EBDFA1); /* Firefox 3.6 - 15 */
            background: linear-gradient(to top right, #ffd705 , #EBDFA1); /* 标准的语法 */
            color: #fff;

        }
        /deep/ .el-form-item__label{
             color: #fff;
             font-size: 13px;
        }
        .el-card:hover{
            border: 1px solid #ffd705;
            box-shadow: 0 0 4px #ffd705;
            -webkit-box-shadow: 0 0 10px #ffd705;
        }
        .num{
            font-size: 30px;
        }
        /deep/ .el-card__body {
            height: 200px;
        }
</style>
