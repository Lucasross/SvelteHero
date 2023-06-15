<script lang="ts">
    import AreaData from "../data/AreaData";
    import type Hero from "../data/Hero";
    import { get, type Writable } from "svelte/store";
    import { area_id } from "../store/Stores";


    export let hero: Writable<Hero>;
    export let index: number;

    let heroEdit: boolean = false;
    let heroNameInput: string = $hero.name;

    function SetName() {
        heroEdit = false;
        hero.update(h => h.setName(heroNameInput));
    }

    function Send() {
        if($hero.isInLocation()) {
            AreaData.getById($hero.area_id).leave(hero);
            hero.update(h => h.sendToGuild());
        } else {
            let targetArea: AreaData = AreaData.getById(get(area_id));
            hero.update(h => h.sendToArea(targetArea.id));
            targetArea.enter(hero);
        }
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
            <b><p on:click={SwitchToEdit} on:keypress={null}>{$hero.name}</p></b>
        {:else}
            <span>
                <form on:submit|preventDefault={SetName}>
                    <input
                        type="text"
                        name={$hero.name}
                        bind:value={heroNameInput}
                    />
                </form>
            </span>
        {/if}
        <p>
            Warrior {$hero.level} ({Math.round($hero.experience)}/{$hero.experienceToNextLevel()})
        </p>
        <p>{$hero.getLocation()}</p>
    </div>

    <div class="btn-container">
        <button on:click|preventDefault={Send}>
            {#if $hero.isInLocation()}
                Retrieve
            {:else}
                Send
            {/if}
        </button>
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
