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

const observe = () => {
  const el = document.querySelector('.van-watermark');
  const parent = el?.parentElement!;

  const mutationObserver = new MutationObserver(function (mutationList) {
    for (const mutation of mutationList) {
      // 
      if (mutation.target === parent) {

      }

      // 元素 删除/新增
      if (mutation.type === "childList") {
        console.log("A child node has been added or removed.", mutation.removedNodes);
      } else if (mutation.type === "attributes") {
        const [name, value] = mutation.oldValue!.split(': ');
        console.log(`The 【${mutation.attributeName}】 attribute was modified.`, mutation,name, value);
        // mutation.target.style = value;// 触发死循环
      }
    }

  });

  // 开启监听
  mutationObserver.observe(parent, {
    subtree: true, // 应用于整颗 子树
    childList: true, // 子节点的增、删变换
    attributes: true,// 检测属性变化
    attributeFilter: ['style'],// style 相关属性变化
    attributeOldValue: true,// 记录变化之前的属性值
  });
}


onMounted(() => {
  nextTick(observe)
});

</script>

<template>

  <van-watermark :width="150" opacity="1">
    <template #content>
      <div style="background: linear-gradient(45deg, #000 0, #000 50%, #fff 50%)">
        <p style="mix-blend-mode: difference; color: #fff">Vant watermark</p>
      </div>
    </template>
  </van-watermark>


</template>

<style></style>
