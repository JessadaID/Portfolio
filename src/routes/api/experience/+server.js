import { db } from "$lib/firebase";
import { collection, getDocs, doc, query, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { json } from "@sveltejs/kit";

export async function GET() {
    try {
        const q = query(collection(db, "experiences"));
        const querySnapshot = await getDocs(q);
        const experiences = querySnapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        return json(experiences);
    } catch (error) {
        console.error("Error fetching experiences:", error);
        return json({ error: "Failed to fetch experiences" }, { status: 500 });
    }
}

export async function POST({ request }) {
    const data = await request.json();
    try {
        const docRef = await addDoc(collection(db, "experiences"), data);
        return json({ id: docRef.id, ...data }, { status: 200 });
    } catch (error) {
        console.error("Error adding experience:", error);
        return json({ error: "Failed to add experience" }, { status: 500 });
    }
}

export async function PUT({ request }) {
    const data = await request.json();
    const { id, ...expData } = data;
    try {
        const expRef = doc(db, "experiences", id);
        await updateDoc(expRef, expData);
        return json({ id, ...expData }, { status: 200 });
    } catch (error) {
        console.error("Error updating experience:", error);
        return json({ error: "Failed to update experience" }, { status: 500 });
    }
}

export async function DELETE({ request }) {
    const data = await request.json();
    const { id } = data;
    try {
        const expRef = doc(db, "experiences", id);
        await deleteDoc(expRef);
        return json({ message: "Experience deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting experience:", error);
        return json({ error: "Failed to delete experience" }, { status: 500 });
    }
}
