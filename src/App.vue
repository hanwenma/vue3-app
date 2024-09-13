<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch, reactive, computed } from "vue";
import type { Ref } from "vue";
import { ElMessageBox } from "element-plus";
import { debounce } from "lodash";
import useVirtualList from './useVirtualList';

const tableData: Ref<any[]> = ref([]);

const loading = ref(false);

const remoteData: any[] = [];

const loadData = () => {
  loading.value = true;
  setTimeout(() => {
    tableData.value = remoteData;
    loading.value = false;
  }, 1000);
};

onMounted(() => {
  setTimeout(() => {
    const max = 20;
    let i = 1;
    while (remoteData.length < max) {
      remoteData.push({
        date: "2016-05-03_" + i,
        name: "Tom_" + i,
        address: "No. 189, Grove St, Los Angeles _ " + i,
      });
      i++;
    }
  }, 500);
});

const { actualRenderData } = useVirtualList({
  data: tableData, // 列表项数据
  itemHeight: 67,
  size: 10,
  scrollContainer: '.el-scrollbar__wrap', // 滚动容器
  itemsWrapContainer: '.el-scrollbar__view', // 列表项父容器
  marginContainer: '.el-table__body',// 需要偏移的目标元素
});

const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  done();
};
let rowData = {};
const clickAct = (row) => {
  dialogVisible.value = true;
  rowData = row;
};
</script>

<template>
  <el-button @click="loadData">Render Data</el-button>

  <h1>
    {{ loading ? "In rendering..." : "Rendering completed" }}
  </h1>

  <h2>Total: {{ tableData.length }}</h2>

  <el-table
    :data="actualRenderData"
    stripe
    style="width: 100%"
    height="500"
    border
    row-key="name"
    @row-click="clickAct"
  >
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>

  <el-dialog
    v-model="dialogVisible"
    title="Tips"
    width="500"
    :before-close="handleClose"
  >
    <span>This is a message：{{ rowData.name }}</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
.el-table__row {
  cursor: pointer;
}
.el-table__body .el-table__row > td {
  padding: 0 !important;
  height: 52px !important;
}
.el-table__body,
.el-table__footer,
.el-table__header {
  table-layout: auto !important;
}
</style>
