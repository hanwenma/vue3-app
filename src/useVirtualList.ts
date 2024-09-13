import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed,
  nextTick,
} from "vue";

import type { Ref } from "vue";

interface Config {
  data: Ref<any[]>; // 数据
  itemHeight: number; // 列表项高度
  size: number; // 每次渲染数据量
  scrollContainer: string; // 滚动容器的元素选择器
  actualHeightContainer: string; // 用于撑开高度的元素选择器
  tranlateContainer: string; // 用于偏移的元素选择器
  itmeContainer: string;
  itemKey: string;
}

type HtmlElType = HTMLElement | null;

export default function useVirtualList(config: Config) {
  // 获取元素
  let actualHeightContainerEl: HtmlElType = null,
    tranlateContainerEl: HtmlElType = null,
    scrollContainerEl: HtmlElType = null;

  onMounted(() => {
    actualHeightContainerEl = document.querySelector(
      config.actualHeightContainer
    );
    scrollContainerEl = document.querySelector(config.scrollContainer);
    tranlateContainerEl = document.querySelector(config.tranlateContainer);
  });

  // 数据源发生变动
  watch(
    () => config.data.value,
    () => {
      // 通过设置高度，模拟滚动
      updateActualHeight();

      // 计算需要渲染的数据
      updateRenderData(0);
    }
  );

  // 更新实际高度
  const updateActualHeight = () => {
    let actualHeight = 0;
    config.data.value.forEach((_, i) => {
      actualHeight += RenderedItemsCachMap[i] || config.itemHeight;
    });

    actualHeightContainerEl!.style.height = actualHeight + "px";
  };

  // 缓存已渲染元素的高度
  const RenderedItemsCachMap: any = {};
  const updateRenderedItemCach = (index: number) => {
    nextTick(() => {
      // 获取所有列表项元素
      const Items: HTMLElement[] = Array.from(
        document.querySelectorAll(config.itmeContainer)
      );

      // 进行缓存
      Items.forEach((el) => {
        if (!RenderedItemsCachMap[index]) {
          RenderedItemsCachMap[index] = el.offsetHeight;
        }
        index++;
      });

      updateActualHeight();
    });
  };

  // 实际渲染的数据
  const actualRenderData: Ref<any[]> = ref([]);

  const updateRenderData = (scrollTop: number) => {
    let startIndex = 0;
    let offsetHeight = 0;
    let dataSource = config.data.value;

    for (let i = 0; i < dataSource.length; i++) {
      offsetHeight += RenderedItemsCachMap[startIndex] || config.itemHeight;
      if (offsetHeight >= scrollTop) {
        startIndex = i;
        break;
      }
    }
    

    actualRenderData.value = dataSource.slice(
      startIndex,
      startIndex + config.size
    );

    // 保证数据渲染一直在可视区
    nextTick(() => tranlateContainerEl!.style.transform = `translateY(${offsetHeight}px)`);

    updateRenderedItemCach(startIndex);
  };

  // 滚动事件
  const handleScroll = (e: any) => {
    // 渲染正确的数据
    updateRenderData(e.target.scrollTop);
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
