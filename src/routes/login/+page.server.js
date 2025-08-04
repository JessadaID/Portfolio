// src/routes/login/+page.server.ts
import { ADMIN_EMAIL, ADMIN_PASSWORD, JWT_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (!email || !password) {
      return { error: 'กรุณากรอกอีเมลและรหัสผ่าน' };
    }

    // ตรวจสอบข้อมูลล็อกอิน
    const isValidEmail = email === ADMIN_EMAIL;
    const isValidPassword = password ===  ADMIN_PASSWORD ;

    if (isValidEmail && isValidPassword) {
      // สร้าง JWT token
      const token = jwt.sign(
        { email: ADMIN_EMAIL },
        JWT_SECRET,
        { expiresIn: '24h' }
      );


      // ตั้งค่า cookie
      cookies.set('session', token, {
        path: '/',
        maxAge: 60 * 60 * 24, // 24 ชั่วโมง
        httpOnly: true,
        secure: false, // เปลี่ยนเป็น false สำหรับ development
        sameSite: 'lax' // เปลี่ยนจาก strict เป็น lax
      });

      
      throw redirect(303, '/admin');
    }

    return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
  }
};