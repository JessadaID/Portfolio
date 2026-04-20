<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  export let uiStrings;
  let portfolioData;
  export let currentLang = "th";

  onMount(async () => {
    const response = await fetch("/api/skill");
    const data = await response.json();
    portfolioData = data;
    //console.log(portfolioData);
  });
</script>

<!-- Skills Section -->
<section id="skills" class="py-20 bg-white dark:bg-primary">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2
      class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 dark:text-white"
    >
      {uiStrings[currentLang].skillsTitle}
    </h2>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center"
    >
      {#each portfolioData as skill, index}
        <div
          in:fly={{ y: 30, duration: 600, delay: index * 100 }}
          class="flex flex-col items-center text-center relative group"
        >
          <img src={skill.icon} alt={skill.name} class="w-16 h-16 mb-2" />
          <h3 class="text-sm font-medium text-gray-800 dark:text-gray-100">
            {skill.name}
          </h3>
          <p class="text-xs text-gray-500 dark:text:gray-300">
            {skill.proficiency[currentLang]}
          </p>

          <!-- Tooltip overlay -->
          {#if skill.tooltip && skill.tooltip[currentLang]}
            <div
              class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-[200px] bg-gray-800 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 break-words whitespace-pre-wrap"
            >
              {skill.tooltip[currentLang]}
              <!-- Tooltip Arrow -->
              <div
                class="absolute top-full left-1/2 transform -translate-x-1/2 border-[5px] border-transparent border-t-gray-800"
              ></div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
