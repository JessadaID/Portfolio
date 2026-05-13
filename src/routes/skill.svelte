<script>
  import { fly, fade } from "svelte/transition";
  import { onMount } from "svelte";
  export let uiStrings;
  export let currentLang = "th";

  let portfolioData = [];
  let activeCategory = null; // null means "All" or "Marquee" view

  const categories = [
    { en: "Frontend", th: "Frontend", value: "Frontend" },
    { en: "Backend", th: "Backend", value: "Backend" },
    { en: "Database", th: "Database", value: "Database" },
    { en: "Mobile Development", th: "Mobile Development", value: "Mobile" },
    {
      en: "Programming Languages",
      th: "Programming Languages",
      value: "Programming",
    },
    { en: "Tools & Others", th: "Tools & Others", value: "Tools" },
  ];

  onMount(async () => {
    try {
      const response = await fetch("/api/skill");
      const data = await response.json();
      portfolioData = data;
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  });

  // Filter skills by category
  $: filteredSkills = activeCategory
    ? portfolioData.filter((s) => s.category === activeCategory)
    : portfolioData;

  // Split skills into rows for marquee
  function getMarqueeRows(skills, rowCount = 2) {
    if (skills.length === 0) return [];
    const rows = [];
    const itemsPerRow = Math.ceil(skills.length / rowCount);
    for (let i = 0; i < rowCount; i++) {
      rows.push(skills.slice(i * itemsPerRow, (i + 1) * itemsPerRow));
    }
    return rows;
  }

  $: marqueeRows = getMarqueeRows(portfolioData);

  function toggleCategory(catEn) {
    if (activeCategory === catEn) {
      activeCategory = null;
    } else {
      activeCategory = catEn;
    }
  }
</script>

<!-- Skills Section -->
<section id="skills" class="py-20 bg-white dark:bg-primary overflow-hidden">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2
      class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 dark:text-white"
    >
      {uiStrings[currentLang].skillsTitle}
    </h2>

    <!-- Category Tabs (Top Row) -->
    <div class="flex justify-center mb-12">
      <div
        class="flex justify-between lg:justify-center overflow-x-auto pb-2 gap-2 w-full"
      >
        {#each categories as category}
          <button
            on:click={() => toggleCategory(category.value)}
            class="px-5 py-2 cursor-pointer whitespace-nowrap transition-all duration-300 font-medium text-sm border
              {activeCategory === category.value
              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
              : 'bg-transparent text-gray-500 border-gray-200 hover:border-blue-600 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:border-blue-400'}"
          >
            {category[currentLang]}
          </button>
        {/each}
      </div>
    </div>

    <!-- Skills Display Area -->
    <div class="min-h-[300px]">
      {#if activeCategory === null}
        <!-- Marquee View (When no category is selected) -->
        <div class="flex flex-col gap-12 py-6" in:fade>
          {#each marqueeRows as row, i}
            <div class="marquee-container relative group">
              <div
                class="marquee-content flex gap-12 py-4 {i % 2 === 0
                  ? 'animate-scroll-left'
                  : 'animate-scroll-right'} group-hover:pause"
              >
                <!-- Render items twice for seamless loop -->
                {#each [...row, ...row] as skill, idx}
                  <div
                    class="flex flex-col items-center justify-center min-w-[140px] transition-transform hover:scale-110"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      class="w-16 h-16 mb-3 object-contain"
                    />
                    <span class="text-sm font-medium dark:text-gray-200"
                      >{skill.name}</span
                    >
                    <p class="text-[10px] text-gray-500 dark:text-gray-400">
                      {skill.proficiency[currentLang]}
                    </p>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <!-- Filtered Grid View -->
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center"
          in:fade
        >
          {#each filteredSkills as skill, index (skill.id || index)}
            <div
              in:fly={{ y: 20, duration: 400, delay: index * 50 }}
              class="flex flex-col items-center text-center relative group w-full transition-all duration-300"
            >
              <img
                src={skill.icon}
                alt={skill.name}
                class="w-16 h-16 mb-3 object-contain transition-transform group-hover:scale-110"
              />
              <h3 class="text-sm font-medium text-gray-800 dark:text-gray-100">
                {skill.name}
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {skill.proficiency[currentLang]}
              </p>

              <!-- Tooltip overlay -->
              {#if skill.tooltip && skill.tooltip[currentLang]}
                <div
                  class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 bg-gray-900 text-white text-[11px] rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-xl border border-gray-700"
                >
                  {skill.tooltip[currentLang]}
                  <div
                    class="absolute top-full left-1/2 transform -translate-x-1/2 border-[6px] border-transparent border-t-gray-900"
                  ></div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .marquee-container {
    mask-image: linear-gradient(
      to right,
      transparent,
      black 15%,
      black 85%,
      transparent
    );
    -webkit-mask-image: linear-gradient(
      to right,
      transparent,
      black 15%,
      black 85%,
      transparent
    );
  }

  .marquee-content {
    display: flex;
    width: max-content;
  }

  .animate-scroll-left {
    animation: scroll-left 50s linear infinite;
  }

  .animate-scroll-right {
    animation: scroll-right 50s linear infinite;
  }

  .pause {
    animation-play-state: paused;
  }

  @keyframes scroll-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  @keyframes scroll-right {
    0% {
      transform: translateX(-50%);
    }
    100% {
      transform: translateX(0);
    }
  }

  /* Custom Scrollbar for mobile tabs (if needed) */
  .overflow-x-auto::-webkit-scrollbar {
    height: 4px;
  }
  .overflow-x-auto::-webkit-scrollbar-thumb {
    background: #2563eb;
    border-radius: 2px;
  }
</style>
