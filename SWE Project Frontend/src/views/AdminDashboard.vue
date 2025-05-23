<template>
  <div class="dashboard-page">
    <div class="header">
      <div class="header-content">
        <img src="@/assets/rmuti-logo.png" alt="RMUTI Logo" class="logo" />
        <div class="header-text">
          <h1>แดชบอร์ด - แอดมิน</h1>
          <p>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
          <p v-if="user">ผู้ใช้: {{ user.name || user.email }} <button class="logout-btn" @click="logout">ออกจากระบบ</button></p>
        </div>
      </div>
    </div>

    <div class="dashboard-container">
      <div class="dashboard-section">
        <div class="controls">
          <button class="refresh-btn" @click="fetchSummary" :disabled="loading">รีเฟรชข้อมูล</button>
        </div>
        <h2>ภาพรวมระบบ</h2>
        <div v-if="loading" class="loading">กำลังโหลด...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="summary-grid">
          <div class="summary-card">
            <h3>ผู้ใช้ทั้งหมด</h3>
            <p>{{ summary.userCount }} คน</p>
          </div>
          <div class="summary-card">
            <h3>แอดมิน</h3>
            <p>{{ summary.adminCount }} คน</p>
          </div>
          <div class="summary-card">
            <h3>นักศึกษา</h3>
            <p>{{ summary.studentCount }} คน</p>
          </div>
          <div class="summary-card">
            <h3>รายวิชา</h3>
            <p>{{ summary.subjectCount }} วิชา</p>
          </div>
          <div class="summary-card">
            <h3>คณะทั้งหมด</h3>
            <p>{{ summary.facultyDistribution.length }} คณะ</p>
          </div>
        </div>

        <div class="charts-section">
          <h2>ข้อมูลสถิติ</h2>
          <div class="charts-grid">
            <div class="chart-container">
              <h3>จำนวนผู้ใช้ตามบทบาท</h3>
              <canvas id="roleChart"></canvas>
            </div>
            <div class="chart-container">
              <h3>จำนวนรายวิชาตามหน่วยกิต</h3>
              <canvas id="creditsChart"></canvas>
            </div>
            <div class="chart-container">
              <h3>จำนวนผู้ใช้ตามคณะ</h3>
              <canvas id="facultyChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer-section">
      <p>© 2025 มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น</p>
    </footer>
  </div>
</template>

<script>
import { getDashboardSummary } from '@/services/api';
import { getCurrentUser, logout } from '@/services/auth';
import Chart from 'chart.js/auto';

export default {
  name: 'AdminDashboard',
  data() {
    return {
      user: null,
      summary: {
        userCount: 0,
        adminCount: 0,
        studentCount: 0,
        subjectCount: 0,
        creditsDistribution: [],
        facultyDistribution: []
      },
      loading: false,
      error: null,
      roleChart: null,
      creditsChart: null,
      facultyChart: null
    };
  },
  async created() {
    // ดึงข้อมูลผู้ใช้ที่ล็อกอิน
    this.user = await getCurrentUser();
    if (!this.user) {
      this.$router.push('/login');
      return;
    }

    // ดึงข้อมูลสรุป
    await this.fetchSummary();
  },
  methods: {
    async fetchSummary() {
      this.loading = true;
      this.error = null;
      try {
        const response = await getDashboardSummary();
        this.summary = response.data;
        this.$nextTick(() => {
          this.renderCharts();
        });
      } catch (error) {
        this.error = error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
      } finally {
        this.loading = false;
      }
    },
    renderCharts() {
        // ทำลายกราฟเก่าถ้ามี
      if (this.roleChart) {
        this.roleChart.destroy();
        this.roleChart = null;
      }
      if (this.creditsChart) {
        this.creditsChart.destroy();
        this.creditsChart = null;
      }
      if (this.facultyChart) {
        this.facultyChart.destroy();
        this.facultyChart = null;
      }

      // ตรวจสอบว่า canvas มีอยู่จริงก่อนที่จะสร้างกราฟ
      const roleCanvas = document.getElementById('roleChart');
      if (!roleCanvas) return;
      
      const roleCtx = roleCanvas.getContext('2d');
      this.roleChart = new Chart(roleCtx, {
        type: 'pie',
        data: {
          labels: ['แอดมิน', 'นักศึกษา'],
          datasets: [{
            data: [this.summary.adminCount, this.summary.studentCount],
            backgroundColor: ['#2563eb', '#10b981'],
            borderColor: ['#1e40af', '#059669'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  family: "'Kanit', sans-serif",
                  size: 14
                }
              }
            },
            title: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  return `${label}: ${value} คน`;
                }
              }
            }
          }
        }
      });

      // Bar chart สำหรับจำนวนรายวิชาตามหน่วยกิต
      const creditsCanvas = document.getElementById('creditsChart');
      if (!creditsCanvas) return;
      const creditsCtx = creditsCanvas.getContext('2d');
      const creditsLabels = ['1', '2', '3', '4'];
      const creditsData = creditsLabels.map((credit) => {
        const item = this.summary.creditsDistribution.find((d) => d._id === parseInt(credit));
        return item ? item.count : 0;
      });

      this.creditsChart = new Chart(creditsCtx, {
        type: 'bar',
        data: {
          labels: creditsLabels,
          datasets: [{
            label: 'จำนวนรายวิชา',
            data: creditsData,
            backgroundColor: '#2563eb',
            borderColor: '#1e40af',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'จำนวนรายวิชา',
                font: {
                  family: "'Kanit', sans-serif",
                  size: 14
                }
              },
              ticks: {
                stepSize: 1
              }
            },
            x: {
              title: {
                display: true,
                text: 'หน่วยกิต',
                font: {
                  family: "'Kanit', sans-serif",
                  size: 14
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed.y || 0;
                  return `จำนวนรายวิชา: ${value} วิชา`;
                }
              }
            }
          }
        }
      });

      // Bar chart สำหรับจำนวนผู้ใช้ตามคณะ
      const facultyCanvas = document.getElementById('facultyChart');
      if (!facultyCanvas) return;
      const facultyCtx = facultyCanvas.getContext('2d');
      const facultyLabels = this.summary.facultyDistribution
        .map((item) => item._id || 'ไม่ระบุ')
        .filter((label) => label !== null);
      const facultyData = this.summary.facultyDistribution
        .filter((item) => item._id !== null)
        .map((item) => item.count);

      this.facultyChart = new Chart(facultyCtx, {
        type: 'bar',
        data: {
          labels: facultyLabels,
          datasets: [{
            label: 'จำนวนผู้ใช้',
            data: facultyData,
            backgroundColor: '#f97316',
            borderColor: '#ea580c',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'จำนวนผู้ใช้',
                font: {
                  family: "'Kanit', sans-serif",
                  size: 14
                }
              },
              ticks: {
                stepSize: 1
              }
            },
            x: {
              title: {
                display: true,
                text: 'คณะ',
                font: {
                  family: "'Kanit', sans-serif",
                  size: 14
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed.y || 0;
                  return `จำนวนผู้ใช้: ${value} คน`;
                }
              }
            }
          }
        }
      });
    },
    async logout() {
      if (await logout()) {
        alert('ออกจากระบบสำเร็จ');
        this.$router.push('/login');
      } else {
        alert('เกิดข้อผิดพลาดในการออกจากระบบ');
      }
    }
  },
  beforeUnmount() {
    // Destroy charts when component is unmounted
    if (this.roleChart) {
      this.roleChart.destroy();
      this.roleChart = null;
    }
    if (this.creditsChart) {
      this.creditsChart.destroy();
      this.creditsChart = null;
    }
    if (this.facultyChart) {
      this.facultyChart.destroy();
      this.facultyChart = null;
    }
  }
};
</script>

<style scoped>
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
.logout-btn {
  margin-left: 10px;
  padding: 5px 10px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.logout-btn:hover {
  background: #dc2626;
}
.dashboard-container {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.refresh-btn {
  padding: 10px 20px;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: 'Kanit', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}
.refresh-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}
.refresh-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
}
.dashboard-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 20px;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
.summary-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.summary-card h3 {
  font-size: 1.2rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 10px;
}
.summary-card p {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  margin: 0;
}
.charts-section {
  margin-top: 40px;
}
.charts-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2563eb;
  margin-bottom: 20px;
}
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
.chart-container {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.chart-container h3 {
  font-size: 1.2rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 15px;
  text-align: center;
}
canvas {
  max-width: 100%;
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
  margin: 20px 0;
}
.error {
  text-align: center;
  font-size: 1.2rem;
  color: #ef4444;
  margin: 20px 0;
}
</style>