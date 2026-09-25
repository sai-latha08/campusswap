/**
 * Utility to validate allowed origins for CORS in Express & Socket.io
 */
const getAllowedOrigins = () => {
  const defaults = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://campusswap-taupe.vercel.app',
  ];

  if (process.env.CLIENT_URL) {
    const customOrigins = process.env.CLIENT_URL.split(',').map((url) =>
      url.trim().replace(/\/+$/, '')
    );
    defaults.push(...customOrigins);
  }

  return [...new Set(defaults)];
};

const isOriginAllowed = (origin) => {
  // Allow requests with no origin (like mobile apps, curl, Postman, server-to-server)
  if (!origin) return true;

  const normalizedOrigin = origin.trim().replace(/\/+$/, '');
  const allowed = getAllowedOrigins();

  if (allowed.includes(normalizedOrigin)) {
    return true;
  }

  // Allow all Vercel deployment URLs (*.vercel.app)
  if (/^https:\/\/([a-zA-Z0-9-_]+\.)*vercel\.app$/.test(normalizedOrigin)) {
    return true;
  }

  // Allow local development on any port
  if (/^http:\/\/localhost(:\d+)?$/.test(normalizedOrigin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(normalizedOrigin)) {
    return true;
  }

  return false;
};

module.exports = {
  getAllowedOrigins,
  isOriginAllowed,
};
