<template>
  <button class="zybutton ">
    <slot />
  </button>
</template>
<script >
</script>
<style scoped>
/* From uiverse.io */
.zybutton {
  position: relative;
  text-transform: uppercase;
  text-decoration: none;
  display: inline-block;
  border-radius: 6em;
  transition: all 0.2s;
  border: none;
  font-family: inherit;
  color: #000;
  background-color: #fff;
  padding: 5px 10px;
  margin-left: 10px;
}

.zybutton:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.zybutton:active {
  transform: translateY(-1px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
}

.zybutton::after {
  content: "";
  display: inline-block;
  height: 100%;
  width: 100%;
  border-radius: 100px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  transition: all 0.4s;
}

.zybutton::after {
  background-color: #fff;
}

.zybutton:hover::after {
  transform: scaleX(1.4) scaleY(1.6);
  opacity: 0;
}
</style>
