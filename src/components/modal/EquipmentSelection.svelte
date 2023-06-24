<script lang="ts">
    import { get, type Writable } from "svelte/store";
    import type Equipment from "../../data/Equipment";
    import { guild, heroes as heroesList, heroesUpdate } from "../../store/Stores";
    import type Hero from "../../data/Hero";

    $: heroes = heroesList;

    heroesUpdate.subscribe(u => {
        if(u) {
            heroes = heroesList;
        }
    })

    export let equipment: Equipment;

    function equipItem(hero: Writable<Hero>) {
        hero.update(h => {
            h.equip(equipment, guild)
            return h;
        });
        
    }
</script>

<div class="container">
    {@html equipment != null ? equipment.getTooltip() : "" }
    <hr>
    <div class="hero-container">
        {#each heroes as hero, i}
        <div class="hero background_{i % 2}">
            <img src="{get(hero).getJob().getPicture()}" alt="class icon" style="border-right: 2px black solid"/>
            <p style="margin-left: 20px">{get(hero).name}</p>
            <p>{get(hero).getJob().name}</p>
            <p style="text-align:end; margin-right: 50px">{get(hero).level}</p>
            <button on:click={() => equipItem(hero)}>Equip</button>
        </div>
        {/each}
    </div>
</div>

<style>
    .container {
        min-width: 32vw;
    }
    .hero-container {
        display: flex;
        flex-direction: column;
    }
    .hero {
        vertical-align: middle;
        display: grid;
        grid-template-columns: 40px 150px 150px auto auto;
    }
    .hero:hover {
        background-color: #ccc;
    }
    .hero img {
        height: 40px;
        flex-shrink: 999;
        object-fit: contain;
    }
    .hero * {
        align-self: center;
    }
    button {
        margin: auto;
    }
    .background_0 {
        background-color: inherit;
    }
    .background_1 {
        background-color: #eee;
    }
    hr{
        border: none;
        border-bottom: 1px solid #ccc;
        margin: 5px 0px;
    }
</style>
