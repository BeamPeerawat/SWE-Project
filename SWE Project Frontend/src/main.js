import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);
app.use(router);
app.config.globalProperties.$axios = axios; // เพิ่ม axios เป็น global property
app.mount('#app');