<script>
    export let uiStrings;
    export let portfolioData;
    export let currentLang = 'th';
    
</script>

<!-- Certificates Section -->
<section id="certificates" class="py-20 bg-gray-50 dark:bg-neutral-900">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 dark:text-white">
      {uiStrings[currentLang].certificatesTitle}
    </h2>
  </div>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 gap-8">
        {#each portfolioData.certificates as certificate}
            <div class="bg-white rounded-lg shadow-lg p-6">
            <img src={certificate.link} alt={certificate.title[currentLang]} class="w-full object-cover rounded-t-lg mb-4">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{certificate.title[currentLang]}</h3>
            <p class="text-gray-600 mb-4">{certificate.description[currentLang]}</p>
            <a href={certificate.link} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">
                {uiStrings[currentLang].viewCertificate}
            </a>
            <p class="text-gray-500 text-sm mt-2">{certificate.date}</p>
            </div>
        {/each}
        </div>
</section>