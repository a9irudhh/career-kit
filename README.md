# Career Kit

[![Next.js](https://img.shields.io/badge/Next.js-13%2B-blue)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/atlas/database)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A comprehensive career development platform designed to help tech professionals prepare for interviews, build their resumes, find jobs, and map their career paths.

![Career Kit Landing Page](images/image(1).png)

## 🌟 Overview

Career Kit is an all-in-one platform that provides aspiring and established tech professionals with the tools they need to accelerate their career growth. From technical interview preparation to resume building, job searching, and career planning, our platform offers a complete ecosystem for career development.

## ✨ Key Features

### Technical Interview Preparation
- **Technical Question Practice**: Prepare for coding interviews with our extensive library of technical questions and real-time feedback.
- **Interview Question Sheets**: Access curated question sheets for specific companies and roles to focus your preparation.

### Career Development Tools
- **Resume Creator**: Build an ATS-friendly resume with our AI-powered resume builder optimized for job applications.
- **Career Roadmap Generator**: Plan your career progression with customized roadmaps based on your goals and current skills.
- **AI Career Assistant**: Get personalized career advice and interview tips from our AI-powered assistant.

### Job Discovery
- **Job Finder**: Discover opportunities that match your skills and preferences with our smart job search tool.
- **Current Job Trends**: Stay updated with the latest trends in the job market and skills in demand.

### Community Features
- **Community Forum**: Join our community of job seekers and professionals to share experiences and tips.
- **Resource Library**: Access guides, articles, and resources curated for tech careers.

## 🚀 Getting Started

### Prerequisites
- Node.js 16.8.0 or later
- npm or yarn package manager
- MongoDB database (local or Atlas)

# Demo Images 
Below are some snapshots showcasing the Career Kit platform:

## Community Forum
![Community Forum](images/image(2).png)

![Post Creation](images/image(3).png)




### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/career-kit.git
   cd career-kit
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
career-kit/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router files
│   │   ├── (auth)/         # Authentication routes
│   │   ├── (community)/    # Community forum routes
│   │   ├── api/            # API routes
│   │   ├── page.tsx        # Home page
│   │   └── ...             # Other page routes 
│   ├── components/         # React components
│   │   ├── shared/         # Shared components like PostCard
│   │   ├── ui/             # Shadcn UI components
│   │   └── ...             # Other components
│   ├── lib/                # Utility functions
│   │   ├── auth.ts         # Authentication configuration
│   │   ├── db.ts           # Database connection logic
│   │   └── ...             # Other utility functions
│   └── types/              # TypeScript type definitions
├── .env.local              # Environment variables (create this)
├── next.config.js          # Next.js configuration 
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## 📱 Main Components

### Community Forum
The community forum allows users to:
- View, create, and interact with posts
- Filter posts by category and search terms
- Comment on posts and engage with other users
- Like posts to show appreciation
- Share content with others

### Resume Creator
Our resume builder includes:
- ATS-friendly templates
- Real-time preview
- AI-powered suggestions for content
- Export options (PDF, DOCX)

### Technical Practice
The technical practice section offers:
- Coding challenges by topic and difficulty
- Real-time feedback on solutions
- Performance tracking
- Company-specific question banks

## 🔄 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current authenticated user
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Community Forum
- `GET /api/post/all` - Get all posts with optional filtering
- `GET /api/post/one?id={postId}` - Get a single post
- `POST /api/post/create` - Create a new post
- `PUT /api/post/edit` - Update an existing post
- `DELETE /api/post/one?id={postId}` - Delete a post
- `POST /api/post/like` - Like or unlike a post

### Comments
- `GET /api/comment?postId={postId}` - Get comments for a post
- `POST /api/comment/create` - Create a new comment
- `PUT /api/comment/edit` - Update a comment
- `DELETE /api/comment/delete` - Delete a comment

## 🖥️ Technologies Used

### Frontend
- **Next.js 13+**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **Framer Motion**: Animation library
- **Lucide Icons**: Icon library

### Backend
- **Next.js API Routes**: Server-side API endpoints
- **MongoDB**: NoSQL database
- **NextAuth.js**: Authentication
- **Mongoose**: MongoDB object modeling

### DevOps
- **GitHub**: Version control
- **Vercel/Netlify**: Recommended deployment

## 🤝 Contributing

We welcome contributions to Career Kit! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code follows our coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Thanks to all contributors who have helped build Career Kit
- Special thanks to the open-source community for the amazing tools and libraries that made this project possible

## 📧 Contact

For questions or feedback, please reach out to us at support@career-kit.com

---

© 2025 Career Kit. All rights reserved.

Similar code found with 1 license type