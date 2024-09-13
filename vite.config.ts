import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import pxtovw from "postcss-px-to-viewport";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import WindiCSS from "vite-plugin-windicss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [
        ElementPlusResolver()
      ],
    }),
    Components({
      resolvers: [
        ElementPlusResolver()
      ],
    }),
    WindiCSS({}),
  ],
  css: {
    postcss: {
      plugins: [
        pxtovw({
          viewportWidth: 750, // 计稿宽度 750
          viewportUnit: "vw",
        }),
        // postCssPxToRem({
        //   rootValue: 75, // 750 设计稿，分成 10 份
        //   propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
        //   selectorBlackList: ['norem'], // 过滤掉 norem- 开头的 class，不进行 rem 转换
        // }),
      ],
    },
  },
});
