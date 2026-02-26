<script>
    import { fly } from "svelte/transition";
    export let uiStrings;
    export let portfolioData;
    export let currentLang = "th";
</script>

<!-- Education Section -->
{#if portfolioData.education && portfolioData.education.length > 0}
    <section id="education" class="py-20 bg-white dark:bg-primary">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
                class="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16 dark:text-white"
            >
                {uiStrings[currentLang].educationTitle}
            </h2>

            <div class="relative max-w-4xl mx-auto">
                <!-- Vertical Line -->
                <div
                    class="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700"
                ></div>

                <div class="space-y-12">
                    {#each portfolioData.education as edu, index}
                        <div
                            class="relative flex items-center justify-between w-full"
                        >
                            <!-- Left side (Date) -->
                            <div class="w-5/12 text-right pr-8">
                                <span
                                    class="font-medium text-gray-800 dark:text-gray-200"
                                >
                                    {edu.period[currentLang]}
                                </span>
                            </div>

                            <!-- Center Dot -->
                            <div
                                class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-800 dark:bg-white z-10"
                            ></div>

                            <!-- Right side (Content Card) -->
                            <div class="w-5/12 pl-8">
                                <div
                                    in:fly={{
                                        y: 20,
                                        duration: 600,
                                        delay: index * 200,
                                    }}
                                    class="bg-white dark:bg-primary border border-gray-200 dark:border-gray-800 dark:hover:border-white hover:border-primary p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <h3
                                        class="text-xl font-bold text-gray-800 dark:text-white mb-2"
                                    >
                                        {edu.degree[currentLang]}
                                    </h3>
                                    <p class="text-gray-500 dark:text-gray-400">
                                        {edu.school[currentLang]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </section>
{/if}
