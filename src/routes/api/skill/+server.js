import { db } from "$lib/firebase";
import { collection, getDocs ,doc , where, query, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { json } from "@sveltejs/kit";
import { getAuth } from "firebase/auth";

const auth = getAuth();

export async function GET() {
    try {

        const q = query(collection(db, "skills"));

        const querySnapshot = await getDocs(q);
        const projects =  querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        return json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return json({ error: "Failed to fetch projects" }, { status: 500 });
        
    }
}

export async function POST({ request }) {
    try {
        const data = await request.json();
        // You might want to add validation for 'data' here
        const docRef = await addDoc(collection(db, "skills"), data);
        return json({ id: docRef.id, ...data }, { status: 201 }); // 201 Created
    } catch (error) {
        console.error("Error adding skill:", error);
        return json({ error: "Failed to add skill" }, { status: 500 });
    }
}

export async function PUT({ request }) {
    const data = await request.json();
    const { id, ...skillData } = data;

    if (!id) {
        return json({ error: "Skill ID is required for update" }, { status: 400 });
    }

    try {
        const skillRef = doc(db, "skills", id);
        await updateDoc(skillRef, skillData); // Ensure updateDoc is imported and used
        return json({ id, ...skillData }, { status: 200 });
    } catch (error) {
        console.error("Error updating skill:", error);
        return json({ error: "Failed to update skill" }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    const data = await request.json();
    const { id } = data;

    if (!id) {
        return json({ error: "Skill ID is required for deletion" }, { status: 400 });
    }

    try {
        const skillRef = doc(db, "skills", id);
        await deleteDoc(skillRef); // Corrected: use deleteDoc()
        return json({ message: "Skill deleted successfully" }, { status: 200 }); // Consider 204 No Content for successful deletions without a body
    } catch (error) {
        console.error("Error deleting skill:", error);
        return json({ error: "Failed to delete skill" }, { status: 500 });
    }
}