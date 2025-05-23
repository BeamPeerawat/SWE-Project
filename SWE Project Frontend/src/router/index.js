import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import AddSeat from '../views/AddSeat.vue';
import OpenCourse from '../views/OpenCourse.vue';
import Status from '../views/Status.vue';
import Profile from '../views/Profile.vue';
import GeneralRequest from '../views/GeneralRequest.vue';
import AdvisorHome from '../views/AdvisorHome.vue';
import AdvisorRequestDetail from '../views/AdvisorRequestDetail.vue';
import AdvisorProfile from '../views/AdvisorProfile.vue';
import InstructorHome from '../views/InstructorHome.vue';
import InstructorRequestDetail from '../views/InstructorRequestDetail.vue';
import InstructorProfile from '../views/InstructorProfile.vue';
import HeadHome from '../views/HeadHome.vue';
import HeadRequestDetail from '../views/HeadRequestDetail.vue';
import HeadProfile from '../views/HeadProfile.vue';
import AdminDashboard from '../views/AdminDashboard.vue';
import AdminAnnouncements from '../views/AdminAnnouncements.vue';
import AdminCourses from '../views/AdminCourses.vue';
import AdminUsers from '../views/AdminUsers.vue';
import AdminProfile from '../views/AdminProfile.vue';
import AdvisorOpenRequestDetail from '../views/AdvisorOpenRequestDetail.vue';
import HeadOpenRequestDetail from '../views/HeadOpenRequestDetail.vue';

const routes = [
  {
    path: '/',
    redirect: () => {
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
      if (user.role === 'student') return '/home';
      if (user.role === 'advisor') return '/advisor/home';
      if (user.role === 'instructor') return '/instructor/home';
      if (user.role === 'head') return '/head/home';
      if (user.role === 'admin') return '/admin/dashboard';
      return '/login'; // ถ้าไม่มีผู้ใช้ล็อกอิน ไปที่หน้า login
    },
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
    meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/request',
    name: 'Request',
    redirect: '/request/general',
    meta: { requiresAuth: true, role: 'student' },
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
    meta: { requiresAuth: true, role: 'student' },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, role: 'student' },
  },
  // เส้นทางสำหรับอาจารย์ที่ปรึกษา
  {
    path: '/advisor',
    redirect: '/advisor/home',
    meta: { requiresAuth: true, role: 'advisor' },
  },
  {
    path: '/advisor/home',
    name: 'AdvisorHome',
    component: AdvisorHome,
    meta: { requiresAuth: true, role: 'advisor' },
  },
  {
    path: '/advisor/request/:id',
    name: 'AdvisorRequestDetail',
    component: AdvisorRequestDetail,
    meta: { requiresAuth: true, role: 'advisor' },
  },
  {
    path: '/advisor/open-request/:id',
    name: 'AdvisorOpenRequestDetail',
    component: AdvisorOpenRequestDetail,
    meta: { requiresAuth: true, role: 'advisor' },
  },
  {
    path: '/advisor/profile',
    name: 'AdvisorProfile',
    component: AdvisorProfile,
    meta: { requiresAuth: true, role: 'advisor' },
  },
  // เส้นทางสำหรับอาจารย์ประจำวิชา
  {
    path: '/instructor',
    redirect: '/instructor/home',
    meta: { requiresAuth: true, role: 'instructor' },
  },
  {
    path: '/instructor/home',
    name: 'InstructorHome',
    component: InstructorHome,
    meta: { requiresAuth: true, role: 'instructor' },
  },
  {
    path: '/instructor/request/:id',
    name: 'InstructorRequestDetail',
    component: InstructorRequestDetail,
    meta: { requiresAuth: true, role: 'instructor' },
  },
  {
    path: '/instructor/profile',
    name: 'InstructorProfile',
    component: InstructorProfile,
    meta: { requiresAuth: true, role: 'instructor' },
  },
  // เส้นทางสำหรับหัวหน้าสาขาวิชา
  {
    path: '/head',
    redirect: '/head/home',
    meta: { requiresAuth: true, role: 'head' },
  },
  {
    path: '/head/home',
    name: 'HeadHome',
    component: HeadHome,
    meta: { requiresAuth: true, role: 'head' },
  },
  {
    path: '/head/request/:id',
    name: 'HeadRequestDetail',
    component: HeadRequestDetail,
    meta: { requiresAuth: true, role: 'head' },
  },
  {
    path: '/head/open-request/:id',
    name: 'HeadOpenRequestDetail',
    component: HeadOpenRequestDetail,
    meta: { requiresAuth: true, role: 'head' },
  },
  {
    path: '/head/profile',
    name: 'HeadProfile',
    component: HeadProfile,
    meta: { requiresAuth: true, role: 'head' },
  },
  // เส้นทางสำหรับแอดมิน
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/announcements',
    name: 'AdminAnnouncements',
    component: AdminAnnouncements,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/courses',
    name: 'AdminCourses',
    component: AdminCourses,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/profile',
    name: 'AdminProfile',
    component: AdminProfile,
    meta: { requiresAuth: true, role: 'admin' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('user');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn) {
    next('/login'); // ถ้าต้องการการล็อกอินแต่ไม่ได้ล็อกอิน ไปที่หน้า login
  } else if (to.path === '/login' && isLoggedIn) {
    // ถ้าล็อกอินแล้วและพยายามเข้าหน้า login นำไปยังหน้าหลักของบทบาท
    if (user.role === 'student') {
      next('/home');
    } else if (user.role === 'advisor') {
      next('/advisor/home');
    } else if (user.role === 'instructor') {
      next('/instructor/home');
    } else if (user.role === 'head') {
      next('/head/home');
    } else if (user.role === 'admin') {
      next('/admin/dashboard');
    } else {
      next('/home');
    }
  } else if (requiresAuth && to.meta.role && user.role !== to.meta.role) {
    // ถ้าผู้ใช้พยายามเข้าหน้าที่ไม่ตรงกับบทบาท
    if (user.role === 'student') {
      next('/home');
    } else if (user.role === 'advisor') {
      next('/advisor/home');
    } else if (user.role === 'instructor') {
      next('/instructor/home');
    } else if (user.role === 'head') {
      next('/head/home');
    } else if (user.role === 'admin') {
      next('/admin/dashboard');
    } else {
      next('/home');
    }
  } else {
    next();
  }
});

export default router;