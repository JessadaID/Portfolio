<script>
    
    export let uiStrings;
    export let portfolioData;
    export let currentLang = 'th';
</script>


  <!-- About Section -->
  <section id="about" class="py-20 bg-white dark:bg-gradient-to-t dark:from-slate-900 dark:to-neutral-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 dark:text-white">
        {uiStrings[currentLang].aboutMeTitle}
      </h2>
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 class="text-2xl font-semibold text-gray-800 mb-4 dark:text-white">
            {portfolioData.profile.title[currentLang]}
          </h3>
          <p class="text-gray-600 leading-relaxed mb-6 dark:text-gray-200">
            {portfolioData.profile.bio[currentLang]}
          </p>
          <div class="space-y-2">
            <p class="text-gray-600 dark:text-gray-200">
              <span class="font-medium">{currentLang === 'en' ? 'Location' : 'ที่ตั้ง'}:</span> {portfolioData.profile.location[currentLang]}
            </p>
            <p class="text-gray-600 dark:text-gray-200">
              <span class="font-medium">{currentLang === 'en' ? 'Email' : 'อีเมล'}:</span> {portfolioData.profile.email}
            </p>
          </div>
        </div>
        <div class="space-y-6">
          <div class="bg-gray-50 p-6 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-2">{uiStrings[currentLang].aboutExperience}</h4>
            <p class="text-gray-600">{uiStrings[currentLang].aboutYears}</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-2">{uiStrings[currentLang].aboutProjects}</h4>
            <p class="text-gray-600">{uiStrings[currentLang].aboutCompletedProjects}</p>
          </div>
          <div class="bg-gray-50 p-6 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-2">{uiStrings[currentLang].aboutFocus}</h4>
            <p class="text-gray-600">{uiStrings[currentLang].aboutFocusText}</p>
          </div>
        </div>
      </div>
    </div>
  </section>