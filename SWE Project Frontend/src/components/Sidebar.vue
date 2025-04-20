<template>
  <div class="sidebar" :class="{ 'open': isOpen }">
    <div class="sidebar-header">
      <h3>เมนู</h3>
      <button class="close-btn" @click="$emit('toggle-sidebar')">✕</button>
    </div>
    <div class="sidebar-content">
      <ul class="sidebar-menu">
        <li class="menu-item">
          <router-link to="/home">หน้าแรก</router-link>
        </li>
        <li class="menu-item">
          <div class="menu-link" @click="toggleRequestMenu">
            <span>ยื่นคำร้อง</span>
            <i :class="requestMenuOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
          </div>
          <ul class="submenu" v-if="requestMenuOpen">
            <li><router-link to="/request/add-seat">คำร้องขอเพิ่มที่นั่ง</router-link></li>
            <li><router-link to="/request/open-course">คำร้องขอเปิดรายวิชานอกแผน</router-link></li>
          </ul>
        </li>
        <li class="menu-item">
          <router-link to="/status">สถานะคำขอ</router-link>
        </li>
        <li class="menu-item">
          <router-link to="/profile">โปรไฟล์</router-link>
        </li>
      </ul>
      <div class="logout-section">
        <p v-if="user" class="user-email">{{ user.email }}</p>
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i> ออกจากระบบ
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBar',
  props: {
    isOpen: Boolean,
  },
  emits: ['toggle-sidebar'],
  data() {
    return {
      requestMenuOpen: false,
      user: null,
    };
  },
  created() {
    // ดึงข้อมูลผู้ใช้จาก localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  },
  methods: {
    toggleRequestMenu() {
      this.requestMenuOpen = !this.requestMenuOpen;
    },
    logout() {
      localStorage.removeItem('user');
      alert('คุณได้ออกจากระบบเรียบร้อยแล้ว!');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #2c3e50;
  color: white;
  position: fixed;
  top: 0;
  left: -250px;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar.open {
  left: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #34495e;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 0;
}

.menu-item a,
.menu-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
}

.menu-link {
  cursor: pointer;
}

.menu-item a:hover,
.menu-link:hover {
  background: #34495e;
}

.menu-link i {
  font-size: 14px;
}

.submenu {
  list-style: none;
  padding: 0;
  background: #34495e;
}

.submenu li {
  padding: 0;
}

.submenu a {
  display: block;
  padding: 10px 40px;
  font-size: 0.95rem;
  color: white;
  text-decoration: none;
}

.submenu a:hover {
  background: #3e5c76;
}

.logout-section {
  padding: 20px;
  border-top: 1px solid #34495e;
}

.user-email {
  font-size: 0.9rem;
  color: #E5E7EB;
  margin-bottom: 10px;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #d9363e;
}

.logout-btn i {
  font-size: 1rem;
}
</style>