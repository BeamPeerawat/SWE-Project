<template>
    <div class="announcements-page">
      <div class="header">
        <div class="header-content">
          <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
          <div class="header-text">
            <h1>จัดการประชาสัมพันธ์ - แอดมิน</h1>
            <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
            <p v-if="user">ผู้ใช้: {{ user.email }}</p>
          </div>
        </div>
      </div>
  
      <div class="announcements-container">
        <div class="announcements-section">
          <h2>ประชาสัมพันธ์ทั้งหมด</h2>
          <button class="add-btn" @click="openAddModal">+ เพิ่มประชาสัมพันธ์</button>
          <div class="announcements-table">
            <table>
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>หัวข้อ</th>
                  <th>เนื้อหา</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="announcement in announcements" :key="announcement._id">
                  <td>{{ formatDate(announcement.createdAt) }}</td>
                  <td>{{ announcement.title }}</td>
                  <td>{{ truncateContent(announcement.content) }}</td>
                  <td>
                    <button class="edit-btn" @click="editAnnouncement(announcement)">แก้ไข</button>
                    <button class="delete-btn" @click="deleteAnnouncement(announcement._id)">ลบ</button>
                  </td>
                </tr>
                <tr v-if="announcements.length === 0">
                  <td colspan="4">ไม่มีประชาสัมพันธ์</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
  
        <div v-if="showModal" class="modal">
          <div class="modal-content">
            <h2>{{ isEditing ? 'แก้ไขประชาสัมพันธ์' : 'เพิ่มประชาสัมพันธ์' }}</h2>
            <form @submit.prevent="saveAnnouncement">
              <div class="form-group">
                <label>หัวข้อ:</label>
                <input
                  type="text"
                  v-model="currentAnnouncement.title"
                  placeholder="หัวข้อ"
                  required
                />
              </div>
              <div class="form-group">
                <label>เนื้อหา:</label>
                <textarea
                  v-model="currentAnnouncement.content"
                  placeholder="เนื้อหา"
                  required
                ></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="save-btn">บันทึก</button>
                <button type="button" class="cancel-btn" @click="closeModal">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  
      <footer class="footer-section">
        <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminAnnouncements',
    data() {
      return {
        user: null,
        announcements: [
          {
            _id: '1',
            createdAt: '2025-05-01',
            title: 'ปิดปรับปรุงระบบ',
            content: 'ระบบจะปิดปรับปรุงในวันที่ 10 พ.ค. 2568',
          },
          {
            _id: '2',
            createdAt: '2025-05-02',
            title: 'กำหนดการลงทะเบียน',
            content: 'ลงทะเบียนเรียนภาคการศึกษาที่ 1/2568 เริ่ม 15 พ.ค. 2568',
          },
        ],
        showModal: false,
        isEditing: false,
        currentAnnouncement: {
          _id: null,
          title: '',
          content: '',
        },
      };
    },
    created() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
      truncateContent(content) {
        return content.length > 50 ? content.slice(0, 50) + '...' : content;
      },
      openAddModal() {
        this.isEditing = false;
        this.currentAnnouncement = { _id: null, title: '', content: '' };
        this.showModal = true;
      },
      editAnnouncement(announcement) {
        this.isEditing = true;
        this.currentAnnouncement = { ...announcement };
        this.showModal = true;
      },
      saveAnnouncement() {
        if (this.isEditing) {
          const index = this.announcements.findIndex(a => a._id === this.currentAnnouncement._id);
          if (index !== -1) {
            this.announcements[index] = {
              ...this.currentAnnouncement,
              createdAt: this.announcements[index].createdAt,
            };
          }
        } else {
          this.announcements.push({
            _id: String(this.announcements.length + 1),
            createdAt: new Date().toISOString(),
            ...this.currentAnnouncement,
          });
        }
        this.closeModal();
        alert('บันทึกประชาสัมพันธ์เรียบร้อยแล้ว!');
      },
      deleteAnnouncement(id) {
        if (confirm('ยืนยันการลบประชาสัมพันธ์นี้?')) {
          this.announcements = this.announcements.filter(a => a._id !== id);
          alert('ลบประชาสัมพันธ์เรียบร้อยแล้ว!');
        }
      },
      closeModal() {
        this.showModal = false;
        this.currentAnnouncement = { _id: null, title: '', content: '' };
      },
    },
  };
  </script>
  
  <style scoped>
  .announcements-page { min-height: 100vh; background: #f9fafb; font-family: 'Kanit', sans-serif; padding: 20px; color: #1f2937; }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); border-radius: 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); }
  .header-content { display: flex; align-items: center; gap: 20px; }
  .logo { width: 70px; height: 70px; border-radius: 50%; background: white; padding: 8px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); }
  .header-text h1 { margin: 0; font-size: 2rem; font-weight: 600; color: white; }
  .header-text p { margin: 8px 0 0; font-size: 1.1rem; color: rgba(255, 255, 255, 0.9); }
  .announcements-container { background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
  .announcements-section { position: relative; }
  .announcements-section h2 { font-size: 1.5rem; font-weight: 600; color: #2563eb; margin-bottom: 20px; }
  .add-btn { position: absolute; top: 0; right: 0; padding: 10px 20px; background: #10b981; color: #ffffff; border: none; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; cursor: pointer; transition: background 0.3s, transform 0.3s; }
  .add-btn:hover { background: #059669; transform: translateY(-2px); }
  .announcements-table { width: 100%; overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d1d5db; padding: 12px; text-align: center; }
  th { background: #2563eb; color: #ffffff; font-weight: 500; }
  td { color: #1f2937; font-size: 1rem; }
  .edit-btn, .delete-btn { padding: 8px 15px; border: none; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 0.9rem; cursor: pointer; margin: 0 5px; }
  .edit-btn { background: #f97316; color: #ffffff; }
  .edit-btn:hover { background: #ea580c; }
  .delete-btn { background: #ef4444; color: #ffffff; }
  .delete-btn:hover { background: #dc2626; }
  .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 2000; }
  .modal-content { background: #ffffff; padding: 20px; border-radius: 12px; width: 90%; max-width: 600px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); }
  .modal-content h2 { font-size: 1.5rem; font-weight: 600; color: #2563eb; margin-bottom: 20px; }
  .form-group { margin-bottom: 15px; }
  .form-group label { font-weight: 500; font-size: 1rem; color: #1f2937; margin-bottom: 5px; display: block; }
  .form-group input, .form-group textarea { width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; }
  .form-group textarea { height: 100px; resize: vertical; }
  .form-group input:focus, .form-group textarea:focus { border-color: #2563eb; box-shadow: 0 0 8px rgba(37, 99, 235, 0.2); outline: none; }
  .form-actions { display: flex; gap: 10px; justify-content: flex-end; }
  .save-btn, .cancel-btn { padding: 10px 20px; border: none; border-radius: 8px; font-family: 'Kanit', sans-serif; font-size: 1rem; cursor: pointer; }
  .save-btn { background: #10b981; color: #ffffff; }
  .save-btn:hover { background: #059669; }
  .cancel-btn { background: #6b7280; color: #ffffff; }
  .cancel-btn:hover { background: #4b5563; }
  .footer-section { background: #2563eb; color: white; text-align: center; padding: 20px; font-size: 0.9rem; margin-top: 30px; }
  .footer-section p { margin: 0; }
  </style>