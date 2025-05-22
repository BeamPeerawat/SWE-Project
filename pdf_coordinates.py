import fitz  # PyMuPDF
import tkinter as tk
from PIL import Image, ImageTk
import os

def on_click(event):
    canvas_x, canvas_y = event.x, event.y
    pdf_x = (canvas_x / canvas_width) * page_width
    pdf_y = ((canvas_height - canvas_y) / canvas_height) * page_height
    print(f"PDF coordinates: ({pdf_x:.2f}, {pdf_y:.2f})")

# ระบุ path ของ PDF
pdf_path = "C:/Users/User/OneDrive - Rajamangala University of Technology Isan/Desktop/SWE-Project/SWE Project Backend/templates/RE.01-คำร้องทั่วไป.pdf"

# ตรวจสอบว่าไฟล์ PDF มีอยู่
if not os.path.exists(pdf_path):
    print(f"Error: PDF file not found at {pdf_path}")
    exit(1)

# เปิด PDF และโหลดหน้าแรก
document = fitz.open(pdf_path)
page = document.load_page(0)
pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # ขยาย 2 เท่าเพื่อความชัดเจน
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

# สร้างหน้าต่าง GUI
root = tk.Tk()
root.title("PDF Coordinate Viewer")
tk_img = ImageTk.PhotoImage(img)
canvas = tk.Canvas(root, width=pix.width, height=pix.height)
canvas.pack()
canvas.create_image(0, 0, anchor=tk.NW, image=tk_img)
canvas.bind("<Button-1>", on_click)

# เก็บขนาดสำหรับการคำนวณพิกัด
canvas_width, canvas_height = pix.width, pix.height
page_width, page_height = page.rect.width, page.rect.height
print(f"PDF Page dimensions: {page_width}x{page_height}")

root.mainloop()
document.close()