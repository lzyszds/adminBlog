export default {
  mounted(el, binding) {
    const observe = new IntersectionObserver((entries) => {
      const { isIntersecting } = entries[0]
      if (isIntersecting == true) {
        //设置动画
        el.classList.add(binding.value)
        observe.unobserve(el)
      }
    })
    observe.observe(el)
  },
}
