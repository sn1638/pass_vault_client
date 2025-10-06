# Password Vault - Secure Password Manager

A secure password manager built with React and Node.js that uses AES-256 encryption to protect your passwords.

## Live Demo
[https://pass-vault-demo.vercel.app](https://pass-vault-demo.vercel.app)

## Features
- AES-256 encryption for password storage
- Secure password generator
- Search and filter vault entries
- User authentication with JWT
- Responsive design with Tailwind CSS

## Tech Stack
- Frontend: React, Tailwind CSS, Vite
- Backend: Node.js, Express, MongoDB
- Security: crypto-js (AES-256), JWT, bcryptjs

## Cryptography Note
This project uses AES-256-CBC encryption from the crypto-js library for password encryption. Each vault entry is encrypted with a unique salt and IV (Initialization Vector) to ensure that identical passwords produce different ciphertexts, enhancing security against pattern analysis.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

## Security Features
- Password encryption using AES-256-CBC
- Unique salt and IV for each entry
- JWT-based authentication
- Password hashing with bcrypt
- CSRF protection
- Input validation and sanitization

## Project Structure
```
project/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── utils/         # Utility functions
│   └── ...
└── server/                # Node.js backend
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    └── utils/             # Utility functions
```

## API Documentation
### Authentication Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Vault Endpoints
- GET `/api/vault` - Get all vault entries
- POST `/api/vault` - Create new vault entry
- GET `/api/vault/:id` - Get specific vault entry
- PUT `/api/vault/:id` - Update vault entry
- DELETE `/api/vault/:id` - Delete vault entry

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
MIT License

## Acknowledgments
- [crypto-js](https://github.com/brix/crypto-js) for encryption
- [Tailwind CSS](https://tailwindcss.com) for styling
- [MongoDB](https://www.mongodb.com) for database








Cryptography Note: This project implements AES-256-CBC encryption using the crypto-js library for secure password storage. Each vault entry uses a unique salt and IV (Initialization Vector) to ensure that identical passwords produce different ciphertexts, preventing pattern analysis. The encryption/decryption happens client-side to ensure passwords never travel unencrypted over the network.
Key security features:

AES-256-CBC encryption
Unique salt and IV per entry
Client-side encryption
Zero-knowledge design (server never sees unencrypted data)
