<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { fade, fly, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import Skill from './skill.svelte';
  import Project from './project.svelte';
  import Experience from './Experience.svelte';
  import Contract from './Contact.svelte';
  import About from './About.svelte';
  // Portfolio data - ในอนาคตจะโหลดจาก JSON file
  let portfolioData = {
    profile: {
      name: {
        en: "Jessada Boonta",
        th: "เจษฎา บุญทา"
      },
      title: {
        en: "Full Stack Web Developer",
        th: "นักพัฒนาเว็บ Full Stack"
      },
      bio: {
        en: "I am a student and developer passionate about web technologies, with experience in building modern and user-responsive applications.",
        th: "ผมเป็นนักศึกษาและนักพัฒนาที่หลงใหลในเทคโนโลยีเว็บ มีประสบการณ์ในการสร้างแอปพลิเคชันที่ทันสมัยและตอบสนองความต้องการของผู้ใช้"
      },
      image: "https://avatars.githubusercontent.com/u/113906747?v=4",
      location: {
        en: "96 moo 7 mealoy thoeng Chiang Rai, Thailand",
        th: "96 หมู่ 7 ต.แม่ลอย อ.เทิง จ.เชียงราย, ประเทศไทย"
      },
      email: "ipnioko54@gmail.com",
      github: "https://github.com/JessadaID",
      linkedin: ""
    },
    skills: [
      /*
      { 
        name: "JavaScript", 
        category: { en: "Frontend", th: "ส่วนหน้า" }, 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
        proficiency: { en: "Expert", th: "เชี่ยวชาญ" }
      },
      { 
        name: "React", 
        category: { en: "Frontend", th: "ส่วนหน้า" }, 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
        proficiency: { en: "Starter", th: "เริ่มต้น" }
      },
      { 
        name: "Svelte", 
        category: { en: "Frontend", th: "ส่วนหน้า" }, 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
        proficiency: { en: "Advanced", th: "เชี่ยวชาญ" }
      },
      { 
        name: "Node.js", 
        category: { en: "Backend", th: "ส่วนหลัง" }, 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
        proficiency: { en: "Intermediate", th: "ปานกลาง" }
      },
      { 
        name: "Python", 
        category: { en: "Backend", th: "ส่วนหลัง" }, 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
        proficiency: { en: "Intermediate", th: "ปานกลาง" }
      },
      { 
        name: "Java", 
        category: { en: "Backend", th: "ส่วนหลัง" }, // Adjusted category for better fit
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        proficiency: { en: "Intermediate", th: "ปานกลาง" }
      },
      { 
        name: "C , C++", 
        category: { en: "Software Development", th: "พัฒนาซอฟต์แวร์" }, // Adjusted category
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
        proficiency: { en: "Intermediate", th: "ปานกลาง" }
      },
      { 
        name: "Php", 
        category: { en: "Backend", th: "ส่วนหลัง" }, // Adjusted category
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
        proficiency: { en: "Expert", th: "เชี่ยวชาญ" }
      },
      { 
        name: "Firebase", 
        category: { en: "Cloud Platform", th: "แพลตฟอร์มคลาวด์" }, // Adjusted category
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
        proficiency: { en: "Expert", th: "เชี่ยวชาญ" }
      },
      {
        name: "Tailwind CSS", 
        category: { en: "Frontend", th: "ส่วนหน้า" }, 
        icon: "https://www.svgrepo.com/show/354431/tailwindcss-icon.svg",
        proficiency: { en: "Intermediate", th: "ปานกลาง" }
      },
      { 
        name: "Git", 
        category: { en: "Version Control", th: "การควบคุมเวอร์ชัน" }, 
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
        proficiency: { en: "Intermediate", th: "ปานกลาง" }
      },
      {
        name: "Sql",
        category: { en: "Database", th: "ฐานข้อมูล" },
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
        proficiency: { en: "IntermedExpertiate", th: "เชี่ยวชาญ" }
      }*/
    ],
   
    experience: [
      /*
      {
        company: "Tech Startup Inc.",
        position: { en: "Senior Frontend Developer", th: "นักพัฒนาส่วนหน้าอาวุโส" },
        period: "2022 - Present",
        description: {
          en: "Lead frontend development team, architected scalable React applications",
          th: "นำทีมพัฒนาส่วนหน้า ออกแบบสถาปัตยกรรมแอปพลิเคชัน React ที่ปรับขนาดได้"
        }
      },
      {
        company: "Digital Agency",
        position: { en: "Full Stack Developer", th: "นักพัฒนา Full Stack" },
        period: "2020 - 2022",
        description: {
          en: "Developed custom web solutions for various clients using modern technologies",
          th: "พัฒนาโซลูชันเว็บแบบกำหนดเองสำหรับลูกค้าหลากหลายโดยใช้เทคโนโลยีที่ทันสมัย"
        }
      }*/
    ]
  };

  let currentLang = 'th'; // Default language

  const uiStrings = {
    en: {
      navHome: "Home", navAbout: "About", navSkills: "Skills", navProjects: "Projects", navExperience: "Experience", navContact: "Contact",
      heroHello: "Hello, I'm", heroViewWork: "View My Work", heroContactMe: "Contact Me",
      aboutMeTitle: "About Me", aboutExperience: "Experience", aboutYears: "2+ Years in Web Development",
      aboutProjects: "Projects", aboutCompletedProjects: "3+ Completed Projects", aboutFocus: "Focus", aboutFocusText: "Modern Web Technologies",
      skillsTitle: "Skills & Technologies",
      projectsTitle: "Featured Projects", projectGithub: "GitHub", projectDemo: "Live Demo",
      experienceTitle: "Work Experience",
      contactTitle: "Let's Work Together",
      contactIntro: "I'm always interested in new opportunities and exciting projects. Let's discuss how we can bring your ideas to life.",
      contactSendEmail: "Send Email", contactViewGithub: "View GitHub", contactLinkedIn: "LinkedIn",
      footerRights: "All rights reserved."
    },
    th: {
      navHome: "หน้าแรก", navAbout: "เกี่ยวกับ", navSkills: "ทักษะ", navProjects: "โปรเจกต์", navExperience: "ประสบการณ์", navContact: "ติดต่อ",
      heroHello: "สวัสดี, ผมชื่อ", heroViewWork: "ดูผลงานของฉัน", heroContactMe: "ติดต่อฉัน",
      aboutMeTitle: "เกี่ยวกับฉัน", aboutExperience: "ประสบการณ์", aboutYears: "2+ ปีในการพัฒนาเว็บ",
      aboutProjects: "โปรเจกต์", aboutCompletedProjects: "3+ โปรเจกต์ที่เสร็จสมบูรณ์", aboutFocus: "ความเชี่ยวชาญ", aboutFocusText: "เทคโนโลยีเว็บสมัยใหม่",
      skillsTitle: "ทักษะและเทคโนโลยี",
      projectsTitle: "โปรเจกต์เด่น", projectGithub: "GitHub", projectDemo: "เดโม่",
      experienceTitle: "ประสบการณ์ทำงาน",
      contactTitle: "มาทำงานร่วมกัน",
      contactIntro: "ฉันสนใจโอกาสใหม่ๆ และโปรเจกต์ที่น่าตื่นเต้นอยู่เสมอ มาพูดคุยกันว่าเราจะทำให้ไอเดียของคุณเป็นจริงได้อย่างไร",
      contactSendEmail: "ส่งอีเมล", contactViewGithub: "ดู GitHub", contactLinkedIn: "LinkedIn",
      footerRights: "สงวนลิขสิทธิ์"
    }
  };

  const navItems = [
    { id: 'home', key: 'navHome' }, { id: 'about', key: 'navAbout' }, { id: 'skills', key: 'navSkills' },
    { id: 'projects', key: 'navProjects' }, { id: 'experience', key: 'navExperience' }, { id: 'contact', key: 'navContact' }
  ];

  let isVisible = false;
  let activeSection = 'home';
  
  onMount(() => {
    isVisible = true;

    if (browser) {
      const savedLang = localStorage.getItem('portfolioLang');
      if (savedLang && (savedLang === 'en' || savedLang === 'th')) {
        currentLang = savedLang;
      }
    }
    
    // Intersection Observer for section highlighting
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSection = entry.target.id;
        }
      });
    }, { threshold: 0.3 });
    
    sections.forEach(section => observer.observe(section));
    
    return () => observer.disconnect();
  });

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }

  function setLanguage(lang) {
    currentLang = lang;
    if (browser) {
      localStorage.setItem('portfolioLang', lang);
    }
  }
</script>

<svelte:head>
  <title>{portfolioData.profile.name[currentLang]} - Portfolio</title>
  <meta name="description" content="Portfolio of {portfolioData.profile.name[currentLang]}, {portfolioData.profile.title[currentLang]}">
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
</svelte:head>

<!-- Navigation -->
<nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <a href="#home" on:click|preventDefault={() => scrollToSection('home')} class="text-xl font-bold text-gray-800">
        {portfolioData.profile.name[currentLang]}
      </a>
      <div class="flex items-center">
        <div class="hidden md:flex space-x-8">
          {#each navItems as item}
            <button 
              on:click={() => scrollToSection(item.id)}
              class="text-gray-600 hover:text-blue-600 transition-colors capitalize
                     {activeSection === item.id ? 'text-blue-600 font-medium' : ''}"
            >
              {uiStrings[currentLang][item.key]}
            </button>
          {/each}
        </div>
        <div class="flex space-x-1 ml-4">
          <button 
            on:click={() => setLanguage('en')}
            class:font-semibold="{currentLang === 'en'}" class:text-blue-600="{currentLang === 'en'}"
            class="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors"
          >EN</button>
          <button 
            on:click={() => setLanguage('th')}
            class:font-semibold="{currentLang === 'th'}" class:text-blue-600="{currentLang === 'th'}"
            class="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors"
          >TH</button>
        </div>
      </div>
    </div>
  </div>
</nav>

<main class="pt-15">
  <!-- Hero Section -->
  <section id="home" class="min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
      <div>
        {#if isVisible}
          <h1 
            in:fly="{{ y: 30, duration: 800, easing: quintOut }}" 
            class="text-4xl md:text-6xl font-bold text-gray-800 mb-4"
          >
            {uiStrings[currentLang].heroHello}<br>
            <span class="text-blue-600">{portfolioData.profile.name[currentLang]}</span>
          </h1>
          <p 
            in:fly="{{ y: 30, duration: 800, delay: 200, easing: quintOut }}"
            class="text-xl text-gray-600 mb-6"
          >
            {portfolioData.profile.title[currentLang]}
          </p>
          <p 
            in:fly="{{ y: 30, duration: 800, delay: 400, easing: quintOut }}"
            class="text-gray-500 mb-8 leading-relaxed"
          >
            {portfolioData.profile.bio[currentLang]}
          </p>
          <div 
            in:fly="{{ y: 30, duration: 800, delay: 600, easing: quintOut }}"
            class="flex space-x-4"
          >
            <button 
              on:click={() => scrollToSection('projects')}
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                     transition-all duration-300 hover:scale-105"
            >
              {uiStrings[currentLang].heroViewWork}
            </button>
            <button 
              on:click={() => scrollToSection('contact')}
              class="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg 
                     hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              {uiStrings[currentLang].heroContactMe}
            </button>
          </div>
        {/if}
      </div>
      <div class="flex justify-center">
        {#if isVisible}
          <div in:scale="{{ duration: 800, delay: 800, easing: quintOut }}">
            <img 
              src={portfolioData.profile.image} 
              alt={portfolioData.profile.name[currentLang]}
              class="w-80 h-80 rounded-full object-cover shadow-2xl border-8 border-white"
            >
          </div>
        {/if}
      </div>
    </div>
  </section>

  <About {uiStrings} {portfolioData} {currentLang}/>

  <Skill {uiStrings}  {currentLang}/>

  <Project {uiStrings}  {currentLang}/>

  <Experience {uiStrings} {portfolioData} {currentLang}/>

  <Contract {uiStrings} {portfolioData} {currentLang}/>
</main>

<!-- Footer -->
<footer class="bg-gray-800 text-white py-8">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <p>&copy; {new Date().getFullYear()} {portfolioData.profile.name[currentLang]}. {uiStrings[currentLang].footerRights}</p>
  </div>
</footer>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  :global(body) {
    font-family: 'Kanit', sans-serif;
  }
</style>