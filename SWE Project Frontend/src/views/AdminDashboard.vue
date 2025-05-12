<template>
    <div class="dashboard-page">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
          <div class="header-text">
            <h1>แดชบอร์ด - แอดมิน</h1>
            <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
            <p v-if="user">ยินดีต้อนรับ: {{ user.email }}</p>
          </div>
        </div>
      </div>
  
      <!-- Dashboard Content -->
      <div class="dashboard-container">
        <div class="stats-section">
          <h2>ภาพรวมระบบ</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <i class="fas fa-file-alt"></i>
              <h3>คำร้องทั้งหมด</h3>
              <p>150</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-users"></i>
              <h3>ผู้ใช้ทั้งหมด</h3>
              <p>500</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-book"></i>
              <h3>รายวิชาทั้งหมด</h3>
              <p>75</p>
            </div>
            <div class="stat-card">
              <i class="fas fa-bullhorn"></i>
              <h3>ประชาสัมพันธ์</h3>
              <p>10</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Footer -->
      <footer class="footer-section">
        <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminDashboard',
    data() {
      return {
        user: null,
      };
    },
    created() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    },
  };
  </script>
  
  <style scoped>
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
  
  .dashboard-page {
    min-height: 100vh;
    background: #f9fafb;
    font-family: 'Kanit', sans-serif;
    padding: 20px;
    color: #1f2937;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 25px;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    animation: fadeIn 0.8s ease-out;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .logo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: white;
    padding: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .header-text h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: white;
  }
  
  .header-text p {
    margin: 8px 0 0;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .dashboard-container {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    animation: fadeIn 1s ease-out;
  }
  
  .stats-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 20px;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .stat-card {
    background: #f9fafb;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
  }
  
  .stat-card:hover {
    transform: translateY(-5px);
  }
  
  .stat-card i {
    font-size: 2rem;
    color: #2563eb;
    margin-bottom: 10px;
  }
  
  .stat-card h3 {
    font-size: 1.2rem;
    font-weight: 500;
    color: #1f2937;
    margin: 10px 0;
  }
  
  .stat-card p {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2563eb;
  }
  
  .footer-section {
    background: #2563eb;
    color: white;
    text-align: center;
    padding: 20px;
    font-size: 0.9rem;
    margin-top: 30px;
  }
  
  .footer-section p {
    margin: 0;
  }
  </style>