<template>
  <div class="home-page">
    <!-- Header Section -->
    <header class="hero-section">
      <div class="hero-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <h1>ยินดีต้อนรับสู่ระบบยื่นคำร้องออนไลน์</h1>
        <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
        <p v-if="user">ยินดีต้อนรับ: {{ user.email }}</p>
        <router-link to="/request" class="cta-btn">เริ่มยื่นคำร้อง</router-link>
      </div>
    </header>

    <!-- Features Section -->
    <section class="features-section">
      <h2>บริการของเรา</h2>
      <div class="features-grid">
        <div class="feature-card">
          <i class="fas fa-file-alt"></i>
          <h3>ยื่นคำร้อง</h3>
          <p>ยื่นคำร้องขอเพิ่มที่นั่งหรือเปิดรายวิชานอกแผนได้ง่าย ๆ</p>
          <a href="#" class="feature-link" @click.prevent="openRequestModal">ไปที่ยื่นคำร้อง</a>
        </div>
        <div class="feature-card">
          <i class="fas fa-tasks"></i>
          <h3>ตรวจสอบสถานะ</h3>
          <p>ติดตามสถานะคำร้องของคุณได้ทุกที่ทุกเวลา</p>
          <router-link to="/status" class="feature-link">ไปที่สถานะคำขอ</router-link>
        </div>
        <div class="feature-card">
          <i class="fas fa-user"></i>
          <h3>โปรไฟล์</h3>
          <p>จัดการข้อมูลส่วนตัวและประวัติการยื่นคำร้อง</p>
          <router-link to="/profile" class="feature-link">ไปที่โปรไฟล์</router-link>
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
            คำร้องขอเพิ่มที่นั่ง
          </router-link>
          <router-link to="/request/open-course" class="modal-btn open-course-btn" @click="closeModal">
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
    // ดึงข้อมูลผู้ใช้จาก localStorage
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

@keyframes scaleUp {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
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

.cta-btn {
  display: inline-block;
  padding: 15px 40px;
  background: #F97316;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 500;
  transition: background 0.3s, transform 0.3s;
}

.cta-btn:hover {
  background: #EA580C;
  transform: translateY(-3px);
}

/* Features Section */
.features-section {
  padding: 60px 20px;
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
  transition: transform 0.3s, box-shadow 0.3s;
  animation: fadeIn 1.2s ease-out;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.feature-card i {
  font-size: 2.5rem;
  color: #2563EB;
  margin-bottom: 15px;
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
  display: inline-block;
  color: #2563EB;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.feature-link:hover {
  color: #1E40AF;
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
  animation: modalFadeIn 0.3s ease-out;
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
  display: block;
  padding: 12px 20px;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.add-seat-btn {
  background: #2563EB;
  color: #FFFFFF;
}

.add-seat-btn:hover {
  background: #1E40AF;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.open-course-btn {
  background: #F97316;
  color: #FFFFFF;
}

.open-course-btn:hover {
  background: #EA580C;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
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
    padding: 12px 30px;
    font-size: 1rem;
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