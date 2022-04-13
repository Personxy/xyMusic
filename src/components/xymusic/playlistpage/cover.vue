<template>
  <!-- 全屏遮罩 -->
  <div class="fullscreencover"></div>
</template>
<script>
export default {};
</script>
<style>
.fullscreencover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  z-index: 1801;
}
</style>
