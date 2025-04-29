import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import AddSeat from '../views/AddSeat.vue';
import OpenCourse from '../views/OpenCourse.vue';
import Status from '../views/Status.vue';
import Profile from '../views/Profile.vue';
import GeneralRequest from '../views/GeneralRequest.vue';

const routes = [
  {
    path: '/',
    redirect: '/login', // Redirect หน้าแรกไปที่ /login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }, // ต้องล็อกอินก่อน
  },
  {
    path: '/request',
    name: 'Request',
    redirect: '/request/general',
    meta: { requiresAuth: true }, // ต้องล็อกอินก่อน
    children: [
      {
        path: 'general',
        name: 'GeneralRequest',
        component: GeneralRequest,
      },
      {
        path: 'add-seat',
        name: 'AddSeat',
        component: AddSeat,
      },
      {
        path: 'open-course',
        name: 'OpenCourse',
        component: OpenCourse,
      },
    ],
  },
  {
    path: '/status',
    name: 'Status',
    component: Status,
    meta: { requiresAuth: true }, // ต้องล็อกอินก่อน
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }, // ต้องล็อกอินก่อน
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// เพิ่ม Navigation Guard เพื่อตรวจสอบการล็อกอิน
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('user');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn) {
    next('/login'); // ถ้ายังไม่ล็อกอิน ให้ไปหน้า Login
  } else if (to.path === '/login' && isLoggedIn) {
    next('/home'); // ถ้าล็อกอินแล้วและพยายามเข้า /login ให้ไปหน้า Home
  } else {
    next(); // ดำเนินการต่อ
  }
});

export default router;