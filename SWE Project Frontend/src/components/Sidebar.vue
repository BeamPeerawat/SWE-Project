<template>
  <div class="sidebar" :class="{ 'open': isOpen }">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <h3>ระบบยื่นคำร้อง</h3>
      </div>
      <button class="close-btn" @click="$emit('toggle-sidebar')">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="sidebar-content">
      <ul class="sidebar-menu">
        <li class="menu-item">
          <router-link to="/home" class="menu-link" active-class="active">
            <i class="fas fa-home"></i>
            <span>หน้าแรก</span>
          </router-link>
        </li>
        <li class="menu-item">
          <div class="menu-link" @click="toggleRequestMenu" :class="{ 'active': requestMenuOpen }">
            <i class="fas fa-file-alt"></i>
            <span>ยื่นคำร้อง</span>
            <i :class="requestMenuOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-right'"></i>
          </div>
          <ul class="submenu" :class="{ 'open': requestMenuOpen }">
            <li>
              <router-link to="/request/add-seat" active-class="active">
                <i class="fas fa-user-plus"></i>
                <span>คำร้องขอเพิ่มที่นั่ง</span>
              </router-link>
            </li>
            <li>
              <router-link to="/request/open-course" active-class="active">
                <i class="fas fa-book-open"></i>
                <span>คำร้องขอเปิดรายวิชานอกแผน</span>
              </router-link>
            </li>
          </ul>
        </li>
        <li class="menu-item">
          <router-link to="/status" class="menu-link" active-class="active">
            <i class="fas fa-clipboard-list"></i>
            <span>สถานะคำขอ</span>
          </router-link>
        </li>
        <li class="menu-item">
          <router-link to="/profile" class="menu-link" active-class="active">
            <i class="fas fa-user-circle"></i>
            <span>โปรไฟล์</span>
          </router-link>
        </li>
      </ul>
      <div class="logout-section">
        <div class="user-info">
          <i class="fas fa-user-circle user-icon"></i>
          <div class="user-details">
            <p class="user-email">{{ user?.email }}</p>
            <p class="user-role">นักศึกษา</p>
          </div>
        </div>
        <button class="logout-btn" @click="logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>ออกจากระบบ</span>
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
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #2c3e50 0%, #2c3e50 100%);
  color: white;
  position: fixed;
  top: 0;
  left: -280px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar.open {
  left: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  padding: 5px;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: white;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 0;
}

.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  padding: 0;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.menu-link i:first-child {
  width: 20px;
  text-align: center;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-link.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.menu-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #4caf50;
}

.submenu {
  list-style: none;
  padding: 0;
  background: rgba(0, 0, 0, 0.2);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.submenu.open {
  max-height: 200px;
}

.submenu li {
  padding: 0;
}

.submenu a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px 12px 52px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s;
}

.submenu a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.submenu a.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}

.logout-section {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.user-icon {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.user-details {
  flex: 1;
}

.user-email {
  font-size: 0.9rem;
  color: white;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: rgba(255, 77, 79, 0.9);
  color: white;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: #ff4d4f;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 77, 79, 0.3);
}

.logout-btn i {
  font-size: 1rem;
}

/* Animation for menu items */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-item {
  animation: slideIn 0.3s ease-out forwards;
  opacity: 0;
}

.menu-item:nth-child(1) { animation-delay: 0.1s; }
.menu-item:nth-child(2) { animation-delay: 0.2s; }
.menu-item:nth-child(3) { animation-delay: 0.3s; }
.menu-item:nth-child(4) { animation-delay: 0.4s; }
</style>