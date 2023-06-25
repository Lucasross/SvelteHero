<script lang="ts">
    import { get, type Writable } from "svelte/store";
    import type Hero from "../../data/Hero";
    import type Equipment from "../../data/Equipment";
    import Sprite from "./Sprite.svelte";
    import { guild } from "../../store/Stores";

    export let hero: Writable<Hero>;
    let equipmentDetail: HTMLDivElement;
    let selectedId: string = null;

    export const reset = () => {
        equipmentDetail.innerHTML = "Click on an equipment to show detail.";
        selectedId = null;
    }

    function show(equipment: Equipment, e) {
        if(e.button === 0) {
            if(selectedId != equipment.id) {
                equipmentDetail.innerHTML = equipment.getTooltip(get(hero));
                selectedId = equipment.id;
            } else {
                equipmentDetail.innerHTML = "Click on an equipment to show detail.";
                selectedId = null;
            }
        } else if (e.button === 2 || e == null) {
            hero.update(h => {
                h.unequip(equipment.slotType, guild);
                return h;
            })
        }
    }
</script>

<svelte:window on:contextmenu|preventDefault={null}/>
<div>
    <div class="slot-container">
        {#each $hero.equipments() as slot}
            {#if !slot.empty()}

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div on:mousedown|preventDefault={e => show(slot.get(), e)} class:selected={selectedId == slot.get().id} class="slot">
                    <Sprite sprite={slot.get().getSprite()}/>
                </div>

            {:else}

                <div class="slot">
                    Empty
                </div>

            {/if}
        {/each}
    </div>

    <hr>
    <div bind:this={equipmentDetail}>
        Click on an equipment to show detail.
    </div>
</div>

<style>
    .slot-container {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
    }
    .slot {
        border-radius: 15%;
        border: 1px solid #111111;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
    }
    .selected {
        border: 1px solid orange;
    }
    hr {
        margin: 5px 0px;
        border: none;
        border-bottom: 1px black solid;
    }
</style>