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

const data = ref([
  {
    id: '1',
    title: '标题 1',
    content: ['内容 1'.repeat(100),],
    active: true
  },
  {
    id: '2',
    title: '标题 2',
    content: ['内容 2'.repeat(150),],
    active: false
  },
  {
    id: '3',
    title: '标题 3',
    content: ['内容 3'.repeat(120), '内容 3'.repeat(100)],
    active: false
  },
]);

const offsetTop = ref(0);

onMounted(() => {
  const root = document.querySelector('.content-box')!;
  const contents = document.querySelectorAll('.content-item')!;

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const { target, isIntersecting } = entry;
      if (isIntersecting) {
        const id = target.dataset.id;
        clickAct({ target: document.querySelector(`.title-item-${id}`) }, id);
      }
    });
  }, {
    root,
    threshold: [0.5]
  });
  // 开始监听
  contents.forEach((target => {
    intersectionObserver.observe(target);
  }));
});

const clickAct = (e, id: string) => {
  data.value.forEach(v => {
    if (id === v.id) {
      v.active = true;
      offsetTop.value = e.target.offsetTop;
    } else {
      v.active = false;
    }
  });
}

</script>

<template>
  <div class="title-box">
    <div class="active-line" :style="{ top: offsetTop + 'px' }"></div>
    <a :class="['title-item', `title-item-${item.id}`, item.active ? 'active' : '']" :href="`#${item.id}`"
      @click="clickAct($event, item.id)" v-for="(item, i) in data">{{ item.title }}</a>
  </div>
  <div class="content-box">
    <div class="content-item" v-for="item in data" :data-id="item.id">
      <h3 :id="item.id">{{ item.title }}</h3>
      <div class="text" v-for="text in item.content">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style>
@import url("./style.css");
</style>
<style>
#app {
  display: flex;
}

.active {
  color: #3939db !important;
  font-size: 18px;
  font-weight: bold;
}

.active-line {
  width: 3px;
  height: 22px;
  border-radius: 3px;
  background: #3939db;
  display: block;
  position: absolute;
  left: 5px;
  top: 3px;
  transition: 0.3s;
}

.title-box {
  position: relative;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  border-right: 1px solid rgb(248, 149, 0);
}

.title-item {
  text-decoration: none;
  color: #333;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.content-box {
  box-sizing: border-box;
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  padding-left: 10px;
}

.content-item {}

h3 {
  height: 60px;
  line-height: 60px;
}

.text {
  font-size: 14px;
  line-height: 25px;
  margin-bottom: 20px;
}
</style>
