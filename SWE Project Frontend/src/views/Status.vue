<template>
  <div class="status-page">
    <!-- Header -->
    <div class="status-header">
      <div class="header-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <div class="header-text">
          <h1>สถานะคำขอ</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
        </div>
      </div>
      <button class="back-btn" @click="$router.push('/')">
        <i class="fas fa-arrow-left"></i> ย้อนกลับ
      </button>
    </div>

    <!-- Notification -->
    <div v-if="showNotification" class="notification" :class="notificationType">
      <i :class="notificationIcon"></i>
      <span>{{ notificationMessage }}</span>
      <button class="notification-close" @click="closeNotification">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Status Body -->
    <div class="status-body">
      <div v-if="isLoading" class="loading">กำลังโหลดข้อมูล...</div>
      <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-else>
        <!-- Search and Filter -->
        <div class="status-controls">
          <div class="search-bar">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="ค้นหาคำร้อง (เช่น ประเภทคำร้อง)"
              @input="filterRequests"
            />
            <i class="fas fa-search"></i>
          </div>
          <div class="filter-bar">
            <label>กรองสถานะ:</label>
            <select v-model="statusFilter" @change="filterRequests">
              <option value="">ทั้งหมด</option>
              <option value="pending_advisor">รอพิจารณาโดยอาจารย์ที่ปรึกษา</option>
              <option value="advisor_approved">อนุมัติโดยอาจารย์ที่ปรึกษา</option>
              <option value="advisor_rejected">ปฏิเสธโดยอาจารย์ที่ปรึกษา</option>
              <option value="pending_head">รอพิจารณาโดยหัวหน้าสาขา</option>
              <option value="head_approved">อนุมัติโดยหัวหน้าสาขา</option>
              <option value="head_rejected">ปฏิเสธโดยหัวหน้าสาขา</option>
            </select>
          </div>
        </div>

        <!-- Status Table -->
        <div class="status-table-wrapper">
          <table class="status-table">
            <thead>
              <tr>
                <th>วันที่ยื่น</th>
                <th>ประเภทคำร้อง</th>
                <th>สถานะ</th>
                <th>หมายเหตุ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in paginatedRequests" :key="request._id">
                <td>{{ formatDate(request.createdAt) }}</td>
                <td>{{ getPetitionTypeLabel(request) }}</td>
                <td>
                  <span :class="getStatusClass(request.status)">{{ formatStatus(request.status) }}</span>
                </td>
                <td>{{ request.advisorComment || request.headComment || '-' }}</td>
                <td>
                  <button class="view-btn" @click="viewRequest(request)">
                    ดูรายละเอียด
                  </button>
                  <button
                    v-if="['pending_advisor', 'advisor_approved'].includes(request.status)"
                    class="cancel-btn"
                    @click="openConfirmModal(request)"
                  >
                    ยกเลิก
                  </button>
                  <button
                    v-if="request.status === 'head_approved' || request.status === 'instructor_approved'"
                    class="download-btn"
                    @click="downloadPDF(request._id, request.requestType)"
                  >
                    <i class="fas fa-file-pdf"></i> ดาวน์โหลด PDF
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedRequests.length === 0">
                <td colspan="5" class="no-data">ไม่พบคำร้องที่ตรงกับเงื่อนไข</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="pagination-btn"
          >
            <i class="fas fa-chevron-left"></i> ก่อนหน้า
          </button>
          <span>หน้า {{ currentPage }} จาก {{ totalPages }}</span>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="pagination-btn"
          >
            ถัดไป <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- Request Details Modal -->
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3><i class="fas fa-file-alt"></i> รายละเอียดคำร้อง</h3>
              <button class="close-btn" @click="closeModal">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <!-- Request Information -->
              <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> ข้อมูลคำร้อง</h4>
                <div class="detail-item">
                  <label><i class="fas fa-calendar"></i> วันที่ยื่น:</label>
                  <p>{{ formatDate(selectedRequest.createdAt) }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-file-signature"></i> ประเภทคำร้อง:</label>
                  <p>{{ getPetitionTypeLabel(selectedRequest) }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-comment"></i> รายละเอียด:</label>
                  <p>{{ selectedRequest.details || getRequestDetails(selectedRequest) }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-info"></i> สถานะ:</label>
                  <p :class="getStatusClass(selectedRequest.status)" class="highlight">
                    {{ formatStatus(selectedRequest.status) }}
                  </p>
                </div>
                <div class="detail-item" v-if="selectedRequest.advisorComment">
                  <label><i class="fas fa-comment-alt"></i> หมายเหตุจากอาจารย์ที่ปรึกษา:</label>
                  <p>{{ selectedRequest.advisorComment }}</p>
                </div>
                <div class="detail-item" v-if="selectedRequest.headComment">
                  <label><i class="fas fa-comment-alt"></i> หมายเหตุจากหัวหน้าสาขา:</label>
                  <p>{{ selectedRequest.headComment }}</p>
                </div>
              </div>

              <!-- Student Information -->
              <div class="detail-section">
                <h4><i class="fas fa-user"></i> ข้อมูลนักศึกษา</h4>
                <div class="detail-item">
                  <label><i class="fas fa-user-circle"></i> ผู้ยื่น:</label>
                  <p>{{ selectedRequest.studentName || selectedRequest.fullName }} ({{ selectedRequest.studentId }})</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-university"></i> คณะ:</label>
                  <p>{{ selectedRequest.faculty }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-graduation-cap"></i> สาขาวิชา:</label>
                  <p>{{ selectedRequest.fieldOfStudy }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="modal-close-btn" @click="closeModal">
                <i class="fas fa-times"></i> ปิด
              </button>
            </div>
          </div>
        </div>

        <!-- Confirm Cancel Modal -->
        <div v-if="showConfirmModal" class="confirm-modal-overlay" @click="closeConfirmModal">
          <div class="confirm-modal-content" @click.stop>
            <div class="confirm-modal-header">
              <h3><i class="fas fa-exclamation-triangle"></i> ยืนยันการยกเลิกคำร้อง</h3>
            </div>
            <div class="confirm-modal-body">
              <p>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำร้องนี้?</p>
              <p class="highlight">{{ getPetitionTypeLabel(selectedRequest) }}</p>
              <p>การยกเลิกนี้ไม่สามารถย้อนกลับได้</p>
            </div>
            <div class="confirm-modal-footer">
              <button class="confirm-btn" @click="cancelRequest">
                <i class="fas fa-check"></i> ยืนยัน
              </button>
              <button class="cancel-btn" @click="closeConfirmModal">
                <i class="fas fa-times"></i> ยกเลิก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StatusPage',
  data() {
    return {
      user: null,
      requests: [],
      filteredRequests: [],
      paginatedRequests: [],
      searchQuery: '',
      statusFilter: '',
      currentPage: 1,
      itemsPerPage: 10,
      isLoading: false,
      errorMessage: '',
      showModal: false,
      selectedRequest: null,
      showConfirmModal: false,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'success',
      notificationIcon: 'fas fa-check-circle',
      petitionTypeLabels: {
        request_leave: 'ขอลา',
        request_transcript: 'ขอใบระเบียนผลการศึกษา',
        request_change_course: 'ขอเปลี่ยนแปลงรายวิชา',
        other: 'อื่นๆ',
        open_course: 'ขอเปิดรายวิชานอกแผนการเรียน',
        add_seat: 'ขอเพิ่มที่นั่ง' // เพิ่มสำหรับ AddSeatRequest
      }
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchRequests();
    } else {
      this.$router.push('/login');
    }
  },
  watch: {
    currentPage() {
      this.updatePaginatedRequests();
    }
  },
  methods: {
    async fetchRequests() {
      this.isLoading = true;
      try {
        const [generalResponse, openCourseResponse, addSeatResponse] = await Promise.all([
          axios.get(`/api/generalrequests?userId=${this.user._id}`),
          axios.get(`/api/opencourserequests/opencourserequests?userId=${this.user._id}`),
          axios.get(`/api/addseatrequests/user/${this.user._id}`), // Updated endpoint
        ]);

        this.requests = [
          ...generalResponse.data.map(req => ({ ...req, requestType: 'general' })),
          ...openCourseResponse.data
            .filter(req => req.status !== 'draft')
            .map(req => ({ ...req, requestType: 'open_course', petitionType: 'open_course' })),
          ...addSeatResponse.data
            .filter(req => req.status !== 'draft')
            .map(req => ({ ...req, requestType: 'add_seat', petitionType: 'add_seat' })),
        ];
        this.filterRequests();
      } catch (error) {
        console.error('Error fetching requests:', error);
        this.errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลคำร้อง';
      } finally {
        this.isLoading = false;
      }
    },
    filterRequests() {
      let filtered = this.requests;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(request =>
          this.getPetitionTypeLabel(request).toLowerCase().includes(query)
        );
      }

      if (this.statusFilter) {
        filtered = filtered.filter(request => request.status === this.statusFilter);
      }

      this.filteredRequests = filtered;
      this.currentPage = 1;
      this.updatePaginatedRequests();
    },
    updatePaginatedRequests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.paginatedRequests = this.filteredRequests.slice(start, end);
    },
    getPetitionTypeLabel(request) {
      if (request.requestType === 'open_course') {
        return this.petitionTypeLabels['open_course'];
      } else if (request.requestType === 'add_seat') {
        return this.petitionTypeLabels['add_seat'];
      }
      return this.petitionTypeLabels[request.petitionType] || request.petitionType;
    },
    getRequestDetails(request) {
      if (request.requestType === 'open_course') {
        return `รหัสวิชา: ${request.courseCode}, ชื่อวิชา: ${request.courseTitle}, เหตุผล: ${request.reason}`;
      } else if (request.requestType === 'add_seat') {
        return `รหัสวิชา: ${request.courseCode}, ชื่อวิชา: ${request.courseTitle}, ตอนเรียน: ${request.section}`;
      }
      return request.details;
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
        pending_advisor: 'รอพิจารณาโดยอาจารย์ที่ปรึกษา',
        advisor_approved: 'อนุมัติโดยอาจารย์ที่ปรึกษา',
        advisor_rejected: 'ปฏิเสธโดยอาจารย์ที่ปรึกษา',
        pending_head: 'รอพิจารณาโดยหัวหน้าสาขา',
        head_approved: 'อนุมัติโดยหัวหน้าสาขา',
        head_rejected: 'ปฏิเสธโดยหัวหน้าสาขา',
        submitted: 'รอยื่นยันโดยอาจารย์ประจำวิชา',
        instructor_approved: 'อนุมัติโดยอาจารย์ประจำวิชา',
        instructor_rejected: 'ปฏิเสธโดยอาจารย์ประจำวิชา'
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
        head_rejected: 'status-rejected',
        submitted: 'status-pending',
        instructor_approved: 'status-approved',
        instructor_rejected: 'status-rejected'
      };
      return statusClasses[status] || '';
    },
    viewRequest(request) {
      this.selectedRequest = request;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedRequest = null;
    },
    openConfirmModal(request) {
      this.selectedRequest = request;
      this.showConfirmModal = true;
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
      this.selectedRequest = null;
    },
    async cancelRequest() {
      try {
        const endpoint = this.selectedRequest.requestType === 'open_course'
          ? `/api/opencourserequests/${this.selectedRequest._id}/reject`
          : this.selectedRequest.requestType === 'add_seat'
          ? `/api/addseatrequests/${this.selectedRequest._id}/reject`
          : `/api/generalrequests/${this.selectedRequest._id}/reject`;
        await axios.post(endpoint, { comment: 'ยกเลิกโดยนักศึกษา' });
        this.showNotification = true;
        this.notificationMessage = 'ยกเลิกคำร้องเรียบร้อยแล้ว';
        this.notificationType = 'success';
        this.notificationIcon = 'fas fa-check-circle';
        this.closeConfirmModal();
        await this.fetchRequests();
      } catch (error) {
        this.showNotification = true;
        this.notificationMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการยกเลิกคำร้อง';
        this.notificationType = 'error';
        this.notificationIcon = 'fas fa-exclamation-circle';
      }
    },
    async downloadPDF(requestId, requestType) {
      const endpoint = requestType === 'open_course'
        ? `/api/opencourserequests/${requestId}/pdf`
        : requestType === 'add_seat'
        ? `/api/addseatrequests/${requestId}/pdf`
        : `/api/generalrequests/${requestId}/pdf`;
      try {
        console.log(`Downloading PDF from: ${endpoint}`);
        const response = await axios.get(endpoint, { responseType: 'blob' });
        const fileName = requestType === 'open_course' 
          ? `RE07_${requestId}.pdf` 
          : requestType === 'add_seat' 
          ? `RE06_${requestId}.pdf` 
          : `GeneralRequest_${requestId}.pdf`;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading PDF:', {
          endpoint,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
        });
        this.showNotification = true;
        this.notificationMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการดาวน์โหลด PDF';
        this.notificationType = 'error';
        this.notificationIcon = 'fas fa-exclamation-circle';
      }
    },
    closeNotification() {
      this.showNotification = false;
      this.notificationMessage = '';
    }
  }
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

@keyframes modalFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes modalGlow {
  0% {
    transform: scale(0.85);
    opacity: 0;
    box-shadow: 0 0 0 rgba(26, 115, 232, 0);
  }
  60% {
    transform: scale(1.03);
    opacity: 1;
    box-shadow: 0 0 20px rgba(26, 115, 232, 0.3);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 15px rgba(26, 115, 232, 0.2);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 0.5;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

.status-page {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Kanit', sans-serif;
  padding: 20px;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  animation: slideDown 0.5s ease-out;
}

.status-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50, #1a73e8);
  animation: progress 2s ease-in-out infinite;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.logo {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: white;
  padding: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.header-text {
  color: white;
}

.header-text h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.8s ease-out;
}

.header-text p {
  margin: 8px 0 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  animation: fadeIn 0.8s ease-out 0.2s backwards;
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
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.back-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
  transform: translateX(-100%);
  transition: transform 0.3s;
  z-index: -1;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.back-btn:hover::before {
  transform: translateX(0);
}

.back-btn i {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.back-btn:hover i {
  transform: translateX(-5px);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progress {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.status-body {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-out;
}

.loading {
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  color: #1a73e8;
  padding: 20px;
}

.error-message {
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  color: #e74c3c;
  padding: 20px;
}

.status-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.search-bar {
  position: relative;
  flex: 1;
}

.search-bar input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.search-bar input:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 8px rgba(26, 115, 232, 0.2);
  outline: none;
}

.search-bar i {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-bar label {
  font-weight: 500;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
}

.filter-bar select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-bar select:focus {
  border-color: #1a73e8;
  outline: none;
}

.status-table-wrapper {
  overflow-x: auto;
}

.status-table {
  width: 100%;
  border-collapse: collapse;
}

.status-table th,
.status-table td {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

.status-table th {
  background: #1a73e8;
  color: white;
  font-weight: 500;
}

.status-table td {
  background: white;
  color: #333;
}

.status-table tbody tr {
  transition: background 0.3s;
}

.status-table tbody tr:hover {
  background: #f9f9f9;
}

.status-draft {
  color: #6b7280;
  font-weight: 500;
}

.status-pending {
  color: #f39c12;
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

.no-data {
  padding: 20px;
  color: #666;
  font-style: italic;
  font-size: 1rem;
  font-weight: 400;
}

.view-btn {
  padding: 8px 15px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.view-btn:hover {
  background: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.pagination-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background: #1557b0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
}

.pagination span {
  font-size: 1rem;
  font-weight: 400;
  color: #333;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: modalFade 0.5s ease-out;
}

.modal-content {
  background: rgba(245, 247, 250, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  max-width: 540px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.2), 0 0 25px rgba(26, 115, 232, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: modalGlow 0.5s ease-out;
  position: relative;
}

.modal-header {
  padding: 20px 25px;
  background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.5;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.6rem;
  cursor: pointer;
  transition: transform 0.3s, opacity 0.3s;
}

.close-btn:hover {
  transform: scale(1.2);
  opacity: 0.9;
}

.modal-body {
  padding: 30px;
}

.detail-section {
  margin-bottom: 25px;
  padding: 15px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
  transition: transform 0.3s, box-shadow 0.3s;
}

.detail-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.1);
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.5;
}

.detail-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.detail-item label {
  font-weight: 500;
  font-size: 1rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  line-height: 1.5;
}

.detail-item p {
  font-size: 1rem;
  font-weight: 400;
  color: #666;
  line-height: 1.5;
}

.detail-item p.highlight {
  color: #1a73e8;
}

.modal-footer {
  padding: 15px 25px;
  text-align: right;
  background: rgba(245, 247, 250, 0.95);
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
}

.modal-close-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.modal-close-btn2 {
  padding: 12px 30px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.modal-close-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(26, 115, 232, 0.4);
}

.modal-close-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.modal-close-btn:active::before {
  width: 200px;
  height: 200px;
  animation: ripple 0.6s ease-out;
}

.modal-close-btn2:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.modal-close-btn2::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.modal-close-btn2:active::before {
  width: 200px;
  height: 200px;
  animation: ripple 0.6s ease-out;
}

/* Confirm Modal Styling */
.confirm-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: modalFade 0.3s ease-out;
}

.confirm-modal-content {
  background: white;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  animation: modalGlow 0.5s ease-out;
}

.confirm-modal-header {
  padding: 15px 20px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.confirm-modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirm-modal-body {
  padding: 20px;
  text-align: center;
}

.confirm-modal-body p {
  font-size: 1rem;
  font-weight: 400;
  color: #333;
  margin: 0 0 10px;
}

.confirm-modal-body p.highlight {
  font-weight: 500;
  color: #1a73e8;
}

.confirm-modal-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.confirm-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.confirm-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

.cancel-btn {
  padding: 8px 15px;
  background: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.3s, transform 0.3s;
}

.cancel-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.download-btn {
  padding: 8px 15px;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 10px;
  transition: background 0.3s, transform 0.3s;
}

.download-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

.download-btn i {
  margin-right: 5px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .status-header {
    flex-direction: column;
    gap: 15px;
  }

  .back-btn {
    width: 100%;
    justify-content: center;
  }

  .status-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .status-table th,
  .status-table td {
    padding: 10px;
    font-size: 0.95rem;
  }

  .view-btn {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .modal-content {
    width: 95%;
    max-height: 90vh;
  }

  .modal-header h3 {
    font-size: 1.4rem;
  }

  .detail-section h4 {
    font-size: 1.15rem;
  }

  .detail-item label,
  .detail-item p {
    font-size: 0.95rem;
  }

  .modal-close-btn,
  .modal-close-btn2 {
    padding: 10px 25px;
  }

  .confirm-modal-content {
    width: 95%;
  }

  .confirm-modal-header h3 {
    font-size: 1.1rem;
  }

  .confirm-modal-body p {
    font-size: 0.95rem;
  }

  .confirm-btn,
  .cancel-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}

/* Notification Styling */
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
  animation: slideIn 0.5s ease-out, fadeOut 0.5s ease-in 4.5s forwards;
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

.notification.warning {
  background: linear-gradient(135deg, #f39c12 0%, #d35400 100%);
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
  opacity: 0.8;
  transition: opacity 0.3s;
}

.notification-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>