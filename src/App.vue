<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',

}
</script>
<style>
/* 表头错位 解决样式 */
  body .el-table th.gutter{
        display: table-cell!important;
      }

      body .el-table colgroup.gutter{
        display: table-cell!important;
      }
      /* .el-table--border td{
   border-right: none;
   }
 .el-table::before{
  height:0;
}
 .base .el-table__body{
  border-top: 1px solid #CCCCCC;
} */

</style>
