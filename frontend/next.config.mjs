// Semua request /api/* diteruskan ke FastAPI, jadi browser tidak kena masalah CORS.
const backend = process.env.BACKEND_URL || "http://127.0.0.1:8000";

/** @type {import('next').NextConfig} */
export default {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backend}/:path*` }];
  },
};
