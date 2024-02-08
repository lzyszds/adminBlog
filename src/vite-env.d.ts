
//声明*.vue
declare module '*.vue' {
  import { defineComponent } from 'vue'
  const component: ReturnType<typeof defineComponent>
  export default component
}

declare module 'markdown-it-mark'
declare module 'markdown-it-container'
declare module 'markdown-it-bracketed-spans'
declare module 'markdown-it-inline-comments'
