# 🤖 InterviewMate - Miku Edition

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-1.5-8E75B2?style=for-the-badge&logo=google)
![TiDB](https://img.shields.io/badge/TiDB-Cloud-4477F8?style=for-the-badge&logo=mysql)

**InterviewMate** adalah aplikasi simulasi wawancara kerja berbasis AI yang interaktif dan cerdas. Ditenagai oleh **Google Gemini AI**, aplikasi ini menghadirkan **Miku**, HRD virtual yang siap mewawancarai Anda dalam Bahasa Indonesia yang natural dan profesional.

---

## ✨ Fitur Unggulan

- **🤖 AI Interviewer "Miku"**: Simulasi wawancara yang terasa hidup dengan persona HRD yang ramah namun profesional.
- **🇮🇩 Bahasa Indonesia Natural**: Percakapan mengalir lancar dalam Bahasa Indonesia, cocok untuk latihan interview lokal.
- **🎯 Universal Job Role**: Bisa digunakan untuk latihan interview posisi APAPUN (IT, Ekonomi, Marketing, dll).
- **📝 Auto-Generated Questions**: Pertanyaan disesuaikan secara dinamis berdasarkan CV dan posisi yang Anda lamar.
- **💾 History Penyimpanan**: Riwayat chat tersimpan aman di database (MySQL/TiDB) untuk review kembali.
- **⚡ Real-time Feedback**: Dapatkan respons instan dan feedback konstruktif dari AI.

---

## 🛠️ Teknologi

Project ini dibangun dengan stack teknologi modern:

- **Frontend**: [Next.js](https://nextjs.org/) (App Router) & [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: Next.js API Routes
- **Database**: [TiDB Cloud](https://tidbcloud.com/) (MySQL Compatible) via [Prisma ORM](https://www.prisma.io/)
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/) (`gemini-1.5-flash`)

---

## 🚀 Cara Menjalankan (Local)

1. **Clone Repository**

   ```bash
   git clone https://github.com/username/interviewmate.git
   cd interviewmate
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Buat file `.env` dan isi dengan:

   ```env
   DATABASE_URL="mysql://username:password@gateway.tidbcloud.com:4000/db?sslaccept=strict"
   GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Setup Database**

   ```bash
   npx prisma db push
   ```

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🌐 Deployment

Aplikasi ini siap dideploy ke **Vercel**.

1. Push code ke GitHub.
2. Import project di Vercel.
3. Tambahkan Environment Variables (`DATABASE_URL`, `GEMINI_API_KEY`).
4. Deploy! 🚀

---



Dibuat dengan ❤️ untuk membantu pencari kerja Indonesia.
