<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { marked } from "marked";

    let activeTab = "projects"; // 'projects' | 'skills' | 'experiences'

    // --- Markdown editor modal state ---
    let markdownModalOpen = false;
    let markdownLang = "th"; // which language is being edited: 'th' | 'en'
    // Project State
    let projects = [];
    let projectForm = {
        title: { th: "", en: "" },
        description: { th: "", en: "" },
        learned: { th: "", en: "" },
        detailContent: { th: "", en: "" },
        image: "",
        github: "",
        demo: "",
        tech: [],
        featured: false,
    };
    let techInputString = ""; // Comma-separated tech string
    let editingProjectId = null;

    // State for insert-image helper
    let insertImageUrl = "";
    let insertImageAlt = "";

    // Experience State
    let experiences = [];
    let experienceForm = {
        company: "",
        logo: "",
        position: { th: "", en: "" },
        period: "",
        description: { th: "", en: "" },
    };
    let editingExperienceId = null;

    // Skill State
    let skills = [];
    let skillForm = {
        name: "",
        category: "",
        icon: "",
        proficiency: { th: "", en: "" },
        tooltip: { th: "", en: "" },
    };
    // Use a string key for proficiency dropdown to avoid object-reference mismatch
    let selectedProficiencyKey = "";
    let editingSkillId = null;
    const skillCategories = [
        { value: "Frontend", label: "Frontend" },
        { value: "Backend", label: "Backend" },
        { value: "Database", label: "Database" },
        { value: "Mobile", label: "Mobile Development" },
        { value: "Programming", label: "Programming Languages" },
        { value: "Tools", label: "Tools & Others" },
    ];

    // Map proficiency en label -> bilingual object
    const proficiencyLevels = [
        { key: "Beginner",     value: { th: "เริ่มต้น",    en: "Beginner" } },
        { key: "Intermediate", value: { th: "ระดับกลาง",  en: "Intermediate" } },
        { key: "Advanced",     value: { th: "ระดับสูง",   en: "Advanced" } },
        { key: "Expert",       value: { th: "ผู้เชี่ยวชาญ", en: "Expert" } },
    ];

    let isLoading = false;

    // --- Utility Functions ---
    function resetProjectForm() {
        projectForm = {
            title: { th: "", en: "" },
            description: { th: "", en: "" },
            learned: { th: "", en: "" },
            detailContent: { th: "", en: "" },
            image: "",
            github: "",
            demo: "",
            tech: [],
            featured: false,
        };
        techInputString = "";
        insertImageUrl = "";
        insertImageAlt = "";
        editingProjectId = null;
    }

    // Render markdown for live preview
    function renderMarkdown(text) {
        if (!text)
            return "<p class='text-gray-400 italic'>Preview will appear here...</p>";
        return marked.parse(text);
    }

    /**
     * Insert ![alt](url) at the current cursor position in the active markdown textarea.
     * Falls back to appending at the end if no cursor info is available.
     */
    function insertImageToMarkdown() {
        if (!insertImageUrl.trim()) return;

        const syntax = `\n![${insertImageAlt || "รูปภาพ"}](${insertImageUrl.trim()})\n`;
        const field = markdownLang === "th" ? "th" : "en";
        const textareaId = markdownLang === "th" ? "detail-th" : "detail-en";
        const el = document.getElementById(textareaId);

        if (el) {
            const start = el.selectionStart ?? el.value.length;
            const end = el.selectionEnd ?? el.value.length;
            const before = el.value.substring(0, start);
            const after = el.value.substring(end);
            projectForm.detailContent[field] = before + syntax + after;
            // Restore focus and move cursor after inserted text
            setTimeout(() => {
                el.focus();
                const pos = start + syntax.length;
                el.setSelectionRange(pos, pos);
            }, 10);
        } else {
            // Fallback: append to end
            projectForm.detailContent[field] += syntax;
        }

        insertImageUrl = "";
        insertImageAlt = "";
    }
    function resetExperienceForm() {
        experienceForm = {
            company: "",
            logo: "",
            position: { th: "", en: "" },
            period: "",
            description: { th: "", en: "" },
        };
        editingExperienceId = null;
    }

    function resetSkillForm() {
        skillForm = {
            name: "",
            category: "",
            icon: "",
            proficiency: { th: "", en: "" },
            tooltip: { th: "", en: "" },
        };
        selectedProficiencyKey = "";
        editingSkillId = null;
    }

    onMount(() => {
        if (browser) {
            // ลบการตรวจสอบ localStorage ออกไป เพราะเราตรวจสอบจาก server-side session แล้วใน +page.server.js
            loadProjects();
            loadSkills();
            loadExperiences();
        }
    });

    // --- Project Functions ---
    async function loadProjects() {
        isLoading = true;
        try {
            const response = await fetch("/api/project");
            if (response.ok) {
                projects = await response.json();
            } else {
                console.error("Failed to load projects");
                alert("Failed to load projects.");
            }
        } catch (error) {
            console.error("Error loading projects:", error);
            alert("Error loading projects.");
        }
        isLoading = false;
    }

    async function handleSubmitProject(event) {
        event.preventDefault();
        isLoading = true;
        projectForm.tech = techInputString
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "");

        const url = "/api/project";
        const method = editingProjectId ? "PUT" : "POST";

        try {
            //console.log('Submitting project:', projectForm);
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(projectForm),
            });

            if (response.ok) {
                alert(
                    editingProjectId
                        ? "Project updated successfully!"
                        : "Project added successfully!",
                );
                resetProjectForm();
                loadProjects();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error submitting project:", error);
            alert("An error occurred while submitting the project.");
        }
        isLoading = false;
    }

    function startEditProject(projectToEdit) {
        editingProjectId = projectToEdit.id;
        projectForm = {
            ...projectToEdit,
            featured: projectToEdit.featured || false,
            learned: projectToEdit.learned || { th: "", en: "" },
            detailContent: projectToEdit.detailContent || { th: "", en: "" },
        };
        techInputString = projectToEdit.tech.join(", ");
        insertImageUrl = "";
        insertImageAlt = "";
        window.scrollTo(0, 0);
    }

    async function deleteProject(projectId) {
        if (!confirm("Are you sure you want to delete this project?")) return;
        isLoading = true;
        try {
            //console.log('Deleting project with ID:', projectId);
            const response = await fetch(`/api/project`, {
                method: "DELETE",
                body: JSON.stringify({ id: projectId }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                alert("Project deleted successfully!");
                loadProjects();
            } else {
                alert("Failed to delete project.");
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Error deleting project.");
        }
        isLoading = false;
    }

    // --- Experience Functions ---
    async function loadExperiences() {
        isLoading = true;
        try {
            const response = await fetch("/api/experience");
            if (response.ok) {
                experiences = await response.json();
            } else {
                console.error("Failed to load experiences");
                alert("Failed to load experiences.");
            }
        } catch (error) {
            console.error("Error loading experiences:", error);
            alert("Error loading experiences.");
        }
        isLoading = false;
    }

    async function handleSubmitExperience(event) {
        event.preventDefault();
        isLoading = true;

        const url = "/api/experience";
        const method = editingExperienceId ? "PUT" : "POST";

        try {
            const payload = editingExperienceId
                ? { id: editingExperienceId, ...experienceForm }
                : experienceForm;
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert(
                    editingExperienceId
                        ? "Experience updated successfully!"
                        : "Experience added successfully!",
                );
                resetExperienceForm();
                loadExperiences();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error submitting experience:", error);
            alert("An error occurred while submitting the experience.");
        }
        isLoading = false;
    }

    function startEditExperience(experienceToEdit) {
        editingExperienceId = experienceToEdit.id;
        experienceForm = { ...experienceToEdit };
        window.scrollTo(0, 0);
    }

    async function deleteExperience(experienceId) {
        if (!confirm("Are you sure you want to delete this experience?"))
            return;
        isLoading = true;
        try {
            const response = await fetch(`/api/experience`, {
                method: "DELETE",
                body: JSON.stringify({ id: experienceId }),
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                alert("Experience deleted successfully!");
                loadExperiences();
            } else {
                alert("Failed to delete experience.");
            }
        } catch (error) {
            console.error("Error deleting experience:", error);
            alert("Error deleting experience.");
        }
        isLoading = false;
    }

    // --- Skill Functions ---
    async function loadSkills() {
        isLoading = true;
        try {
            const response = await fetch("/api/skill");
            if (response.ok) {
                skills = await response.json();
            } else {
                console.error("Failed to load skills");
                alert("Failed to load skills.");
            }
        } catch (error) {
            console.error("Error loading skills:", error);
            alert("Error loading skills.");
        }
        isLoading = false;
    }

    async function handleSubmitSkill(event) {
        event.preventDefault();
        isLoading = true;

        // Resolve proficiency object from selected key
        const profLevel = proficiencyLevels.find((l) => l.key === selectedProficiencyKey);
        if (profLevel) skillForm.proficiency = profLevel.value;

        const url = "/api/skill";
        const method = editingSkillId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(skillForm),
            });

            if (response.ok) {
                alert(
                    editingSkillId
                        ? "Skill updated successfully!"
                        : "Skill added successfully!",
                );
                resetSkillForm();
                loadSkills();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error submitting skill:", error);
            alert("An error occurred while submitting the skill.");
        }
        isLoading = false;
    }

    function startEditSkill(skillToEdit) {
        editingSkillId = skillToEdit.id;
        skillForm = {
            ...skillToEdit,
            tooltip: skillToEdit.tooltip || { th: "", en: "" },
        };
        // Match the stored proficiency object to its key by 'en' value
        const match = proficiencyLevels.find(
            (l) => l.value.en === (skillToEdit.proficiency?.en ?? "")
        );
        selectedProficiencyKey = match ? match.key : "";
        window.scrollTo(0, 0);
    }

    async function deleteSkill(skillId) {
        if (!confirm("Are you sure you want to delete this skill?")) return;
        isLoading = true;
        try {
            const response = await fetch(`/api/skill`, {
                method: "DELETE",
                body: JSON.stringify({ id: skillId }),
                headers: { "Content-Type": "application/json" },
            });
            if (response.ok) {
                alert("Skill deleted successfully!");
                loadSkills();
            } else {
                alert("Failed to delete skill.");
            }
        } catch (error) {
            console.error("Error deleting skill:", error);
            alert("Error deleting skill.");
        }
        isLoading = false;
    }
</script>

<!-- Admin Layout -->
<div class="h-screen bg-gray-50 flex overflow-hidden">

    <!-- Sidebar — fixed height, sticky -->
    <aside class="w-52 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
        <div class="px-5 py-5 border-b border-gray-100">
            <a href="/" class="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                &larr; Back to site
            </a>
            <h1 class="text-base font-semibold text-gray-800 mt-1">Admin Panel</h1>
        </div>
        <nav class="flex-1 py-4 px-3 space-y-1">
            {#each [
                { key: "projects", label: "Projects" },
                { key: "skills",   label: "Skills" },
                { key: "experiences", label: "Experiences" },
            ] as tab}
                <button
                    on:click={() => (activeTab = tab.key)}
                    class="w-full text-left px-3 py-2 rounded text-sm transition-colors
                           {activeTab === tab.key
                               ? 'bg-gray-900 text-white font-medium'
                               : 'text-gray-600 hover:bg-gray-100'}"
                >
                    {tab.label}
                </button>
            {/each}
        </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto p-6 lg:p-8">

        {#if isLoading}
            <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span class="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                Loading...
            </div>
        {/if}

        <!-- ==================== PROJECTS ==================== -->
        {#if activeTab === "projects"}
            <div class="max-w-5xl">
                <!-- Form card -->
                <div class="bg-white border border-gray-200 rounded-lg mb-8">
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 class="text-sm font-semibold text-gray-800">
                            {editingProjectId ? "Edit Project" : "Add New Project"}
                        </h2>
                        {#if editingProjectId}
                            <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Editing</span>
                        {/if}
                    </div>

                    <form on:submit={handleSubmitProject} class="p-6 space-y-6">

                        <!-- Title -->
                        <fieldset class="border-0 p-0 m-0">
                            <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Title</legend>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="title-th" class="field-label">Thai</label>
                                    <input id="title-th" type="text" required bind:value={projectForm.title.th} class="field-input" />
                                </div>
                                <div>
                                    <label for="title-en" class="field-label">English</label>
                                    <input id="title-en" type="text" required bind:value={projectForm.title.en} class="field-input" />
                                </div>
                            </div>
                        </fieldset>

                        <!-- Description -->
                        <fieldset class="border-0 p-0 m-0">
                            <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Short Description</legend>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="desc-th" class="field-label">Thai</label>
                                    <textarea id="desc-th" rows="3" required bind:value={projectForm.description.th} class="field-input"></textarea>
                                </div>
                                <div>
                                    <label for="desc-en" class="field-label">English</label>
                                    <textarea id="desc-en" rows="3" required bind:value={projectForm.description.en} class="field-input"></textarea>
                                </div>
                            </div>
                        </fieldset>

                        <!-- Learned -->
                        <fieldset class="border-0 p-0 m-0">
                            <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">What I Learned <span class="normal-case font-normal text-gray-400">(optional)</span></legend>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="learned-th" class="field-label">Thai</label>
                                    <textarea id="learned-th" rows="3" bind:value={projectForm.learned.th} class="field-input" placeholder="เช่น เรียนรู้การใช้ SvelteKit..."></textarea>
                                </div>
                                <div>
                                    <label for="learned-en" class="field-label">English</label>
                                    <textarea id="learned-en" rows="3" bind:value={projectForm.learned.en} class="field-input" placeholder="e.g. Learned SvelteKit..."></textarea>
                                </div>
                            </div>
                        </fieldset>

                        <!-- Markdown Detail Content -->
                        <fieldset class="border-0 p-0 m-0">
                            <div class="flex items-center justify-between mb-3">
                                <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Detail Content (Markdown) <span class="normal-case font-normal text-gray-400">(optional)</span>
                                </legend>
                                <!-- Language toggle -->
                                <div class="flex rounded border border-gray-200 overflow-hidden text-xs">
                                    <button type="button" on:click={() => (markdownLang = "th")}
                                        class="px-3 py-1 transition-colors {markdownLang === 'th' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}">
                                        TH
                                    </button>
                                    <button type="button" on:click={() => (markdownLang = "en")}
                                        class="px-3 py-1 transition-colors {markdownLang === 'en' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}">
                                        EN
                                    </button>
                                </div>
                            </div>

                            <!-- Insert image helper -->
                            <div class="flex flex-col sm:flex-row gap-2 mb-3 p-3 bg-gray-50 border border-gray-200 rounded">
                                <div class="flex-1 min-w-0">
                                    <label for="insert-img-alt" class="field-label">Alt text</label>
                                    <input id="insert-img-alt" type="text" bind:value={insertImageAlt}
                                        placeholder="Image description" class="field-input text-sm" />
                                </div>
                                <div class="flex-[2] min-w-0">
                                    <label for="insert-img-url" class="field-label">Image URL</label>
                                    <input id="insert-img-url" type="text" bind:value={insertImageUrl}
                                        placeholder="https://example.com/image.png" class="field-input text-sm"
                                        on:keydown={(e) => e.key === "Enter" && (e.preventDefault(), insertImageToMarkdown())} />
                                </div>
                                <div class="flex items-end shrink-0">
                                    <button type="button" on:click={insertImageToMarkdown}
                                        disabled={!insertImageUrl.trim()}
                                        class="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700
                                               transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
                                        Insert Image
                                    </button>
                                </div>
                            </div>
                            <p class="text-xs text-gray-400 mb-3">Click in the editor to set cursor position, then click Insert Image to embed at that position.</p>

                            <!-- Split editor / preview -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                <div class="flex flex-col">
                                    <span class="field-label mb-1">Editor — {markdownLang === "th" ? "Thai" : "English"}</span>
                                    {#if markdownLang === "th"}
                                        <textarea id="detail-th" bind:value={projectForm.detailContent.th} rows="16"
                                            class="field-input font-mono text-sm resize-none"
                                            placeholder="# Project title&#10;&#10;Content in markdown..."></textarea>
                                    {:else}
                                        <textarea id="detail-en" bind:value={projectForm.detailContent.en} rows="16"
                                            class="field-input font-mono text-sm resize-none"
                                            placeholder="# Project title&#10;&#10;Content in markdown..."></textarea>
                                    {/if}
                                </div>
                                <div class="flex flex-col">
                                    <span class="field-label mb-1">Preview</span>
                                    <div class="flex-1 border border-gray-200 rounded p-4 bg-white overflow-y-auto min-h-[300px] text-sm markdown-preview">
                                        {@html renderMarkdown(markdownLang === "th" ? projectForm.detailContent.th : projectForm.detailContent.en)}
                                    </div>
                                </div>
                            </div>

                            <!-- Cheatsheet -->
                            <details class="mt-2">
                                <summary class="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">Markdown syntax reference</summary>
                                <div class="mt-2 p-3 bg-gray-50 rounded border border-gray-100 text-xs font-mono text-gray-600 grid grid-cols-2 gap-x-6 gap-y-1">
                                    <span><strong># H1</strong></span>
                                    <span><strong>## H2</strong></span>
                                    <span><strong>**bold**</strong></span>
                                    <span><strong>*italic*</strong></span>
                                    <span><strong>- item</strong> bullet</span>
                                    <span><strong>1. item</strong> ordered</span>
                                    <span><strong>`code`</strong></span>
                                    <span><strong>```block```</strong></span>
                                    <span><strong>&gt; quote</strong></span>
                                    <span><strong>---</strong> rule</span>
                                    <span><strong>[text](url)</strong></span>
                                    <span><strong>![alt](url)</strong></span>
                                </div>
                            </details>
                        </fieldset>

                        <!-- URLs -->
                        <fieldset class="border-0 p-0 m-0">
                            <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Links</legend>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label for="image" class="field-label">Thumbnail URL <span class="text-red-400">*</span></label>
                                    <input id="image" type="text" required bind:value={projectForm.image} class="field-input" placeholder="https://..." />
                                </div>
                                <div>
                                    <label for="github" class="field-label">GitHub URL</label>
                                    <input id="github" type="url" bind:value={projectForm.github} class="field-input" placeholder="https://github.com/..." />
                                </div>
                                <div>
                                    <label for="demo" class="field-label">Demo URL</label>
                                    <input id="demo" type="url" bind:value={projectForm.demo} class="field-input" placeholder="https://..." />
                                </div>
                            </div>
                        </fieldset>

                        <!-- Tech + Featured -->
                        <fieldset class="border-0 p-0 m-0">
                            <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Options</legend>
                            <div class="space-y-3">
                                <div>
                                    <label for="tech" class="field-label">Technologies <span class="font-normal text-gray-400">(comma-separated)</span></label>
                                    <input id="tech" type="text" required bind:value={techInputString} class="field-input"
                                        placeholder="Svelte, Node.js, Firebase" />
                                </div>
                                <label class="flex items-center gap-2 cursor-pointer w-fit">
                                    <input type="checkbox" bind:checked={projectForm.featured}
                                        class="w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500" />
                                    <span class="text-sm text-gray-700">Featured — show on homepage</span>
                                </label>
                            </div>
                        </fieldset>

                        <!-- Actions -->
                        <div class="flex gap-3 pt-2 border-t border-gray-100">
                            <button type="submit" disabled={isLoading} class="btn-primary">
                                {isLoading ? "Saving..." : editingProjectId ? "Update Project" : "Add Project"}
                            </button>
                            {#if editingProjectId}
                                <button type="button" on:click={resetProjectForm} disabled={isLoading} class="btn-secondary">
                                    Cancel
                                </button>
                            {/if}
                        </div>

                    </form>
                </div>

                <!-- Project list -->
                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Existing Projects</h2>
                <div class="space-y-2">
                    {#each projects as project (project.id)}
                        <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                            <div class="min-w-0">
                                <p class="text-sm font-medium text-gray-800 truncate">
                                    {project.title.en || project.title.th}
                                    {#if project.featured}
                                        <span class="ml-2 text-xs font-normal bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Featured</span>
                                    {/if}
                                </p>
                                <p class="text-xs text-gray-400 truncate mt-0.5">{project.tech.join(", ")}</p>
                            </div>
                            <div class="flex gap-2 shrink-0">
                                <button on:click={() => startEditProject(project)} disabled={isLoading} class="btn-sm-edit">Edit</button>
                                <button on:click={() => deleteProject(project.id)} disabled={isLoading} class="btn-sm-delete">Delete</button>
                            </div>
                        </div>
                    {:else}
                        <p class="text-sm text-gray-400">No projects yet.</p>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- ==================== EXPERIENCES ==================== -->
        {#if activeTab === "experiences"}
            <div class="max-w-3xl">
                <div class="bg-white border border-gray-200 rounded-lg mb-8">
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 class="text-sm font-semibold text-gray-800">
                            {editingExperienceId ? "Edit Experience" : "Add New Experience"}
                        </h2>
                        {#if editingExperienceId}
                            <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Editing</span>
                        {/if}
                    </div>
                    <form on:submit={handleSubmitExperience} class="p-6 space-y-5">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="exp-company" class="field-label">Company</label>
                                <input id="exp-company" type="text" required bind:value={experienceForm.company} class="field-input" placeholder="Company name" />
                            </div>
                            <div>
                                <label for="exp-logo" class="field-label">Logo URL</label>
                                <input id="exp-logo" type="url" bind:value={experienceForm.logo} class="field-input" placeholder="https://..." />
                            </div>
                        </div>

                        <fieldset class="border-0 p-0 m-0">
                            <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Position</legend>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="exp-position-th" class="field-label">Thai</label>
                                    <input id="exp-position-th" type="text" required bind:value={experienceForm.position.th} class="field-input" />
                                </div>
                                <div>
                                    <label for="exp-position-en" class="field-label">English</label>
                                    <input id="exp-position-en" type="text" required bind:value={experienceForm.position.en} class="field-input" />
                                </div>
                            </div>
                        </fieldset>

                        <div>
                            <label for="exp-period" class="field-label">Period</label>
                            <input id="exp-period" type="text" required bind:value={experienceForm.period} class="field-input" placeholder="e.g. 2023 – Present" />
                        </div>

                        <fieldset class="border-0 p-0 m-0">
                            <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</legend>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="exp-desc-th" class="field-label">Thai</label>
                                    <textarea id="exp-desc-th" rows="4" required bind:value={experienceForm.description.th} class="field-input"></textarea>
                                </div>
                                <div>
                                    <label for="exp-desc-en" class="field-label">English</label>
                                    <textarea id="exp-desc-en" rows="4" required bind:value={experienceForm.description.en} class="field-input"></textarea>
                                </div>
                            </div>
                        </fieldset>

                        <div class="flex gap-3 pt-2 border-t border-gray-100">
                            <button type="submit" disabled={isLoading} class="btn-primary">
                                {isLoading ? "Saving..." : editingExperienceId ? "Update Experience" : "Add Experience"}
                            </button>
                            {#if editingExperienceId}
                                <button type="button" on:click={resetExperienceForm} disabled={isLoading} class="btn-secondary">Cancel</button>
                            {/if}
                        </div>
                    </form>
                </div>

                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Existing Experiences</h2>
                <div class="space-y-2">
                    {#each experiences as exp (exp.id)}
                        <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3 min-w-0">
                                {#if exp.logo}
                                    <img src={exp.logo} alt={exp.company} class="w-8 h-8 object-contain shrink-0 rounded" />
                                {/if}
                                <div class="min-w-0">
                                    <p class="text-sm font-medium text-gray-800 truncate">{exp.position.th || exp.position.en}</p>
                                    <p class="text-xs text-gray-400">{exp.company} · {exp.period}</p>
                                </div>
                            </div>
                            <div class="flex gap-2 shrink-0">
                                <button on:click={() => startEditExperience(exp)} disabled={isLoading} class="btn-sm-edit">Edit</button>
                                <button on:click={() => deleteExperience(exp.id)} disabled={isLoading} class="btn-sm-delete">Delete</button>
                            </div>
                        </div>
                    {:else}
                        <p class="text-sm text-gray-400">No experiences yet.</p>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- ==================== SKILLS ==================== -->
        {#if activeTab === "skills"}
            <div class="max-w-3xl">
                <div class="bg-white border border-gray-200 rounded-lg mb-8">
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 class="text-sm font-semibold text-gray-800">
                            {editingSkillId ? "Edit Skill" : "Add New Skill"}
                        </h2>
                        {#if editingSkillId}
                            <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Editing</span>
                        {/if}
                    </div>
                    <form on:submit={handleSubmitSkill} class="p-6 space-y-5">

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="skill-name" class="field-label">Skill Name</label>
                                <input id="skill-name" type="text" required bind:value={skillForm.name} class="field-input" />
                            </div>
                            <div>
                                <label for="skill-category" class="field-label">Category</label>
                                <select id="skill-category" required bind:value={skillForm.category} class="field-input">
                                    <option value="" disabled>Select category</option>
                                    {#each skillCategories as cat}
                                        <option value={cat.value}>{cat.label}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="skill-icon" class="field-label">Icon URL</label>
                                <input id="skill-icon" type="url" required bind:value={skillForm.icon} class="field-input" placeholder="https://..." />
                            </div>
                            <div>
                                <label for="skill-proficiency" class="field-label">Proficiency</label>
                                <select id="skill-proficiency" required bind:value={selectedProficiencyKey} class="field-input">
                                    <option value="" disabled>Select level</option>
                                    {#each proficiencyLevels as level}
                                        <option value={level.key}>{level.key} / {level.value.th}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>

                        <fieldset class="border-0 p-0 m-0">
                            <legend class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Tooltip</legend>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="skill-tooltip-th" class="field-label">Thai</label>
                                    <textarea id="skill-tooltip-th" rows="2" bind:value={skillForm.tooltip.th} class="field-input" placeholder="คำอธิบายเพิ่มเติม"></textarea>
                                </div>
                                <div>
                                    <label for="skill-tooltip-en" class="field-label">English</label>
                                    <textarea id="skill-tooltip-en" rows="2" bind:value={skillForm.tooltip.en} class="field-input" placeholder="Additional info"></textarea>
                                </div>
                            </div>
                        </fieldset>

                        <div class="flex gap-3 pt-2 border-t border-gray-100">
                            <button type="submit" disabled={isLoading} class="btn-primary">
                                {isLoading ? "Saving..." : editingSkillId ? "Update Skill" : "Add Skill"}
                            </button>
                            {#if editingSkillId}
                                <button type="button" on:click={resetSkillForm} disabled={isLoading} class="btn-secondary">Cancel</button>
                            {/if}
                        </div>
                    </form>
                </div>

                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Existing Skills</h2>
                <div class="space-y-2">
                    {#each skills as skill (skill.id)}
                        <div class="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-3 min-w-0">
                                <img src={skill.icon} alt={skill.name} class="w-7 h-7 object-contain shrink-0" />
                                <div class="min-w-0">
                                    <p class="text-sm font-medium text-gray-800">{skill.name}</p>
                                    <p class="text-xs text-gray-400">{skill.category} · {skill.proficiency.en || skill.proficiency.th}</p>
                                </div>
                            </div>
                            <div class="flex gap-2 shrink-0">
                                <button on:click={() => startEditSkill(skill)} disabled={isLoading} class="btn-sm-edit">Edit</button>
                                <button on:click={() => deleteSkill(skill.id)} disabled={isLoading} class="btn-sm-delete">Delete</button>
                            </div>
                        </div>
                    {:else}
                        <p class="text-sm text-gray-400">No skills yet.</p>
                    {/each}
                </div>
            </div>
        {/if}

    </main>
</div>




<style>
    /* ---- Form utilities ---- */
    :global(.field-label) {
        display: block;
        font-size: 0.75rem;
        font-weight: 500;
        color: #6b7280;
        margin-bottom: 0.25rem;
        letter-spacing: 0.01em;
    }
    :global(.field-input) {
        display: block;
        width: 100%;
        padding: 0.5rem 0.625rem;
        font-size: 0.875rem;
        color: #111827;
        background: #fff;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
    }
    :global(.field-input:focus) {
        border-color: #374151;
        box-shadow: 0 0 0 2px rgba(55,65,81,0.12);
    }
    :global(.field-input::placeholder) { color: #9ca3af; }

    :global(.btn-primary) {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #fff;
        background: #111827;
        border-radius: 0.375rem;
        border: none;
        cursor: pointer;
        transition: background 0.15s;
    }
    :global(.btn-primary:hover:not(:disabled)) { background: #374151; }
    :global(.btn-primary:disabled) { opacity: 0.5; cursor: not-allowed; }

    :global(.btn-secondary) {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
        background: #f3f4f6;
        border-radius: 0.375rem;
        border: 1px solid #e5e7eb;
        cursor: pointer;
        transition: background 0.15s;
    }
    :global(.btn-secondary:hover:not(:disabled)) { background: #e5e7eb; }
    :global(.btn-secondary:disabled) { opacity: 0.5; cursor: not-allowed; }

    :global(.btn-sm-edit) {
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: #374151;
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: background 0.15s;
    }
    :global(.btn-sm-edit:hover:not(:disabled)) { background: #e5e7eb; }

    :global(.btn-sm-delete) {
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: #b91c1c;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: background 0.15s;
    }
    :global(.btn-sm-delete:hover:not(:disabled)) { background: #fee2e2; }
    :global(.btn-sm-edit:disabled),
    :global(.btn-sm-delete:disabled) { opacity: 0.5; cursor: not-allowed; }

    /* ---- Markdown live preview styles ---- */
    :global(.markdown-preview h1),
    :global(.markdown-preview h2),
    :global(.markdown-preview h3) {
        font-weight: 700;
        color: #1f2937;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        line-height: 1.3;
    }
    :global(.markdown-preview h1) {
        font-size: 1.5rem;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 0.25rem;
    }
    :global(.markdown-preview h2) {
        font-size: 1.2rem;
    }
    :global(.markdown-preview h3) {
        font-size: 1rem;
    }

    :global(.markdown-preview p) {
        color: #374151;
        margin-bottom: 0.75rem;
        line-height: 1.75;
        font-size: 0.9rem;
    }

    :global(.markdown-preview ul) {
        list-style-type: disc;
        padding-left: 1.25rem;
        margin-bottom: 0.75rem;
    }
    :global(.markdown-preview ol) {
        list-style-type: decimal;
        padding-left: 1.25rem;
        margin-bottom: 0.75rem;
    }
    :global(.markdown-preview li) {
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
        color: #374151;
    }

    :global(.markdown-preview code) {
        background: #f3f4f6;
        border-radius: 3px;
        padding: 0.1em 0.35em;
        font-family: monospace;
        font-size: 0.85em;
        color: #4f46e5;
    }

    :global(.markdown-preview pre) {
        background: #1e293b;
        color: #e2e8f0;
        border-radius: 6px;
        padding: 1rem;
        overflow-x: auto;
        margin-bottom: 0.75rem;
        font-size: 0.82rem;
    }
    :global(.markdown-preview pre code) {
        background: none;
        padding: 0;
        color: inherit;
    }

    :global(.markdown-preview blockquote) {
        border-left: 3px solid #6366f1;
        padding-left: 0.75rem;
        margin-left: 0;
        color: #6b7280;
        font-style: italic;
        font-size: 0.9rem;
    }

    :global(.markdown-preview a) {
        color: #4f46e5;
        text-decoration: underline;
    }
    :global(.markdown-preview img) {
        max-width: 100%;
        border-radius: 6px;
        margin: 0.5rem 0;
    }
    :global(.markdown-preview hr) {
        border: none;
        border-top: 1px solid #e5e7eb;
        margin: 1rem 0;
    }

    :global(.markdown-preview strong) {
        font-weight: 700;
        color: #111827;
    }
    :global(.markdown-preview em) {
        font-style: italic;
    }
</style>
