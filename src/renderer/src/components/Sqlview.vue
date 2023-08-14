<template>
  <h1>查询数据</h1>
  <n-space vertical :size="12">
    <n-data-table
      :bordered="false"
      :columns="data.columns"
      :data="data.queryData"
      :pagination="paginationReactive"
    />
  </n-space>
  <n-button type="primary" @click="queryData"> 搜索 </n-button>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { NButton, NDataTable, NSpace } from 'naive-ui'

const data = reactive({
  columns: [
    {
      title: 'info',
      key: 'info'
    }
  ],
  queryData: [] as Array<{ info: string }>
})
const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 50, 100],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  }
})
const versions = reactive({ ...window.electron.process.versions })
const api = window.api
const queryData = async (): Promise<void> => {
  console.log('versions', versions)
  data.queryData = (await api.queryDatabase()) as Array<{ info: string }>
  console.log('result', data.queryData)
}
</script>
