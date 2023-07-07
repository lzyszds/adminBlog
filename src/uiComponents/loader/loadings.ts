import './loading.css';
//移除loading效果
const hide = (id) => {
  const _id = document.querySelector(id || 'body')
  const loadingDiv = document.querySelector('#loadingDiv')
  setTimeout(() => {
    if (loadingDiv) {
      // 给loadingDiv删除
      _id!.removeChild(loadingDiv)
    }
  }, 500);
};
//展示loading效果
const show = (id, text?) => {
  //在页面未加载完毕之前显示的loading Html自定义内容
  var _LoadingHtml = `
  <div id="over" style="position:absolute;position: fixed;top: 0;left: 0; width: 100%;height: 100%; background-color: #fff;opacity:1;z-index: 2;">
  </div>
  <div id="layout"
   style="position:absolute;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2;
    text-align: center;
    transform: translate(-50%, -50%);
  }">
  ${html4}
  <div style="margin: 40px;
    text-align: center;
    font-weight: 600;
    color: #fff;
    text-shadow: 1px 1px 3px rgb(81,97,206);
    font-size: 16px;">${text == null ? text = "加载中..." : text = text}</div>
  </div>
  `;
  var div = document.createElement('div');
  div.setAttribute('id', 'loadingDiv')
  div.setAttribute('style', 'display: none;')
  //呈现loading效果
  div.innerHTML = _LoadingHtml
  let _id = document.querySelector(id || 'body')
  //如果当前所选元素大于等于页面可视高度，则loading界面设置全屏效果
  if (!_id) {
    _id = document.querySelector('body')
    _id.appendChild(div)
    let _over = document.querySelector('#over') as HTMLElement
    let _layout = document.querySelector('#layout') as HTMLElement
    _over.style.setProperty('position', 'fixed')
    _layout.style.setProperty('position', 'fixed')
    console.warn('输入的选择器不存在,默认添加到body,瞧瞧是不是因为异步问题-------来自loading内容')
  } else {
    if (_id.clientHeight >= window.screen.height) {
      _id = document.querySelector('body')
      _id.appendChild(div)
      let _over = document.querySelector('#over') as HTMLElement
      let _layout = document.querySelector('#layout') as HTMLElement
      _over.style.setProperty('position', 'fixed')
      _layout.style.setProperty('position', 'fixed')
    } else {
      _id.appendChild(div)
      let _over = document.querySelector('#over') as HTMLElement
      let _layout = document.querySelector('#layout') as HTMLElement
      _id.style.setProperty('position', 'relative')
      _over.style.setProperty('position', 'absolute')
      _layout.style.setProperty('position', 'absolute')
    }


  }


  document.getElementById("loadingDiv")!.style.display = "block";
}

/* 下方是一些loading效果的方案 */
// 方案一
const html1 = `<div class="loader">
  <div class="outer"></div>
  <div class="middle"></div>
  <div class="inner"></div>
</div>`
// 方案二
const html2 = `<div class='html2'>
<span></span>
<span></span>
<span></span>
<span></span>
</div>`
// 方案三
const html3 = `<svg viewBox="0 0 50 50" class='html3'>
<circle class="ring" cx="25" cy="25" r="20"></circle>
<circle class="ball" cx="25" cy="5" r="3.5"></circle>
</svg>
`

const html4 = ` <div class="wrapper">
                  <div class="circle"></div>
                  <div class="circle"></div>
                  <div class="circle"></div>
                  <div class="shadow"></div>
                  <div class="shadow"></div>
                  <div class="shadow"></div>
              </div> `
export default {
  hide,
  show
}
