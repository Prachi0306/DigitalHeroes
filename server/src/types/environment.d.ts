declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    MONGODB_URI?: string;
    REDIS_URL?: string;
    JWT_ACCESS_SECRET?: string;
    JWT_ACCESS_EXPIRY?: string;
    JWT_REFRESH_SECRET?: string;
    JWT_REFRESH_EXPIRY?: string;
    COOKIE_SECRET?: string;
    FRONTEND_URL?: string;
    CLOUDINARY_CLOUD_NAME?: string;
    CLOUDINARY_API_KEY?: string;
    CLOUDINARY_API_SECRET?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
  }
}
