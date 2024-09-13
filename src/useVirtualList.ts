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
  scrollContainer: string;// 滚动容器选择器
  itemsWrapContainer: string;// 包裹列表项的容器，父元素或祖先元素，用于撑开高度
  marginContainer?: string;// 用于偏移的元素
}

type HtmlElType = HTMLElement | null;

export default function useVirtualList(config: Config) {
  // 获取元素
  let itemsWrapContainerEl: HtmlElType  = null,
  marginContainerEl: HtmlElType = null,
  scrollContainerEl: HtmlElType = null;

  onMounted(() => {
    itemsWrapContainerEl = document.querySelector(config.itemsWrapContainer);
    scrollContainerEl = document.querySelector(config.scrollContainer);
    if(config.marginContainer) marginContainerEl = document.querySelector(config.marginContainer);
  });

  // 通过设置高度，模拟滚动
  watch(() => config.data.value, (newVal) => {
    itemsWrapContainerEl!.style.height = newVal.length * config.itemHeight + "px";
  });

  // 实际渲染的数据
  const startIndex = ref(0);
  const endIndex = ref(config.size);
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
    marginContainerEl = marginContainerEl || itemsWrapContainerEl!
    .children[0] as HTMLElement;
    marginContainerEl.style.marginTop = scrollTop + "px";

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
