import { db } from "$lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { json } from "@sveltejs/kit";

// GET /api/project/:id — fetch a single project by Firestore document ID
export async function GET({ params }) {
    const { id } = params;
    try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return json({ error: "Project not found" }, { status: 404 });
        }

        return json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
        console.error("Error fetching project:", error);
        return json({ error: "Failed to fetch project" }, { status: 500 });
    }
}
