<script lang="ts">
	import { page } from '$app/state';
</script>

<header>
	<div class="header-content">
		<h1>User Management</h1>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		background: var(--color-bg-1);
		border-bottom: 1px solid var(--color-bg-2);
	}

	.header-content h1 {
		margin: 0;
		color: var(--color-theme-1);
		font-size: 1.5rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}
</style>
