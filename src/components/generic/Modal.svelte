<script lang="ts">
	export let showModal; // boolean
	export var closable: boolean = true;

	let dialog; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();

	export const close = () => {
		dialog.close();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => closable ? dialog.close() : null}
>
	<div on:click|stopPropagation>
		<slot />
		{#if closable}
			<button on:click={() => dialog.close()}>❌</button>
		{/if}
	</div>
</dialog>

<style>
	dialog {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: 64em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		margin: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	button {
		position: absolute;
		top: 0;
		left: 100%;
		transform: translate(-100%, 0%);
		border: none;
		margin: 0;
		padding-right: 0.3vw;
		background-color: #00000000;
	}
	button:hover {
		background-color: #00000066;
	}
</style>
