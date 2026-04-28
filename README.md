# FlashMaster Backend

A RESTful API backend for the FlashMaster Exam Helper Application built with Node.js, Express.js, MongoDB and Cloudinary.

## Tech Stack
- Node.js — Runtime environment
- Express.js — Backend framework
- MongoDB Atlas — Cloud database
- Mongoose — ODM for MongoDB
- JWT — Authentication
- bcryptjs — Password hashing
- Multer — File handling
- Cloudinary — Cloud file storage
- Render — Deployment platform

## Live Backend URL
https://flashmaster-backened-1.onrender.com

## API Routes

### Auth Routes
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login and get JWT token | No |
| GET | /api/auth/users | Get all users (admin) | Yes |

### Materials Routes
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/materials | Upload study material | Yes |
| GET | /api/materials | Get user materials | Yes |
| GET | /api/materials/all | Get all materials (admin) | Yes |
| DELETE | /api/materials/:id | Delete material | Yes |

### Flashcards Routes
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/flashcards | Create flashcard | Yes |
| GET | /api/flashcards | Get user flashcards | Yes |
| PATCH | /api/flashcards/:id/difficulty | Update difficulty | Yes |
| DELETE | /api/flashcards/:id | Delete flashcard | Yes |

### Study Plan Routes
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/plans | Create study plan | Yes |
| GET | /api/plans | Get user plans | Yes |

### Progress Routes
| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/progress | Save progress | Yes |
| GET | /api/progress | Get progress | Yes |
| PATCH | /api/progress/:id | Update progress | Yes |

## Database Collections
- Users — stores user info and roles
- Materials — stores uploaded file URLs
- Flashcards — stores Q&A cards
- StudyPlans — stores study schedules
- Progress — stores revision status

## Environment Variables
Create a .env file with:
## Installation
```bash
npm install
npm run dev
```

## Developed By
Mythri Sarla — AP24110012034
