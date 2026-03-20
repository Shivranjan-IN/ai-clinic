const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const session = require('express-session');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const passport = require('./config/passport');

const errorHandler = require('./middleware/errorHandler');
const prisma = require('./config/database');

// Import routes (Will be created next)
const clinicRoutes = require('./routes/clinicRoutes');
const systemRoutes = require('./routes/systemRoutes');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const orderRoutes = require('./routes/orderRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const cartRoutes = require('./routes/cartRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const documentRoutes = require('./routes/documentRoutes');
const clinicDocumentRoutes = require('./routes/clinicDocumentRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const labRoutes = require('./routes/labRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

const app = express();

// CORS — must be configured before all routes and before Helmet.
// Reads allowed origins from FRONTEND_URL env var (comma-separated) plus the
// standard local-dev ports so nothing breaks locally.
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://ai-clinic-1-qeeu.onrender.com',  // Live deployed frontend (Render)
    'https://ai-clinic-chi.vercel.app',        // Live deployed frontend (Vercel)
    ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(o => o.trim()) : []),
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200, // Some legacy browsers (IE11) choke on 204
};

// Handle pre-flight OPTIONS requests for ALL routes.
app.options('*', cors(corsOptions));

// Apply CORS to all subsequent routes.
app.use(cors(corsOptions));

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images/uploads to be served cross-origin
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static files
app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Backend is running ");
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Anti-Gravity Healthcare API is operational in orbit' });
});

// API Routes
app.use('/api/clinics', clinicRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/clinic-documents', clinicDocumentRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/lab', labRoutes); // Also mount at /api/lab for frontend compatibility
app.use('/api/prescriptions', prescriptionRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Coordinate not found in star chart' });
});

const PORT = process.env.PORT || 5000;
console.log("👉 DATABASE_URL:", process.env.DATABASE_URL);
app.listen(PORT, () => {
    console.log(`🚀 Anti-Gravity Healthcare Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, initiating landing sequence');
    prisma.$disconnect(() => {
        console.log('💾 Database connection closed');
        process.exit(0);
    });
});
