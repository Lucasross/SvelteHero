<script lang="ts">
    import AreaData from "../data/AreaData";
    import type Hero from "../data/Hero";
    import { get, type Writable } from "svelte/store";
    import { area_id } from "../store/Stores";
    import Modal from "./generic/Modal.svelte";
    import Progressbar from "./generic/Progressbar.svelte";

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
            targetArea.enter(hero);
            hero.update(h => h.sendToArea(targetArea.id));
        }
    }

    function SwitchToEdit() {
        heroEdit = true;
    }

    // Modal

    let showModal = false;
</script>

<div class="container background_{index % 2}" on:click={() => (showModal = true)} on:keydown={null} >
    <div>
        <img
            width="64px"
            height="64px"
            src={$hero.getJob().getPicture()}
            alt={$hero.getJob().jobType.toString()}
        />
    </div>

    <div class="vertical-grid">
        {#if !heroEdit}
            <b><p on:click|stopPropagation={SwitchToEdit} on:keypress={null}>{$hero.name}</p></b>
        {:else}
            <span on:click|stopPropagation={null} on:keypress={null}>
                <form on:submit|preventDefault={SetName}>
                    <!-- svelte-ignore a11y-autofocus -->
                    <input autofocus
                        maxlength="16"
                        type="text"
                        name={$hero.name}
                        bind:value={heroNameInput}
                    />
                </form>
            </span>
        {/if}
        <p>
            {$hero.getJob().name} - {$hero.level} ({($hero.experience/$hero.experienceToNextLevel()*100).toFixed(2)}%)
        </p>
        <p>{$hero.getLocation()}</p>
    </div>

    <div class="btn-container">
        <button on:click|preventDefault|stopPropagation={Send}>
            {#if $hero.isInLocation()}
                Retrieve
            {:else}
                Send
            {/if}
        </button>
    </div>
</div>

<Modal bind:showModal >
    <div class="hero-modal">
        {#if !heroEdit}
        <h1 on:click={SwitchToEdit} on:keypress={null}>{$hero.name}</h1>
    {:else}
        <span>
            <form on:submit|preventDefault={SetName}>
                <h1>
                    <input
                        type="text"
                        name={$hero.name}
                        bind:value={heroNameInput}
                    />
                </h1>
            </form>
        </span>
    {/if}
        <h3>{$hero.getJob().name} - {$hero.level}</h3> 
        <div>
            <div class="space"/>
            <p>Experiences : {$hero.experience}/{$hero.experienceToNextLevel()} ({Math.round($hero.experience/$hero.experienceToNextLevel()*100)}%)</p>
            <Progressbar height={10} barColor="#77CDF3" borderPixel={1} progress={($hero.experience/$hero.experienceToNextLevel()) * 100}/>
            <div class="space"/>
            <p>Location : {$hero.getLocation()} {$hero.isInLocation() ? "(farming...)" : "(waiting...)"}</p>
            <div class="space"/>
            <p>Damage : {$hero.attack}</p>
        </div>
    </div>
</Modal>

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
        font-size: small;
    }
    button {
        margin-right: 1em;
        padding: 0.3em 0.8em 0.3em 0.8em;
    }
    p {
        font-size: 0.8vw;
    }
    .hero-modal {
        min-width: 22vw;
    }
    .space {
        margin-bottom: 0.35vw;
    }
</style>
