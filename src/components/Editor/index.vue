<template>
  <div class="editor" style="margin-top:5px;">
    <div id="editorid" class="toolbar"></div>
    <div id="editorct" class="text"></div>
  </div>
</template>

<script>
  import WangEditor from 'wangeditor'

  export default {
    data() {
      return {
        editor: Object
      }
    },
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    watch: {
      data: {
        handler(newVal, oldVal) {
          this.editor.txt.html(this.data['content'])
        }
      }
    },
    mounted() {
      const that = this
      this.editor = new WangEditor('#editorid', '#editorct')
      this.editor.customConfig.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        //      'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        //      'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        //      'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]
      this.editor.customConfig.uploadImgServer = process.env.BASE_API + '/api/uploadImg'
      this.editor.customConfig.pasteIgnoreImg = true // 忽略粘贴内容中的图片
      this.editor.customConfig.showLinkImg = false // 取消插入图片链接功能
      this.editor.customConfig.uploadImgShowBase64 = false
      this.editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
          var url = result.data
          insertImg(process.env.BASE_API + '/api/downFile/' + url + '/tt')
        }
      }
      this.editor.customConfig.onchange = (html) => {
        that.data['content'] = html
      }
      this.editor.create()
      if (this.data['content']) {
        this.editor.txt.html(this.data['content'])
      }
    }
  }
</script>
<style scoped>
  .editor {
    height: 100%;
  }

  .toolbar {
    height: 60px;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .text {
    height: 200px;
    border: 1px solid #ccc;
    resize: vertical;
  }
</style>
