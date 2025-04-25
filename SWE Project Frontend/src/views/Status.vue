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

    <!-- Status Body -->
    <div class="status-body">
      <!-- Loading and Error States -->
      <div v-if="isLoading" class="loading">กำลังโหลดข้อมูล...</div>
      <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-else>
        <!-- Search and Filter -->
        <div class="status-controls">
          <div class="search-bar">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="ค้นหาคำร้อง (เช่น รายวิชา, ประเภทคำร้อง)"
              @input="filterRequests"
            />
            <i class="fas fa-search"></i>
          </div>
          <div class="filter-bar">
            <label>กรองสถานะ:</label>
            <select v-model="statusFilter" @change="filterRequests">
              <option value="">ทั้งหมด</option>
              <option value="ร่าง">ร่าง</option>
              <option value="รอพิจารณา">รอพิจารณา</option>
              <option value="อนุมัติ">อนุมัติ</option>
              <option value="ปฏิเสธ">ปฏิเสธ</option>
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
                <th>รายวิชา</th>
                <th>สถานะ</th>
                <th>หมายเหตุ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in paginatedRequests" :key="request._id">
                <td>{{ request.date }}</td>
                <td>{{ request.type }}</td>
                <td>{{ request.course }}</td>
                <td>
                  <span :class="getStatusClass(request.status)">{{ request.status }}</span>
                </td>
                <td>{{ request.note || '-' }}</td>
                <td>
                  <button class="view-btn" @click="viewRequest(request)">
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
              <tr v-if="paginatedRequests.length === 0">
                <td colspan="6" class="no-data">ไม่พบคำร้องที่ตรงกับเงื่อนไข</td>
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
                  <p>คำร้องขอเปิดรายวิชานอกแผน</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-book"></i> รายวิชา:</label>
                  <p class="highlight">{{ `${selectedRequest.courseCode} - ${selectedRequest.courseTitle}` }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-graduation-cap"></i> หน่วยกิต:</label>
                  <p>{{ selectedRequest.credits }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-comment"></i> เหตุผล:</label>
                  <p>{{ selectedRequest.reason }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-info"></i> สถานะ:</label>
                  <p :class="getStatusClass(selectedRequest.status)" class="highlight">
                    {{ formatStatus(selectedRequest.status) }}
                  </p>
                </div>
              </div>

              <!-- Student Information -->
              <div class="detail-section">
                <h4><i class="fas fa-user"></i> ข้อมูลนักศึกษา</h4>
                <div class="detail-item">
                  <label><i class="fas fa-user-circle"></i> ผู้ยื่น:</label>
                  <p>{{ selectedRequest.studentName }} ({{ selectedRequest.studentId }})</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-university"></i> คณะ:</label>
                  <p>{{ selectedRequest.faculty }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-graduation-cap"></i> สาขาวิชา:</label>
                  <p>{{ selectedRequest.fieldOfStudy }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-layer-group"></i> ระดับการศึกษา:</label>
                  <p>{{ selectedRequest.levelOfStudy.join(', ') }}</p>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="detail-section">
                <h4><i class="fas fa-envelope"></i> ข้อมูลติดต่อ</h4>
                <div class="detail-item">
                  <label><i class="fas fa-phone"></i> เบอร์โทรศัพท์:</label>
                  <p>{{ selectedRequest.contactNumber }}</p>
                </div>
                <div class="detail-item">
                  <label><i class="fas fa-at"></i> อีเมล:</label>
                  <p>{{ selectedRequest.email }}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="modal-close-btn" @click="closeModal">
                <i class="fas fa-times-circle"></i> ปิด
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
      requests: [],
      searchQuery: '',
      statusFilter: '',
      filteredRequests: [],
      currentPage: 1,
      itemsPerPage: 5,
      isLoading: false,
      errorMessage: '',
      showModal: false,
      selectedRequest: null
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
    },
    paginatedRequests() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredRequests.slice(start, end);
    }
  },
  methods: {
    async fetchRequests() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        // ดึงข้อมูลผู้ใช้จาก localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.email || !userData._id) {
          throw new Error('ไม่พบข้อมูลผู้ใช้หรือข้อมูลไม่ครบถ้วน');
        }

        console.log('Fetching requests for:', userData.email, userData._id); // ดีบั๊ก

        // ดึงข้อมูลจากทั้งสอง endpoints พร้อมกัน
        const [openCourseResponse, addSeatResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/opencourserequests?email=${userData.email}`),
          axios.get(`http://localhost:3000/api/addseatrequests?email=${userData.email}`)
        ]);

        // แปลงข้อมูลจาก opencourserequests
        const openCourseRequests = openCourseResponse.data.map(form => ({
          _id: form._id,
          date: this.formatDate(form.createdAt),
          type: 'คำร้องขอเปิดรายวิชานอกแผน',
          course: `${form.courseCode} - ${form.courseTitle}`,
          status: this.formatStatus(form.status),
          note: form.reason || '-',
          createdAt: form.createdAt,
          courseCode: form.courseCode,
          courseTitle: form.courseTitle,
          credits: form.credits,
          reason: form.reason,
          studentName: form.studentName,
          studentId: form.studentId,
          faculty: form.faculty,
          fieldOfStudy: form.fieldOfStudy,
          levelOfStudy: form.levelOfStudy,
          contactNumber: form.contactNumber,
          email: form.email
        }));

        // แปลงข้อมูลจาก addseatrequests
        const addSeatRequests = addSeatResponse.data.map(form => ({
          _id: form._id,
          date: this.formatDate(form.createdAt),
          type: 'คำร้องขอเพิ่มที่นั่ง',
          course: `${form.courseCode} - ${form.courseTitle}`,
          status: this.formatStatus(form.status),
          note: form.reason || '-',
          createdAt: form.createdAt,
          courseCode: form.courseCode,
          courseTitle: form.courseTitle,
          credits: form.credits,
          reason: form.reason,
          studentName: form.studentName,
          studentId: form.studentId,
          faculty: form.faculty,
          fieldOfStudy: form.fieldOfStudy,
          levelOfStudy: form.levelOfStudy,
          contactNumber: form.contactNumber,
          email: form.email
        }));

        // รวมข้อมูลและกรองโดย userId เพื่อความมั่นใจ
        this.requests = [...openCourseRequests, ...addSeatRequests].filter(
          request => request.email === userData.email
        );

        // เรียงลำดับตามวันที่จากใหม่ไปเก่า
        this.requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        this.filteredRequests = [...this.requests];

        console.log('Fetched requests:', this.requests); // ดีบั๊ก
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        this.errorMessage = 'ไม่สามารถโหลดข้อมูลคำร้องได้ กรุณาลองใหม่';
      } finally {
        this.isLoading = false;
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
      switch (status) {
        case 'draft':
          return 'ร่าง';
        case 'submitted':
          return 'รอพิจารณา';
        case 'approved':
          return 'อนุมัติ';
        case 'rejected':
          return 'ปฏิเสธ';
        default:
          return status;
      }
    },
    getStatusClass(status) {
      if (status === 'รอพิจารณา') return 'status-pending';
      if (status === 'อนุมัติ') return 'status-approved';
      if (status === 'ปฏิเสธ') return 'status-rejected';
      if (status === 'ร่าง') return 'status-draft';
      return '';
    },
    filterRequests() {
      let filtered = this.requests;

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          request =>
            request.type.toLowerCase().includes(query) ||
            request.course.toLowerCase().includes(query)
        );
      }

      if (this.statusFilter) {
        filtered = filtered.filter(request => request.status === this.statusFilter);
      }

      this.filteredRequests = filtered;
      this.currentPage = 1;
    },
    viewRequest(request) {
      this.selectedRequest = request;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedRequest = null;
    }
  },
  async created() {
    await this.fetchRequests();
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
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.8s ease-out;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.header-text h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a73e8;
  line-height: 1.5;
}

.header-text p {
  margin: 5px 0 0;
  font-size: 1rem;
  font-weight: 400;
  color: #666;
  line-height: 1.5;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f1f3f5;
  border: none;
  border-radius: 5px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.back-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  color: #2ecc71;
  font-weight: 500;
}

.status-rejected {
  color: #e74c3c;
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

  .modal-close-btn {
    padding: 10px 25px;
  }
}
</style>