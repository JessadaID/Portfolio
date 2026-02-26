<script>
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  export let form;

  let loading = false;
  let email = "";
  let password = "";

  // ถ้า login สำเร็จให้ redirect
  $: if (form?.success) {
    goto("/admin");
  }
</script>

<svelte:head>
  <title>เข้าสู่ระบบ</title>
</svelte:head>

<div
  class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
>
  <div
    class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100"
  >
    <div>
      <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
        เข้าสู่ระบบ
      </h2>
    </div>

    <form
      class="mt-8 space-y-6"
      method="POST"
      use:enhance={() => {
        loading = true;
        return ({ update }) => {
          loading = false;
          update();
        };
      }}
    >
      <div class="flex flex-col gap-5">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1">อีเมล</label
          >
          <input
            type="email"
            id="email"
            name="email"
            bind:value={email}
            required
            disabled={loading}
            class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 transition duration-150 ease-in-out"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label
          >
          <input
            type="password"
            id="password"
            name="password"
            bind:value={password}
            required
            disabled={loading}
            class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500 transition duration-150 ease-in-out"
            placeholder="••••••••"
          />
        </div>
      </div>

      {#if form?.error}
        <div class="rounded-md bg-red-50 p-4 border border-red-200">
          <div class="flex">
            <div class="ml-2">
              <p class="text-sm font-medium text-red-800">
                {form.error}
              </p>
            </div>
          </div>
        </div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition duration-150 ease-in-out shadow-sm"
        >
          {loading ? "กำลังตรวจสอบข้อมูล..." : "เข้าสู่ระบบ"}
        </button>
      </div>
    </form>
  </div>
</div>
