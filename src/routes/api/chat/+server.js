import { db } from "$lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
    try {
        const { message, chatHistory } = await request.json();

        // 1. Fetch data from Firestore
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const projects = projectsSnapshot.docs.map(doc => doc.data());

        const skillsSnapshot = await getDocs(collection(db, "skills"));
        const skills = skillsSnapshot.docs.map(doc => doc.data());

        const experiencesSnapshot = await getDocs(collection(db, "experiences"));
        const experiences = experiencesSnapshot.docs.map(doc => doc.data());

        // 2. Format the system prompt
        const portfolioContext = `
คุณคือ AI Assistant เป็นผู้หญิง ประจำ Portfolio ของ "เจษฎา" (Jessada) ซึ่งเป็น Web Developer
ข้อมูลของเจษฎามีดังนี้:

[ข้อมูลส่วนตัว]
- ชื่อ: เจษฎา
- นามสกุล: บุญทา
- อายุ: 23 ปี
- เพศ: ชาย 
- การศึกษา: ปริญญาตรี คณะวิศวกรรมศาสตร์ สาขาวิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา เชียงใหม่ GPA: 3.87

[ช่องทางการติดต่อ]
- Email: jessada.bo46@gmail.com
- linkedin: https://www.linkedin.com/in/jessada-boonta/
- GitHub: https://github.com/JessadaID
- Tel: 095-123-6881

[ประสบการณ์การทำงาน]
${experiences.map(e => `- ${e.company} (${e.period || ''})
    ${e.position?.th || e.position?.en || ''}
    รายละเอียดงาน:
    ${e.description?.th || e.description?.en || ''}`).join('\n')}

[ทักษะ (Skills)]
${skills.map(s => `- ${s.name}: ความชำนาญ ${s.proficiency?.th || s.proficiency?.en || ''} (${s.tooltip?.th || s.tooltip?.en || ''})`).join('\n')}

[โปรเจกต์ (Projects)]
${projects.map(p => `- ${p.title?.th || p.title?.en || ''}: ${p.description?.th || p.description?.en || ''} (เทคโนโลยีที่ใช้: ${(p.tech || []).join(', ')})`).join('\n')}

กฏประจำตัวของคุณ:
1. ตอบคำถามอย่างสุภาพและเป็นกันเอง ราวกับว่าคุณเป็นผู้ช่วยส่วนตัวของเจษฎา
2. ตอบกระชับ ไม่เยิ่นเย้อ หากถูกถามให้แนะนำผลงานและทักษะ ให้อ้างอิงจากข้อมูลด้านบนเท่านั้น
3. หากผู้ใช้ถามเรื่องส่วนตัวที่ไม่มีในฐานข้อมูล ให้บอกช่องทางการติดต่อ หรือบอกว่าสามารถทักไปหาเจษฎาโดยตรงได้
        `;

        const messages = [
            { role: "system", content: portfolioContext },
            ...(chatHistory || []),
            { role: "user", content: message }
        ];

        // 3. Call Groq API via standard Fetch
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant', // Fast model parameter
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Groq API Error:", errorText);
            throw new Error('Failed to fetch from Groq API');
        }

        const data = await response.json();
        const reply = data.choices[0].message.content;

        return json({ reply });

    } catch (error) {
        console.error("Chat API Error:", error);
        return json({ error: "ขออภัยครับ ตอนนี้ระบบ AI มีปัญหาขัดข้อง" }, { status: 500 });
    }
}
