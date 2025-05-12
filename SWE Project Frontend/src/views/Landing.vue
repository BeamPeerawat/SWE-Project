<template>
    <div class="landing-page">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
          <div class="header-text">
            <h1>ระบบพิจารณาคำร้อง</h1>
            <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
            <p>เลือกบทบาทเพื่อเข้าสู่ระบบ</p>
          </div>
        </div>
      </div>
  
      <!-- Role Selection -->
      <div class="role-selection">
        <h2>เลือกบทบาทของคุณ</h2>
        <div class="role-grid">
          <div class="role-card" @click="selectRole('student')">
            <i class="fas fa-user-graduate"></i>
            <h3>นักศึกษา</h3>
            <p>ยื่นคำร้องและตรวจสอบสถานะ</p>
            <button class="select-btn">เลือก</button>
          </div>
          <div class="role-card" @click="selectRole('advisor')">
            <i class="fas fa-chalkboard-teacher"></i>
            <h3>อาจารย์ที่ปรึกษา</h3>
            <p>พิจารณาคำร้องของนักศึกษา</p>
            <button class="select-btn">เลือก</button>
          </div>
          <div class="role-card" @click="selectRole('instructor')">
            <i class="fas fa-book"></i>
            <h3>อาจารย์ประจำวิชา</h3>
            <p>พิจารณาคำร้องขอเพิ่มที่นั่ง</p>
            <button class="select-btn">เลือก</button>
          </div>
          <div class="role-card" @click="selectRole('head')">
            <i class="fas fa-user-tie"></i>
            <h3>หัวหน้าสาขาวิชา</h3>
            <p>อนุมัติคำร้องขั้นสุดท้าย</p>
            <button class="select-btn">เลือก</button>
          </div>
          <div class="role-card" @click="selectRole('admin')">
            <i class="fas fa-user-shield"></i>
            <h3>แอดมิน</h3>
            <p>จัดการระบบและข้อมูล</p>
            <button class="select-btn">เลือก</button>
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
    name: 'LandingPage',
    methods: {
      selectRole(role) {
        // จำลองการตั้งค่าผู้ใช้ใน localStorage
        const user = {
          email: `${role}@rmuti.ac.th`, // อีเมลจำลอง
          role: role,
        };
        localStorage.setItem('user', JSON.stringify(user));
  
        // นำทางไปยังหน้าหลักของบทบาทนั้น
        switch (role) {
          case 'student':
            this.$router.push('/home');
            break;
          case 'advisor':
            this.$router.push('/advisor/home');
            break;
          case 'instructor':
            this.$router.push('/instructor/home');
            break;
          case 'head':
            this.$router.push('/head/home');
            break;
          case 'admin':
            this.$router.push('/admin/dashboard');
            break;
          default:
            this.$router.push('/home');
        }
      },
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
  
  .landing-page {
    min-height: 100vh;
    background: #f9fafb;
    font-family: 'Kanit', sans-serif;
    padding: 20px;
    color: #1f2937;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    padding: 30px;
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    border-radius: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    animation: fadeIn 0.8s ease-out;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 20px;
    text-align: center;
  }
  
  .logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: white;
    padding: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .header-text h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 600;
    color: white;
  }
  
  .header-text p {
    margin: 8px 0 0;
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .role-selection {
    flex: 1;
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    animation: fadeIn 1s ease-out;
    text-align: center;
  }
  
  .role-selection h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 30px;
  }
  
  .role-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
  
  .role-card {
    background: #f9fafb;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    animation: fadeIn 1.2s ease-out;
  }
  
  .role-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  .role-card i {
    font-size: 2.5rem;
    color: #2563eb;
    margin-bottom: 15px;
  }
  
  .role-card h3 {
    font-size: 1.3rem;
    font-weight: 500;
    color: #1f2937;
    margin: 10px 0;
  }
  
  .role-card p {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 15px;
  }
  
  .select-btn {
    padding: 10px 20px;
    background: #2563eb;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }
  
  .select-btn:hover {
    background: #1e40af;
    transform: translateY(-2px);
  }
  
  .footer-section {
    background: #2563eb;
    color: white;
    text-align: center;
    padding: 20px;
    font-size: 0.9rem;
    margin-top: 40px;
  }
  
  .footer-section p {
    margin: 0;
  }
  </style>