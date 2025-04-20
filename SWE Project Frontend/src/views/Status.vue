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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(request, index) in paginatedRequests" :key="index">
                <td>{{ request.date }}</td>
                <td>{{ request.type }}</td>
                <td>{{ request.course }}</td>
                <td>
                  <span :class="getStatusClass(request.status)">{{ request.status }}</span>
                </td>
                <td>{{ request.note || '-' }}</td>
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
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StatusPage',
    data() {
      return {
        // ข้อมูลจำลองสำหรับตารางสถานะคำร้อง
        requests: [
          {
            date: '08/04/2025',
            type: 'คำร้องขอเพิ่มที่นั่ง',
            course: 'CS101 - Introduction to Programming',
            status: 'รอพิจารณา',
            note: 'รออาจารย์พิจารณา',
          },
          {
            date: '07/04/2025',
            type: 'คำร้องขอเปิดรายวิชานอกแผน',
            course: 'ENG201 - English for Engineers',
            status: 'อนุมัติ',
            note: 'อนุมัติโดยคณบดี',
          },
          {
            date: '06/04/2025',
            type: 'คำร้องขอเพิ่มที่นั่ง',
            course: 'MATH301 - Calculus III',
            status: 'ปฏิเสธ',
            note: 'ที่นั่งเต็ม',
          },
          {
            date: '05/04/2025',
            type: 'คำร้องขอเปิดรายวิชานอกแผน',
            course: 'PHY101 - Physics I',
            status: 'รอพิจารณา',
            note: '',
          },
          {
            date: '04/04/2025',
            type: 'คำร้องขอเพิ่มที่นั่ง',
            course: 'CHEM201 - Chemistry II',
            status: 'อนุมัติ',
            note: 'อนุมัติโดยอาจารย์',
          },
          {
            date: '03/04/2025',
            type: 'คำร้องขอเพิ่มที่นั่ง',
            course: 'BIO101 - Biology I',
            status: 'รอพิจารณา',
            note: 'รออาจารย์พิจารณา',
          },
          {
            date: '02/04/2025',
            type: 'คำร้องขอเปิดรายวิชานอกแผน',
            course: 'HIST101 - World History',
            status: 'ปฏิเสธ',
            note: 'ไม่สอดคล้องกับหลักสูตร',
          },
        ],
        searchQuery: '',
        statusFilter: '',
        filteredRequests: [],
        currentPage: 1,
        itemsPerPage: 5, // ปรับจาก 3 เป็น 5 เพื่อแสดง 5 คำร้องต่อหน้า
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
      },
    },
    methods: {
      getStatusClass(status) {
        if (status === 'รอพิจารณา') return 'status-pending';
        if (status === 'อนุมัติ') return 'status-approved';
        if (status === 'ปฏิเสธ') return 'status-rejected';
        return '';
      },
      filterRequests() {
        let filtered = this.requests;
  
        // กรองตามคำค้นหา
        if (this.searchQuery) {
          const query = this.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (request) =>
              request.type.toLowerCase().includes(query) ||
              request.course.toLowerCase().includes(query)
          );
        }
  
        // กรองตามสถานะ
        if (this.statusFilter) {
          filtered = filtered.filter(
            (request) => request.status === this.statusFilter
          );
        }
  
        this.filteredRequests = filtered;
        this.currentPage = 1; // รีเซ็ตหน้าเมื่อมีการกรอง
      },
    },
    created() {
      this.filteredRequests = [...this.requests]; // โหลดข้อมูลเริ่มต้น
    },
  };
  </script>
  
  <style scoped>
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
    color: #1a73e8;
  }
  
  .header-text p {
    margin: 5px 0 0;
    font-size: 1rem;
    color: #666;
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
    color: #333;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .back-btn:hover {
    background: #e0e0e0;
  }
  
  .status-body {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
    transition: border-color 0.3s;
  }
  
  .search-bar input:focus {
    border-color: #1a73e8;
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
    color: #333;
  }
  
  .filter-bar select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-family: 'Kanit', sans-serif;
    font-size: 1rem;
    cursor: pointer;
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
  }
  
  .status-table th {
    background: #1a73e8;
    color: white;
    font-weight: 500;
  }
  
  .status-table td {
    background: white;
    color: #333;
    font-size: 1rem;
  }
  
  .status-table tbody tr {
    transition: background 0.3s;
  }
  
  .status-table tbody tr:hover {
    background: #f9f9f9;
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
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .pagination-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .pagination-btn:hover:not(:disabled) {
    background: #1557b0;
  }
  
  .pagination span {
    font-size: 1rem;
    color: #333;
  }
  </style>