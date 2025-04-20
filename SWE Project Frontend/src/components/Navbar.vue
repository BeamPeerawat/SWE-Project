<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        ☰
      </button>
      <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
      <span class="brand-text">ระบบขอเอกสารทางวิชาการ</span>
    </div>
    <ul class="navbar-menu">
      <li><router-link to="/home">หน้าแรก</router-link></li>
      <li><router-link to="/about">เกี่ยวกับเรา</router-link></li>
      <li><router-link to="/contact">ติดต่อเรา</router-link></li>
      <li>
        <router-link v-if="!isLoggedIn" to="/login">เข้าสู่ระบบ</router-link>
        <span v-else class="username">{{ user.email }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('user');
    },
    user() {
      return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #007bff, #00c4cc);
  padding: 15px 30px;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.menu-btn {
  font-size: 24px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
}

.logo {
  width: 50px;
  border-radius: 50%;
}

.navbar-menu {
  display: flex;
  list-style: none;
  gap: 25px;
  align-items: center;
  margin: 0;
}

.navbar-menu a,
.navbar-menu .username {
  color: white;
  text-decoration: none;
  font-weight: 400;
  transition: color 0.3s;
}

.navbar-menu a:hover,
.navbar-menu .username:hover {
  color: #ffeb3b;
}

.navbar-menu .username {
  cursor: default;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 15px;
  }

  .navbar-brand {
    margin-bottom: 15px;
  }

  .navbar-menu {
    flex-direction: column;
    gap: 15px;
    width: 100%;
    text-align: center;
  }

  .brand-text {
    font-size: 1rem;
  }

  .logo {
    width: 40px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 10px;
  }

  .navbar-brand {
    gap: 10px;
  }

  .brand-text {
    font-size: 0.9rem;
  }

  .logo {
    width: 35px;
  }

  .navbar-menu {
    gap: 10px;
  }
}
</style>