# ใช้ Node.js เวอร์ชัน 16 เป็นฐาน
FROM node:16

# กำหนด working directory ใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดในโปรเจค
COPY . .

# ตั้งค่า environment variable เพื่อบอกว่ากำลังรันใน Docker
ENV DOCKER_ENV=true

# เปิด port 8080
EXPOSE 8080

# รัน development server
CMD ["npm", "run", "serve", "--", "--port", "8080", "--host", "0.0.0.0"]