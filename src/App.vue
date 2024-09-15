<script setup lang="ts">
import {
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
  reactive,
  computed,
} from "vue";
import type { Ref } from "vue";
import { ElMessageBox } from "element-plus";
import { debounce } from "lodash";
import useVirtualList from "./useVirtualList";

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
    const max = 10 * 2;
    let i = 1;
    while (remoteData.length < max) {
      remoteData.push({
        id: i,
        date: "2016-05-03_" + i,
        name: "Tom_" + i,
        value: "Tom_" + i,
        label: "Tom_" + i,
        address: "No. 189, Grove St, Los Angeles _ ".repeat(Math.random() * 10),
      });
      i++;
    }
  }, 500);
});

// const { actualRenderData } = useVirtualList({
//   data: tableData, // 列表项数据
//   itemHeight: 50,
//   size: 10,
//   scrollContainer: ".el-scrollbar__wrap", // 滚动容器
//   actualHeightContainer: ".el-scrollbar__view", // 渲染实际高度的容器
//   translateContainer: ".el-table__body", // 需要偏移的目标元素,
//   itmeContainer: '.el-table__row'
// });

// const { actualRenderData } = useVirtualList({
//   data: tableData, // 列表项数据
//   itemHeight: 51,
//   size: 10,
//   scrollContainer: ".scroll-container", // 滚动容器
//   actualHeightContainer: ".actual-height-container", // 渲染实际高度的容器
//   translateContainer: ".translate-container", // 需要偏移的目标元素,
//   itmeContainer: '.item'
// });

const { actualRenderData } = useVirtualList({
  data: tableData, // 列表项数据
  itemHeight: 51,
  size: 10,
  scrollContainer: ".el-scrollbar", // 滚动容器
  actualHeightContainer: ".el-select-dropdown__wrap", // 渲染实际高度的容器
  translateContainer: ".el-scrollbar__view", // 需要偏移的目标元素,
  itmeContainer: '.el-select-dropdown__item'
});

const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  done();
};
let rowData:any = {};
const clickAct = (row:any) => {
  dialogVisible.value = true;
  rowData = row;
};
const value = ref();
</script>

<template>
  <el-button @click="loadData">Render Data</el-button>

  <h1>
    {{ loading ? "In rendering..." : "Rendering completed" }}
  </h1>

  <h2>Total: {{ tableData.length }}</h2>

  <el-select v-model="value" class="m-2" placeholder="Select" size="large">
    <el-option
      v-for="item in actualRenderData"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>

  <!-- <ul
    class="scroll-container"
    style="height: 500px; overflow-y: auto; border: 1px solid"
  >
    <div class="actual-height-container">
      <div class="translate-container">
        <li
          class="item"
          :key="item.name"
          v-for="(item, i) in actualRenderData"
          style="text-align: center; border-bottom: 1px solid red"
          @click="clickAct(item)"
        >
          <p>{{ item.name }}</p>
          <p>{{item.address}}</p>
        </li>
      </div>
    </div>
  </ul> -->

  <!-- <el-table
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
  </el-table> -->

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
.el-scrollbar{
  max-height: 200px;
  overflow-y: auto;
  
}
.el-scrollbar__view{
  height: 100%;
  max-height: none !important;
}
</style>
