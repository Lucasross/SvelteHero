<script lang="ts">
    import { element } from "svelte/internal";
    import type { InventoryEquipment } from "../../data/Guild";
    import UpgradeRecipe from "../../data/UpgradeRecipe";
    import Item from "../../data/Item";
    import Sprite from "../generic/Sprite.svelte";
    import { guild } from "../../store/Stores";
    import { get } from "svelte/store";

    export let target: InventoryEquipment;
</script>

<div class="container">
    <div class="slot">
        <Sprite sprite={target?.getEquipment().getSprite()}/>
    </div>
    {@html target != null ? target.getEquipment().getTooltipDifference(target.getStatsEffects(), target.getStatsEffects(target.upgradeLevel + 1), target.upgradeLevel) : ""}
    <hr>
    <h3>Upgrade Recipe</h3>
    {#if target != null}
        {#each UpgradeRecipe.getRecipeFor(target?.getEquipment()) as element}
        <div class="recipe-container">
            <p style="font-size:xx-large"><b>·</b></p>
            <Sprite sprite={Item.getById(element[0]).getSprite()}/>
            <p style="font-size:large">{$guild.inventory.get(element[0])} / {element[1]}</p>
        </div>
        {/each}
    {/if}
</div>

<style>
    .container {
        min-width: 32vw;
    }

    .slot {
        border-radius: 15%;
        height: 60px;
        width: 60px;
        border: 1px solid #111111;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .recipe-container {
        display:flex; 
        flex-direction: row; 
        /* justify-content: center;  */
        align-items: center;
    }

    hr {
        border: none;
        border-bottom: 1px solid #ccc;
        margin: 5px 0px;
    }
</style>
