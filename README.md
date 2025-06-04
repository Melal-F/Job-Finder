# Job Finder

A full-stack job search and application platform built with Next.js and Express.js.

## Project Structure

The project follows a client-server architecture:

```
├── client/          # Next.js frontend application
└── server/          # Express.js backend server
```

## Tech Stack

### Frontend (client/)
- Next.js 15.0.3
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- Axios for API calls
- React Hot Toast for notifications
- React Quill for rich text editing

### Backend (server/)
- Express.js
- MongoDB with Mongoose
- Node.js
- Express OpenID Connect for authentication
- Cookie Parser
- CORS support

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd job-finder
```

2. Install Frontend Dependencies
```bash
cd client
npm install
```

3. Install Backend Dependencies
```bash
cd ../server
npm install
```

### Environment Setup

1. Create a `.env` file in the server directory with the following variables:
```
SECRET = 
BASE_URL = http://localhost:8080
CLIENT_ID=
ISSUER_BASE_URL = 
CLIENT_URL = http://localhost:3000
CLIENT_SECRET = 
PORT = 8080
MONGO_URI =  
```


### Running the Application

1. Start the Backend Server
```bash
cd server
npm start
```

2. Start the Frontend Development Server
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Features

- User authentication and authorization
- Job search and filtering
- Job application management
- Rich text editor for job descriptions
- Responsive design with Tailwind CSS
- Modern UI components with Radix UI

## Development

- Frontend development server runs on port 3000
- Backend server runs on port 5000
- API endpoints are prefixed with `/api`
- MongoDB is used as the primary database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

