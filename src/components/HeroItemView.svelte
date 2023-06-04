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

<div class="container">
    <div>
        <img class="color1" width="128px" src="pictures/warlord-helmet.png" alt="warlord">
    </div>
    <div class="vertical-grid">
        {#if !heroEdit}
           <h1 on:click={SwitchToEdit} on:keypress={null}>{hero.name}</h1>
        {:else}
        <h1>
            <form on:submit|preventDefault={SetName}>
                <input type="text" name="{hero.name}" bind:value={heroNameInput}>
                
            </form>
        </h1>
        {/if}
        <h2>
            Warrior {hero.level}
        </h2>
        <h2>
            Sacred dragon's temple
        </h2>
    </div>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
        border: 0;
    }
    img {
        display: block;
    }
    .container {
        background-color: blanchedalmond;
        border-radius: 0 1vw 1vw 0;
        /*padding: 10px;*/
        gap: 0.5vw;
        border-top: 2px solid black;
        border-right: 2px solid black;
        border-bottom: 2px solid black;

        display: grid;
        grid-template-columns: 128px 1fr;
    }
    .vertical-grid{
        display: grid;
        grid-template-rows: auto;
    }

    .vertical-grid > * {
        display: flex;
        vertical-align: middle;
        align-items: center;
    }
    .color1 {
        background-color: black;
    }
</style>

