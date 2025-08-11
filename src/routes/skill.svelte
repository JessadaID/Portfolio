<script>

  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
    export  let uiStrings;
    let portfolioData;
    export let currentLang = 'th';

  onMount(async () => {
    const response = await fetch('/api/skill');
    const data = await response.json();
    portfolioData = data;
    //console.log(portfolioData);
  });

</script>
  <!-- Skills Section -->
  <section id="skills" class="py-20 bg-gray-50 dark:bg-gradient-to-b dark:from-slate-900 dark:to-gray-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 dark:text-white">
        {uiStrings[currentLang].skillsTitle}
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
        {#each portfolioData as skill, index}
          <div 
            in:fly="{{ y: 30, duration: 600, delay: index * 100 }}"
                        class="flex flex-col items-center text-center"
                      >
            <img src={skill.icon} alt={skill.name} class="w-16 h-16 mb-2">
            <h3 class="text-sm font-medium text-gray-800 dark:text-gray-100">{skill.name}</h3>
            <p class="text-xs text-gray-500 dark:text:gray-300">{skill.proficiency[currentLang]}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>