<template>
  <div class="videoplay">
    <div class="videoarea">
      <div class="videotype">
        <span v-if="videoinfo.vid">视频详情</span>
        <span v-if="mvinfo.id">mv详情</span>
      </div>
      <div class="videoplayarer">
        <!-- <video :src="videoinfo.url"
               controls
               autoplay
               v-if="videoinfo.vid"></video>
        <video :src="mvinfo.url"
               controls
               autoplay
               v-if="mvinfo.id">{{12}}</video> -->
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    videoinfo: Object,
    mvinfo: Object
  },
  data () {
    return {
    }
  },
  methods: {


  },
  created () {

  }
}
</script>