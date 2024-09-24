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

// 开启监听
const startObserve = (selector: string) => {
  const contents: HTMLElement[] = Array.from(
    document.querySelectorAll(selector)!
  );

  // 实例化 IntersectionObserver
  let intersectionObserverInstance = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const { target, isIntersecting } = entry;
      // 目标元素进入视口
      if (isIntersecting) {
        // 执行入场动画
        startAnimate(target);
      }
    });
  });

  // 开始监听每一个内容项
  contents.forEach((target) => {
    intersectionObserverInstance.observe(target);
  });

  return intersectionObserverInstance;
};

// 开始动画
const startAnimate = (target: Element) => {
  const newspaperSpinning = [
    {
      transform: `translate(100px, 50px) scale(0.5)`,
      opacity: 0,
      background: "linear-gradient(225deg, #CC4D82, #FDCA8A)",
      color: "red",
    },
    { transform: "translate(0px, 0px) scale(1)" },
  ];

  const newspaperTiming = {
    duration: 300,// 动画执行时间
    iterations: 1,// 动画执行次数
  };

  target.animate(newspaperSpinning, newspaperTiming);
};

let intersectionObserver: IntersectionObserver;
onMounted(() => {
  intersectionObserver = startObserve(".item");
});

onBeforeUnmount(() => {
  intersectionObserver.disconnect();
});
</script>

<template>
  <div class="list">
    <div class="item" v-for="i in 100" :data-index="i">{{ i }}</div>
  </div>
</template>

<style>
@import url("./style.css");
</style>
<style>
.list {
  overflow: hidden;
}
.item {
  height: 200px;
  line-height: 200px;
  text-align: center;
  margin: 20px;
  font-size: 50px;
  font-weight: 700;
  background: linear-gradient(225deg, #7dccb3, #ac44cc);
  color: #fff;
  border-radius: 10px;
}
</style>
