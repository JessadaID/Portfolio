<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { fade, fly, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import Skill from "./skill.svelte";
  import Project from "./project.svelte";
  import Experience from "./Experience.svelte";
  import Contract from "./Contact.svelte";
  import About from "./About.svelte";
  import Education from "./Education.svelte";
  import Certificates from "./Certificates.svelte";
  import ThemeToggle from "$lib/component/ThemeToggle.svelte";
  import { theme } from "$lib/stores/theme.js";
  import ChatWithAi from "$lib/component/ChatWithAi.svelte";
  // Portfolio data - ในอนาคตจะโหลดจาก JSON file

  let portfolioData = {
    profile: {
      name: {
        en: "Jessada Boonta",
        th: "เจษฎา บุญทา",
      },
      title: {
        en: "Full Stack Web Developer",
        th: "นักพัฒนาเว็บ Full Stack",
      },
      bio: {
        en: "Recent Computer Engineering graduate with a strong passion for Full-Stack Development. Enjoy building end-to-end web applications and accustomed to flexible Agile workflows. Highly driven to explore emerging technologies and continuously improve to deliver efficient, high-quality software.",
        th: "สวัสดีครับ ผมเป็นนักศึกษาจบใหม่สาขาวิศวกรรมคอมพิวเตอร์ผู้มีความหลงใหลในงาน Full-Stack Development สนุกกับการพัฒนาแอปพลิเคชันตั้งแต่หน้าบ้านจนถึงหลังบ้าน คุ้นเคยกับกระบวนการทำงานแบบ Agile ที่เน้นความยืดหยุ่น รักในการเรียนรู้เทคโนโลยีใหม่ๆ และพร้อมพัฒนาตัวเองเพื่อส่งมอบงานที่มีประสิทธิภาพอยู่เสมอ",
      },
      image: "https://avatars.githubusercontent.com/u/113906747?v=4",
      location: {
        en: "96 moo 7 mealoy thoeng Chiang Rai, Thailand",
        th: "96 หมู่ 7 ต.แม่ลอย อ.เทิง จ.เชียงราย, ประเทศไทย",
      },
      email: "jessada.bo46@gmail.com",
      github: "https://github.com/JessadaID",
      linkedin: "https://www.linkedin.com/in/jessada-boonta-40587a378/",
    },
    skills: [],

    experience: [],

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
        title: {
          en: "AWS Lambda Foundation",
          th: "AWS Lambda Foundation",
        },
        issuer: "AWS",
        date: "08/05/2026",
        link: "./AWS_Lamda.jpg",
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
        link: "./cer-html-css-js.jpg",
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
        link: "./Cer_CPE_AI.jpg",
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
        link: "./Cert_ic3.jpg",
        description: {
          en: "Certified in IC3 Digital Literacy GS6 Level 1, demonstrating proficiency in key digital competencies including content creation, information management, online safety, and effective digital collaboration based on international standards.",
          th: "ใบรับรองมาตรฐานสากลด้านทักษะดิจิทัล (IC3 GS6) ครอบคลุมความรู้พื้นฐานด้านเทคโนโลยี, การสร้างสรรค์เนื้อหาดิจิทัล, การสื่อสารออนไลน์อย่างปลอดภัย และการบริหารจัดการข้อมูลอย่างเป็นระบบตามมาตรฐาน Digital Literacy ระดับโลก",
        },
      },
    ],
  };

  let currentLang = "th"; // Default language

  const uiStrings = {
    en: {
      navHome: "Home",
      navAbout: "About",
      navSkills: "Skills",
      navProjects: "Projects",
      navCertificates: "Certificates",
      navContact: "Contact",
      heroHello: "Hello, I'm",
      heroViewWork: "View My Work",
      heroContactMe: "Contact Me",
      aboutMeTitle: "About Me",
      aboutExperience: "Experience",
      aboutYears: "3+ Years in Web Development",
      aboutProjects: "Projects",
      aboutCompletedProjects: "5+ Completed Projects",
      aboutFocus: "Focus",
      aboutFocusText: "Modern Web Technologies",
      skillsTitle: "Skills & Technologies",
      projectsTitle: "Featured Projects",
      projectGithub: "GitHub",
      projectDemo: "Live Demo",
      experienceTitle: "Work Experience",
      contactTitle: "Let's Work Together",
      contactIntro:
        "I'm always interested in new opportunities and exciting projects. Let's discuss how we can bring your ideas to life.",
      contactSendEmail: "Send Email",
      contactViewGithub: "View GitHub",
      contactLinkedIn: "LinkedIn",
      footerRights: "All rights reserved.",
      certificatesTitle: "Certificates",
      navEducation: "Education",
      educationTitle: "Education History",
      viewMoreProjects: "View More Projects",
      viewLessProjects: "Show Less",
    },
    th: {
      navHome: "หน้าแรก",
      navAbout: "เกี่ยวกับ",
      navSkills: "ทักษะ",
      navProjects: "โปรเจกต์",
      navCertificates: "ใบรับรอง",
      navContact: "ติดต่อ",
      heroHello: "สวัสดี, ผมชื่อ",
      heroViewWork: "ดูผลงานของฉัน",
      heroContactMe: "ติดต่อฉัน",
      aboutMeTitle: "เกี่ยวกับฉัน",
      aboutExperience: "ประสบการณ์",
      aboutYears: "3+ ปีในการพัฒนาเว็บ",
      aboutProjects: "โปรเจกต์",
      aboutCompletedProjects: "5+ โปรเจกต์ที่เสร็จสมบูรณ์",
      aboutFocus: "ความชื่นชอบ",
      aboutFocusText: "เทคโนโลยีเว็บสมัยใหม่",
      skillsTitle: "ทักษะและเทคโนโลยี",
      projectsTitle: "โปรเจกต์",
      projectGithub: "GitHub",
      projectDemo: "เดโม่",
      experienceTitle: "ประสบการณ์ทำงาน",
      contactTitle: "มาทำงานร่วมกัน",
      contactIntro:
        "ฉันสนใจโอกาสใหม่ๆ และโปรเจกต์ที่น่าตื่นเต้นอยู่เสมอ มาพูดคุยกันว่าเราจะทำให้ไอเดียของคุณเป็นจริงได้อย่างไร",
      contactSendEmail: "ส่งอีเมล",
      contactViewGithub: "ดู GitHub",
      contactLinkedIn: "LinkedIn",
      footerRights: "สงวนลิขสิทธิ์",
      certificatesTitle: "ใบรับรอง",
      navEducation: "การศึกษา",
      educationTitle: "ประวัติการศึกษา",
      viewMoreProjects: "ดูโปรเจคเพิ่มเติม",
      viewLessProjects: "แสดงน้อยลง",
    },
  };

  const navItems = [
    { id: "home", key: "navHome" },
    { id: "about", key: "navAbout" },
    { id: "skills", key: "navSkills" },
    { id: "projects", key: "navProjects" },
    { id: "education", key: "navEducation" },
    { id: "certificates", key: "navCertificates" },
    { id: "contact", key: "navContact" },
  ];

  let isVisible = false;
  let activeSection = "home";
  let mobileMenuOpen = false;

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  onMount(() => {
    theme.initTheme();
    isVisible = true;

    if (browser) {
      const savedLang = localStorage.getItem("portfolioLang");
      if (savedLang && (savedLang === "en" || savedLang === "th")) {
        currentLang = savedLang;
      }
    }

    // Intersection Observer for section highlighting
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection = entry.target.id;
          }
        });
      },
      { threshold: 0.3 },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  });

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
    closeMobileMenu();
  }

  function setLanguage(lang) {
    currentLang = lang;
    if (browser) {
      localStorage.setItem("portfolioLang", lang);
    }
  }
</script>

<svelte:head>
  <title>{portfolioData.profile.name[currentLang]} - Portfolio</title>
  <meta
    name="description"
    content="Portfolio of {portfolioData.profile.name[
      currentLang
    ]}, {portfolioData.profile.title[currentLang]}"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<!-- Navigation -->
<nav
  class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200 dark:bg-primary dark:border-gray-700"
>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-2">
      <!-- Logo / Name -->
      <a
        href="#home"
        on:click|preventDefault={() => scrollToSection("home")}
        class="text-lg font-bold text-gray-800 dark:text-white"
      >
        {portfolioData.profile.name[currentLang]}
      </a>

      <!-- Right side controls -->
      <div class="flex items-center gap-2">
        <!-- Desktop nav links -->
        <div class="hidden md:flex space-x-6 text-sm">
          {#each navItems as item}
            <button
              on:click={() => scrollToSection(item.id)}
              class="text-gray-600 hover:text-blue-600 dark:text-gray-100 transition-colors capitalize
                     {activeSection === item.id
                ? 'text-blue-600 font-medium'
                : ''}"
            >
              {uiStrings[currentLang][item.key]}
            </button>
          {/each}
        </div>

        <!-- Language switcher -->
        <div class="flex space-x-1">
          <button
            on:click={() => setLanguage("en")}
            class:font-semibold={currentLang === "en"}
            class:text-blue-600={currentLang === "en"}
            class="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors {currentLang ===
            'en'
              ? 'dark:text-blue-600'
              : 'dark:text-gray-100'}">EN</button
          >
          <button
            on:click={() => setLanguage("th")}
            class:font-semibold={currentLang === "th"}
            class:text-blue-600={currentLang === "th"}
            class="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors {currentLang ===
            'th'
              ? 'dark:text-blue-600'
              : 'dark:text-gray-100'}">TH</button
          >
        </div>

        <!-- Theme Toggle -->
        <ThemeToggle />

        <!-- Hamburger button (mobile only) -->
        <button
          aria-label="Toggle mobile menu"
          on:click={toggleMobileMenu}
          class="md:hidden p-2 rounded text-gray-600 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400 transition-colors"
        >
          {#if mobileMenuOpen}
            <!-- X icon -->
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          {:else}
            <!-- Hamburger icon -->
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile dropdown menu -->
    {#if mobileMenuOpen}
      <div
        class="md:hidden border-t border-gray-200 dark:border-gray-700 py-3 flex flex-col gap-1"
      >
        {#each navItems as item}
          <button
            on:click={() => scrollToSection(item.id)}
            class="text-left px-3 py-2 text-sm rounded text-gray-600 hover:text-blue-600 hover:bg-gray-50
                   dark:text-gray-100 dark:hover:text-blue-400 dark:hover:bg-gray-800 transition-colors
                   {activeSection === item.id
              ? 'text-blue-600 font-medium'
              : ''}"
          >
            {uiStrings[currentLang][item.key]}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</nav>

<main class="pt-10">
  <!-- Hero Section -->
  <section
    id="home"
    class="py-12 md:py-20 flex items-center bg-white dark:bg-primary"
  >
    <!-- Content -->
    <div
      class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 md:gap-12 items-center relative w-full"
      style="z-index: 2;"
    >
      <!-- Text content - order 2 on mobile (below image) -->
      <div class="order-2 md:order-1 text-center md:text-left">
        {#if isVisible}
          <h1
            in:fly={{ y: 30, duration: 800, easing: quintOut }}
            class="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-4 relative dark:text-white"
          >
            {uiStrings[currentLang].heroHello}<br />
            <span class="text-blue-600"
              >{portfolioData.profile.name[currentLang]}</span
            >
          </h1>
          <p
            in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}
            class="text-lg md:text-xl text-gray-600 mb-4 relative dark:text-gray-200"
          >
            {portfolioData.profile.title[currentLang]}
          </p>
          <p
            in:fly={{ y: 30, duration: 800, delay: 400, easing: quintOut }}
            class="text-gray-500 mb-6 leading-relaxed relative dark:text-gray-400 text-sm md:text-base"
          >
            {portfolioData.profile.bio[currentLang]}
          </p>
          <div
            in:fly={{ y: 30, duration: 800, delay: 600, easing: quintOut }}
            class="flex flex-wrap justify-center md:justify-start gap-3 relative"
          >
            <button
              on:click={() => scrollToSection("projects")}
              class="bg-blue-600 text-white px-5 py-2.5 hover:bg-blue-700
                   transition-all duration-300 shadow-lg dark:bg-transparent dark:text-blue-600
                   border-2 border-blue-600
                   dark:border-2 dark:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white text-sm md:text-base"
            >
              {uiStrings[currentLang].heroViewWork}
            </button>
            <button
              on:click={() => scrollToSection("contact")}
              class="border text-blue-600 px-5 py-2.5
                   hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg
                   border-2 border-blue-600
                   dark:text-white dark:bg-transperent dark:border-2 dark:border-white dark:hover:bg-white dark:hover:text-blue-600 text-sm md:text-base"
            >
              {uiStrings[currentLang].heroContactMe}
            </button>
          </div>
        {/if}
      </div>

      <!-- Profile image - order 1 on mobile (above text) -->
      <div class="order-1 md:order-2 flex justify-center relative">
        {#if isVisible}
          <div
            in:scale={{ duration: 800, delay: 800, easing: quintOut }}
            class="relative"
          >
            <img
              src={portfolioData.profile.image}
              alt={portfolioData.profile.name[currentLang]}
              class="w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-full object-cover shadow-2xl border-4 md:border-8 border-white relative"
              style="z-index: 3;"
            />
            <div
              class="absolute inset-0 w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 rounded-full bg-blue-400/20 blur-2xl -z-10"
            ></div>
          </div>
        {/if}
      </div>
    </div>
  </section>

  <About {uiStrings} {portfolioData} {currentLang} />

  <Education {uiStrings} {portfolioData} {currentLang} />

  <Skill {uiStrings} {currentLang} />

  <Project {uiStrings} {currentLang} />

  <Experience {uiStrings} {portfolioData} {currentLang} />

  <Certificates {uiStrings} {portfolioData} {currentLang} />

  <Contract {uiStrings} {portfolioData} {currentLang} />

  <ChatWithAi />
</main>

<!-- Footer -->
<footer class="bg-gray-800 text-white py-6">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p>
      &copy; {new Date().getFullYear()}
      {portfolioData.profile.name[currentLang]}. {uiStrings[currentLang]
        .footerRights}
    </p>
  </div>
</footer>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  :global(body) {
    font-family: "Sarabun", sans-serif;
  }
</style>
