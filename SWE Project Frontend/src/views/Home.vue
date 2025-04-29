<template>
  <div class="home-page">
    <!-- Header Section -->
    <header class="hero-section">
      <div class="hero-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <h1>ยินดีต้อนรับสู่ระบบยื่นคำร้องออนไลน์</h1>
        <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
        <p v-if="user" class="welcome-text">
          <i class="fas fa-user-circle"></i>
          ยินดีต้อนรับ: {{ user.email }}
        </p>
        <router-link to="/request/general" class="cta-btn">
          <i class="fas fa-file-alt"></i>
          เริ่มยื่นคำร้อง
        </router-link>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features-section">
      <h2>บริการของเรา</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-file-alt"></i>
          </div>
          <h3>ยื่นคำร้อง</h3>
          <p>ยื่นคำร้องขอเพิ่มที่นั่งหรือเปิดรายวิชานอกแผนได้ง่าย ๆ</p>
          <a href="#" class="feature-link" @click.prevent="openRequestModal">
            ไปที่ยื่นคำร้อง
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-tasks"></i>
          </div>
          <h3>ตรวจสอบสถานะ</h3>
          <p>ติดตามสถานะคำร้องของคุณได้ทุกที่ทุกเวลา</p>
          <router-link to="/status" class="feature-link">
            ไปที่สถานะคำขอ
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-user"></i>
          </div>
          <h3>โปรไฟล์</h3>
          <p>จัดการข้อมูลส่วนตัวและประวัติการยื่นคำร้อง</p>
          <router-link to="/profile" class="feature-link">
            ไปที่โปรไฟล์
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Modal for Request Selection -->
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>เลือกประเภทคำร้อง</h3>
        <p>คุณต้องการยื่นคำร้องประเภทใด?</p>
        <div class="modal-buttons">
          <router-link to="/request/add-seat" class="modal-btn add-seat-btn" @click="closeModal">
            <i class="fas fa-user-plus"></i>
            คำร้องขอเพิ่มที่นั่ง
          </router-link>
          <router-link to="/request/open-course" class="modal-btn open-course-btn" @click="closeModal">
            <i class="fas fa-book-open"></i>
            คำร้องขอเปิดรายวิชานอกแผน
          </router-link>
        </div>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Footer Section -->
    <footer class="footer-section">
      <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      showModal: false,
      user: null,
    };
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  },
  methods: {
    openRequestModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
/* Animations */
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

.home-page {
  min-height: 100vh;
  background: #FFFFFF;
  font-family: 'Kanit', sans-serif;
  color: #111827;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%);
  color: white;
  text-align: center;
  padding: 80px 20px;
  animation: fadeIn 1s ease-out;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 20px;
  background: white;
  padding: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: #E5E7EB;
}

.welcome-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  margin: 0 auto 20px;
  max-width: fit-content;
}

.welcome-text i {
  font-size: 1.2rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  background: #F97316;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.3s;
}

.cta-btn:hover {
  background: #EA580C;
  transform: translateY(-2px);
}

/* Features Section */
.features-section {
  padding: 20px 20px;
  text-align: center;
  background: #F9FAFB;
}

.features-section h2 {
  font-size: 2rem;
  color: #2563EB;
  margin-bottom: 40px;
  animation: fadeIn 1s ease-out;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: #FFFFFF;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  animation: fadeIn 1.2s ease-out;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: #EFF6FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.feature-icon i {
  font-size: 1.8rem;
  color: #2563EB;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 1rem;
  color: #6B7280;
  margin-bottom: 20px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2563EB;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.feature-link:hover {
  color: #1E40AF;
  gap: 12px;
}

.feature-link i {
  transition: transform 0.3s;
}

.feature-link:hover i {
  transform: translateX(5px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: #FFFFFF;
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
  text-align: center;
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

.modal-content h3 {
  font-size: 1.8rem;
  color: #2563EB;
  margin-bottom: 10px;
}

.modal-content p {
  font-size: 1rem;
  color: #6B7280;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;
}

.add-seat-btn {
  background: #2563EB;
  color: #FFFFFF;
}

.add-seat-btn:hover {
  background: #1E40AF;
  transform: translateY(-2px);
}

.open-course-btn {
  background: #F97316;
  color: #FFFFFF;
}

.open-course-btn:hover {
  background: #EA580C;
  transform: translateY(-2px);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6B7280;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #111827;
}

/* Footer Section */
.footer-section {
  background: #2563EB;
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 0.9rem;
}

.footer-section p {
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .cta-btn {
    padding: 10px 25px;
    font-size: 1.1rem;
  }

  .features-section h2 {
    font-size: 1.8rem;
  }

  .feature-card h3 {
    font-size: 1.3rem;
  }

  .feature-card p {
    font-size: 0.9rem;
  }

  .modal-content {
    max-width: 90%;
    padding: 20px;
  }

  .modal-content h3 {
    font-size: 1.5rem;
  }

  .modal-content p {
    font-size: 0.9rem;
  }

  .modal-btn {
    font-size: 0.9rem;
    padding: 10px 15px;
  }
}
</style>