import vue from "vue";
//年月日格式化
vue.filter("dateFormat", (time) => {
  const date = new Date(time);
  var YY = date.getFullYear();
  var MM =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

  return `${YY}-${MM}-${DD}`;
});
// 收藏数变为万单位
vue.filter("wan", (count) => {
  if (count > 10000) return parseInt(count / 10000) + "万";
  return count;
});
// 分秒格式化
vue.filter("minutesformat", (time) => {
  let minute = time / 60;
  let minutes = parseInt(minute);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let second = time % 60;
  let seconds = Math.floor(second);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return `${minutes}:${seconds}`;
});
