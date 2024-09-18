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
import useMutatWatermark from "./useMutatWatermark";

const mutatKeys = useMutatWatermark(['.van-watermark']);

</script>

<template>
  <van-watermark :width="150" opacity="1" :key="mutatKeys[0]">
    <template #content>
      <div
        style="background: linear-gradient(45deg, #000 0, #000 50%, #fff 50%)"
      >
        <p style="mix-blend-mode: difference; color: #fff">Vant watermark</p>
      </div>
    </template>
  </van-watermark>
</template>

<style></style>
