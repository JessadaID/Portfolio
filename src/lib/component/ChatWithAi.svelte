<script>
    import { onMount } from "svelte";
    import { fly, fade } from "svelte/transition";

    let showChat = false;
    let inputMessage = "";
    let chatHistory = [];
    let isTyping = false;
    let chatContainer;

    const quickChats = [
        "✨ สรุปจุดเด่นของคุณเจษฎาให้ฟังหน่อย",
        "💼 คุณเจษฎามีประสบการณ์ทำงานที่ไหนบ้าง?",
        "🚀 โปรเจกต์ที่โดดเด่นมีอะไรบ้าง?",
        "📞 ขอช่องทางการติดต่อหน่อยครับ",
    ];

    function sendQuickChat(text) {
        inputMessage = text;
        sendMessage();
    }

    function clearChat() {
        chatHistory = [];
        inputMessage = "";
    }

    function scrollToBottom() {
        if (chatContainer) {
            setTimeout(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 50);
        }
    }

    async function sendMessage() {
        if (!inputMessage.trim() || isTyping) return;

        const userMsg = inputMessage.trim();
        chatHistory = [...chatHistory, { role: "user", content: userMsg }];
        inputMessage = "";
        isTyping = true;
        scrollToBottom();

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    chatHistory: chatHistory.slice(0, -1),
                }),
            });

            const data = await res.json();
            if (res.ok) {
                chatHistory = [
                    ...chatHistory,
                    { role: "assistant", content: data.reply },
                ];
            } else {
                chatHistory = [
                    ...chatHistory,
                    { role: "assistant", content: "Error: " + data.error },
                ];
            }
        } catch (err) {
            chatHistory = [
                ...chatHistory,
                {
                    role: "assistant",
                    content: "ขออภัยครับ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
                },
            ];
        } finally {
            isTyping = false;
            scrollToBottom();
        }
    }
</script>

<div
    class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)]"
>
    <!-- Chat Window -->
    {#if showChat}
        <div
            transition:fly={{ y: 20, duration: 300 }}
            class="bg-white dark:bg-primary border border-primary dark:border-white w-[90vw] sm:w-96 overflow-hidden flex flex-col h-[70vh] max-h-[28rem]"
        >
            <!-- Header -->
            <div
                class="px-5 py-4 border-b border-primary dark:border-white bg-white dark:bg-primary flex justify-between items-center"
            >
                <div class="flex items-center gap-3">
                    <span class="relative flex h-3 w-3">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full bg-green-400 opacity-75"
                        ></span>
                        <span class="relative inline-flex h-3 w-3 bg-green-500"
                        ></span>
                    </span>
                    <div>
                        <h3
                            class="font-semibold text-primary dark:text-white leading-tight"
                        >
                            AI Assistant
                        </h3>
                    </div>
                </div>
                <div class="flex items-center gap-1">
                    {#if chatHistory.length > 0}
                        <button
                            title="ล้างแชท (Clear Chat)"
                            aria-label="Clear Chat"
                            on:click={clearChat}
                            class="text-gray-400 hover:text-red-500 transition-colors p-2"
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
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path></svg
                            >
                        </button>
                    {/if}
                    <button
                        aria-label="Close Chat"
                        on:click={() => (showChat = false)}
                        class="text-primary dark:text-white hover:text-gray-500 transition-colors p-2"
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
                                d="M6 18L18 6M6 6l12 12"
                            ></path></svg
                        >
                    </button>
                </div>
            </div>

            <!-- Chat Body (Messages) -->
            <div
                bind:this={chatContainer}
                class="flex-1 p-5 overflow-y-auto bg-gray-50 dark:bg-primary flex flex-col gap-4 text-sm"
            >
                <!-- AI Welcome Message -->
                <div class="flex gap-3">
                    <div
                        class="w-8 h-8 bg-white dark:bg-primary flex items-center justify-center shrink-0 border border-primary dark:border-white"
                    >
                        <svg
                            class="w-4 h-4 text-primary dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path></svg
                        >
                    </div>
                    <div
                        class="bg-white dark:bg-primary border border-primary dark:border-white p-3 text-primary dark:text-white max-w-[85%] whitespace-pre-wrap leading-relaxed"
                    >
                        👋 สวัสดีครับ! ผมคือ AI ประจำ Portfolio นี้
                        มีอะไรให้ผมแนะนำเกี่ยวกับ ทักษะ (Skills), ประสบการณ์
                        หรือโปรเจกต์ไหมครับ?
                    </div>
                </div>

                <!-- Quick Chat Suggestions (Only show when no history) -->
                {#if chatHistory.length === 0 && !isTyping}
                    <div class="flex flex-col gap-2 mt-1 ml-11">
                        <p
                            class="text-xs text-gray-500 dark:text-gray-400 mb-1"
                        >
                            คำถามแนะนำสำหรับ HR:
                        </p>
                        <div class="flex flex-wrap gap-2">
                            {#each quickChats as chat}
                                <button
                                    on:click={() => sendQuickChat(chat)}
                                    class="text-left px-3 py-2 text-xs border border-primary dark:border-white text-primary dark:text-white bg-white dark:bg-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    {chat}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Chat History Loop -->
                {#each chatHistory as msg}
                    <div
                        class="flex gap-3 {msg.role === 'user'
                            ? 'flex-row-reverse'
                            : ''}"
                    >
                        {#if msg.role === "assistant"}
                            <div
                                class="w-8 h-8 bg-white dark:bg-primary flex items-center justify-center shrink-0 border border-primary dark:border-white"
                            >
                                <svg
                                    class="w-4 h-4 text-primary dark:text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    ><path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    ></path></svg
                                >
                            </div>
                        {/if}
                        <div
                            class="p-3 max-w-[85%] whitespace-pre-wrap leading-relaxed {msg.role ===
                            'user'
                                ? 'bg-primary text-white dark:bg-white dark:text-primary'
                                : 'bg-white text-primary dark:bg-primary dark:text-white border border-primary dark:border-white'}"
                        >
                            {msg.content}
                        </div>
                    </div>
                {/each}

                <!-- Typing Indicator -->
                {#if isTyping}
                    <div class="flex gap-3">
                        <div
                            class="w-8 h-8 bg-white dark:bg-primary flex items-center justify-center shrink-0 border border-primary dark:border-white"
                        >
                            <svg
                                class="w-4 h-4 text-primary dark:text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                ></path></svg
                            >
                        </div>
                        <div
                            class="bg-white dark:bg-primary border border-primary dark:border-white p-3 text-primary dark:text-white flex gap-1.5 items-center"
                        >
                            <div
                                class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                            ></div>
                            <div
                                class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                style="animation-delay: 0.15s"
                            ></div>
                            <div
                                class="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                                style="animation-delay: 0.3s"
                            ></div>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Input Area -->
            <div
                class="p-3 border-t border-primary dark:border-white bg-white dark:bg-primary"
            >
                <form class="flex gap-2" on:submit|preventDefault={sendMessage}>
                    <input
                        type="text"
                        bind:value={inputMessage}
                        disabled={isTyping}
                        placeholder="ถามอะไรสักหน่อยสิ..."
                        class="flex-1 bg-white dark:bg-primary text-primary dark:text-white border border-primary dark:border-white px-4 py-2 text-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        aria-label="Send message"
                        type="submit"
                        class="bg-primary hover:bg-gray-800 text-white dark:bg-white dark:text-primary dark:hover:bg-gray-200 px-4 py-2 transition-all flex items-center justify-center border border-primary dark:border-white shrink-0"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            ><path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2.5"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            ></path></svg
                        >
                    </button>
                </form>
            </div>
        </div>
    {/if}

    <!-- Toggle Button -->
    <button
        class="bg-primary text-white border border-primary dark:border-white dark:bg-primary px-4 py-2 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none group"
        on:click={() => (showChat = !showChat)}
    >
        <div class="relative">
            <svg
                height="20px"
                width="20px"
                version="1.1"
                id="_x32_"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xml:space="preserve"
                class="fill-current text-white"
            >
                <g>
                    <path
                        class="st0"
                        d="M247.355,106.9C222.705,82.241,205.833,39.18,197.46,0c-8.386,39.188-25.24,82.258-49.899,106.917
            c-24.65,24.642-67.724,41.514-106.896,49.904c39.188,8.373,82.254,25.235,106.904,49.895c24.65,24.65,41.522,67.72,49.908,106.9
            c8.373-39.188,25.24-82.258,49.886-106.917c24.65-24.65,67.724-41.514,106.896-49.904
            C315.08,148.422,272.014,131.551,247.355,106.9z"
                    />
                    <path
                        class="st0"
                        d="M407.471,304.339c-14.714-14.721-24.81-40.46-29.812-63.864c-5.011,23.404-15.073,49.142-29.803,63.872
            c-14.73,14.714-40.464,24.801-63.864,29.812c23.408,5.01,49.134,15.081,63.864,29.811c14.73,14.722,24.81,40.46,29.82,63.864
            c5.001-23.413,15.081-49.142,29.802-63.872c14.722-14.722,40.46-24.802,63.856-29.82
            C447.939,329.14,422.201,319.061,407.471,304.339z"
                    />
                    <path
                        class="st0"
                        d="M146.352,354.702c-4.207,19.648-12.655,41.263-25.019,53.626c-12.362,12.354-33.968,20.82-53.613,25.027
            c19.645,4.216,41.251,12.656,53.613,25.027c12.364,12.362,20.829,33.96,25.036,53.618c4.203-19.658,12.655-41.255,25.023-53.626
            c12.354-12.362,33.964-20.82,53.605-25.035c-19.64-4.2-41.251-12.656-53.613-25.019
            C159.024,395.966,150.555,374.351,146.352,354.702z"
                    />
                </g>
            </svg>
        </div>
        <p class="font-medium">Assistant</p>
    </button>
</div>
