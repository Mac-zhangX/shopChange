<template>
  <div class="app-container">

    <!-- <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />
    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    /> -->
    <div id="div1" />
  </div>
</template>

<script>
import WangEditor from 'wangeditor'
export default {

  data() {
    return {
      filterText: '',
      data2: [{
        id: 1,
        label: 'Level one 1',
        children: [{
          id: 4,
          label: 'Level two 1-1',
          children: [{
            id: 9,
            label: 'Level three 1-1-1'
          }, {
            id: 10,
            label: 'Level three 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: 'Level one 2',
        children: [{
          id: 5,
          label: 'Level two 2-1'
        }, {
          id: 6,
          label: 'Level two 2-2'
        }]
      }, {
        id: 3,
        label: 'Level one 3',
        children: [{
          id: 7,
          label: 'Level two 3-1'
        }, {
          id: 8,
          label: 'Level two 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  mounted() {
    this.editor = new WangEditor('#div1') // 这个地方传入div元素的id 需要加#号
    // 配置 onchange 事件
    this.editor.change = function() { // 这里是change 不是官方文档中的 onchange
      // 编辑区域内容变化时，实时打印出当前内容
      console.log(this.txt.html())
    }
    this.editor.create() // 生成编辑器
    this.editor.txt.html('<p>输入内容...</p>') // 注意：这个地方是txt  不是官方文档中的$txt
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

