# Uplane Background Remover

A full-stack web application to remove backgrounds from images, built as a challenge project. Users can upload images, have their backgrounds removed automatically, and download the processed results. The app features a modern UI and a scalable backend.

---

## Features

- **Drag-and-drop image upload**
- **Automatic background removal** (via external API)
- **Processed images are horizontally flipped** for effect
- **Download and manage your processed images**
- **Responsive, clean UI**

---

## Tech Stack

### **Frontend (web/)**
- **React 18** – UI library
- **Vite** – Fast build tool and dev server
- **TypeScript** – Type safety
- **Tailwind CSS** – Utility-first CSS framework

### **Backend (server/)**
- **Node.js + Express** – REST API server
- **TypeScript** – Type safety
- **Prisma** – ORM for PostgreSQL
- **Sharp** – Image processing (normalization, flipping)
- **Axios** – HTTP client for background removal API
- **Multer** – File upload middleware
- **Cloudflare R2 / S3** – Object storage for images

---

## Infrastructure

- **PostgreSQL** – Database for image metadata
- **MinIO** – S3-compatible storage (local development)
- **Docker Compose** – Local orchestration for DB, storage, backend, frontend
