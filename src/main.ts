import { createApp } from "vue";
// import 'amfe-flexible'
import { Watermark } from 'vant';
import App from "./App.vue";

const app = createApp(App)
app.use(Watermark);
app.mount("#app");


