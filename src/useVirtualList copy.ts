import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
} from "vue";

import type { Ref } from "vue";

interface Config {
  data: Ref<any[]>; // 数据
  itemHeight: number;// 列表项高度
  size: number;// 每次渲染数据量
  scrollContainer: string;// 滚动容器的元素选择器
  actualHeightContainer: string;// 用于撑开高度的元素选择器
  tranlateContainer: string;// 用于偏移的元素选择器
}

type HtmlElType = HTMLElement | null;

export default function useVirtualList(config: Config) {
  // 获取元素
  let actualHeightContainerEl: HtmlElType  = null,
  tranlateContainerEl: HtmlElType = null,
  scrollContainerEl: HtmlElType = null;

  onMounted(() => {
    actualHeightContainerEl = document.querySelector(config.actualHeightContainer);
    scrollContainerEl = document.querySelector(config.scrollContainer);
    tranlateContainerEl = document.querySelector(config.tranlateContainer);
  });

  // 通过设置高度，模拟滚动
  watch(() => config.data.value, (newVal) => {
    actualHeightContainerEl!.style.height = newVal.length * config.itemHeight + "px";
  });

  // 实际渲染的数据
  const startIndex = ref(0);
  const endIndex = ref(config.size - 1);
  const actualRenderData = computed(() => {
    return config.data.value.slice(startIndex.value, endIndex.value + 1);
  });

  // 滚动事件
  const handleScroll = (e) => {
    const target = e.target;
    const { scrollTop, clientHeight, scrollHeight } = target;

    // 边界控制：实际触底，且页面正常渲染全部数据时，不再触发后续计算，防止触底抖动
    if (
      scrollHeight <= scrollTop + clientHeight &&
      endIndex.value >= config.data.value.length
    ) {
      return;
    }

    // 保证数据渲染一直在可视区
    tranlateContainerEl!.style.transform = `translateY(${scrollTop}px)`;

    // 渲染正确的数据
    startIndex.value = Math.floor(scrollTop / config.itemHeight);
    endIndex.value = startIndex.value + config.size;
  };

  // 注册滚动事件
  onMounted(() => {
    scrollContainerEl?.addEventListener("scroll", handleScroll);
  });

  // 移除滚动事件
  onBeforeUnmount(() => {
    scrollContainerEl?.removeEventListener("scroll", handleScroll);
  });

  return { actualRenderData };
}