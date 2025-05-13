<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <i class="fas fa-bars"></i>
      </button>
      <div class="brand-content">
        <div class="brand-text">
          <h1>ระบบขอเอกสารทางวิชาการ</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
        </div>
      </div>
    </div>
    <div class="navbar-menu-container">
      <ul class="navbar-menu">
        <li>
          <router-link to="/home" active-class="active">
            <i class="fas fa-home"></i>
            <span>หน้าแรก</span>
          </router-link>
        </li>
        <li>
          <router-link to="/about" active-class="active">
            <i class="fas fa-info-circle"></i>
            <span>เกี่ยวกับเรา</span>
          </router-link>
        </li>
        <li>
          <router-link to="/contact" active-class="active">
            <i class="fas fa-envelope"></i>
            <span>ติดต่อเรา</span>
          </router-link>
        </li>
        <li class="user-menu">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="login-btn">
              <i class="fas fa-sign-in-alt"></i>
              <span>เข้าสู่ระบบ</span>
            </router-link>
          </template>
          <template v-else>
            <div class="user-dropdown" @click="toggleDropdown">
              <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <span class="username">{{ user.email }}</span>
                <i class="fas fa-chevron-down"></i>
              </div>
              <div class="dropdown-menu" :class="{ 'show': isDropdownOpen }">
                <router-link to="/profile">
                  <i class="fas fa-user"></i>
                  <span>โปรไฟล์</span>
                </router-link>
                <button @click="logout">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      isDropdownOpen: false
    };
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('user');
    },
    user() {
      return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    },
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  },
  mounted() {
    // ปิด dropdown เมื่อคลิกนอกเมนู
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.isDropdownOpen = false;
      }
    });
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #1a237e, #0d47a1);
  padding: 15px 30px;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.brand-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-btn {
  font-size: 1.2rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.3s;
}

.menu-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* .logo {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: white;
  padding: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
} */

.brand-text h1 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
}

.brand-text p {
  margin: 0;
  font-size: 0.8rem;
  opacity: 0.8;
}

.navbar-menu-container {
  position: relative;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 25px;
  align-items: center;
  margin: 0;
  padding: 0;
}

.navbar-menu a {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 400;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s;
}

.navbar-menu a:hover,
.navbar-menu a.active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.navbar-menu a i {
  font-size: 1rem;
}

.user-menu {
  position: relative;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border-radius: 20px;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-info i:first-child {
  font-size: 1.2rem;
}

.user-info i:last-child {
  font-size: 0.8rem;
  transition: transform 0.3s;
}

.user-dropdown:hover .user-info i:last-child {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.3s;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-menu a,
.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.3s;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background: #f5f5f5;
}

.dropdown-menu a i,
.dropdown-menu button i {
  color: #666;
  width: 20px;
  text-align: center;
}

.login-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 8px 20px;
  border-radius: 20px;
  transition: all 0.3s;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .brand-text h1 {
    font-size: 1.1rem;
  }
  
  .brand-text p {
    display: none;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 15px;
  }

  .navbar-brand {
    width: 100%;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .navbar-menu {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .navbar-menu a {
    width: 100%;
    justify-content: center;
  }

  .user-dropdown {
    width: 100%;
  }

  .dropdown-menu {
    width: 100%;
    position: static;
    margin-top: 10px;
    box-shadow: none;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 10px;
  }

  .brand-text h1 {
    font-size: 1rem;
  }

  .logo {
    width: 35px;
    height: 35px;
  }

  .navbar-menu a span {
    display: none;
  }

  .navbar-menu a i {
    font-size: 1.2rem;
  }
}
</style>