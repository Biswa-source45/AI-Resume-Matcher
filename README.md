# AI Resume Matcher 🤖

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

</div>

<div align="center">

### 🚀 Modern Tech Stack

</div>

| Frontend | Backend | Database | DevOps |
|----------|---------|----------|---------|
| ⚛️ React 18 | 🐍 Python 3.9+ | 📊 Supabase | 🔄 Vercel |
| ⚡ Vite | ⚡ FastAPI | 🔐 JWT | 📦 Git |
| 🎨 TailwindCSS | 🤖 Google Gemini | 🗄️ PostgreSQL  |
| 📱 Framer Motion | 📄 PyPDF2 | |
| 📊 Recharts | | | |


# AI Resume Matcher

An intelligent resume analysis tool powered by AI that provides detailed insights, career recommendations, and interactive chat support for job seekers.


## 🌟 Live Demo

Visit the live application: [AI Resume Matcher](https://resume-matcher-frontend-plum.vercel.app/)

## 🚀 Features

- **AI-Powered Resume Analysis**
  - Detailed skill assessment
  - Career path recommendations
  - Experience level evaluation
  - Professional tone analysis

- **Interactive Chat Support**
  - Context-aware AI career advisor
  - Personalized guidance
  - Real-time recommendations

- **User-Friendly Interface**
  - Drag-and-drop resume upload
  - Interactive visualizations
  - Mobile-responsive design
  - Secure user authentication

## 🛠️ Technology Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Supabase for authentication

### Backend
- FastAPI (Python)
- Google Gemini AI
- PyPDF2 for PDF processing
- Supabase Database
- JWT Authentication

## 📥 Installation

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- Git

### Clone the Repository
```bash
git clone https://github.com/Biswa-source45/AI-Resume-Matcher.git
cd AI-Resume-Matcher
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=your_backend_url
```

### Backend Setup
```bash
cd backend
python -m venv venv
# For Windows
.\venv\Scripts\activate
# For Unix/macOS
source venv/bin/activate

pip install -r requirements.txt
```

Create `.env` file in backend directory:
```env
GOOGLE_API_KEY=your_google_ai_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
```

## 🚀 Running the Application

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Start Backend
```bash
cd backend
uvicorn main:app --reload
```
Backend will run on `http://localhost:8000`

## 📖 Usage Guide

1. **Sign Up/Login**
   - Create an account or login using email
   - Secure authentication via Supabase

2. **Upload Resume**
   - Navigate to dashboard
   - Click "Upload Resume" button
   - Select PDF file (max 10MB)

3. **View Analysis**
   - AI generates comprehensive analysis
   - View skill breakdown
   - Check career recommendations
   - Review improvement suggestions

4. **Chat with AI**
   - Click "Chat with AI" button
   - Ask career-related questions
   - Get personalized advice

## ⚙️ API Endpoints

### Authentication
- `POST /set-cookie`: Set authentication cookie
- `POST /logout`: Clear authentication

### Resume Analysis
- `POST /analyze-resume`: Upload and analyze resume
- `GET /summaries`: Get user's analysis history
- `DELETE /summaries/{id}`: Delete specific analysis

### Chat
- `POST /chat`: Send message to AI assistant

## 🔐 Security

- JWT-based authentication
- HttpOnly cookies
- CORS protection
- File validation
- Rate limiting
- Secure credential storage

## 💡 Device Compatibility

- **Desktop**: Full functionality
- **Mobile**: Basic features
  - Some limitations on file upload
  - Recommended to use desktop for best experience

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

Developed by: **Biswabhusan Sahoo**

## 🔗 Links

- [Live Application](https://resume-matcher-frontend-plum.vercel.app/)
- [GitHub Repository](https://github.com/Biswa-source45/AI-Resume-Matcher.git)
- [Report Bug](https://github.com/Biswa-source45/AI-Resume-Matcher/issues)
- [Request Feature](https://github.com/Biswa-source45/AI-Resume-Matcher/issues)

---

Made with ❤️ by Biswabhusan Sahoo

