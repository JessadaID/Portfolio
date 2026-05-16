<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { page } from "$app/stores";
  import { fly, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { theme } from "$lib/stores/theme.js";
  import ThemeToggle from "$lib/component/ThemeToggle.svelte";
  import { marked } from "marked";

  // Get project ID from route params
  const projectId = $page.params.id;

  let project = null;
  let loading = true;
  let error = null;
  let currentLang = "th";
  let isVisible = false;

  // UI strings for bilingual support
  const uiStrings = {
    en: {
      back: "Back to Portfolio",
      technologies: "Technologies",
      github: "GitHub",
      demo: "Live Demo",
      overview: "Overview",
      learned: "What I Learned",
      gallery: "Gallery",
      details: "Project Details",
      notFound: "Project not found.",
      loading: "Loading...",
      scrollTop: "Scroll to Top",
    },
    th: {
      back: "กลับหน้าหลัก",
      technologies: "เทคโนโลยีที่ใช้",
      github: "GitHub",
      demo: "เดโม่",
      overview: "ภาพรวม",
      learned: "สิ่งที่เรียนรู้",
      gallery: "รูปภาพ",
      details: "รายละเอียดโปรเจค",
      notFound: "ไม่พบโปรเจคนี้",
      loading: "กำลังโหลด...",
      scrollTop: "เลื่อนขึ้นบนสุด",
    },
  };

  function scrollToTop() {
    if (browser) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Render markdown safely
  function renderMarkdown(text) {
    if (!text) return "";
    return marked.parse(text);
  }

  onMount(async () => {
    theme.initTheme();
    isVisible = true;

    // Restore saved language preference
    if (browser) {
      const savedLang = localStorage.getItem("portfolioLang");
      if (savedLang && (savedLang === "en" || savedLang === "th")) {
        currentLang = savedLang;
      }
    }

    // Fetch single project data
    try {
      const res = await fetch(`/api/project/${projectId}`);
      if (!res.ok) {
        error = "Project not found";
      } else {
        project = await res.json();
      }
    } catch (e) {
      error = "Failed to load project";
    } finally {
      loading = false;
    }
  });

  function setLanguage(lang) {
    currentLang = lang;
    if (browser) {
      localStorage.setItem("portfolioLang", lang);
    }
  }
</script>

<svelte:head>
  <title
    >{project ? (project.title?.[currentLang] ?? "Project") : "Project"} - Portfolio</title
  >
  <meta
    name="description"
    content={project ? (project.description?.[currentLang] ?? "") : ""}
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<!-- Navbar -->
<nav
  class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200 dark:bg-primary dark:border-gray-700"
>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-3">
      <!-- Back button -->
      <a
        href="/"
        class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600
               dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {uiStrings[currentLang].back}
      </a>

      <!-- Right controls -->
      <div class="flex items-center gap-2">
        <!-- Language switcher -->
        <div class="flex space-x-1">
          <button
            on:click={() => setLanguage("en")}
            class:font-semibold={currentLang === "en"}
            class="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors
                   {currentLang === 'en'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300'}">EN</button
          >
          <button
            on:click={() => setLanguage("th")}
            class:font-semibold={currentLang === "th"}
            class="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors
                   {currentLang === 'th'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-300'}">TH</button
          >
        </div>

        <ThemeToggle />
      </div>
    </div>
  </div>
</nav>

<main class="pt-16 min-h-screen bg-white dark:bg-primary">
  <!-- Loading state -->
  {#if loading}
    <div class="flex items-center justify-center min-h-screen">
      <div in:fade class="text-center">
        <div
          class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-gray-500 dark:text-gray-400">
          {uiStrings[currentLang].loading}
        </p>
      </div>
    </div>

    <!-- Error state -->
  {:else if error || !project}
    <div class="flex items-center justify-center min-h-screen">
      <div in:fade class="text-center px-6">
        <p class="text-2xl text-gray-400 dark:text-gray-500 mb-6">
          {uiStrings[currentLang].notFound}
        </p>
        <a
          href="/"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium
                 hover:bg-blue-700 transition-all duration-300"
        >
          {uiStrings[currentLang].back}
        </a>
      </div>
    </div>

    <!-- Project content -->
  {:else}
    <!-- ===== HERO SECTION ===== -->
    <section
      class="py-16 md:py-24 bg-white dark:bg-primary border-b border-gray-100 dark:border-gray-800"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {#if isVisible}
          <!-- Project number + title -->
          <div in:fly={{ y: 30, duration: 700, easing: quintOut }}>
            <div class="text-blue-600 font-mono text-sm mb-3">
              Project Detail
            </div>
            <h1
              class="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              {project.title?.[currentLang] ?? ""}
            </h1>

            <!-- Short description -->
            <p
              class="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-8 max-w-3xl"
            >
              {project.description?.[currentLang] ?? ""}
            </p>

            <!-- Tech Stack -->
            <div class="flex flex-wrap gap-2 mb-8">
              {#each project.tech ?? [] as tech}
                <span
                  class="bg-white text-primary border border-primary text-sm px-3 py-1
                             hover:bg-primary hover:text-white transition-colors
                             dark:border-gray-400 dark:text-primary dark:hover:border-white dark:hover:text-white"
                >
                  {tech}
                </span>
              {/each}
            </div>

            <!-- Action buttons -->
            <div class="flex flex-wrap gap-4">
              {#if project.github}
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-6 py-3
                         bg-gray-900 text-white font-medium
                         hover:bg-primary transition-all duration-300
                         hover:shadow-lg dark:border dark:border-gray-600"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
                         0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                         -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
                         .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
                         -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004
                         1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651
                         .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856
                         0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {uiStrings[currentLang].github}
                </a>
              {/if}

              {#if project.demo}
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center px-6 py-3
                         bg-transparent text-blue-600 font-medium
                         border border-blue-600 hover:bg-blue-600 hover:text-white
                         transition-all duration-300
                         dark:border-white dark:text-white dark:hover:text-neutral-900 dark:hover:bg-white"
                >
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  {uiStrings[currentLang].demo}
                </a>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </section>

    <!-- ===== MAIN IMAGE ===== -->
    <!-- {#if project.image}
      <section class="py-12 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            in:fly={{ y: 30, duration: 700, delay: 100, easing: quintOut }}
            class="overflow-hidden shadow-xl"
          >
            <img
              src={project.image}
              alt={project.title?.[currentLang] ?? ""}
              class="w-full object-contain max-h-[520px] bg-white dark:bg-gray-800"
            />
          </div>
        </div>
      </section>
    {/if} -->

    <!-- ===== DETAIL CONTENT (Markdown) ===== -->
    {#if project.detailContent?.[currentLang]}
      <section class="py-16 bg-white dark:bg-primary">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div in:fly={{ y: 30, duration: 700, delay: 150, easing: quintOut }}>
            <div class="w-12 h-1 bg-blue-600 mb-8"></div>
            <!-- Rendered markdown -->
            <div
              class="prose prose-lg dark:prose-invert max-w-none markdown-body text-gray-900 dark:text-gray-300"
            >
              {@html renderMarkdown(project.detailContent[currentLang])}
            </div>
          </div>
        </div>
      </section>
    {:else if project.learned?.[currentLang]}
      <!-- Fallback: show learned section if no detailContent -->
      <section class="py-16 bg-white dark:bg-primary">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div in:fly={{ y: 30, duration: 700, delay: 150, easing: quintOut }}>
            <div class="w-12 h-1 bg-blue-600 mb-4"></div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {uiStrings[currentLang].learned}
            </h2>
            <p
              class="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap"
            >
              {project.learned[currentLang]}
            </p>
          </div>
        </div>
      </section>
    {/if}

    <!-- ===== IMAGE GALLERY ===== -->
    {#if project.images && project.images.length > 0}
      <section class="py-16 bg-gray-50 dark:bg-gray-900">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div in:fly={{ y: 30, duration: 700, delay: 200, easing: quintOut }}>
            <div class="w-12 h-1 bg-blue-600 mb-4"></div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-8">
              {uiStrings[currentLang].gallery}
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {#each project.images as imgUrl, i}
                <div
                  in:fly={{
                    y: 30,
                    duration: 600,
                    delay: 200 + i * 100,
                    easing: quintOut,
                  }}
                  class="overflow-hidden shadow-lg group"
                >
                  <img
                    src={imgUrl}
                    alt="Screenshot {i + 1}"
                    class="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              {/each}
            </div>
          </div>
        </div>
      </section>
    {/if}

    <!-- ===== SCROLL TO TOP BUTTON (bottom) ===== -->
    <section
      class="py-16 bg-white dark:bg-primary border-t border-gray-100 dark:border-gray-800"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <button
          on:click={scrollToTop}
          class="inline-flex items-center gap-2 px-8 py-3
                 border-2 border-blue-600 text-blue-600 font-medium bg-transparent
                 hover:bg-blue-600 hover:text-white transition-all duration-300
                 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary rounded-none"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
          {uiStrings[currentLang].scrollTop}
        </button>
      </div>
    </section>
  {/if}
</main>

<style>
  /* Markdown rendered content styles */
  :global(.markdown-body h1),
  :global(.markdown-body h2),
  :global(.markdown-body h3) {
    font-weight: 700;
    color: inherit;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    line-height: 1.3;
  }
  :global(.markdown-body h1) {
    font-size: 1.75rem;
  }
  :global(.markdown-body h2) {
    font-size: 1.4rem;
  }
  :global(.markdown-body h3) {
    font-size: 1.15rem;
  }

  :global(.markdown-body p) {
    color: inherit;
    margin-bottom: 1rem;
    line-height: 1.8;
  }

  :global(.markdown-body ul),
  :global(.markdown-body ol) {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
  :global(.markdown-body ul) {
    list-style-type: disc;
  }
  :global(.markdown-body ol) {
    list-style-type: decimal;
  }

  :global(.markdown-body li) {
    margin-bottom: 0.4rem;
    line-height: 1.7;
  }

  :global(.markdown-body code) {
    background: rgba(99, 102, 241, 0.1);
    border-radius: 4px;
    padding: 0.15em 0.4em;
    font-family: monospace;
    font-size: 0.9em;
  }

  :global(.markdown-body pre) {
    background: #1e293b;
    color: #e2e8f0;
    border-radius: 8px;
    padding: 1.25rem;
    overflow-x: auto;
    margin-bottom: 1rem;
  }

  :global(.markdown-body pre code) {
    background: none;
    padding: 0;
    color: inherit;
  }

  :global(.markdown-body blockquote) {
    border-left: 4px solid #2563eb;
    padding-left: 1rem;
    margin-left: 0;
    color: #6b7280;
    font-style: italic;
  }

  :global(.markdown-body a) {
    color: #2563eb;
    text-decoration: underline;
  }

  :global(.markdown-body img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
  }

  :global(.markdown-body hr) {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 2rem 0;
  }

  :global(.dark .markdown-body hr) {
    border-top-color: #374151;
  }

  :global(.markdown-body table) {
    width: 100%;
    margin-bottom: 1.5rem;
    border-collapse: collapse;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  :global(.markdown-body th) {
    border-bottom: 2px solid #e5e7eb;
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: inherit;
  }

  :global(.dark .markdown-body th) {
    border-bottom-color: #374151;
  }

  :global(.markdown-body td) {
    border-bottom: 1px solid #e5e7eb;
    padding: 0.75rem 1rem;
    color: inherit;
  }

  :global(.dark .markdown-body td) {
    border-bottom-color: #374151;
  }

  :global(.markdown-body tr:nth-child(even)) {
    background-color: #f9fafb;
  }

  :global(.dark .markdown-body tr:nth-child(even)) {
    background-color: rgba(255, 255, 255, 0.03);
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: "Sarabun", sans-serif;
  }
</style>
