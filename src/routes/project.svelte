<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let uiStrings;
  let portfolioData;
  export let currentLang = "th";

  onMount(async () => {
    const respond = await fetch("/api/project");
    const data = await respond.json();
    portfolioData = data;
    //console.log(portfolioData);
  });
</script>
<!-- Projects Section -->
<section id="projects" class="py-16 dark:bg-gradient-to-b dark:from-gray-900 dark:to-neutral-900">
  <div class="container mx-auto px-6">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-white">{uiStrings[currentLang].projectsTitle}</h2>
      <div class="w-20 h-1 bg-blue-600 mx-auto"></div>
    </div>

    <!-- Projects Grid -->
    <div class="max-w-6xl mx-auto space-y-16">
      {#each portfolioData as project, index}
        <div
          in:fly={{ y: 50, duration: 600, delay: index * 200 }}
          class="group"
        >
          <div
            class="bg-transperent"
          >
            <div
              class="flex flex-col lg:flex-row items-stretch min-h-[400px]"
              class:lg:flex-row-reverse={index % 2 === 1}
            >
              <!-- Image Container -->
              <div class="lg:w-1/2 relative overflow-hidden flex items-center justify-center">
                <img
                  src={project.image}
                  alt={project.title[currentLang]}
                  class="max-w-full max-h-full object-contain transition-transform duration-500
                         group-hover:scale-105 px-6"
                />
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden"></div>
              </div>

              <!-- Content Container -->
              <div class="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <!-- Project Number -->
                <div class="text-blue-600 font-mono text-sm mb-3">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <!-- Title -->
                <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight dark:text-white">
                  {project.title[currentLang]}
                </h3>

                <!-- Description -->
                <p class="text-gray-600 mb-6 text-base lg:text-lg leading-relaxed dark:text-gray-300">
                  {project.description[currentLang]}
                </p>

                <!-- Tech Stack -->
                <div class="mb-8">
                  <h4 class="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider dark:text-white">
                    Technologies
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    {#each project.tech as tech}
                      <span
                        class="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 
                               text-sm px-3 py-1 rounded-full border border-blue-200
                               hover:border-blue-300 transition-colors"
                      >
                        {tech}
                      </span>
                    {/each}
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-4">
                  <a
                    href={project.github}
                    class="inline-flex items-center justify-center px-4 py-2 
                           bg-gray-900 text-white font-medium rounded-lg
                           hover:bg-gray-800 transition-all duration-300
                           hover:shadow-lg group/btn dark:border-2 "
                           target="_blank"
                  >
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="group-hover/btn:translate-x-0.5 transition-transform">
                      {uiStrings[currentLang].projectGithub}
                    </span>
                  </a>

                  {#if project.demo}
                    <a
                      href={project.demo}
                      class="inline-flex items-center justify-center px-4 py-2 
                             bg-transparent text-blue-600 font-medium rounded-lg
                             border-2 border-blue-600 hover:bg-blue-600 hover:text-white
                             transition-all duration-300 group/btn dark:border-white dark:text-white dark:hover:text-neutral-900 dark:hover:bg-white"
                             target="_blank"
                    >
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span class="group-hover/btn:translate-x-0.5 transition-transform">
                        {uiStrings[currentLang].projectDemo}
                      </span>
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>