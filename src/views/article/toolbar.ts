

const toolbar = {
  addTag: {
    title: '添加标记',
    icon: 'iconfont icon-bg-color',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '==';
        const suffix = '==';
        const placeholder = '请输入文本';
        const content = selected || placeholder;
        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },

  },
  music: {
    title: '音乐',
    icon: 'fa fa-yc-square',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '(((:';
        const suffix = ':)))';
        const placeholder = '//m701.music.126.net/20221030170951/44e47b6cca6b689a455ff3bd0bdabcfc/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096479954/d772/334b/dd34/08377580c7f76289955a97a48e5c0ca1.mp3';
        const content = selected || placeholder;
        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },
  test: {
    title: '音乐',
    icon: 'fa fa-yc-square',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '(((:';
        const suffix = ':)))';
        const placeholder = '//m701.music.126.net/20221030170951/44e47b6cca6b689a455ff3bd0bdabcfc/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096479954/d772/334b/dd34/08377580c7f76289955a97a48e5c0ca1.mp3';
        const content = selected || placeholder;
        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },

  },
  left: {
    title: '居左',
    icon: 'iconfont icon-text-align-left',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '::: align-left \n';
        const suffix = '\n:::';
        const placeholder = '请输入文本';
        const content = selected || placeholder;

        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },
  center: {
    title: '居中',
    icon: 'iconfont icon-text-align-center',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '::: align-center \n';
        const suffix = '\n :::';
        const placeholder = '请输入文本';
        const content = selected || placeholder;

        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },
  right: {
    title: '居右',
    icon: 'iconfont icon-text-align-right',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = '::: align-right \n';
        const suffix = ' \n:::';
        const placeholder = '请输入文本';
        const content = selected || placeholder;

        return {
          text: `${prefix}\n${content}\n${suffix}`,
          selected: content,
        };
      });
    },
  },
  tips: {
    title: '提示:可以给当前标记添加各种属性,类似与jQuery的attr 点击查看参考',
    icon: 'fa fa-exclamation-circle',
    action(editor) {
      editor.insert(function (selected) {
        const prefix = 'F12看看我就明白了,定义特殊属性时得加data-xxxx才能添加{.lzy_class #lzy_id ';
        const suffix = ' }';
        const placeholder = ' data-lzyqq=1024327189';
        const content = selected || placeholder;

        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },
}



export default toolbar
