<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Header with Logo -->
      <div class="login-header">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <h1>ระบบขอเอกสารทางวิชาการ</h1>
        <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
      </div>

      <!-- Login Section -->
      <div class="login-content">
        <h2>เข้าสู่ระบบ</h2>
        <p>กรุณาใช้อีเมล @rmuti.ac.th เพื่อเข้าสู่ระบบ</p>
        <button class="google-login-btn" @click="loginWithGoogle">
          <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" class="google-icon" />
          Sign in with Google
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      errorMessage: '',
    };
  },
  mounted() {
    // ตรวจสอบ query parameter หลังจาก Google callback
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    console.log('Query user:', user); // Debug
    if (user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        console.log('Parsed userData:', userData); // Debug
        // ตรวจสอบความถูกต้องของข้อมูล
        if (userData.email && userData.email.endsWith('@rmuti.ac.th')) {
          localStorage.removeItem('user'); // เคลียร์ข้อมูลเก่า
          localStorage.setItem('user', JSON.stringify(userData));
          // ลบ query parameter เพื่อป้องกันการใช้ซ้ำ
          window.history.replaceState({}, document.title, '/login');
          // Redirect ตาม role
          if (userData.role === 'advisor') {
            this.$router.push('/advisor/home');
          } else if (userData.role === 'instructor') {
            this.$router.push('/instructor/home');
          } else if (userData.role === 'head') {
            this.$router.push('/head/home');
          } else if (userData.role === 'admin') {
            this.$router.push('/admin/dashboard');
          } else {
            this.$router.push('/home');
          }
        } else {
          this.errorMessage = 'อีเมลไม่ถูกต้อง กรุณาใช้อีเมล @rmuti.ac.th';
        }
      } catch (error) {
        console.error('Error parsing user:', error); // Debug
        this.errorMessage = 'เกิดข้อผิดพลาดในการล็อกอิน';
      }
    }
  },
  methods: {
    loginWithGoogle() {
      // Redirect ไปยัง Google OAuth endpoint
      window.location.href = 'http://localhost:3000/api/auth/google';
    },
  },
};
</script>

<style scoped>
/* คงสไตล์เดิมไว้ */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleUp {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: url('@/assets/login-background.jpg') no-repeat center center fixed;
  background-size: cover;
  font-family: 'Kanit', sans-serif;
  color: #111827;
}

.login-container {
  background: #FFFFFF;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: center;
  animation: fadeIn 1s ease-out;
}

.login-header {
  margin-bottom: 30px;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 15px;
  animation: scaleUp 0.5s ease-in-out infinite alternate;
}

.login-header h1 {
  font-size: 1.8rem;
  color: #2563EB;
  margin: 10px 0;
}

.login-header p {
  font-size: 1rem;
  color: #6B7280;
}

.login-content h2 {
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 10px;
}

.login-content p {
  font-size: 1rem;
  color: #6B7280;
  margin-bottom: 20px;
}

.google-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  background: #FFFFFF;
  border: 2px solid #2563EB;
  border-radius: 25px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #2563EB;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, box-shadow 0.3s, transform 0.3s;
}

.google-login-btn:hover {
  background: #2563EB;
  color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
  transform: translateY(-3px);
}

.google-icon {
  width: 20px;
  height: 20px;
}

.error-message {
  color: #EF4444;
  font-size: 0.9rem;
  margin-top: 10px;
}

.login-footer {
  margin-top: 30px;
}

.login-footer p {
  font-size: 0.9rem;
  color: #6B7280;
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-container {
    padding: 30px;
    max-width: 90%;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }

  .login-header p {
    font-size: 0.9rem;
  }

  .login-content h2 {
    font-size: 1.3rem;
  }

  .login-content p {
    font-size: 0.9rem;
  }

  .google-login-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
}
</style>