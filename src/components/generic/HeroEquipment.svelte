<script lang="ts">
    import { get, type Writable } from "svelte/store";
    import type Hero from "../../data/Hero";
    import { SlotType } from "../../data/Equipment";
    import Sprite from "./Sprite.svelte";
    import { guild } from "../../store/Stores";
    import type { InventoryEquipment } from "../../data/Guild";

    export let hero: Writable<Hero>;
    let equipmentDetail: HTMLDivElement;
    var selectedEquipment: InventoryEquipment;

    export const reset = () => {
        selectedEquipment = null;
    }

    function show(invEquipment: InventoryEquipment, e) {
        if(e.button === 0) {
            if(selectedEquipment != invEquipment) {
                selectedEquipment = invEquipment;
            } else {
                selectedEquipment = null;
            }
        } else if (e.button === 2 || e == null) {
            hero.update(h => {
                h.unequip(invEquipment.getEquipment().slotType, guild);
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
                <div on:mousedown|preventDefault={e => show(slot.get(), e)} class:selected={selectedEquipment == slot.equipment} class="slot">
                    <Sprite sprite={slot.get().getEquipment().getSprite()}/>
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
        {#if selectedEquipment == null}
            Left click on an equipment to show/hide detail.<br>
            Right click ton un-equip.
            {#each $hero.equipments() as slot}
                {#if !slot.empty()}
                    <p><b>· </b>{@html slot.get().getNicifiedName()}</p>
                {:else}
                    <p><b>· </b>Empty - {SlotType[slot.slotType]}</p>
                {/if}
            {/each}
        {:else}
            {@html selectedEquipment.getEquipment().getTooltip(get(hero), selectedEquipment.getStatsEffects(), selectedEquipment.upgradeLevel)}
        {/if}
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