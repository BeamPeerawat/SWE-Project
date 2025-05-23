import fitz  # PyMuPDF
import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk
import os

class PDFCoordinateViewer:
    def __init__(self, root, pdf_path):
        self.root = root
        self.pdf_path = pdf_path
        self.current_page = 0
        self.zoom = 1.0
        
        # เปิด PDF และโหลดข้อมูล
        self.document = fitz.open(pdf_path)
        self.page_count = len(self.document)
        
        # สร้าง GUI
        self.setup_gui()
        self.load_page(0)
    
    def setup_gui(self):
        self.root.title(f"PDF Coordinate Viewer - {os.path.basename(self.pdf_path)}")
        
        # Frame สำหรับควบคุม
        control_frame = tk.Frame(self.root)
        control_frame.pack(fill=tk.X, padx=5, pady=5)
        
        # ปุ่มควบคุม
        tk.Button(control_frame, text="Previous", command=self.prev_page).pack(side=tk.LEFT)
        tk.Button(control_frame, text="Next", command=self.next_page).pack(side=tk.LEFT)
        tk.Label(control_frame, text=f"Page:").pack(side=tk.LEFT)
        self.page_label = tk.Label(control_frame, text="1")
        self.page_label.pack(side=tk.LEFT)
        tk.Label(control_frame, text=f"of {self.page_count}").pack(side=tk.LEFT)
        
        # Zoom controls
        tk.Label(control_frame, text="Zoom:").pack(side=tk.LEFT, padx=(10,0))
        tk.Button(control_frame, text="+", command=lambda: self.set_zoom(1.25)).pack(side=tk.LEFT)
        tk.Button(control_frame, text="-", command=lambda: self.set_zoom(0.8)).pack(side=tk.LEFT)
        
        # Canvas พร้อม scrollbar
        self.canvas_frame = tk.Frame(self.root)
        self.canvas_frame.pack(fill=tk.BOTH, expand=True)
        
        self.canvas = tk.Canvas(self.canvas_frame, bg='white')
        self.h_scroll = ttk.Scrollbar(self.canvas_frame, orient="horizontal", command=self.canvas.xview)
        self.v_scroll = ttk.Scrollbar(self.canvas_frame, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(xscrollcommand=self.h_scroll.set, yscrollcommand=self.v_scroll.set)
        
        self.h_scroll.pack(side=tk.BOTTOM, fill=tk.X)
        self.v_scroll.pack(side=tk.RIGHT, fill=tk.Y)
        self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        
        self.canvas.bind("<Button-1>", self.on_click)
        self.canvas.bind("<Configure>", self.on_canvas_configure)
    
    def load_page(self, page_num):
        if 0 <= page_num < self.page_count:
            self.current_page = page_num
            self.page_label.config(text=str(page_num + 1))
            
            # โหลดหน้า PDF
            page = self.document.load_page(page_num)
            self.page_width, self.page_height = page.rect.width, page.rect.height
            
            # สร้างภาพจาก PDF ด้วย zoom ปัจจุบัน
            matrix = fitz.Matrix(self.zoom, self.zoom)
            pix = page.get_pixmap(matrix=matrix)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            # บันทึกภาพและแสดงบน canvas
            self.tk_img = ImageTk.PhotoImage(img)
            self.canvas.config(scrollregion=(0, 0, pix.width, pix.height))
            self.canvas.create_image(0, 0, anchor=tk.NW, image=self.tk_img)
            
            print(f"Loaded page {page_num + 1}/{self.page_count}")
            print(f"PDF Page dimensions: {self.page_width}x{self.page_height}")
    
    def on_click(self, event):
        # คำนวณพิกัด PDF จากพิกัด canvas
        canvas_x = self.canvas.canvasx(event.x)
        canvas_y = self.canvas.canvasy(event.y)
        
        pdf_x = (canvas_x / (self.page_width * self.zoom)) * self.page_width
        pdf_y = ((self.page_height * self.zoom - canvas_y) / (self.page_height * self.zoom)) * self.page_height
        
        print(f"PDF coordinates: ({pdf_x:.2f}, {pdf_y:.2f})")
    
    def on_canvas_configure(self, event):
        # ปรับขนาด canvas เมื่อหน้าต่างเปลี่ยนขนาด
        if hasattr(self, 'tk_img'):
            self.canvas.config(scrollregion=self.canvas.bbox("all"))
    
    def prev_page(self):
        if self.current_page > 0:
            self.load_page(self.current_page - 1)
    
    def next_page(self):
        if self.current_page < self.page_count - 1:
            self.load_page(self.current_page + 1)
    
    def set_zoom(self, factor):
        self.zoom *= factor
        self.load_page(self.current_page)

def main():
    # ระบุ path ของ PDF
    pdf_path = "C:/Users/User/OneDrive - Rajamangala University of Technology Isan/Desktop/SWE-Project/SWE Project Backend/templates/RE.07-คำร้องขอเปิดรายวิชานอกแผนการเรียน.pdf"
    
    # ตรวจสอบว่าไฟล์ PDF มีอยู่
    if not os.path.exists(pdf_path):
        print(f"Error: PDF file not found at {pdf_path}")
        return
    
    # สร้างหน้าต่าง GUI
    root = tk.Tk()
    app = PDFCoordinateViewer(root, pdf_path)
    root.geometry("800x600")
    root.mainloop()
    
    # ปิดเอกสารเมื่อปิดโปรแกรม
    app.document.close()

if __name__ == "__main__":
    main()