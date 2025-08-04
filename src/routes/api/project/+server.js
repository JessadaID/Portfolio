import { db } from "$lib/firebase";
import { collection, getDocs ,doc , where, query,addDoc ,updateDoc , deleteDoc} from "firebase/firestore";
import { json } from "@sveltejs/kit";

export async function GET() {
    try {
        const q = query(collection(db, "projects"));

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
    const data = await request.json();
    //console.log("Received data:", data);
    
    try {
        const docRef = await addDoc(collection(db, "projects"), data);
        return json({ id: docRef.id, ...data }, { status: 200 });
    } catch (error) {
        console.error("Error adding project:", error);
        return json({ error: "Failed to add project" }, { status: 500 });
    }
}

export async function PUT({ request })
{
    const data = await request.json();
    const { id, ...projectData } = data;
    console.log("Updating project with ID:", id, "Data:", projectData);
    
    try {
        const projectRef = doc(db, "projects", id);
        await updateDoc(projectRef, projectData);
        return json({ id, ...projectData }, { status: 200 });
    } catch (error) {
        console.error("Error updating project:", error);
        return json({ error: "Failed to update project" }, { status: 500 });
    }
}


export async function DELETE({ request }) {
    const data = await request.json();
    const { id } = data;
    console.log("Deleting project with ID:", data);
    try {
        const projectRef = doc(db, "projects", id);
        await deleteDoc(projectRef);
        return json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting project:", error);
        return json({ error: "Failed to delete project" }, { status: 500 });
    }
}