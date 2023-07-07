import '@kangc/v-md-editor/lib/style/base-editor.css';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import '@/assets/css/essay.less'

/* ------------Markdown-------------- */
import VueMarkdownEditor from '@kangc/v-md-editor';

import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';

import Prism from 'prismjs';
//插入自定义文本
import container from 'markdown-it-container'
//标记
import mark from 'markdown-it-mark'

//表情包
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';

//LineNumber 高亮代码行号
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
//Align 内容定位 可以引入 align 插件来支持设置内容的水平位置：
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';
//可以给当前标记添加各种属性,类似与jQuery的attr 点击查看参考
import markdownItAttrs from 'markdown-it-attrs'
//

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
  extend(md) {
    md.use(mark)
      .use(markdownItAttrs, {
        // optional, these are default options
        leftDelimiter: '{',
        rightDelimiter: '}',
        allowedAttributes: []  // empty array = all attributes are allowed
      })
      .use(container, 'spoiler', {
        validate: function (params) {
          return params.trim().match(/^spoiler\s+(.*)$/);
        },
        render: function (tokens, idx) {
          var m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);
          if (tokens[idx].nesting === 1) {
            // opening tag
            return '<details><summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n';
          } else {
            // closing tag
            return '</details>\n';
          }
        }
      })
    // 添加规则 给当前所有的标签都添加上id
    md.core.ruler.push('show-line', (state) => {
      // forEach 遍历 tokens
      state.tokens.forEach(token => {
        // token.map 即所在的行数
        if (token.map && (token.tag === 'h2' || token.tag === 'h3')) {
          // 起始行
          const id = ["id", 'toc-head-' + token.map[0].toString()]
          // 初始化属性
          token.attrs = token.attrs || []
          // 添加属性
          token.attrs.push(id)
        }
      })
      return true;
    });


    md.core.ruler.push('music', function replace(state) {

      //实现了导入音乐播放器(((:路径不要带https:)))
      return '出了点问题，暂时停用'
      if (state.tokens) {
        state.tokens.forEach(token => {
          if (token.children) {
            token.children.forEach((child, index) => {
              const lent = child.content//.split(':')
              const pat = /^[(]{1}/
              console.log(pat.test(lent[0]))
              if (lent.length <= 1) return
              token.children.splice(0, 1)
              token.children.push({
                attrs: [['src', lent[1]], ['controls', true]],
                block: false,
                children: null,
                content: '',
                hidden: false,
                info: "",
                level: 0,
                map: null,
                markup: "(((:",
                meta: null,
                nesting: 0,
                tag: "audio",
                type: "audio_open",
              }, {
                attrs: null,
                block: false,
                children: null,
                content: '',
                hidden: false,
                info: "",
                level: 0,
                map: null,
                markup: "",
                meta: null,
                nesting: -1,
                tag: "",
                type: "text",
              }, {
                attrs: null,
                block: false,
                children: null,
                content: '',
                hidden: false,
                info: "",
                level: 0,
                map: null,
                markup: ":)))",
                meta: null,
                nesting: -1,
                tag: "audio",
                type: "audio_close",
              })
            })
          }
        });
      }
    });
  }
}).use(createEmojiPlugin())
  .use(createLineNumbertPlugin())
  .use(createCopyCodePlugin())
  .use(createAlignPlugin());
export default VueMarkdownEditor
/* ------------Markdown-------------- */
