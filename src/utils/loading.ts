import { h, createVNode, render, nextTick } from 'vue'

export default {
  // 当被绑定的元素挂载到 DOM 中时
  mounted(el, binding) {
    // 创建loading元素  
    const loadingElement = h('div', { id: 'loadingVNode' }, [
      h('div', { id: 'over' }), // 用于全屏遮罩效果的元素
      h('div', { id: 'layout' }, [
        h('div', { class: 'loading-svg' }, [h('span'), h('span'), h('span'), h('span')]), // 使用自定义loading内容组件
        h('div', { class: 'loading-text' }, "加载中...")
      ]) // loading内容的元素
    ])
    el.__loadingElement = loadingElement;
  },

  // 在VNode更新时调用
  updated(el, binding) {
    const loadingElement = el.__loadingElement;

    // 根据绑定的值更新loading显示或隐藏
    if (binding.value) {
      //渲染loading组件
      render(loadingElement, el);
    } else {
      //移除loading组件
      render(null, el);
    }
  },
  beforeUnmount(el) {
    // 移除loading组件
    render(null, el);
  }
};

const setLoadingPosition = (targetElement) => {
  const loadingDiv = document.querySelector('#loadingVNode') as HTMLElement;
  let parentWidth, parentHeight
  if (loadingDiv) {
    targetElement.style.position = 'relative';
    // 获取父元素的宽度和高度
    parentWidth = targetElement.clientWidth;
    parentHeight = targetElement.clientHeight;
    if (targetElement.nodeName == 'BODY') {
      parentWidth = targetElement.clientWidth -  1
      parentHeight = targetElement.clientHeight -  1
    }
    // 设置loading元素的宽度和高度与父元素相同
    loadingDiv.style.width = parentWidth + 'px';
    loadingDiv.style.height = parentHeight + 'px';
  }
};

const createLoadingElement = (text) => {
  const loadtext = text.text || '加载中...';
  // Create the loading element using the h function
  const loadingElement = h('div', { id: 'loadingVNode' }, [
    h('div', { id: 'over' }), // For fullscreen overlay effect
    h('div', { id: 'layout' }, [
      h('div', { class: 'loading-svg' }, [
        h('span'),
        h('span'),
        h('span'),
        h('span'),
      ]),
      h('div', { class: 'loading-text' }, loadtext) // Text for loading
    ])
  ]);

  return loadingElement;
};

export const hide = (id?) => {
  const targetElement = document.querySelector(id || 'body');
  // setTimeout(() => {
  render(null, targetElement);
  // }, 50)
};

export const show = async (id?, text?) => {
  const targetElement = document.querySelector(id || 'body');
  if (!targetElement) {
    throw new Error('输入的选择器不存在，默认添加到body。瞧瞧是不是因为异步问题-------来自loading内容');
  }
  //使用createVNode创建加载元素，使用createLoadingElement创建自定义元素
  const loadingElement = createVNode(createLoadingElement, { text });
  //将加载div附加到所选元素
  render(loadingElement, targetElement);
  //使用nextTick确保在设置加载位置之前已渲染DOM
  await nextTick();
  //根据元件的高度设置加载元件的位置
  setLoadingPosition(targetElement);
};


