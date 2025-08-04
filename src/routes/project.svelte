<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

    export let uiStrings;
    let portfolioData;
    export let currentLang = 'th';

  onMount( async() => {
     const respond = await fetch('/api/project');
     const data = await respond.json();
      portfolioData = data;
      //console.log(portfolioData);
  });
</script>

<!-- Projects Section -->
  <section id="projects" class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
        {uiStrings[currentLang].projectsTitle}
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each portfolioData as project, index}
          <div 
            in:fly="{{ y: 50, duration: 600, delay: index * 200 }}"
            class="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 
                   overflow-hidden hover:-translate-y-2"
          >
            <img 
              src={project.image} 
              alt={project.title[currentLang]}
              class="w-full h-48 object-cover"
            >
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                {project.title[currentLang]}
              </h3>
              <p class="text-gray-600 mb-4 text-sm leading-relaxed">
                {project.description[currentLang]}
              </p>
              <div class="flex flex-wrap gap-2 mb-4">
                {#each project.tech as tech}
                  <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {tech}
                  </span>
                {/each}
              </div>
              <div class="flex space-x-3">
                <a 
                  href={project.github} 
                  class="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  {uiStrings[currentLang].projectGithub}
                </a>
                <a 
                  href={project.demo} 
                  class="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  {uiStrings[currentLang].projectDemo}
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>