import { nextTick, reactive, onMounted, onBeforeUnmount } from "vue";

export default function useMutatWatermark(seletors: string[]) {
  const keys: number[] = reactive([]);
  const mutationObservers: MutationObserver[] = [];

  // 挂载时，开启监听
  onMounted(() => {
    seletors.map((seletor, index) => {
      // 监听父元素
      observer(seletor, index);

      // 初始化 key
      keys.push(performance.now());
    });
  });

  // 开启监听
  const observer = (seletor: string, index: number) => {
    const target: HTMLElement | null = document.querySelector(seletor);
    if (!target) return;
    const parent = target?.parentNode!;

    // 实例化
    const mutationObserver = new MutationObserver(function (mutationList) {
      // 先关闭监听，避免死循环
      mutationObserver.disconnect();

      for (const mutation of mutationList) {
        if (
          mutation.type == "childList" && 
          mutation.removedNodes[0]
        ) {
          const nodeEl = mutation.removedNodes[0] as HTMLElement;
          const seletorStr = seletor.slice(1);
          const isTargetEl = nodeEl.classList.contains(seletorStr) || nodeEl.id === seletorStr;

          if(isTargetEl){
            window.location.reload();
            return;
          }
        }
      }

      // 修改 key 值，目的是让外部组件重新渲染
      keys[index] = performance.now();

      // 修改完成后，重新开启监听
      nextTick(() => observer(seletor, index));
    });

    // 开启监听
    setTimeout(() => {
      mutationObserver.observe(parent, {
        subtree: true, // 应用于整颗 子树
        childList: true, // 子节点的增、删变换
        attributes: true, // 检测属性变化
        attributeFilter: ["style"], // style 相关属性变化
        attributeOldValue: true, // 记录变化之前的属性值
      });
    });

    // 缓存实例对象，便于后续关闭监听
    mutationObservers.push(mutationObserver);
  };

  // 卸载时，关闭监听
  onBeforeUnmount(() => {
    mutationObservers.forEach((item) => item.disconnect());
  });

  return keys;
}
