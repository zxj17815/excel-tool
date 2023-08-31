<template>
  <n-space>
    <n-date-picker v-model:value="data.dateRange" type="daterange" clearable></n-date-picker>
    <n-input-group>
      <n-input-group-label>WING平台单号</n-input-group-label>
      <n-input v-model:value="data.queryOptions.wingOrderNo" />
    </n-input-group>
    <n-button type="info" @click="queryData"> 搜索 </n-button>
    <n-button type="primary" :loading="data.loading" @click="uploadFile"> 导入 </n-button>
    <n-button type="primary" :loading="data.loading" @click="exportFile"> 导出 </n-button>
  </n-space>
  <n-space vertical :size="24">
    <n-data-table scroll-x="2600" :bordered="false" :columns="data.columns" :data="data.queryData"
      :pagination="paginationReactive" />
  </n-space>
</template>

<script setup lang="ts">
import { VNode, h, reactive } from 'vue'
import {
  NButton,
  NInputGroup,
  NInput,
  NInputGroupLabel,
  NDataTable,
  NSpace,
  NDatePicker,
  useNotification,
  useDialog
} from 'naive-ui'
import { format } from 'date-fns'
import { TableColumns } from 'naive-ui/es/data-table/src/interface';
interface Columns {
  wingOrderNo: string
  bjSendTime: string
  payTime: string
  refundTime: string
}
const notification = useNotification()
const dialog = useDialog()
const data = reactive({
  dateRange: [new Date(Date.now()).setDate(1), Date.now()] as [number, number],
  queryOptions: {
    wingOrderNo: ''
  },
  columns: [
    {
      title: 'WING平台单号',
      key: 'wingOrderNo',
      fixed: 'left'
    },
    {
      title: '伯俊发货时间',
      key: 'bjSendTime',
      render: (row: Columns): VNode => {
        return h('span', format(Date.parse(row.bjSendTime), 'yyyy-MM-dd HH:mm:ss'))
      }
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
      title: '总数量(退款)',
      key: 'totalNumRefund'
    },
    {
      title: '总成交金额(退款)',
      key: 'totalAmountRefund'
    },
    {
      title: '收款时间',
      key: 'payTime',
      render: (row: Columns): VNode => {
        try {
          return h('span', format(Date.parse(row.payTime), 'yyyy-MM-dd HH:mm:ss'))
        } catch (error) {
          return h('span', '')
        }
      }
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
      key: 'refundTime',
      render: (row: Columns): VNode => {
        try {
          return h('span', format(Date.parse(row.refundTime), 'yyyy-MM-dd HH:mm:ss'))
        } catch (error) {
          return h('span', '')
        }
      }
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
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (row: Columns): VNode => {
        return h(
          NButton,
          {
            type: 'error',
            onClick: () => {
              dialog.warning({
                title: '警告',
                content: '你确定？',
                positiveText: '确定',
                negativeText: '不确定',
                onPositiveClick: () => {
                  const sql_where = `wingOrderNo='${row.wingOrderNo}'`
                  api
                    .deleteOrders(sql_where)
                    .then((res) => {
                      console.log('result', res)
                      queryData()
                      notification.success({
                        content: '已删除:' + row.wingOrderNo
                      })
                    })
                    .catch((err) => {
                      notification.error({
                        content: '删除失败:' + row.wingOrderNo,
                        meta: err.message,
                        keepAliveOnHover: true
                      })
                    })
                },
                onNegativeClick: () => {
                  console.log('cancel')
                }
              })
            }
          },
          {
            default: () => '删除'
          }
        )
      }
    }
  ] as TableColumns,
  queryData: [] as Array<{ info: string }>,
  uploadFile: '' as string,
  loading: false
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
  const sql = `bjSendTime between '${format(
    data.dateRange[0],
    'yyyy-MM-dd HH:mm:ss'
  )}' and '${format(data.dateRange[1], 'yyyy-MM-dd HH:mm:ss')}' and wingOrderNo like '%${data.queryOptions.wingOrderNo
    }%'`
  data.queryData = (await api.selectOrders(sql)) as Array<{ info: string }>
  console.log('result', data.queryData)
}
const uploadFile = async (): Promise<void> => {
  data.loading = true
  console.log('versions', versions)
  api
    .uploadFile()
    .then((res) => {
      console.log('result', res)
      data.loading = false
      notification.success({
        content: '导入成功',
        keepAliveOnHover: true
      })
      queryData()
    })
    .catch((err) => {
      data.loading = false
      notification.error({
        content: '导入失败',
        meta: err.message,
        keepAliveOnHover: true
      })
    })
}
const exportFile = async (): Promise<void> => {
  data.loading = true
  console.log('versions', versions)
  const sql = `bjSendTime between '${format(
    data.dateRange[0],
    'yyyy-MM-dd HH:mm:ss'
  )}' and '${format(data.dateRange[1], 'yyyy-MM-dd HH:mm:ss')}' and wingOrderNo like '%${data.queryOptions.wingOrderNo
    }%'`
  api
    .exportFile(sql)
    .then((res) => {
      console.log('result', res)
      data.loading = false
      notification.success({
        content: '导出成功',
        keepAliveOnHover: true
      })
    })
    .catch((err) => {
      data.loading = false
      notification.error({
        content: '导出失败',
        meta: err.message,
        keepAliveOnHover: true
      })
    })
}
</script>
