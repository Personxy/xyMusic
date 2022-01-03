<template>
  <div class="currentplay">
    <div class="left"></div>
    <div class="mid"></div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {
  name: "playanimation",
};
</script>
<style lang="less" scoped>
.currentplay {
  width: 12px;
  height: 12px;
  transform: rotate(180deg);
  overflow: hidden;
  .left {
    float: left;
    width: 3px;
    height: 1px;
    background-color: #ec4141;
    margin-right: 1px;
    animation-name: left;
    animation-duration: 0.7s;
    animation-iteration-count: infinite;
    animation-direction: alternate-reverse;
  }
  .mid {
    float: left;
    width: 3px;
    height: 1px;
    background-color: #ec4141;
    margin-right: 1px;
    animation-name: mid;
    animation-duration: 0.8s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  .right {
    float: left;
    width: 3px;
    height: 1px;
    background-color: #ec4141;
    margin-right: 1px;
    animation-name: right;
    animation-duration: 0.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
  @keyframes left {
    to {
      height: 8px;
    }
  }
  @keyframes mid {
    to {
      height: 9px;
    }
  }
  @keyframes right {
    to {
      height: 12px;
    }
  }
}
</style>
