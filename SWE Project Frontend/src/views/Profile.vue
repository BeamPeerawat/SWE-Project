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
        <div class="info-grid">
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
            <p v-if="!isEditing">{{ user.studentId || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="text"
              v-model="editUser.studentId"
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
              required
            />
          </div>
          <div class="info-item">
            <label>สาขาวิชา:</label>
            <p v-if="!isEditing">{{ user.fieldOfStudy || 'ยังไม่ได้ระบุ' }}</p>
            <input
              v-else
              type="text"
              v-model="editUser.fieldOfStudy"
              placeholder="สาขาวิชา"
              required
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
            <div v-else>
              <input
                type="tel"
                v-model="editUser.contactNumber"
                placeholder="เบอร์โทรศัพท์"
                maxlength="10"
                inputmode="numeric"
                pattern="[0-9]{10}"
                @input="restrictToNumbers"
                required
              />
              <span
                v-if="editUser.contactNumber && editUser.contactNumber.length !== 10"
                class="error-message"
              >
                กรุณากรอกเบอร์โทรศัพท์ 10 หลัก
              </span>
            </div>
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
                <th>รายวิชา</th>
                <th>สถานะ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in requestHistory" :key="request._id">
                <td>{{ formatDate(request.createdAt) }}</td>
                <td>{{ request.requestType }}</td>
                <td>{{ `${request.courseCode} - ${request.courseTitle}` }}</td>
                <td>
                  <span :class="getStatusClass(request.status)">{{
                    formatStatus(request.status)
                  }}</span>
                </td>
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
            <button class="modal-close-btn2" @click="cancelRequest">
              <i class="fas fa-times-circle"></i> ยกเลิกคำร้อง
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

      <!-- Confirm Cancel Modal -->
      <div v-if="showConfirmModal" class="confirm-modal-overlay" @click="closeConfirmModal">
        <div class="confirm-modal-content" @click.stop>
          <div class="confirm-modal-header">
            <h3><i class="fas fa-exclamation-circle"></i> ยืนยันการยกเลิก</h3>
          </div>
          <div class="confirm-modal-body">
            <p>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำร้องนี้?</p>
            <p class="highlight">{{ `${selectedRequest.courseCode} - ${selectedRequest.courseTitle}` }}</p>
          </div>
          <div class="confirm-modal-footer">
            <button class="confirm-btn" @click="confirmCancel">
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
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfilePage',
  data() {
    return {
      isEditing: false,
      isLoading: false,
      errorMessage: '',
      showModal: false,
      showConfirmModal: false,
      selectedRequest: null,
      // Notification data
      showNotification: false,
      notificationMessage: '',
      notificationType: 'success',
      notificationIcon: 'fas fa-check-circle',
      user: {
        name: '',
        studentId: '',
        faculty: '',
        fieldOfStudy: '',
        email: '',
        contactNumber: ''
      },
      editUser: {
        name: '',
        studentId: '',
        faculty: '',
        fieldOfStudy: '',
        email: '',
        contactNumber: ''
      },
      requestHistory: []
    };
  },
  async mounted() {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    // Fetch request history from backend
    await this.fetchRequestHistory();
  },
  methods: {
    async fetchRequestHistory() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        // ดึงข้อมูลผู้ใช้จาก localStorage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData.email || !userData._id) {
          throw new Error('ไม่พบข้อมูลผู้ใช้หรือข้อมูลไม่ครบถ้วน');
        }

        console.log('Fetching request history for:', userData.email, userData._id); // ดีบั๊ก

        // ดึงข้อมูลจากทั้งสอง endpoints พร้อมกัน
        const [openCourseResponse, addSeatResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/opencourserequests?email=${userData.email}`),
          axios.get(`http://localhost:3000/api/addseatrequests?email=${userData.email}`)
        ]);

        // แปลงข้อมูลจาก opencourserequests
        const openCourseRequests = openCourseResponse.data.map(request => ({
          ...request,
          requestType: 'คำร้องขอเปิดรายวิชานอกแผน'
        }));

        // แปลงข้อมูลจาก addseatrequests
        const addSeatRequests = addSeatResponse.data.map(request => ({
          ...request,
          requestType: 'คำร้องขอเพิ่มที่นั่ง'
        }));

        // รวมข้อมูลและกรองโดย email เพื่อความมั่นใจ
        this.requestHistory = [...openCourseRequests, ...addSeatRequests]
          .filter(request => request.email === userData.email)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        console.log('Fetched request history:', this.requestHistory); // ดีบั๊ก
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        this.errorMessage = 'เกิดข้อผิดพลาดในการโหลดประวัติคำร้อง กรุณาลองใหม่';
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(dateString) {
      // Format MongoDB createdAt date to DD-MM-YYYY
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    formatStatus(status) {
      // Map database status to user-friendly text
      return status === 'draft' ? 'ร่าง' : 'รอพิจารณา';
    },
    editProfile() {
      // Enter edit mode and populate editUser with current user data
      this.editUser = { ...this.user };
      this.isEditing = true;
    },
    saveProfile() {
      // Validate contact number
      if (this.editUser.contactNumber.length !== 10) {
        alert('กรุณากรอกเบอร์โทรศัพท์ 10 หลัก');
        return;
      }
      // Update user data
      this.user = { ...this.editUser };
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(this.user));
      // Exit edit mode
      this.isEditing = false;
      alert('บันทึกข้อมูลเรียบร้อยแล้ว!');
    },
    cancelEdit() {
      // Exit edit mode without saving
      this.isEditing = false;
      this.editUser = {
        name: '',
        studentId: '',
        faculty: '',
        fieldOfStudy: '',
        email: '',
        contactNumber: ''
      };
    },
    restrictToNumbers(event) {
      // Restrict contact number to numeric characters
      this.editUser.contactNumber = event.target.value.replace(/[^0-9]/g, '');
    },
    viewRequest(request) {
      // Show modal with request details
      this.selectedRequest = request;
      this.showModal = true;
    },
    closeModal() {
      // Hide modal and clear selected request
      this.showModal = false;
      this.selectedRequest = null;
    },
    getStatusClass(status) {
      // Return class based on request status
      if (status === 'draft') return 'status-draft';
      return 'status-pending';
    },
    cancelRequest() {
      // แสดงป็อปอัพยืนยัน
      this.showConfirmModal = true;
    },
    closeConfirmModal() {
      this.showConfirmModal = false;
    },
    async confirmCancel() {
      try {
        // ตรวจสอบว่า selectedRequest มีค่าและมี _id
        if (!this.selectedRequest || !this.selectedRequest._id) {
          throw new Error('ไม่พบข้อมูลคำร้องที่เลือก');
        }

        // กำหนด endpoint ตามประเภทคำร้อง
        const endpoint =
          this.selectedRequest.requestType === 'คำร้องขอเปิดรายวิชานอกแผน'
            ? `http://localhost:3000/api/opencourserequests/${this.selectedRequest._id}`
            : `http://localhost:3000/api/addseatrequests/${this.selectedRequest._id}`;

        // ส่งคำขอ DELETE ไปยัง backend
        await axios.delete(endpoint);

        // แสดง notification
        this.showNotification = true;
        this.notificationMessage = 'ยกเลิกคำร้องสำเร็จ';
        this.notificationType = 'success';
        this.notificationIcon = 'fas fa-check-circle';

        // ลบคำร้องออกจาก state
        this.requestHistory = this.requestHistory.filter(
          request => request._id !== this.selectedRequest._id
        );

        // ปิด modals ทั้งสอง
        this.closeConfirmModal();
        this.closeModal();

        // Auto-hide notification หลัง 5 วินาที
        setTimeout(() => {
          this.closeNotification();
        }, 5000);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการยกเลิกคำร้อง:', error);
        // แสดง notification ข้อผิดพลาด
        this.showNotification = true;
        this.notificationMessage = 'ไม่สามารถยกเลิกคำร้องได้ กรุณาลองใหม่';
        this.notificationType = 'error';
        this.notificationIcon = 'fas fa-exclamation-circle';

        // ปิด confirm modal
        this.closeConfirmModal();

        // Auto-hide notification หลัง 5 วินาที
        setTimeout(() => {
          this.closeNotification();
        }, 5000);
      }
    },
    closeNotification() {
      this.showNotification = false;
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

@keyframes scaleUp {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
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
    box-shadow: 0 0 0 rgba(37, 99, 235, 0);
  }
  60% {
    transform: scale(1.03);
    opacity: 1;
    box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
  }
  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 15px rgba(37, 99, 235, 0.2);
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

/* General Page Styling */
.profile-page {
  min-height: 100vh;
  background: #f9fafb;
  font-family: 'Kanit', sans-serif;
  padding: 20px;
  color: #1f2937;
}

/* Header Styling */
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Profile Container Styling */
.profile-container {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  animation: fadeIn 1s ease-out;
}

/* User Info Section Styling */
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

/* Request History Section Styling */
.history-table {
  width: 100%;
  overflow-x: auto;
}

.loading {
  text-align: center;
  color: #2563eb;
  font-size: 1rem;
  font-weight: 400;
  margin: 20px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
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
  font-size: 1rem;
}

td {
  color: #1f2937;
  font-size: 1rem;
  font-weight: 400;
}

.status-draft {
  color: #6b7280;
  font-weight: 500;
}

.status-pending {
  color: #f97316;
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
  cursor: pointer;
  transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
}

.view-btn:hover {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
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
  background: rgba(249, 250, 251, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  max-width: 540px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.2), 0 0 25px rgba(37, 99, 235, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: modalGlow 0.5s ease-out;
  position: relative;
}

.modal-header {
  padding: 20px 25px;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: #ffffff;
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
  color: #ffffff;
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
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.detail-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2563eb;
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
  color: #6b7280;
  line-height: 1.5;
}

.detail-item p.highlight {
  color: #2563eb;
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
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: #ffffff;
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
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
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

/* Responsive Design */
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

  th,
  td {
    padding: 8px;
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
  color: #2563eb;
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
  padding: 10px 20px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
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

.cancel-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* Responsive Design for Notification and Confirm Modal */
@media (max-width: 768px) {
  .notification {
    width: 90%;
    right: 5%;
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
</style>