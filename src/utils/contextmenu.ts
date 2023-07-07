import { ElMessage } from 'element-plus'
const svg = {
  copyIcon: `<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" style="margin-right: 7px" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
  cutIcon: `<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" style="margin-right: 7px" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>`,
  pasteIcon: `<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" style="margin-right: 7px; position: relative; top: -1px" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
  downloadIcon: `<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" style="margin-right: 7px; position: relative; top: -1px" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
  deleteIcon: `<svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none" style="margin-right: 7px" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
};

const menuItems = [
  {
    content: `${svg.copyIcon}Copy`,
    events: {
      click: (e) => {
        //获取当前浏览器选中的文本
        const text = window.getSelection()!.toString()
        //将文本通过 clipboard 传入剪切板
        navigator.clipboard.writeText(text).then(() => {
          if (!text) return ElNotification({ title: '复制失败', message: '请选择文本' })
          ElMessage({
            type: 'success',
            // title: '提示',
            grouping: true,
            message: '复制成功：' + text
          })
          /* clipboard successfully set */
        }, function (res) {
          console.log("lzy ~ res", res)
          /* clipboard write failed */
        });

        // document.execCommand("Copy")
        // console.log(e, "Copy Button Click")
      },
      // mouseover: () => console.log("Copy Button Mouseover")
      // You can use any event listener from here
    },
  },
  { content: `${svg.pasteIcon}Paste` },
  { content: `${svg.cutIcon}Cut` },
  { content: `${svg.downloadIcon}Download` },
  {
    content: `${svg.deleteIcon}Delete`,
    divider: "top", // top, bottom, top-bottom
  },
];
let ul
window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (ul) ul.remove();
  ul = document.createElement("ul");
  document.body.appendChild(ul);
  ul.classList.add("contextMenu");
  menuItems.forEach((item, index) => {
    const button = document.createElement("button");
    const li: any = document.createElement("li");
    button.classList.add("contextMenu-button");
    li.classList.add("contextMenu-item");
    button.innerHTML = item.content;
    li.addEventListener("click", (e) => {
      ul.remove();
      if (item.events) {
        item.events.click(e);
      }
    });
    li.appendChild(button);
    li.firstChild.setAttribute("style", `animation-delay: ${index * 0.08}s`);
    ul.appendChild(li);
    ul.setAttribute("style", `--height: ${ul.scrollHeight}px;--top: ${e.clientY}px; --left: ${e.clientX}px;`);
  });
});
function removeMessage() {
  const contextMenu = document.querySelector(".contextMenu");
  if (contextMenu) contextMenu.remove();
}
window.addEventListener("click", removeMessage);
window.addEventListener("blur", removeMessage);

//提示框
function ElNotification(options) {
  const content: any = document.querySelectorAll('.notification-content')
  let top = null
  if (content.length > 0) {
    top = content[content.length - 1].parentNode.offsetTop +
      content[content.length - 1].parentNode.scrollHeight + 20
  }
  const notification = document.createElement("div");
  notification.classList.add("notification");
  if (top) notification.style.top = top + 'px'
  const style = options.title == '提示' ? 'color:#67c23a' : 'color:red';
  notification.innerHTML = `
    <div class="notification-content">
      <h2 class="notification-title" style='${style}'>${options.title}</h2>
      <div class="notification-message">${options.message}</div>
    </div>
    <div class="notification-close">
      <svg viewBox="0 0 24 24" width="17" height="17" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </div>
  `;
  const close: any = notification.querySelector('.notification-close')
  const closeclick = close.addEventListener('click', function (e) {
    close.removeEventListener('click', closeclick)
    notification.remove()
  })
  document.body.appendChild(notification);
  const title = notification.querySelector('.notification-title') as HTMLDivElement
  const message = notification.querySelector('.notification-message') as HTMLDivElement
  notification.style.height =
    title.scrollHeight
    + message.scrollHeight + 34 + 'px'
  setTimeout(() => {
    close.removeEventListener('click', closeclick)
    notification.remove();
  }, 2000);
}
