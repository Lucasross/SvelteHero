<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type Hero from "../data/Hero";

    export let hero : Hero

    let heroEdit : boolean = false
    let heroNameInput : string = hero.name

    const dispatch = createEventDispatcher();

    function SetName() {
        heroEdit = false
		dispatch('setName', {
			name: heroNameInput
		});
	}

    function SwitchToEdit() {
        heroEdit = true;
    }
</script>

<div>
    {#if !heroEdit}
        <h1 on:click={SwitchToEdit} on:keypress={null}>{hero.name} {hero.level}</h1>
    {:else}
    <h1>
        <form on:submit|preventDefault={SetName}>
            <input type="text" name="{hero.name}" bind:value={heroNameInput}>
            {hero.level}
        </form>
    </h1>
    {/if}
</div>

