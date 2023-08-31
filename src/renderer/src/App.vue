<script setup lang="ts">
import Versions from './components/Versions.vue'
import Sqlview from './components/Sqlview.vue'
import { NNotificationProvider, NConfigProvider, NDialogProvider } from 'naive-ui'
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <div id="app">
    <n-dialog-provider>
      <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
        <div class="header">
          <div class="title">WING平台数据分析工具</div>
        </div>
        <div class="content">
          <n-notification-provider>
            <Sqlview></Sqlview>
          </n-notification-provider>
        </div>
        <div class="footer">
          <Versions></Versions>
        </div>
      </n-config-provider>
    </n-dialog-provider>
  </div>
</template>

<style lang="less">
@import './assets/css/styles.less';
</style>
