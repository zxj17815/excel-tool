<script setup lang="ts">
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })
</script>

<template>
  <ul class="versions">
    <li class="v8-version">App Ver1.0 by JayZhang</li>
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
    <li class="v8-version">V8 v{{ versions.v8 }}</li>
  </ul>
</template>

<style lang="less" scoped>
ul {
  list-style: none;
  position: absolute;
  bottom: 10px;
}

.versions {
  margin: 0 auto;
  float: none;
  clear: both;
  overflow: hidden;
  font-family: 'Menlo', 'Lucida Console', monospace;
  color: #2f3241;
  line-height: 1;
  transition: all 0.3s;

  li {
    display: block;
    float: left;
    border-right: 1px solid rgba(194, 245, 255, 0.4);
    padding: 0 6px;
    font-size: 12px;
    opacity: 0.8;

    &:last-child {
      border: none;
    }
  }
}
</style>