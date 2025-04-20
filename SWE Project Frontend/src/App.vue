<template>
  <div id="app">
    <NavBar @toggle-sidebar="toggleSidebar" />
    <SideBar :isOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />
    <div class="main-content" :class="{ 'shifted': sidebarOpen }">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from './components/Navbar.vue';
import SideBar from './components/Sidebar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    SideBar,
  },
  data() {
    return {
      sidebarOpen: false, // ค่าเริ่มต้นเป็นปิด
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen; // สลับสถานะ
      console.log('Sidebar Open:', this.sidebarOpen); // เพิ่ม log เพื่อ debug
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