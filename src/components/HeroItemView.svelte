<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type Hero from "../data/Hero";
    import type { Writable } from "svelte/store";

    export let hero: Hero;
    export let index: number;

    let heroEdit: boolean = false;
    let heroNameInput: string = hero.name;

    const dispatch = createEventDispatcher();

    function SetName() {
        heroEdit = false;
        dispatch("setName", {
            name: heroNameInput,
            index: index,
        });
    }

    function SwitchToEdit() {
        heroEdit = true;
    }
</script>

<div class="container background_{index % 2}">
    <div>
        <img
            width="64px"
            height="64px"
            src="pictures/warlord-helmet.png"
            alt="warlord"
        />
    </div>

    <div class="vertical-grid">
        {#if !heroEdit}
            <b><p on:click={SwitchToEdit} on:keypress={null}>{hero.name}</p></b>
        {:else}
            <span>
                <form on:submit|preventDefault={SetName}>
                    <input
                        type="text"
                        name={hero.name}
                        bind:value={heroNameInput}
                    />
                </form>
            </span>
        {/if}
        <p>
            Warrior - {hero.level}
        </p>
        <p>Beginner's area</p>
    </div>

    <div class="btn-container">
        <button>Send</button>
    </div>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }
    img {
        display: block;
    }
    .container {
        display: flex;
    }
    .background_0 {
        background-color: white;
    }
    .background_1 {
        background-color: #f8f8f8;
    }
    .vertical-grid {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .vertical-grid > * {
        flex: 1;
    }
    .btn-container {
        align-self: center;
    }
    button {
        margin-right: 1em;
        padding: 0.3em 0.8em 0.3em 0.8em;
    }
    p {
        font-size: 0.8vw;
    }
</style>
