// =====================================
// Port
// =====================================

process.env.PORT = process.env.PORT || 3000;

// =====================================
// Environment
// =====================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================================
// Token expiration
// =====================================

process.env.tokenExpiration = '48h';

// =====================================
// Seed authentication
// =====================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =====================================
// Database
// =====================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/iUnid';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;