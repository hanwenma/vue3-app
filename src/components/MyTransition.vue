<script lang="ts">
import { defineComponent } from 'vue';

const nextFrame = (callback: () => unknown) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })
}

export default defineComponent({
  name: 'Transition',
  setup(props, { slots }) {
    // 返回 render 函数
    return () => {
      // 通过默认插槽，获取目标元素
      const innerVNode = (slots as any).default()

      // 为目标元素添加 transition 相关钩子
      innerVNode.transition = {
        beforeEnter(el: any) {
          console.log(111)
          // 设置 初始状态 和 运动过程
          el.classList.add("enter-from");
          el.classList.add("enter-active");
        },
        enter(el: any) {
          // 在下一帧切换状态
          nextFrame(() => {
            // 切换状态
            el.classList.remove("enter-from");
            el.classList.add("enter-to");

            // 动效结束后，移除和动效相关的类
            el.addEventListener("transitionend", () => {
              el.classList.remove("enter-to");
              el.classList.remove("enter-active");
            });
          })
        },
        leave(el: any) {
          // 设置离场 初始状态 和 运动过程
          el.classList.add("leave-from");
          el.classList.add("leave-active");

          // 在下一帧中，切换元素状态
          nextFrame(() => {
            // 切换元素状态
            el.classList.remove("leave-from");
            el.classList.add("leave-to");

            // 动效结束后，移除和动效相关的类
            el.addEventListener("transitionend", () => {
              el.classList.remove("leave-to");
              el.classList.remove("leave-active");

              // 离场动效结束，移除目标元素
              el.remove();
            });
          })
        }
      }

      // 返回修改过的 VNode
      return innerVNode
    }
  }
})
</script>
