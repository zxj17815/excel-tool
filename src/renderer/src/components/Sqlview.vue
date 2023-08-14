<template>
  <h1>查询数据</h1>
  <table>
    <thead>
      <tr>
        <th>id</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in data.queryData" :key="index">
        <td>{{ item.info }}</td>
      </tr>
    </tbody>
  </table>
  <button @click="queryData">Query Data</button>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const data = reactive({
  queryData: [] as Array<{ info: string }>
})
const versions = reactive({ ...window.electron.process.versions })
const api = window.api
const queryData = async (): Promise<void> => {
  console.log('versions', versions)
  data.queryData = (await api.queryDatabase()) as Array<{ info: string }>
  console.log('result', data.queryData)
}
</script>
