<script>
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let uiStrings;
  export let currentLang = "th";

  let experiences = [];
  let isLoading = true;

  onMount(async () => {
    try {
      const response = await fetch("/api/experience");
      if (response.ok) {
        experiences = await response.json();
      }
    } catch (error) {
      console.error("Error loading experiences:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<!-- Experience Section -->
<section id="experience" class="py-20 dark:bg-primary">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2
      class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 dark:text-white"
    >
      {uiStrings[currentLang].experienceTitle}
    </h2>
    <div class="space-y-8">
      {#if isLoading}
        <p class="text-center text-gray-500">Loading experiences...</p>
      {:else if experiences.length > 0}
        {#each experiences as exp, index}
          <div
            in:fly={{ y: 50, duration: 600, delay: index * 200 }}
            class="p-8 flex flex-col md:flex-row gap-6 items-start"
          >
            <!-- Company Logo -->
            {#if exp.logo}
              <div
                class="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-white rounded flex items-center justify-center overflow-hidden dark:bg-primary"
              >
                <img
                  src={exp.logo}
                  alt={exp.company}
                  class="max-w-full max-h-full object-contain p-2"
                />
              </div>
            {/if}

            <div class="flex-1 w-full">
              <div
                class="flex flex-col md:flex-row md:justify-between md:items-start mb-4"
              >
                <div>
                  <h3
                    class="text-xl font-semibold text-gray-800 dark:text-gray-100"
                  >
                    {exp.position[currentLang] || ""}
                  </h3>
                  <p class="text-blue-600 font-medium mt-1">
                    {exp.company || ""}
                  </p>
                </div>
                <span
                  class="text-gray-600 dark:text-gray-400 text-sm mt-3 md:mt-0 font-medium bg-gray-100 dark:bg-secondary px-3 py-1.5 rounded-full inline-block w-max"
                >
                  {exp.period || ""}
                </span>
              </div>
              <p
                class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
              >
                {exp.description[currentLang] || ""}
              </p>
            </div>
          </div>
        {/each}
      {:else}
        <p class="text-center text-gray-500">No experiences found.</p>
      {/if}
    </div>
  </div>
</section>
