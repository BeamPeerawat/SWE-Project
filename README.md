# ระบบคำร้องออนไลน์ - มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตขอนแก่น

ระบบคำร้องออนไลน์สำหรับนักศึกษาในการยื่นคำร้องต่างๆ เช่น การขอเปิดรายวิชา การขอเพิ่มที่นั่ง และคำร้องทั่วไป โดยใช้การล็อกอินผ่าน Google Account ของมหาวิทยาลัย

## สารบัญ

- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [การติดตั้งและการใช้งาน](#การติดตั้งและการใช้งาน)
  - [การรันบนเครื่องโดยตรง (สำหรับการพัฒนา)](#การรันบนเครื่องโดยตรง-สำหรับการพัฒนา)
  - [การรันด้วย Docker (สำหรับการทดสอบ)](#การรันด้วย-docker-สำหรับการทดสอบ)
- [การ Deploy บนเซิร์ฟเวอร์](#การ-deploy-บนเซิร์ฟเวอร์)
- [การแก้ไขปัญหาที่พบบ่อย](#การแก้ไขปัญหาที่พบบ่อย)
- [ผู้พัฒนา](#ผู้พัฒนา)

## โครงสร้างโปรเจค

โปรเจคนี้แบ่งเป็น 2 ส่วนหลัก:

### 1. Frontend (Vue.js)

```
SWE Project Frontend/
├── public/              # ไฟล์สาธารณะ
├── src/                 # โค้ดหลัก
│   ├── assets/          # รูปภาพและ CSS
│   ├── components/      # Vue Components
│   ├── router/          # การจัดการเส้นทาง
│   ├── views/           # หน้าต่างๆ
│   ├── App.vue          # Component หลัก
│   └── main.js          # จุดเริ่มต้นแอพพลิเคชัน
├── Dockerfile           # สำหรับสร้าง Docker image
├── package.json         # รายการ dependencies
└── vue.config.js        # การตั้งค่า Vue
```

### 2. Backend (Node.js)

```
SWE Project Backend/
├── config/              # การตั้งค่าต่างๆ
│   ├── db.js            # การเชื่อมต่อ MongoDB
│   └── passport.js      # การตั้งค่า Google OAuth
├── models/              # โมเดลข้อมูล
├── routes/              # API Routes
│   ├── api.js           # API หลัก
│   ├── AddSeatRequestapi.js    # API สำหรับคำร้องขอเพิ่มที่นั่ง
│   ├── GeneralRequestapi.js    # API สำหรับคำร้องทั่วไป
│   ├── OpenCourseRequest.js    # API สำหรับคำร้องขอเปิดรายวิชา
│   └── subjectapi.js           # API สำหรับข้อมูลรายวิชา
├── Dockerfile           # สำหรับสร้าง Docker image
├── package.json         # รายการ dependencies
└── server.js            # จุดเริ่มต้นเซิร์ฟเวอร์
```

## เทคโนโลยีที่ใช้

### Frontend
- **Vue.js** - JavaScript framework สำหรับสร้าง UI
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client สำหรับเรียกใช้ API
- **Vue Router** - การจัดการเส้นทางใน Vue.js

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework สำหรับ Node.js
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM สำหรับ MongoDB
- **Passport** - Authentication middleware
- **Google OAuth 2.0** - สำหรับการล็อกอินด้วย Google

### อื่นๆ
- **Docker** - สำหรับ containerization
- **Docker Compose** - สำหรับจัดการหลาย containers

## การติดตั้งและการใช้งาน

### การรันบนเครื่องโดยตรง (สำหรับการพัฒนา)

#### 1. ติดตั้ง Dependencies

```bash
# ติดตั้ง Node.js และ npm (ถ้ายังไม่มี)
# ดาวน์โหลดได้จาก: https://nodejs.org/

# ติดตั้ง MongoDB (ถ้ายังไม่มี)
# ดาวน์โหลดได้จาก: https://www.mongodb.com/try/download/community
```

#### 2. รัน Frontend

```bash
cd "SWE Project Frontend"
npm install
npm run serve
```

#### 3. รัน Backend

```bash
cd "SWE Project Backend"
npm install
node server.js
```

#### 4. รัน MongoDB (ถ้าไม่ได้ติดตั้งเป็น service)

```bash
mongod --dbpath="C:\data\db"
```

#### 5. เข้าใช้งาน

เปิดเบราว์เซอร์และไปที่ URL: http://localhost:8080

### การรันด้วย Docker (สำหรับการทดสอบ)

#### 1. ติดตั้ง Docker และ Docker Compose

```bash
# ดาวน์โหลด Docker Desktop สำหรับ Windows
# https://www.docker.com/products/docker-desktop
```

#### 2. รัน Docker Compose

```bash
# ไปที่โฟลเดอร์หลักของโปรเจค
cd "SWE-Project"
docker-compose up --build -d
```

#### 3. เข้าใช้งาน

เปิดเบราว์เซอร์และไปที่ URL: http://localhost:8081

## การ Deploy บนเซิร์ฟเวอร์

### หมายเหตุสำคัญ
เนื่องจากมีอีกกลุ่มที่ใช้เซิร์ฟเวอร์เดียวกัน เราจึงต้องใช้พอร์ตที่แตกต่างกัน:
- Frontend: พอร์ต 8081 (แทนที่จะเป็น 8080)
- Backend: พอร์ต 3001 (แทนที่จะเป็น 3000)
- MongoDB: พอร์ต 27018 (แทนที่จะเป็น 27017)

### 1. เชื่อมต่อเซิร์ฟเวอร์

```bash
ssh ecp@203.158.201.73
# รหัสผ่าน: petition
# (ระบบอาจขอให้เปลี่ยนรหัสผ่าน)
```

หากไม่สามารถเชื่อมต่อผ่าน SSH ได้ ให้ติดต่ออาจารย์เพื่อขอความช่วยเหลือในการ deploy

### 2. อัพโหลดโปรเจค

```bash
# จากเครื่องของคุณ (ใช้ Command Prompt หรือ PowerShell)
scp -r "c:\Users\User\OneDrive - Rajamangala University of Technology Isan\Desktop\SWE-Project" ecp@203.158.201.73:~/
```

### 3. ติดตั้ง Docker (ถ้ายังไม่มี)

```bash
sudo apt update
sudo apt install docker.io docker-compose
```

### 4. รัน Docker

```bash
cd SWE-Project
sudo docker-compose up --build -d
```

### 5. ตรวจสอบสถานะ

```bash
sudo docker ps
```

### 6. เข้าใช้งาน

เปิดเบราว์เซอร์และไปที่ URL: http://203.158.201.73:8081

## การแก้ไขปัญหาที่พบบ่อย

### 1. ปัญหาการเชื่อมต่อกับ Backend

**อาการ:** Frontend ไม่สามารถเรียกใช้ API จาก Backend ได้

**วิธีแก้ไข:**
- ตรวจสอบว่า Backend กำลังทำงานอยู่
- ตรวจสอบการตั้งค่า CORS ใน `server.js`
- ตรวจสอบ baseURL ใน `main.js`

### 2. ปัญหาการเชื่อมต่อกับ MongoDB

**อาการ:** Backend ไม่สามารถเชื่อมต่อกับ MongoDB ได้

**วิธีแก้ไข:**
- ตรวจสอบว่า MongoDB กำลังทำงานอยู่
- ตรวจสอบ MONGO_URI ใน `docker-compose.yml`
- ตรวจสอบการตั้งค่าใน `config/db.js`

### 3. ปัญหาการล็อกอินด้วย Google

**อาการ:** ไม่สามารถล็อกอินด้วย Google ได้

**วิธีแก้ไข:**
- ตรวจสอบ GOOGLE_CLIENT_ID และ GOOGLE_CLIENT_SECRET
- ตรวจสอบ GOOGLE_REDIRECT_URI ว่าถูกต้อง
- ตรวจสอบการตั้งค่า session ใน `server.js`

### 4. ตรวจสอบล็อกของ Docker

```bash
# ดูล็อกของ Frontend
docker-compose logs frontend

# ดูล็อกของ Backend
docker-compose logs backend

# ดูล็อกของ MongoDB
docker-compose logs mongo
```

### 5. หยุดการทำงานของ Docker

```bash
docker-compose down
```

## ผู้พัฒนา

- [ชื่อ-นามสกุล] - [รหัสนักศึกษา]
- [ชื่อ-นามสกุล] - [รหัสนักศึกษา]
- [ชื่อ-นามสกุล] - [รหัสนักศึกษา]
