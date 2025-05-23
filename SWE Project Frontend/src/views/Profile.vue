<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="profile-header">
      <div class="header-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <div class="header-text">
          <h1>โปรไฟล์ผู้ใช้</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
        </div>
      </div>
      <button class="back-btn" @click="$router.push('/')">
        <i class="fas fa-arrow-left"></i> ย้อนกลับ
      </button>
    </div>

    <!-- Profile Content -->
    <div class="profile-container">
      <!-- User Info Section -->
      <div class="profile-section user-info">
        <h2>ข้อมูลส่วนตัว</h2>
        <div v-if="isLoadingUser" class="loading">กำลังโหลดข้อมูลผู้ใช้...</div>
        <div v-else-if="errorMessageUser" class="error-message">
          {{ errorMessageUser }}
        </div>
        <div v-else class="info-grid">
          <div class="info-item">
            <label>ชื่อ-นามสกุล:</label>
            <p v-if="!isEditing">{{ user.name || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="text"
              v-model="editUser.name"
              placeholder="ชื่อ-นามสกุล"
              required
            />
          </div>
          <div class="info-item">
            <label>รหัสนักศึกษา:</label>
            <p v-if="!isEditing">{{ user.student_no || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="text"
              v-model="editUser.student_no"
              placeholder="รหัสนักศึกษา"
              required
            />
          </div>
          <div class="info-item">
            <label>คณะ:</label>
            <p v-if="!isEditing">{{ user.faculty || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="text"
              v-model="editUser.faculty"
              placeholder="คณะ"
            />
          </div>
          <div class="info-item">
            <label>สาขาวิชา:</label>
            <p v-if="!isEditing">{{ user.branch || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="text"
              v-model="editUser.branch"
              placeholder="สาขาวิชา"
            />
          </div>
          <div class="info-item">
            <label>กลุ่มเรียน:</label>
            <p v-if="!isEditing">{{ user.group || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="text"
              v-model="editUser.group"
              placeholder="กลุ่มเรียน"
            />
          </div>
          <div class="info-item">
            <label>อีเมล:</label>
            <p v-if="!isEditing">{{ user.email || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="email"
              v-model="editUser.email"
              placeholder="อีเมล"
              required
            />
          </div>
          <div class="info-item">
            <label>เบอร์โทรศัพท์:</label>
            <p v-if="!isEditing">{{ user.contactNumber || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="text"
              v-model="editUser.contactNumber"
              placeholder="เบอร์โทรศัพท์"
              @input="restrictToNumbers"
            />
            <span v-if="isEditing && editUser.contactNumber && editUser.contactNumber.length !== 10" class="error-message">
              กรุณากรอกเบอร์โทรศัพท์ 10 หลัก
            </span>
          </div>
        </div>
        <div class="action-buttons">
          <button v-if="!isEditing" class="edit-btn" @click="editProfile">
            แก้ไขข้อมูล
          </button>
          <div v-else class="edit-actions">
            <button type="button" class="save-btn" @click="saveProfile">
              บันทึก
            </button>
            <button type="button" class="cancel-btn" @click="cancelEdit">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>

      <!-- Request History Section -->
      <div class="profile-section request-history">
        <h2>ประวัติการยื่นคำร้อง</h2>
        <div v-if="isLoading" class="loading">กำลังโหลดข้อมูล...</div>
        <div v-else-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div v-else class="history-table">
          <table>
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
              <tr v-for="request in requestHistory" :key="request._id">
                <td>{{ formatDate(request.createdAt) }}</td>
                <td>{{ getPetitionTypeLabel(request) }}</td>
                <td>
                  <span :class="getStatusClass(request.status)">{{
                    formatStatus(request.status)
                  }}</span>
                </td>
                <td>{{ request.advisorComment || request.headComment || '-' }}</td>
                <td>
                  <button class="view-btn" @click="viewRequest(request)">
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
              <tr v-if="requestHistory.length === 0">
                <td colspan="5">ยังไม่มีประวัติการยื่นคำร้อง</td>
              </tr>
            </tbody>
          </table>
        </div>
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
                <p>{{ selectedRequest.fieldOfStudy || selectedRequest.branch }}</p>
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

      <!-- Notification -->
      <div v-if="showNotification" class="notification" :class="notificationType">
        <i :class="notificationIcon"></i>
        <span>{{ notificationMessage }}</span>
        <button class="notification-close" @click="closeNotification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfilePage',
  data() {
    return {
      isEditing: false,
      isLoading: false,
      isLoadingUser: false,
      errorMessage: '',
      errorMessageUser: '',
      showModal: false,
      selectedRequest: null,
      showNotification: false,
      notificationMessage: '',
      notificationType: 'success',
      notificationIcon: 'fas fa-check-circle',
      user: {
        name: '',
        student_no: '',
        faculty: '',
        branch: '',
        group: '',
        email: '',
        contactNumber: '',
      },
      editUser: {
        name: '',
        student_no: '',
        faculty: '',
        branch: '',
        group: '',
        email: '',
        contactNumber: '',
      },
      requestHistory: [],
      petitionTypeLabels: {
        request_leave: 'ขอลา',
        request_transcript: 'ขอใบระเบียนผลการศึกษา',
        request_change_course: 'ขอเปลี่ยนแปลงรายวิชา',
        other: 'อื่นๆ',
        open_course: 'ขอเปิดรายวิชานอกแผนการเรียน',
        add_seat: 'ขอเพิ่มที่นั่ง',
      },
    };
  },
  async mounted() {
    await this.fetchUserData();
    await this.fetchRequestHistory();
  },
  methods: {
    async fetchUserData() {
      this.isLoadingUser = true;
      this.errorMessageUser = '';
      try {
        const response = await this.$axios.get('/api/auth/user');
        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } catch (error) {
        console.error('Error fetching user data:', error);
        this.errorMessageUser = 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้ กรุณาล็อกอินใหม่';
        if (error.response?.status === 401) {
          setTimeout(() => {
            localStorage.removeItem('user');
            this.$router.push('/login');
          }, 2000);
        }
      } finally {
        this.isLoadingUser = false;
      }
    },
    async fetchRequestHistory() {
  this.isLoading = true;
  this.errorMessage = '';
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData._id) {
      throw new Error('ไม่พบข้อมูลผู้ใช้หรือข้อมูลไม่ครบถ้วน');
    }

    const [generalResponse, openCourseResponse, addSeatResponse] = await Promise.all([
      axios.get(`/api/generalrequests?userId=${userData._id}`),
      axios.get(`/api/opencourserequests/opencourserequests?userId=${userData._id}`),
      axios.get(`/api/addseatrequests/user/${userData._id}`), // Updated endpoint
    ]);

    this.requestHistory = [
      ...generalResponse.data.map(req => ({ ...req, requestType: 'general' })),
      ...openCourseResponse.data
        .filter(req => req.status !== 'draft')
        .map(req => ({ ...req, requestType: 'open_course', petitionType: 'open_course' })),
      ...addSeatResponse.data
        .filter(req => req.status !== 'draft')
        .map(req => ({ ...req, requestType: 'add_seat', petitionType: 'add_seat' })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching request history:', error);
    this.errorMessage = 'เกิดข้อผิดพลาดในการโหลดประวัติคำร้อง กรุณาลองใหม่';
  } finally {
    this.isLoading = false;
  }
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
        year: 'numeric',
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
        instructor_rejected: 'ปฏิเสธโดยอาจารย์ประจำวิชา',
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
        instructor_rejected: 'status-rejected',
      };
      return statusClasses[status] || '';
    },
    viewRequest(request) {
      this.selectedRequest = {
        ...request,
        studentName: request.studentName || request.fullName,
        studentId: request.studentId || request.student_no,
        faculty: request.faculty,
        fieldOfStudy: request.fieldOfStudy || request.branch,
      };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedRequest = null;
    },
    editProfile() {
      this.editUser = { ...this.user };
      this.isEditing = true;
    },
    async saveProfile() {
      if (this.editUser.contactNumber && this.editUser.contactNumber.length !== 10) {
        this.showNotification = true;
        this.notificationMessage = 'กรุณากรอกเบอร์โทรศัพท์ 10 หลัก';
        this.notificationType = 'error';
        this.notificationIcon = 'fas fa-exclamation-circle';
        setTimeout(() => {
          this.closeNotification();
        }, 5000);
        return;
      }
      try {
        const updateData = {
          name: this.editUser.name,
          student_no: this.editUser.student_no,
          faculty: this.editUser.faculty,
          branch: this.editUser.branch,
          group: this.editUser.group,
          contactNumber: this.editUser.contactNumber || '',
        };
        const response = await this.$axios.put(`/api/user/${this.user.email}`, updateData);
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.isEditing = false;
        this.showNotification = true;
        this.notificationMessage = 'บันทึกข้อมูลเรียบร้อยแล้ว!';
        this.notificationType = 'success';
        this.notificationIcon = 'fas fa-check-circle';
        setTimeout(() => {
          this.closeNotification();
        }, 5000);
      } catch (error) {
        console.error('Error saving profile:', error);
        this.showNotification = true;
        this.notificationMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่';
        this.notificationType = 'error';
        this.notificationIcon = 'fas fa-exclamation-circle';
        setTimeout(() => {
          this.closeNotification();
        }, 5000);
      }
    },
    cancelEdit() {
      this.isEditing = false;
      this.editUser = {
        name: '',
        student_no: '',
        faculty: '',
        branch: '',
        group: '',
        email: '',
        contactNumber: '',
      };
    },
    restrictToNumbers(event) {
      this.editUser.contactNumber = event.target.value.replace(/[^0-9]/g, '');
    },
    closeNotification() {
      this.showNotification = false;
      this.notificationMessage = '';
    },
  },
};
</script>

<style scoped>
/* CSS รวมทั้งส่วนประวัติส่วนตัวและประวัติการยื่นคำร้อง */
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

.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Kanit', sans-serif;
  padding: 20px;
}

.profile-header {
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

.profile-header::before {
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

.profile-container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-out;
}

.profile-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 10px;
  border-left: 5px solid #2563eb;
  transition: transform 0.3s, box-shadow 0.3s;
}

.profile-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.profile-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 15px;
  border-bottom: 2px solid #2563eb;
  padding-bottom: 5px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item label {
  font-weight: 500;
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 5px;
}

.info-item p {
  font-size: 1rem;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.5;
}

.info-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.info-item input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 8px rgba(37, 99, 235, 0.2);
  outline: none;
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 400;
  margin-top: 5px;
  display: block;
}

.action-buttons {
  margin-top: 20px;
}

.edit-btn,
.save-btn,
.cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.edit-btn {
  background: #f97316;
  color: #ffffff;
}

.edit-btn:hover {
  background: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.edit-actions {
  display: flex;
  gap: 10px;
}

.save-btn {
  background: #10b981;
  color: #ffffff;
}

.save-btn:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.cancel-btn {
  background: #6b7280;
  color: #ffffff;
}

.cancel-btn:hover {
  background: #4b5563;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.history-table {
  width: 100%;
  overflow-x: auto;
}

.loading {
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  color: #1a73e8;
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

th {
  background: #1a73e8;
  color: white;
  font-weight: 500;
}

td {
  background: white;
  color: #333;
}

tbody tr {
  transition: background 0.3s;
}

tbody tr:hover {
  background: #f9f9f9;
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

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 15px;
  }

  .back-btn {
    width: 100%;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .edit-actions {
    flex-direction: column;
    gap: 10px;
  }

  .profile-section {
    padding: 15px;
  }

  th,
  td {
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

  .notification {
    width: 90%;
    right: 5%;
  }
}
</style>