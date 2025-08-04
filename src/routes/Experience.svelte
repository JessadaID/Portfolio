<script>
    export let uiStrings;
    export let portfolioData;
    export let currentLang = 'th';
    
</script>

<!-- Experience Section -->
 {#if portfolioData.experience && portfolioData.experience.length > 0}
 
  <section id="experience" class="py-20 bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">
        {uiStrings[currentLang].experienceTitle}
      </h2>
      <div class="space-y-8">
        {#each portfolioData.experience as exp, index}
          <div 
            in:fly="{{ x: -50, duration: 600, delay: index * 200 }}"
            class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div>
                <h3 class="text-xl font-semibold text-gray-800">
                  {exp.position[currentLang]}
                </h3>
                <p class="text-blue-600 font-medium">{exp.company}</p>
              </div>
              <span class="text-gray-500 text-sm mt-2 md:mt-0">
                {exp.period}
              </span>
            </div>
            <p class="text-gray-600 leading-relaxed">
              {exp.description[currentLang]}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  {/if}