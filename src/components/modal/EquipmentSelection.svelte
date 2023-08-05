<script lang="ts">
    import { get, type Writable } from "svelte/store";
    import type Equipment from "../../data/Equipment";
    import { guild, heroes as heroesList, heroesUpdate } from "../../store/Stores";
    import type Hero from "../../data/Hero";
    import { createEventDispatcher } from 'svelte';
    import type { InventoryEquipment } from "../../data/Guild";

    const dispatch = createEventDispatcher();

    $: heroes = heroesList;


    heroesUpdate.subscribe(u => {
        if(u) {
            heroes = heroesList;
        }
    })

    export let inventoryEquipment: InventoryEquipment;

    function equipItem(hero: Writable<Hero>) {
        hero.update(h => {
            h.equip(inventoryEquipment, guild)
            return h;
        });
        dispatch("equip");
    }
</script>

<div class="container">
    {@html inventoryEquipment != null ? inventoryEquipment.getEquipment().getTooltip() : "" }
    <hr>
    <div class="hero-container">
        {#each heroes as hero, i}
        <div class="hero background_{i % 2}">
            <img src="{get(hero).getJob().getPicture()}" alt="class icon" style="border-right: 2px black solid"/>
            <p style="margin-left: 20px">{get(hero).name}</p>
            <p>{get(hero).getJob().name}</p>
            <p style="text-align:end; margin-right: 50px">{get(hero).level}</p>
            <button on:click={() => equipItem(hero)} disabled={!get(hero).canEquip(inventoryEquipment?.getEquipment())}>
                {#if !get(hero).canEquip(inventoryEquipment?.getEquipment())}
                    Low level
                {:else}
                    Equip
                {/if}
            </button>
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
        grid-template-columns: 40px 150px 150px 150px auto;
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
