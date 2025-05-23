<template>
  <div class="instructor-home-page">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <div class="header-text">
          <h1>หน้าหลัก - อาจารย์ประจำวิชา</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
          <p v-if="user">ยินดีต้อนรับ: {{ user.email }}</p>
        </div>
      </div>
    </div>

    <!-- Request List -->
    <div class="request-section">
      <h2>รายการคำร้องขอเพิ่มที่นั่ง</h2>
      <div v-if="isLoading" class="loading">กำลังโหลดข้อมูล...</div>
      <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-else class="request-table">
        <table>
          <thead>
            <tr>
              <th>วันที่ยื่น</th>
              <th>รหัสนักศึกษา</th>
              <th>ชื่อ-นามสกุล</th>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชา</th>
              <th>สถานะ</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request._id">
              <td>{{ formatDate(request.createdAt) }}</td>
              <td>{{ request.studentId }}</td>
              <td>{{ request.studentName }}</td>
              <td>{{ request.courseCode }}</td>
              <td>{{ request.courseTitle }}</td>
              <td>
                <span :class="getStatusClass(request.status)">{{ formatStatus(request.status) }}</span>
              </td>
              <td>
                <router-link :to="`/instructor/request/${request._id}`" class="view-btn">
                  ดูรายละเอียด
                </router-link>
              </td>
            </tr>
            <tr v-if="requests.length === 0">
              <td colspan="7">ไม่มีคำร้องที่ต้องพิจารณา</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer-section">
      <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'InstructorHome',
  data() {
    return {
      user: null,
      requests: [],
      isLoading: false,
      errorMessage: ''
    };
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      if (this.user.role !== 'instructor') {
        this.$router.push('/login');
        return;
      }
      this.fetchRequests();
    } else {
      this.$router.push('/login');
    }
  },
  methods: {
    async fetchRequests() {
      this.isLoading = true;
      try {
        const response = await axios.get('/api/addseatrequests/addseatrequests');
        this.requests = response.data;
      } catch (error) {
        console.error('Error fetching requests:', error);
        this.errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดคำร้อง';
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    formatStatus(status) {
      const statusLabels = {
        submitted: 'รอยื่นยันโดยอาจารย์ประจำวิชา',
        instructor_approved: 'อนุมัติโดยอาจารย์ประจำวิชา',
        instructor_rejected: 'ปฏิเสธโดยอาจารย์ประจำวิชา'
      };
      return statusLabels[status] || status;
    },
    getStatusClass(status) {
      const statusClasses = {
        submitted: 'status-pending',
        instructor_approved: 'status-approved',
        instructor_rejected: 'status-rejected'
      };
      return statusClasses[status] || '';
    }
  }
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

.instructor-home-page {
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

.request-section {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: fadeIn 1s ease-out;
}

.request-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 20px;
}

.request-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #d1d5db;
  padding: 12px;
  text-align: center;
}

th {
  background: #2563eb;
  color: #ffffff;
  font-weight: 500;
}

td {
  color: #1f2937;
  font-size: 1rem;
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

.view-btn {
  padding: 8px 15px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s, transform 0.3s;
}

.view-btn:hover {
  background: #1e40af;
  transform: translateY(-2px);
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

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #2563eb;
  margin: 50px 0;
}

.error-message {
  text-align: center;
  font-size: 1.2rem;
  color: #ef4444;
  margin: 50px 0;
}
</style>