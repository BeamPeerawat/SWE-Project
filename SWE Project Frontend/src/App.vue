<template>
  <div id="app">
    <!-- แสดง Navbar และ Sidebar เฉพาะเมื่อไม่ได้อยู่ในหน้า Landing -->
    <template v-if="$route.name !== 'LandingPage'">
      <NavBar @toggle-sidebar="toggleSidebar" />
      <SideBar v-if="userRole === 'student'" :isOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />
      <AdvisorSidebar v-if="userRole === 'advisor'" :isOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />
      <!-- เพิ่ม Sidebar สำหรับบทบาทอื่นๆ ในอนาคต -->
      <InstructorSidebar v-if="userRole === 'instructor'" :isOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />
      <HeadSidebar v-if="userRole === 'head'" :isOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />
      <AdminSidebar v-if="userRole === 'admin'" :isOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />
    </template>
    <div class="main-content" :class="{ 'shifted': sidebarOpen && $route.name !== 'Landing' }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from './components/Navbar.vue';
import SideBar from './components/Sidebar.vue';
import AdvisorSidebar from './components/AdvisorSidebar.vue';
import InstructorSidebar from './components/InstructorSidebar.vue';
import HeadSidebar from './components/HeadSidebar.vue';
import AdminSidebar from './components/AdminSidebar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    SideBar,
    AdvisorSidebar,
    InstructorSidebar,
    HeadSidebar,
    AdminSidebar,
  },
  data() {
    return {
      sidebarOpen: false,
      userRole: null,
    };
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userRole = user.role || null;
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      console.log('Sidebar Open:', this.sidebarOpen);
    },
  },
  watch: {
    '$route'(to) {
      // อัปเดต userRole เมื่อเปลี่ยนหน้า
      if (to.name === 'Landing') {
        this.userRole = null;
      } else {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          this.userRole = user.role || null;
        }
      }
    },
  },
};
</script>

<style>
#app {
  font-family: 'Kanit', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  transition: margin-left 0.3s ease;
}

.shifted {
  margin-left: 250px;
}
</style>