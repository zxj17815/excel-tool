<script setup lang="ts">
import Versions from './components/Versions.vue'
import Sqlview from './components/Sqlview.vue'
</script>

<template>
  <div class="header">
    <div class="title">WING平台数据分析工具</div>
  </div>
  <div class="content">
    <Sqlview></Sqlview>
  </div>
  <div class="footer">
    <Versions></Versions>
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
