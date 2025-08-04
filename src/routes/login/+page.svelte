<script>
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  
  export let form;
  
  let loading = false;
  let email = '';
  let password = '';
  
  // ถ้า login สำเร็จให้ redirect
  $: if (form?.success) {
    goto('/admin');
  }
</script>

<svelte:head>
  <title>เข้าสู่ระบบ</title>
</svelte:head>

<div class="login-container">
  <div class="login-card">
    <h1>เข้าสู่ระบบ</h1>
    
    <form 
      method="POST" 
      use:enhance={() => {
        loading = true;
        return ({ update }) => {
          loading = false;
          update();
        };
      }}
    >
      <div class="form-group">
        <label for="email">อีเมล</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          bind:value={email}
          required 
          disabled={loading}
        />
      </div>
      
      <div class="form-group">
        <label for="password">รหัสผ่าน</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          bind:value={password}
          required 
          disabled={loading}
        />
      </div>
      
      {#if form?.error}
        <div class="error-message">
          {form.error}
        </div>
      {/if}
      
      <button type="submit" disabled={loading}>
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  </div>
</div>
