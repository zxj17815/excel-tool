<template>
  <n-space>
    <n-button type="info" @click="queryData"> 搜索 </n-button>
    <n-button type="primary" @click="uploadFile"> 导入 </n-button>
    <n-button type="primary" @click="queryData"> 导出 </n-button>
  </n-space>
  <n-space vertical :size="24">
    <n-data-table
      scroll-x="2048"
      :bordered="false"
      :columns="data.columns"
      :data="data.queryData"
      :pagination="paginationReactive"
    />
  </n-space>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { NButton, NDataTable, NSpace } from 'naive-ui'
const data = reactive({
  columns: [
    {
      title: 'WING平台单号',
      key: 'wingOrderNo'
    },
    {
      title: '伯俊发货时间',
      key: 'bjSendTime'
    },
    {
      title: '总数量',
      key: 'totalNumSalse'
    },
    {
      title: '总成交金额',
      key: 'totalAmountSalse'
    },
    {
      title: '总数量',
      key: 'totalNumRefund'
    },
    {
      title: '总成交金额',
      key: 'totalAmountRefund'
    },
    {
      title: '收款时间',
      key: 'payTime'
    },
    {
      title: '商品实付',
      key: 'goodsPay'
    },
    {
      title: '平台优惠1',
      key: 'platformDiscount1'
    },
    {
      title: '平台优惠2',
      key: 'platformDiscount2'
    },
    {
      title: '平台优惠3',
      key: 'platformDiscount3'
    },
    {
      title: '平台优惠4',
      key: 'platformDiscount4'
    },
    {
      title: '运费实付',
      key: 'freightPay'
    },
    {
      title: '退款时间',
      key: 'refundTime'
    },
    {
      title: '商品实退',
      key: 'goodsRefund'
    },
    {
      title: '平台优惠回收1',
      key: 'platformDiscountRecovery1'
    },
    {
      title: '平台优惠回收2',
      key: 'platformDiscountRecovery2'
    },
    {
      title: '平台优惠回收3',
      key: 'platformDiscountRecovery3'
    },
    {
      title: '平台优惠回收4',
      key: 'platformDiscountRecovery4'
    },
    {
      title: '运费实退',
      key: 'freightRefund'
    }
  ],
  queryData: [] as Array<{ info: string }>,
  uploadFile: '' as string
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
const uploadFile = async (): Promise<void> => {
  console.log('versions', versions)
  data.uploadFile = (await api.uploadFile()) as string
  console.log('result', data.uploadFile)
}
</script>
