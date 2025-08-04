<script>
    export let uiStrings;
    export let portfolioData;
    export let currentLang = 'th';
</script>

<!-- Contact Section -->
  <section id="contact" class="py-20 bg-blue-600">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-3xl md:text-4xl font-bold text-white mb-8">
        {uiStrings[currentLang].contactTitle}
      </h2>
      <p class="text-blue-100 mb-12 text-lg max-w-2xl mx-auto">
        {uiStrings[currentLang].contactIntro}
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="mailto:{portfolioData.profile.email}"
          class="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium 
                 hover:bg-gray-100 transition-colors inline-block"
        >
          {uiStrings[currentLang].contactSendEmail}
        </a>
        <a 
          href={portfolioData.profile.github}
          class="border border-white text-white px-8 py-3 rounded-lg font-medium 
                 hover:bg-white hover:text-blue-600 transition-colors inline-block"
                 target="_blank"
        >
          {uiStrings[currentLang].contactViewGithub}
        </a>
        <a 
          href={portfolioData.profile.linkedin}
          class="border border-white text-white px-8 py-3 rounded-lg font-medium 
                 hover:bg-white hover:text-blue-600 transition-colors inline-block"
                 target="_blank"
        >
          {uiStrings[currentLang].contactLinkedIn}
        </a>
      </div>
    </div>
  </section>