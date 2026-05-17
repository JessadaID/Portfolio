<script>
  import { onMount } from "svelte";
  import { fade, fly, scale, slide } from "svelte/transition";
  import { browser } from "$app/environment";
  import { theme } from "$lib/stores/theme.js";

  // Portfolio Static Data
  let portfolioData = {
    profile: {
      name: { en: "Jessada Boonta", th: "เจษฎา บุญทา" },
      title: { en: "Full Stack Web Developer", th: "นักพัฒนาเว็บ Full Stack" },
      bio: {
        en: "Hello, I am a recent Computer Engineering graduate with a passion for Full-Stack Development. I enjoy building applications from the ground up, covering both Front-End and Back-End. I am well-versed in Agile methodologies and value flexibility in the workplace. I have a growth mindset, always eager to learn new technologies and committed to delivering high-quality results.",
        th: "สวัสดีครับ ผมเป็นนักศึกษาจบใหม่สาขาวิศวกรรมคอมพิวเตอร์ ผมรักในการพัฒนาเว็บไซต์และแอปพลิเคชันแบบ Full-Stack Development ผมชอบพัฒนาแอปพลิเคชันตั้งแต่ Front-End จน Back-End และคุ้นเคยการทำงานแบบ Agile ที่เน้นความยืดหยุ่น ผมชอบเรียนรู้เทคโนโลยีใหม่ๆ และพร้อมพัฒนาตัวเองเพื่อให้งานออกมาดีเสมอครับ",
      },
      image: "https://avatars.githubusercontent.com/u/113906747?v=4",
      location: { en: "Chiang Rai, Thailand", th: "จ.เชียงราย, ประเทศไทย" },
      email: "jessada.bo46@gmail.com",
      github: "https://github.com/JessadaID",
      linkedin: "https://www.linkedin.com/in/jessada-boonta-40587a378/",
    },
    education: [
      {
        period: { en: "2022 - Present", th: "2565 - ปัจจุบัน" },
        degree: { en: "Computer Engineering", th: "วิศวกรรมคอมพิวเตอร์" },
        school: {
          en: "Rajamangala University of Technology Lanna Chiang Mai",
          th: "มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา เชียงใหม่",
        },
        gpa: { en: "3.87", th: "3.87" },
      },
      {
        period: { en: "2020 - 2022", th: "2563 - 2565" },
        degree: {
          en: "Information and Communication Technology",
          th: "เทคโนโลยีสารสนเทศและการสื่อสาร",
        },
        school: {
          en: "Chiang Rai Vocational College",
          th: "วิทยาลัยอาชีวศึกษาเชียงราย",
        },
        gpa: { en: "3.96", th: "3.96" },
      },
    ],
    certificates: [
      {
        title: { en: "AWS Lambda Foundation", th: "AWS Lambda Foundation" },
        issuer: "AWS",
        date: "08/05/2026",
        link: "/AWS_Lamda.jpg",
        description: {
          en: "Training course on how to use AWS Lambda to build and deploy serverless applications.",
          th: "หลักสูตรอบรมการใช้ AWS Lambda ในการสร้างและปรับใช้แอปพลิเคชันแบบไร้เซิร์ฟเวอร์",
        },
      },
      {
        title: {
          en: "Creating web applications with HTML, CSS, JavaScript",
          th: "การสร้างเว็บแอพพลิเคชัน ด้วย HTML, CSS, JavaScript",
        },
        issuer: "Udemy",
        date: "05/08/2025",
        link: "/cer-html-css-js.jpg",
        description: {
          en: "A course that trains you to use HTML, CSS, and JavaScript to create full-stack web applications. (20 projects)",
          th: "หลักสูตรที่ฝึกการใช้งาน HTML, CSS, JavaScript ในการสร้างแอพพลิเคชันเว็บแบบ Full Stack (20 โปรเจกต์)",
        },
      },
      {
        title: {
          en: "Training on the use of Generative AI for research and development",
          th: "อบรมการใช้ Generative AI เพื่อการวิจัยและพัฒนา",
        },
        issuer: "",
        date: "05/07/2025",
        link: "/Cer_CPE_AI.jpg",
        description: {
          en: "A comprehensive training course on the use of AI to assist in research and development and the use of AI to its maximum benefit.",
          th: "หลักสูตรอบรมการใช้ AI ช่วยในการวิจัยและพัฒนาอย่างครอบคลุม และการใช้งาน AI ให้เกิดประโยชน์สูงสุด",
        },
      },
      {
        title: {
          en: "IC3 Digital Literacy GS6 (Level 1)",
          th: "IC3 Digital Literacy GS6 (Level 1)",
        },
        issuer: "Certiport",
        date: "07/08/2024",
        link: "/Cert_ic3.jpg",
        description: {
          en: "Certified in IC3 Digital Literacy GS6 Level 1, demonstrating proficiency in key digital competencies including content creation, information management, online safety, and effective digital collaboration based on international standards.",
          th: "ใบรับรองมาตรฐานสากลด้านทักษะดิจิทัล (IC3 GS6) ครอบคลุมความรู้พื้นฐานด้านเทคโนโลยี, การสร้างสรรค์เนื้อหาดิจิทัล, การสื่อสารออนไลน์อย่างปลอดภัย และการบริหารจัดการข้อมูลอย่างเป็นระบบตามมาตรฐาน Digital Literacy ระดับโลก",
        },
      },
    ],
  };

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

  let currentLang = "th";
  let skillsData = [];
  let experienceData = [];
  let projectData = [];

  // Presentation State
  let slides = [];
  let currentSlideIndex = 0;
  let isReady = false;

  onMount(async () => {
    theme.initTheme();
    if (browser) {
      const savedLang = localStorage.getItem("portfolioLang");
      if (savedLang && (savedLang === "en" || savedLang === "th")) {
        currentLang = savedLang;
      }
    }

    // Fetch API Data
    try {
      const [skillsRes, expRes, projRes] = await Promise.all([
        fetch("/api/skill"),
        fetch("/api/experience"),
        fetch("/api/project"),
      ]);

      skillsData = await skillsRes.json();
      experienceData = await expRes.json();
      const allProjects = await projRes.json();

      // Sort and take top 3 projects
      const featured = allProjects.filter((p) => p.featured);
      const nonFeatured = allProjects.filter((p) => !p.featured);
      projectData = [...featured, ...nonFeatured].slice(0, 3);

      generateSlides();
      isReady = true;
    } catch (err) {
      console.error("Error loading presentation data", err);
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  function generateSlides() {
    let newSlides = [];

    // 1. Cover
    newSlides.push({ type: "cover" });

    // 2. About
    newSlides.push({ type: "about" });

    // 3. Education
    newSlides.push({ type: "education" });

    // 4. Skills (1 slide per category)
    categories.forEach((cat) => {
      const catSkills = skillsData.filter((s) => s.category === cat.value);
      if (catSkills.length > 0) {
        newSlides.push({ type: "skill", category: cat, skills: catSkills });
      }
    });

    // 5. Experience (1 slide per company)
    experienceData.forEach((exp) => {
      newSlides.push({ type: "experience", data: exp });
    });

    // 6. Projects (1 slide per project, max 3)
    projectData.forEach((proj) => {
      newSlides.push({ type: "project", data: proj });
    });

    // 7. Certificates (2 per slide)
    for (let i = 0; i < portfolioData.certificates.length; i += 2) {
      newSlides.push({
        type: "certificate",
        data: portfolioData.certificates.slice(i, i + 2),
      });
    }

    // 8. Contact
    newSlides.push({ type: "contact" });

    // 9. Thank you
    newSlides.push({ type: "thankyou" });

    slides = newSlides;
  }

  // Navigation
  function nextSlide() {
    if (currentSlideIndex < slides.length - 1) currentSlideIndex++;
  }
  function prevSlide() {
    if (currentSlideIndex > 0) currentSlideIndex--;
  }
  function goToSlide(index) {
    if (index >= 0 && index < slides.length) currentSlideIndex = index;
  }

  function handleKeydown(e) {
    if (e.key === "ArrowRight" || e.key === "Space" || e.key === "ArrowDown") {
      e.preventDefault();
      nextSlide();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      prevSlide();
    }
    if (e.key === "Escape") {
      window.close(); // might work if opened in new tab, or just fallback
      window.location.href = "/";
    }
  }

  // Swipe gesture support
  let touchstartX = 0;
  let touchendX = 0;
  function handleTouchStart(e) {
    touchstartX = e.changedTouches[0].screenX;
  }
  function handleTouchEnd(e) {
    touchendX = e.changedTouches[0].screenX;
    if (touchendX < touchstartX - 50) nextSlide();
    if (touchendX > touchstartX + 50) prevSlide();
  }

  $: progress =
    slides.length > 1 ? (currentSlideIndex / (slides.length - 1)) * 100 : 0;
  $: currentSlide = slides[currentSlideIndex];
</script>

<svelte:head>
  <title>Presentation - {portfolioData.profile.name[currentLang]}</title>
</svelte:head>

<!-- Body Wrapper -->
<div
  class="h-screen w-screen overflow-hidden bg-white dark:bg-primary flex flex-col relative text-gray-800 dark:text-white select-none"
  on:touchstart={handleTouchStart}
  on:touchend={handleTouchEnd}
>
  {#if !isReady}
    <div class="flex-1 flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"
      ></div>
    </div>
  {:else}
    <!-- Progress Bar -->
    <div
      class="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50"
    >
      <div
        class="h-full bg-gray-900 dark:bg-gray-100 transition-all duration-300 ease-out"
        style="width: {progress}%"
      ></div>
    </div>

    <!-- Header Controls -->
    <div class="absolute top-4 right-4 z-50 flex gap-2">
      <button
        on:click={() => theme.toggleTheme()}
        class="px-3 py-1 bg-white/80 dark:bg-black/50 backdrop-blur shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center text-gray-900 dark:text-white"
        aria-label="Toggle Theme"
      >
        {#if $theme === 'dark'}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        {/if}
      </button>
      <button
        on:click={() => (currentLang = currentLang === "en" ? "th" : "en")}
        class="px-3 py-1 bg-white/80 dark:bg-black/50 backdrop-blur shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white"
      >
        {currentLang.toUpperCase()}
      </button>
      <a
        href="/"
        class="px-3 py-1 bg-white/80 dark:bg-black/50 backdrop-blur shadow hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-900 dark:text-white"
      >
        {currentLang === "th" ? "ออก (ESC)" : "Exit (ESC)"}
      </a>
    </div>

    <!-- Slide Content -->
    <div
      class="flex-1 relative w-full h-full flex items-center justify-center p-8 md:p-16"
    >
      {#key currentSlideIndex}
        <div
          in:fly={{ x: 50, duration: 400, delay: 100 }}
          out:fly={{ x: -50, duration: 400 }}
          class="absolute inset-0 flex items-center justify-center p-6 md:p-12 w-full h-full max-w-6xl mx-auto"
        >
          <!-- TYPE: COVER -->
          {#if currentSlide.type === "cover"}
            <div class="text-center flex flex-col items-center">
              <img
                src={portfolioData.profile.image}
                alt="Profile"
                class="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl border-4 border-gray-900 dark:border-gray-100 mb-8"
              />
              <h1 class="text-4xl md:text-6xl font-bold mb-4">
                {portfolioData.profile.name[currentLang]}
              </h1>
              <h2
                class="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-medium mb-6"
              >
                {portfolioData.profile.title[currentLang]}
              </h2>
              <p
                class="text-gray-500 dark:text-gray-400 text-lg flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path></svg
                >
                {portfolioData.profile.location[currentLang]}
              </p>
            </div>

            <!-- TYPE: ABOUT -->
          {:else if currentSlide.type === "about"}
            <div class="w-full flex flex-col h-full justify-center">
              <h2
                class="text-3xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white border-b-4 border-gray-900 dark:border-white pb-2 inline-block self-start"
              >
                {currentLang === "th" ? "เกี่ยวกับฉัน" : "About Me"}
              </h2>
              <div class="grid md:grid-cols-2 gap-12 items-center">
                <p
                  class="text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-200"
                >
                  {portfolioData.profile.bio[currentLang]}
                </p>
                <div class="space-y-6">
                  <div
                    class="bg-gray-50 dark:bg-primary border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white p-6 shadow-sm transition-colors"
                  >
                    <h3
                      class="text-xl font-bold mb-2 text-gray-800 dark:text-white"
                    >
                      {currentLang === "th" ? "ประสบการณ์" : "Experience"}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-200 text-lg">
                      3+ {currentLang === "th"
                        ? "ปีในการพัฒนาเว็บ"
                        : "Years in Web Development"}
                    </p>
                  </div>
                  <div
                    class="bg-gray-50 dark:bg-primary border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white p-6 shadow-sm transition-colors"
                  >
                    <h3
                      class="text-xl font-bold mb-2 text-gray-800 dark:text-white"
                    >
                      {currentLang === "th" ? "โปรเจกต์" : "Projects"}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-200 text-lg">
                      5+ {currentLang === "th"
                        ? "โปรเจกต์ที่เสร็จสมบูรณ์"
                        : "Completed Projects"}
                    </p>
                  </div>
                  <div
                    class="bg-gray-50 dark:bg-primary border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white p-6 shadow-sm transition-colors"
                  >
                    <h3
                      class="text-xl font-bold mb-2 text-gray-800 dark:text-white"
                    >
                      {currentLang === "th" ? "ความชื่นชอบ" : "Focus"}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-200 text-lg">
                      {currentLang === "th"
                        ? "เทคโนโลยีเว็บสมัยใหม่"
                        : "Modern Web Technologies"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- TYPE: EDUCATION -->
          {:else if currentSlide.type === "education"}
            <div class="w-full flex flex-col h-full justify-center">
              <h2
                class="text-3xl md:text-5xl font-bold mb-12 text-gray-900 dark:text-white border-b-4 border-gray-900 dark:border-white pb-2 inline-block self-start"
              >
                {currentLang === "th" ? "ประวัติการศึกษา" : "Education"}
              </h2>
              <div
                class="space-y-8 pl-4 border-l-4 border-gray-200 dark:border-gray-700 ml-4 md:ml-12"
              >
                {#each portfolioData.education as edu}
                  <div
                    class="relative bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 hover:border-gray-900 dark:hover:border-white p-8 shadow-sm hover:shadow-md transition-shadow w-full max-w-4xl"
                  >
                    <h3
                      class="text-2xl font-bold mb-2 text-gray-900 dark:text-white"
                    >
                      {edu.degree[currentLang]}
                    </h3>
                    <span
                      class="text-gray-800 dark:text-gray-200 font-bold tracking-wider mb-2 block"
                      >{edu.period[currentLang]}</span
                    >
                    <p class="text-xl text-gray-600 dark:text-gray-300 mb-2">
                      {edu.school[currentLang]}
                    </p>
                    <p
                      class="text-lg font-medium text-gray-500 dark:text-gray-400"
                    >
                      GPA: {edu.gpa[currentLang]}
                    </p>
                  </div>
                {/each}
              </div>
            </div>

            <!-- TYPE: SKILL -->
          {:else if currentSlide.type === "skill"}
            <div class="w-full flex flex-col h-full justify-center">
              <h2
                class="text-3xl md:text-5xl font-bold mb-12 text-gray-900 dark:text-white border-b-4 border-gray-900 dark:border-white pb-2 inline-block self-start"
              >
                {currentLang === "th" ? "ทักษะ" : "Skills"} - {currentSlide
                  .category[currentLang]}
              </h2>
              <div
                class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 justify-items-center"
              >
                {#each currentSlide.skills as skill}
                  <div
                    class="flex flex-col items-center justify-center p-6 bg-transparent hover:scale-110 transition-transform w-full h-full max-w-[200px] group"
                  >
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      class="w-20 h-20 md:w-24 md:h-24 mb-4 object-contain transition-transform group-hover:scale-110"
                    />
                    <h3
                      class="text-xl font-semibold text-center text-gray-800 dark:text-gray-100"
                    >
                      {skill.name}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {skill.proficiency[currentLang]}
                    </p>
                  </div>
                {/each}
              </div>
            </div>

            <!-- TYPE: EXPERIENCE -->
          {:else if currentSlide.type === "experience"}
            <div class="w-full flex flex-col h-full justify-center">
              <h2
                class="text-3xl md:text-5xl font-bold mb-12 text-gray-900 dark:text-white border-b-4 border-gray-900 dark:border-white pb-2 inline-block self-start"
              >
                {currentLang === "th" ? "ประสบการณ์ทำงาน" : "Experience"}
              </h2>
              <div
                class="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start bg-transparent"
              >
                {#if currentSlide.data.logo}
                  <div
                    class="w-32 h-32 md:w-48 md:h-48 shrink-0 bg-white flex items-center justify-center overflow-hidden dark:bg-primary shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={currentSlide.data.logo}
                      alt={currentSlide.data.company}
                      class="max-w-full max-h-full object-contain p-4"
                    />
                  </div>
                {/if}
                <div class="flex-1">
                  <div
                    class="flex flex-col md:flex-row justify-between items-start mb-6"
                  >
                    <div>
                      <h3
                        class="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100"
                      >
                        {currentSlide.data.position[currentLang] || ""}
                      </h3>
                      <p
                        class="text-2xl text-gray-700 dark:text-gray-300 font-medium"
                      >
                        {currentSlide.data.company || ""}
                      </p>
                    </div>
                    <span
                      class="mt-4 md:mt-0 px-4 py-2 bg-gray-100 dark:bg-secondary text-gray-600 dark:text-gray-400 rounded-full font-medium"
                    >
                      {currentSlide.data.period || ""}
                    </span>
                  </div>
                  <p
                    class="text-xl leading-relaxed text-gray-600 dark:text-gray-300 whitespace-pre-wrap"
                  >
                    {currentSlide.data.description[currentLang] || ""}
                  </p>
                </div>
              </div>
            </div>

            <!-- TYPE: PROJECT -->
          {:else if currentSlide.type === "project"}
            <div class="w-full flex flex-col h-full justify-center">
              <h2
                class="text-3xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white border-b-4 border-gray-900 dark:border-white pb-2 inline-block self-start"
              >
                {currentLang === "th" ? "โปรเจกต์" : "Project"}
              </h2>
              <div
                class="flex flex-col lg:flex-row gap-8 lg:gap-12 h-[60vh] items-center bg-transparent"
              >
                <div
                  class="w-full lg:w-1/2 h-full flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={currentSlide.data.image}
                    alt={currentSlide.data.title[currentLang]}
                    class="max-w-full max-h-full object-contain border border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div class="w-full lg:w-1/2 flex flex-col justify-center">
                  <h3
                    class="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
                  >
                    {currentSlide.data.title[currentLang]}
                  </h3>
                  <p
                    class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                  >
                    {currentSlide.data.description[currentLang]}
                  </p>
                  <div class="mb-8">
                    <h4
                      class="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wider dark:text-white"
                    >
                      Tech Stack
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      {#each currentSlide.data.tech as tech}
                        <span
                          class="bg-white text-primary border-1 border-primary text-sm px-3 py-1 hover:bg-primary hover:text-white transition-colors dark:hover:border-white"
                        >
                          {tech}
                        </span>
                      {/each}
                    </div>
                  </div>
                  <div class="flex gap-4">
                    <a
                      href={currentSlide.data.github}
                      target="_blank"
                      class="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all duration-300 shadow-sm border border-gray-900 dark:border-white gap-2"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        ><path
                          fill-rule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clip-rule="evenodd"
                        /></svg
                      >
                      GitHub
                    </a>
                    {#if currentSlide.data.demo}
                      <a
                        href={currentSlide.data.demo}
                        target="_blank"
                        class="inline-flex items-center justify-center px-6 py-3 bg-transparent text-gray-900 font-medium border border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 dark:border-white dark:text-white dark:hover:text-black dark:hover:bg-white gap-2"
                      >
                        <svg
                          class="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          /></svg
                        >
                        Live Demo
                      </a>
                    {/if}
                    <a
                      href={`/projects/${currentSlide.data.id}`}
                      target="_blank"
                      class="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-900 font-medium border border-gray-200 hover:bg-gray-200 transition-all duration-300 dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 gap-2"
                    >
                      {currentLang === "th" ? "อ่านเพิ่มเติม" : "Read More"}
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- TYPE: CERTIFICATE -->
          {:else if currentSlide.type === "certificate"}
            <div class="w-full flex flex-col h-full justify-center">
              <h2
                class="text-3xl md:text-5xl font-bold mb-12 text-gray-900 dark:text-white border-b-4 border-gray-900 dark:border-white pb-2 inline-block self-start"
              >
                {currentLang === "th" ? "ใบรับรอง" : "Certificates"}
              </h2>
              <div class="grid md:grid-cols-2 gap-6 md:gap-8 max-h-[65vh] overflow-y-auto pb-4 pr-2 custom-scrollbar">
                {#each currentSlide.data as cert}
                  <div
                    class="bg-white dark:bg-primary border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col"
                  >
                    <div
                      class="h-32 md:h-48 overflow-hidden bg-gray-50 dark:bg-neutral-900 flex items-center justify-center p-4 shrink-0"
                    >
                      <img
                        src={cert.link}
                        alt={cert.title[currentLang]}
                        class="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div class="p-6 flex-1 flex flex-col">
                      <h3
                        class="text-xl md:text-2xl font-semibold mb-2 text-gray-800 dark:text-white"
                      >
                        {cert.title[currentLang]}
                      </h3>
                      <p class="text-gray-500 mb-4 text-sm">
                        {cert.issuer} &bull; {cert.date}
                      </p>
                      <p
                        class="text-gray-700 dark:text-gray-300 flex-1 line-clamp-4 leading-relaxed"
                      >
                        {cert.description[currentLang]}
                      </p>
                    </div>
                  </div>
                {/each}
              </div>
            </div>

            <!-- TYPE: CONTACT -->
          {:else if currentSlide.type === "contact"}
            <div
              class="w-full flex flex-col h-full justify-center items-center text-center"
            >
              <h2
                class="text-4xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white"
              >
                {currentLang === "th" ? "ติดต่อฉัน" : "Get In Touch"}
              </h2>
              <p
                class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mb-12"
              >
                {currentLang === "th"
                  ? "ฉันสนใจโอกาสใหม่ๆ และโปรเจกต์ที่น่าตื่นเต้นอยู่เสมอ มาพูดคุยกันว่าเราจะทำให้ไอเดียของคุณเป็นจริงได้อย่างไร"
                  : "I'm always interested in new opportunities and exciting projects. Let's discuss how we can bring your ideas to life."}
              </p>

              <div class="flex flex-col sm:flex-row gap-6">
                <a
                  href="mailto:{portfolioData.profile.email}"
                  class="px-8 py-4 bg-gray-900 text-white font-bold text-lg hover:bg-gray-800 transition-all shadow-sm border border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white dark:hover:bg-gray-200 flex items-center justify-center gap-3"
                >
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    ><path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path></svg
                  >
                  {currentLang === "th" ? "ส่งอีเมล" : "Send Email"}
                </a>
                <a
                  href={portfolioData.profile.github}
                  target="_blank"
                  class="px-8 py-4 border border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all flex items-center justify-center gap-3"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                    ><path
                      fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"
                    ></path></svg
                  >
                  GitHub
                </a>
                <a
                  href={portfolioData.profile.linkedin}
                  target="_blank"
                  class="px-8 py-4 border border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all flex items-center justify-center gap-3"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"
                    ><path
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    /></svg
                  >
                  LinkedIn
                </a>
              </div>
            </div>

            <!-- TYPE: THANKYOU -->
          {:else if currentSlide.type === "thankyou"}
            <div class="text-center flex flex-col items-center">
              <h1
                class="text-6xl md:text-8xl font-bold mb-6 text-gray-900 dark:text-white"
              >
                {currentLang === "th" ? "ขอบคุณครับ" : "Thank You"}
              </h1>
              <p class="text-2xl text-gray-500 dark:text-gray-400 mb-12">
                {currentLang === "th"
                  ? "ที่รับชม Presentation ของผม"
                  : "For watching my presentation"}
              </p>
              <a
                href="/"
                class="px-8 py-4 border border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold text-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  ><path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  ></path></svg
                >
                {currentLang === "th" ? "กลับหน้าหลัก" : "Back to Portfolio"}
              </a>
            </div>
          {/if}
        </div>
      {/key}
    </div>

    <!-- Navigation Controls -->
    <div
      class="absolute bottom-8 left-0 w-full px-8 flex justify-between items-center z-50"
    >
      <!-- Slide Indicator Dots -->
      <div class="flex gap-2 mx-auto">
        {#each slides as _, i}
          <button
            on:click={() => goToSlide(i)}
            class="w-2 h-2 md:w-3 md:h-3 transition-all duration-300 {i ===
            currentSlideIndex
              ? 'bg-gray-900 dark:bg-white w-6 md:w-8'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-500'}"
            aria-label="Go to slide {i + 1}"
          ></button>
        {/each}
      </div>
    </div>

    <!-- Arrow Buttons (Desktop overlay) -->
    <button
      aria-label="Previous slide"
      on:click={prevSlide}
      class="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/50 text-gray-800 dark:text-white backdrop-blur shadow opacity-0 hover:opacity-100 transition-opacity hidden md:block z-50"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        ></path></svg
      >
    </button>
    <button
      aria-label="Next slide"
      on:click={nextSlide}
      class="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/50 text-gray-800 dark:text-white backdrop-blur shadow opacity-0 hover:opacity-100 transition-opacity hidden md:block z-50"
    >
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        ></path></svg
      >
    </button>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    overflow: hidden; /* Prevent scrolling when in presentation mode */
    font-family: "Sarabun", sans-serif;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
  }
  :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
</style>
