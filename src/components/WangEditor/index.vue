<template>
  <!-- 富文本编辑器组件 -->
  <div>
    <div id="div1" />
  </div>
</template>

<script>
import WangEditor from 'wangeditor'
export default {
  data() {
    return {
      data: '' // 子组件向父组件传值
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

  }
}
</script>

<style lang="scss" scoped>

</style>
