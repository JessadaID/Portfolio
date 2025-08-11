<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    let activeTab = 'projects'; // 'projects' or 'skills'

    // Project State
    let projects = [];
    let projectForm = {
        title: { th: '', en: '' },
        description: { th: '', en: '' },
        image: '',
        github: '',
        demo: '',
        tech: []
    };
    let techInputString = ''; // Separate variable for the comma-separated tech input
    let editingProjectId = null;

    // Skill State
    let skills = [];
    let skillForm = {
        name: '',
        category: '', // Added category
        icon: '',
        proficiency: { th: '', en: '' }
    };
    let editingSkillId = null;
    const skillCategories = [
        { value: 'Frontend', label: 'Frontend' },
        { value: 'Backend', label: 'Backend' },
        { value: 'Database', label: 'Database' },
        { value: 'Mobile', label: 'Mobile Development' },
        { value: 'Programming', label: 'Programming Languages' },
        { value: 'Tools', label: 'Tools & Others' }
    ];

    const proficiencyLevels = [
        { value: { th: 'เริ่มต้น', en: 'Beginner'}, label: {en:'Beginner', th:'เริ่มต้น'} },
        { value: { th: 'ระดับกลาง', en: 'Intermediate'}, label: {en:'Intermediate', th:'ระดับกลาง'} },
        { value: { th : 'ระดับสูง', en: 'Advanced'}, label: {en:'Advanced', th:'ระดับสูง'} },
        { value: { th: 'ผู้เชี่ยวชาญ', en: 'Expert'}, label: {en:'Expert', th:'ผู้เชี่ยวชาญ'} }
    ];

    let isLoading = false;

    // --- Utility Functions ---
    function resetProjectForm() {
        projectForm = {
             title: { th: '', en: '' }, description: { th: '', en: '' },
            image: '', github: '', demo: '', tech: []
        };
        techInputString = '';
        editingProjectId = null;
    }

    function resetSkillForm() {
        skillForm = {  name: '', category: '', icon: '', proficiency: { th: '', en: '' } };
        editingSkillId = null;
    }


    onMount(() => {
        if (browser) {
            const isAdmin = localStorage.getItem('isAdmin') === 'true';
            if (!isAdmin) {
                goto('/login');
            } else {
                loadProjects();
                loadSkills();
            }
        }
    });

    // --- Project Functions ---
    async function loadProjects() {
        isLoading = true;
        try {
            const response = await fetch('/api/project');
            if (response.ok) {
                projects = await response.json();
            } else {
                console.error('Failed to load projects');
                alert('Failed to load projects.');
            }
        } catch (error) {
            console.error('Error loading projects:', error);
            alert('Error loading projects.');
        }
        isLoading = false;
    }

    async function handleSubmitProject(event) {
        event.preventDefault();
        isLoading = true;
        projectForm.tech = techInputString
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');

        const url = '/api/project';
        const method = editingProjectId ? 'PUT' : 'POST';

        try {
            //console.log('Submitting project:', projectForm);
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectForm)
            });

            if (response.ok) {
                alert(editingProjectId ? 'Project updated successfully!' : 'Project added successfully!');
                resetProjectForm();
                loadProjects();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error submitting project:', error);
            alert('An error occurred while submitting the project.');
        }
        isLoading = false;
    }

    function startEditProject(projectToEdit) {
        editingProjectId = projectToEdit.id;
        projectForm = { ...projectToEdit };
        techInputString = projectToEdit.tech.join(', ');
        window.scrollTo(0, 0); // Scroll to top to see the form
    }

    async function deleteProject(projectId) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        isLoading = true;
        try {
            //console.log('Deleting project with ID:', projectId);
            const response = await fetch(`/api/project`, 
            { 
                method: 'DELETE' , 
                body: JSON.stringify({ id: projectId }),
                headers: { 
                    'Content-Type': 'application/json' 
                }});
            if (response.ok) {
                alert('Project deleted successfully!');
                loadProjects();
            } else {
                alert('Failed to delete project.');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Error deleting project.');
        }
        isLoading = false;
    }

    // --- Skill Functions ---
    async function loadSkills() {
        isLoading = true;
        try {
            const response = await fetch('/api/skill');
            if (response.ok) {
                skills = await response.json();
            } else {
                console.error('Failed to load skills');
                alert('Failed to load skills.');
            }
        } catch (error) {
            console.error('Error loading skills:', error);
            alert('Error loading skills.');
        }
        isLoading = false;
    }

    async function handleSubmitSkill(event) {
        event.preventDefault();
        isLoading = true;

        const url = '/api/skill';
        const method = editingSkillId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(skillForm)
            });

            if (response.ok) {
                alert(editingSkillId ? 'Skill updated successfully!' : 'Skill added successfully!');
                resetSkillForm();
                loadSkills();
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error submitting skill:', error);
            alert('An error occurred while submitting the skill.');
        }
        isLoading = false;
    }

    function startEditSkill(skillToEdit) {
        editingSkillId = skillToEdit.id;
        skillForm = { ...skillToEdit };
        window.scrollTo(0, 0); // Scroll to top to see the form
    }

    async function deleteSkill(skillId) {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        isLoading = true;
        try {
            const response = await fetch(`/api/skill`, 
            { 
                method: 'DELETE' , 
                body: JSON.stringify({ id: skillId }),
                headers: { 'Content-Type': 'application/json' 

            }});
            if (response.ok) {
                alert('Skill deleted successfully!');
                loadSkills();
            } else {
                alert('Failed to delete skill.');
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Error deleting skill.');
        }
        isLoading = false;
    }
</script>

<div class="container mx-auto p-4 md:p-8 max-w-2xl">
    <a href="../" class="text-blue-700 ">Home</a>
    <h1 class="text-3xl font-bold my-6 text-gray-800">Admin Panel</h1>

    <!-- Tab Navigation -->
    <div class="mb-6 border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
                on:click={() => activeTab = 'projects'}
                class="{activeTab === 'projects' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Manage Projects
            </button>
            <button
                on:click={() => activeTab = 'skills'}
                class="{activeTab === 'skills' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                Manage Skills
            </button>
        </nav>
    </div>

    {#if isLoading}
        <p class="text-center text-gray-500">Loading data...</p>
    {/if}

    <!-- Projects Section -->
    {#if activeTab === 'projects'}
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">{editingProjectId ? 'Edit Project' : 'Add New Project'}</h2>
            <form on:submit={handleSubmitProject} class="space-y-4">
                <div>
                    <label for="title-th" class="block text-sm font-medium text-gray-700 mb-1">Title (Thai)</label>
                    <input type="text" id="title-th" required bind:value={projectForm.title.th} class="w-full input-field">
                </div>
                <div>
                    <label for="title-en" class="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                    <input type="text" id="title-en" required bind:value={projectForm.title.en} class="w-full input-field">
                </div>
                <div>
                    <label for="description-th" class="block text-sm font-medium text-gray-700 mb-1">Description (Thai)</label>
                    <textarea id="description-th" rows="3" required bind:value={projectForm.description.th} class="w-full input-field"></textarea>
                </div>
                <div>
                    <label for="description-en" class="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                    <textarea id="description-en" rows="3" required bind:value={projectForm.description.en} class="w-full input-field"></textarea>
                </div>
                <div>
                    <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input type="text" id="image" bind:value={projectForm.image} required class="w-full input-field" placeholder="https://example.com/image.png">
                </div>
                <div>
                    <label for="github" class="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                    <input type="url" id="github" bind:value={projectForm.github} class="w-full input-field" placeholder="https://github.com/user/repo">
                </div>
                <div>
                    <label for="demo" class="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                    <input type="url" id="demo" bind:value={projectForm.demo} class="w-full input-field" placeholder="https://example.com/demo">
                </div>
                <div>
                    <label for="tech" class="block text-sm font-medium text-gray-700 mb-1">Technologies (comma-separated)</label>
                    <input type="text" id="tech" placeholder="e.g., Svelte, Tailwind CSS, Node.js" bind:value={techInputString} required class="w-full input-field">
                </div>
                <div class="flex space-x-2">
                    <button type="submit" class="btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Saving...' : (editingProjectId ? 'Update Project' : 'Add Project')}
                    </button>
                    {#if editingProjectId}
                        <button type="button" on:click={resetProjectForm} class="btn-secondary w-full" disabled={isLoading}>Cancel Edit</button>
                    {/if}
                </div>
            </form>
        </div>

        <h2 class="text-xl font-semibold mb-4 text-gray-700">Existing Projects</h2>
        <div class="space-y-4">
            {#each projects as project (project.id)}
                <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                    <div>
                        <h3 class="font-semibold text-gray-800">{project.title.en || project.title.th}</h3>
                        <p class="text-sm text-gray-500">{project.tech.join(', ')}</p>
                    </div>
                    <div class="space-x-2">
                        <button on:click={() => startEditProject(project)} class="btn-edit text-sm" disabled={isLoading}>Edit</button>
                        <button on:click={() => deleteProject(project.id)} class="btn-delete text-sm" disabled={isLoading}>Delete</button>
                    </div>
                </div>
            {:else}
                <p class="text-gray-500">No projects found.</p>
            {/each}
        </div>
    {/if}

    <!-- Skills Section -->
    {#if activeTab === 'skills'}
        <div class="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-700">{editingSkillId ? 'Edit Skill' : 'Add New Skill'}</h2>
            <form on:submit={handleSubmitSkill} class="space-y-4">
                <div>
                    <label for="skill-name" class="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                    <input type="text" id="skill-name" required bind:value={skillForm.name} class="w-full input-field">
                </div>
                <div>
                    <label for="skill-category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select id="skill-category" required bind:value={skillForm.category} class="w-full input-field">
                        <option value="" disabled>Select a category</option>
                        {#each skillCategories as categoryOpt}
                            <option value={categoryOpt.value}>{categoryOpt.label}</option>
                        {/each}
                    </select>
                </div>
                <div>
                    <label for="skill-icon" class="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                    <input type="url" id="skill-icon" required bind:value={skillForm.icon} class="w-full input-field" placeholder="https://example.com/icon.svg">
                </div>
                <div>
                    <label for="skill-proficiency" class="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                    <select id="skill-proficiency" required bind:value={skillForm.proficiency} class="w-full input-field">
                        <option value="" disabled>Select proficiency level</option>
                        {#each proficiencyLevels as level}
                            <option value={level.value}>{level.label.en} / {level.label.th}</option>
                        {/each}
                    </select>
                 <div class="flex space-x-2">
                    <button type="submit" class="btn-primary w-full" disabled={isLoading}>
                        {isLoading ? 'Saving...' : (editingSkillId ? 'Update Skill' : 'Add Skill')}
                    </button>
                    {#if editingSkillId}
                        <button type="button" on:click={resetSkillForm} class="btn-secondary w-full" disabled={isLoading}>Cancel Edit</button>
                    {/if}
                </div>
            </form>
        </div>

        <h2 class="text-xl font-semibold mb-4 text-gray-700">Existing Skills</h2>
        <div class="space-y-4">
            {#each skills as skill (skill.id)}
                <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                    <div class="flex items-center">
                        <img src={skill.icon} alt={skill.name} class="w-8 h-8 mr-3">
                        <div>
                            <h3 class="font-semibold text-gray-800">{skill.name}</h3>
                            <p class="text-xs text-gray-500">Category: {skill.category}</p>
                            <p class="text-sm text-gray-500">Proficiency: {skill.proficiency.en || skill.proficiency.th}</p>
                        </div>
                    </div>
                    <div class="space-x-2">
                        <button on:click={() => startEditSkill(skill)} class="btn-edit text-sm" disabled={isLoading}>Edit</button>
                        <button on:click={() => deleteSkill(skill.id)} class="btn-delete text-sm" disabled={isLoading}>Delete</button>
                    </div>
                </div>
            {:else}
                <p class="text-gray-500">No skills found.</p>
            {/each}
        </div>
    {/if}
</div>
