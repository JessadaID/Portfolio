<script>
    import { goto } from "$app/navigation";
    let email = '';
    let password = '';
    let errorMessage = '';

    function handleSubmit(event) {
        event.preventDefault();
        if(email === '' || password === '') {
            errorMessage = 'Email and password are required.';
            return;
        }

        if (email === import.meta.env.VITE_ADMIN_EMAIL && 
            password === import.meta.env.VITE_ADMIN_PASSWORD) {
            // Redirect to the admin page
            localStorage.setItem('isAdmin', 'true');
            goto('/admin');
        } else {
            errorMessage = 'Invalid email or password.';
        }

    }
</script>

<form on:submit={handleSubmit}>
    <label for="email">email</label>
    <input type="text" bind:value={email} required>
    <label for="password">password</label>
    <input type="password" bind:value={password} required>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    <button type="submit">submit</button>
</form>