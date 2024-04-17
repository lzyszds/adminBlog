<script setup lang="ts"></script>

<template>
  <div class="undefined">内容暂未开发,敬请期待</div>
</template>

<style lang="scss" scoped>
$themeColor: var(--themeColor);

.undefined {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 50px;
  color: $themeColor;
  font-weight: bold;
  background-color: #fff;
  flex-direction: column;
  font-family: "dindin";

  .undefined {
    font-size: 20px;
    color: #000;
  }
}
</style>
