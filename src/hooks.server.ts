// src/hooks.server.ts
import { ADMIN_EMAIL, JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
  const sessionToken = event.cookies.get('session');
  
  if (sessionToken) {
    try {
      // ตรวจสอบ JWT token
      const decoded = jwt.verify(sessionToken, JWT_SECRET) as { email: string; exp: number };
      
      // ตรวจสอบว่าเป็น admin email
      if (decoded.email === ADMIN_EMAIL) {
        event.locals.user = { email: decoded.email };
      } else {
        event.locals.user = null;
        // ลบ cookie ที่ไม่ถูกต้อง
        event.cookies.delete('session', { path: '/' });
      }
    } catch (error) {
      // Token หมดอายุหรือไม่ถูกต้อง
      event.locals.user = null;
      event.cookies.delete('session', { path: '/' });
    }
  } else {
    event.locals.user = null;
  }
  
  return resolve(event);
}