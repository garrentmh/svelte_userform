<script lang="ts">
	import { createUser, getAllUsers, type User } from '$lib/db/users';
	import type { PageData } from './$types';

	// Get prerendered data from the load function
	export let data: PageData;

	let currentView: 'home' | 'create' | 'view' = 'home';
	
	// Form data
	let formData = {
		firstName: '',
		lastName: '',
		email: '',
		hobby: ''
	};
	
	// Form state
	let isSubmitting = false;
	let submitMessage = '';
	let submitSuccess = false;
	
	// Users list
	let users: User[] = [];
	
	// Handle form submission
	async function handleSubmit() {
		isSubmitting = true;
		submitMessage = '';
		
		try {
			// Validate form data
			if (!formData.firstName.trim() || !formData.lastName.trim() || 
				!formData.email.trim() || !formData.hobby.trim()) {
				throw new Error('All fields are required');
			}
			
			// Create user
			const newUser = createUser({
				firstName: formData.firstName.trim(),
				lastName: formData.lastName.trim(),
				email: formData.email.trim(),
				hobby: formData.hobby.trim()
			});
			
			// Reset form
			formData = { firstName: '', lastName: '', email: '', hobby: '' };
			
			submitSuccess = true;
			submitMessage = `User "${newUser.firstName} ${newUser.lastName}" created successfully!`;
			
			// Auto-clear message after 3 seconds
			setTimeout(() => {
				submitMessage = '';
				submitSuccess = false;
			}, 3000);
			
		} catch (error) {
			submitSuccess = false;
			submitMessage = error instanceof Error ? error.message : 'An error occurred';
		} finally {
			isSubmitting = false;
		}
	}
	
	// Load users when viewing
	function loadUsers() {
		users = getAllUsers();
	}
	
	// Handle view change
	function changeView(view: 'home' | 'create' | 'view') {
		currentView = view;
		if (view === 'view') {
			loadUsers();
		}
	}
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<link rel="canonical" href={data.meta.canonical} />
</svelte:head>

{#if currentView === 'home'}
	<section class="home">
		<h1>{data.appConfig.title}</h1>
		<p class="subtitle">{data.appConfig.description}</p>
		
		{#if data.initialStats.isPrerendered}
			<div class="prerender-info">
				<small>🚀 This page was prerendered at build time: {new Date(data.appConfig.buildTime).toLocaleString()}</small>
			</div>
		{/if}
		
		<div class="features">
			<h3>Features:</h3>
			<ul>
				{#each data.appConfig.features as feature}
					<li>{feature}</li>
				{/each}
			</ul>
		</div>
		
		<div class="button-container">
			<button 
				class="btn btn-primary" 
				on:click={() => changeView('create')}
			>
				Create New User
			</button>
			<button 
				class="btn btn-secondary" 
				on:click={() => changeView('view')}
			>
				View Existing Users
			</button>
		</div>
	</section>
{:else if currentView === 'create'}
	<section class="form-section">
		<h2>Create New User</h2>
		
		{#if submitMessage}
			<div class="message" class:success={submitSuccess} class:error={!submitSuccess}>
				{submitMessage}
			</div>
		{/if}
		
		<form on:submit|preventDefault={handleSubmit}>
			<div class="form-group">
				<label for="firstName">First Name</label>
				<input 
					type="text" 
					id="firstName" 
					bind:value={formData.firstName}
					required 
					disabled={isSubmitting}
				/>
			</div>
			
			<div class="form-group">
				<label for="lastName">Last Name</label>
				<input 
					type="text" 
					id="lastName" 
					bind:value={formData.lastName}
					required 
					disabled={isSubmitting}
				/>
			</div>
			
			<div class="form-group">
				<label for="email">Email</label>
				<input 
					type="email" 
					id="email" 
					bind:value={formData.email}
					required 
					disabled={isSubmitting}
				/>
			</div>
			
			<div class="form-group">
				<label for="hobby">Hobby</label>
				<input 
					type="text" 
					id="hobby" 
					bind:value={formData.hobby}
					required 
					disabled={isSubmitting}
				/>
			</div>
			
			<div class="form-actions">
				<button type="submit" class="btn btn-primary" disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</button>
				<button 
					type="button" 
					class="btn btn-secondary" 
					on:click={() => changeView('home')}
					disabled={isSubmitting}
				>
					Back
				</button>
			</div>
		</form>
	</section>
{:else if currentView === 'view'}
	<section class="view-section">
		<h2>Existing Users ({users.length})</h2>
		
		{#if users.length === 0}
			<p class="no-users">No users found. <button class="link-btn" on:click={() => changeView('create')}>Create your first user!</button></p>
		{:else}
			<div class="users-grid">
				{#each users as user}
					<div class="user-card">
						<h3>{user.firstName} {user.lastName}</h3>
						<p><strong>Email:</strong> {user.email}</p>
						<p><strong>Hobby:</strong> {user.hobby}</p>
						<p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
					</div>
				{/each}
			</div>
		{/if}
		
		<div class="view-actions">
			<button 
				class="btn btn-primary" 
				on:click={() => changeView('create')}
			>
				Add New User
			</button>
			<button 
				class="btn btn-secondary" 
				on:click={() => changeView('home')}
			>
				Back to Home
			</button>
		</div>
	</section>
{/if}

<style>
	.home {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 60vh;
		text-align: center;
	}

	.home h1 {
		margin-bottom: 2rem;
		color: var(--color-theme-1);
		font-size: 2.5rem;
	}

	.subtitle {
		font-size: 1.2rem;
		color: var(--color-text-1);
		margin-bottom: 1rem;
		opacity: 0.8;
	}

	.prerender-info {
		background: #e8f5e8;
		border: 1px solid #4caf50;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		margin: 1rem 0;
		color: #2e7d32;
		font-weight: 500;
	}

	.features {
		background: #f8f9fa;
		border-radius: 8px;
		padding: 1.5rem;
		margin: 2rem 0;
		max-width: 400px;
		text-align: left;
	}

	.features h3 {
		margin: 0 0 1rem 0;
		color: var(--color-theme-1);
		text-align: center;
	}

	.features ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.features li {
		margin: 0.5rem 0;
		color: var(--color-text);
	}

	.button-container {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.form-section, .view-section {
		max-width: 500px;
		margin: 0 auto;
		padding: 2rem;
	}

	.form-section h2, .view-section h2 {
		margin-bottom: 1.5rem;
		text-align: center;
		color: var(--color-theme-1);
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e1e5e9;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--color-theme-1);
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 1.5rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.btn-primary {
		background-color: var(--color-theme-1);
		color: white;
	}

	.btn-primary:hover {
		background-color: var(--color-theme-2);
		transform: translateY(-1px);
	}

	.btn-secondary {
		background-color: #6c757d;
		color: white;
	}

	.btn-secondary:hover {
		background-color: #5a6268;
		transform: translateY(-1px);
	}

	.message {
		padding: 1rem;
		margin-bottom: 1.5rem;
		border-radius: 4px;
		text-align: center;
		font-weight: 600;
	}

	.message.success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.message.error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.no-users {
		text-align: center;
		color: #6c757d;
		font-style: italic;
		margin: 2rem 0;
	}

	.link-btn {
		background: none;
		border: none;
		color: var(--color-theme-1);
		text-decoration: underline;
		cursor: pointer;
		font-size: inherit;
	}

	.users-grid {
		display: grid;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.user-card {
		border: 2px solid #e1e5e9;
		border-radius: 8px;
		padding: 1.5rem;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.user-card h3 {
		margin: 0 0 1rem 0;
		color: var(--color-theme-1);
	}

	.user-card p {
		margin: 0.5rem 0;
		color: var(--color-text);
	}

	.view-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	@media (min-width: 768px) {
		.users-grid {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
	}
</style>
