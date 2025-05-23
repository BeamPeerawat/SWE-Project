<template>
    <div class="request-detail-page">
      <!-- Header -->
      <div class="header">
        <div class="header-content">
          <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
          <div class="header-text">
            <h1>รายละเอียดคำร้องขอเปิดรายวิชา</h1>
            <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
            <p v-if="user">ผู้ใช้: {{ user.email }}</p>
          </div>
        </div>
        <button class="back-btn" @click="$router.push('/advisor/home')">
          <i class="fas fa-arrow-left"></i> ย้อนกลับ
        </button>
      </div>
  
      <!-- Request Details -->
      <div class="request-container" v-if="request">
        <div class="detail-section">
          <h2>ข้อมูลคำร้อง</h2>
          <div class="detail-item">
            <label><i class="fas fa-calendar"></i> วันที่ยื่น:</label>
            <p>{{ formatDate(request.createdAt) }}</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-file-signature"></i> ประเภทคำร้อง:</label>
            <p>ขอเปิดรายวิชานอกแผนการเรียน</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-book"></i> รายวิชา:</label>
            <p>{{ request.courseCode }} - {{ request.courseTitle }} ({{ request.credits }} หน่วยกิต)</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-comment"></i> เหตุผล:</label>
            <p>{{ request.reason }}</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-info"></i> สถานะ:</label>
            <p :class="getStatusClass(request.status)">{{ formatStatus(request.status) }}</p>
          </div>
        </div>
  
        <div class="detail-section">
          <h2>ข้อมูลนักศึกษา</h2>
          <div class="detail-item">
            <label><i class="fas fa-user"></i> ชื่อ-นามสกุล:</label>
            <p>{{ request.studentName }}</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-id-card"></i> รหัสนักศึกษา:</label>
            <p>{{ request.studentId }}</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-university"></i> คณะ:</label>
            <p>{{ request.faculty }}</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-graduation-cap"></i> สาขาวิชา:</label>
            <p>{{ request.fieldOfStudy }}</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-graduation-cap"></i> ระดับการศึกษา:</label>
            <p>{{ request.levelOfStudy }}</p>
          </div>
        </div>
  
        <div class="detail-section">
          <h2>ข้อมูลติดต่อ</h2>
          <div class="detail-item">
            <label><i class="fas fa-phone"></i> เบอร์โทรศัพท์:</label>
            <p>{{ request.contactNumber }}</p>
          </div>
          <div class="detail-item">
            <label><i class="fas fa-envelope"></i> อีเมล:</label>
            <p>{{ request.email }}</p>
          </div>
        </div>
  
        <!-- Comment and Action Buttons -->
        <div class="detail-section" v-if="request.status === 'pending_advisor'">
          <h2>การพิจารณาคำร้อง</h2>
          <div class="form-group">
            <label>ความเห็น:</label>
            <textarea
              v-model="comment"
              rows="4"
              placeholder="กรุณาระบุความเห็น (ถ้ามี)"
            ></textarea>
          </div>
          <div class="action-buttons">
            <button class="approve-btn" @click="approveRequest">
              <i class="fas fa-check"></i> อนุมัติ
            </button>
            <button class="reject-btn" @click="rejectRequest">
              <i class="fas fa-times"></i> ปฏิเสธ
            </button>
          </div>
        </div>
      </div>
  
      <!-- Notification -->
      <div v-if="showNotification" class="notification" :class="notificationType">
        <i :class="notificationIcon"></i>
        <span>{{ notificationMessage }}</span>
        <button class="notification-close" @click="showNotification = false">
          <i class="fas fa-times"></i>
        </button>
      </div>
  
      <!-- Footer -->
      <footer class="footer-section">
        <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdvisorOpenRequestDetail',
    data() {
      return {
        user: null,
        request: null,
        comment: '',
        showNotification: false,
        notificationMessage: '',
        notificationType: 'success',
        notificationIcon: 'fas fa-check-circle'
      };
    },
    created() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
        this.fetchRequest();
      } else {
        this.$router.push('/login');
      }
    },
    methods: {
      async fetchRequest() {
        try {
          const response = await this.$axios.get(`/api/opencourserequests/${this.$route.params.id}`);
          this.request = response.data;
        } catch (error) {
          this.showNotification = true;
          this.notificationMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลคำร้อง';
          this.notificationType = 'error';
          this.notificationIcon = 'fas fa-exclamation-circle';
          setTimeout(() => {
            this.$router.push('/advisor/home');
          }, 3000);
        }
      },
      async approveRequest() {
        try {
          await this.$axios.post(`/api/opencourserequests/${this.$route.params.id}/approve`, {
            comment: this.comment
          });
          this.showNotification = true;
          this.notificationMessage = 'อนุมัติคำร้องเรียบร้อยแล้ว';
          this.notificationType = 'success';
          this.notificationIcon = 'fas fa-check-circle';
          setTimeout(() => {
            this.showNotification = false;
            this.$router.push('/advisor/home');
          }, 3000);
        } catch (error) {
          this.showNotification = true;
          this.notificationMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการอนุมัติคำร้อง';
          this.notificationType = 'error';
          this.notificationIcon = 'fas fa-exclamation-circle';
        }
      },
      async rejectRequest() {
        try {
          await this.$axios.post(`/api/opencourserequests/${this.$route.params.id}/reject`, {
            comment: this.comment
          });
          this.showNotification = true;
          this.notificationMessage = 'ปฏิเสธคำร้องเรียบร้อยแล้ว';
          this.notificationType = 'error';
          this.notificationIcon = 'fas fa-exclamation-circle';
          setTimeout(() => {
            this.showNotification = false;
            this.$router.push('/advisor/home');
          }, 3000);
        } catch (error) {
          this.showNotification = true;
          this.notificationMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการปฏิเสธคำร้อง';
          this.notificationType = 'error';
          this.notificationIcon = 'fas fa-exclamation-circle';
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      },
      formatStatus(status) {
        const statusLabels = {
          pending_advisor: 'รอพิจารณา',
          advisor_approved: 'อนุมัติโดยอาจารย์ที่ปรึกษา',
          advisor_rejected: 'ปฏิเสธโดยอาจารย์ที่ปรึกษา',
          pending_head: 'รอพิจารณาโดยหัวหน้าสาขา',
          head_approved: 'อนุมัติโดยหัวหน้าสาขา',
          head_rejected: 'ปฏิเสธโดยหัวหน้าสาขา'
        };
        return statusLabels[status] || status;
      },
      getStatusClass(status) {
        const statusClasses = {
          pending_advisor: 'status-pending',
          advisor_approved: 'status-approved',
          advisor_rejected: 'status-rejected',
          pending_head: 'status-pending',
          head_approved: 'status-approved',
          head_rejected: 'status-rejected'
        };
        return statusClasses[status] || '';
      }
    }
  };
  </script>
  
  <style scoped>
  .request-detail-page {
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
  
  .back-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 25px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 30px;
    font-family: 'Kanit', sans-serif;
    font-size: 1.1rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s;
  }
  
  .back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .request-container {
    background: #ffffff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    animation: fadeIn 1s ease-out;
  }
  
  .detail-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f9fafb;
    border-radius: 10px;
    border-left: 5px solid #2563eb;
  }
  
  .detail-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 15px;
  }
  
  .detail-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }
  
  .detail-item label {
    font-weight: 500;
    font-size: 1rem;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .detail-item p {
    font-size: 1rem;
    color: #6b7280;
  }
  
  .status-pending {
    color: #f97316;
    font-weight: 500;
  }
  
  .status-approved {
    color: #10b981;
    font-weight: 500;
  }
  
  .status-rejected {
    color: #ef4444;
    font-weight: 500;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
    font-size: 1.1rem;
  }
  
  .form-group textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  
  .form-group textarea:focus {
    border-color: #1a73e8;
    box-shadow: 0 0 5px rgba(26, 115, 232, 0.3);
    outline: none;
  }
  
  .action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 30px;
  }
  
  .approve-btn,
  .reject-btn {
    padding: 12px 30px;
    border: none;
    border-radius: 8px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s, transform 0.3s;
  }
  
  .approve-btn {
    background: #10b981;
    color: #ffffff;
  }
  
  .approve-btn:hover {
    background: #059669;
    transform: translateY(-2px);
  }
  
  .reject-btn {
    background: #ef4444;
    color: #ffffff;
  }
  
  .reject-btn:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }
  
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    max-width: 400px;
  }
  
  .notification.success {
    background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
    color: white;
  }
  
  .notification.error {
    background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
    color: white;
  }
  
  .notification i {
    font-size: 1.2rem;
  }
  
  .notification span {
    font-size: 1rem;
    font-weight: 500;
    flex: 1;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 1rem;
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
  </style>