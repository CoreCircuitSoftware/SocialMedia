# 🌐 CircuitSocial - Full-Stack Social Media Platform

<div align="center">

![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

**A modern, containerized social media application built with Django REST Framework and React**

</div>

---

## 📋 Overview

CircuitSocial is a full-featured social media platform demonstrating modern full-stack development practices, cloud deployment, and DevOps workflows. The application showcases proficiency in backend API development, frontend UI/UX design, containerization, and cloud infrastructure management.

### 🎯 Project Goals

- Build a production-ready social media platform with real-world features
- Implement secure authentication and authorization
- Demonstrate scalable architecture using Docker and cloud services
- Create a responsive, modern user interface

---

## ✨ Features

### User Management

- 🔐 Secure user registration and authentication
- 👤 Custom user profiles with avatars and bio
- 🔍 User search and discovery

### Social Features

- 📝 Create, edit, and delete posts
- ❤️ Like and comment on posts
- 📬 Real time messaging between users

### Technical Features

- 🚀 RESTful API architecture
- 🔒 JWT-based authentication
- 🐳 Fully containerized application
- ☁️ Cloud-native deployment

---

## 🛠️ Tech Stack

### Backend

- **Framework:** Django REST Framework
- **Language:** Python 3.11
- **Database:** MySQL 8.0 (AWS RDS in production)
- **Authentication:** JWT tokens
- **WSGI Server:** Gunicorn (production)

### Frontend

- **Framework:** React
- **Build Tool:** Vite
- **Language:** JavaScript/JSX
- **State Management:** React Hooks

### DevOps & Infrastructure

- **Containerization:** Docker, Docker Compose
- **Web Server:** Nginx (reverse proxy)
- **Cloud Platform:** AWS (EC2, RDS)

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Git
- Python 3.11+ (for local development without Docker)
- Node.js 18+ (for local development without Docker)

### Quick Start with Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/CoreCircuitSoftware/SocialMedia.git
   cd SocialMedia
   ```

2. **Set up environment variables using templates**
   - .env.local for running the entire application locally on your personal machine
   - .env.rds.local for running the application locally on your personal machine with a connection to an AWS RDS
   - .env.production for deploying the production build on your EC2 instance

3. **Start the application**
   - Scripts were created to assist in the startup process and ease transitioning between deployment methods

   ```bash
   # Local development with Docker MySQL
   ./scripts/dev-local.sh

   # Local development with AWS RDS connection
   ./scripts/dev-rds.sh

   # Production build for EC2
   ./scripts/deploy-production.sh
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api/
   - Admin Panel: http://localhost:8000/admin/

### Local Development without Docker

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🗺️ Roadmap

### Planned Features

- [ ] Advanced search and filtering
- [ ] User notifications system
- [ ] Email verification

---

## 👨‍💻 Authors

**Core Circuit Software**

- GitHub: [@CoreCircuitSoftware](https://github.com/CoreCircuitSoftware)
- Repository: [SocialMedia](https://github.com/CoreCircuitSoftware/SocialMedia)

---

## 🙏 Acknowledgments

- Django REST Framework documentation
- React documentation
- Docker documentation
- AWS documentation
- The open-source community

---

<div align="center">

</div>
