<script lang="ts">
    import { element } from "svelte/internal";
    import type { InventoryEquipment } from "../../data/Guild";
    import UpgradeRecipe, { ExportRecipe } from "../../data/UpgradeRecipe";
    import Item from "../../data/Item";
    import Sprite from "../generic/Sprite.svelte";
    import { guild } from "../../store/Stores";
    import { Utility } from "../../utility/Utility";

    export let target: InventoryEquipment;
    let recipe: ExportRecipe;

    $: target = target;
    $: recipe = target != null ? UpgradeRecipe.getRecipeFor(target) : null;
</script>

<div class="container">
    <div class="slot">
        <Sprite sprite={target?.getEquipment().getSprite()}/>
    </div>
    {@html target != null ? target.getEquipment().getTooltipDifference(target.getStatsEffects(), target.getStatsEffects(target.upgradeLevel + 1), target.upgradeLevel) : ""}
    <hr>
    <h3>Upgrade Recipe</h3>
    {#if target != null}
        {#each recipe.recipes as element }
        <div class="recipe-container">
            <p style="font-size:xx-large"><b>·</b></p>
            <Sprite sprite={Item.getById(element[0]).getSprite()}/>
            <p style="font-size:large; margin-left: 5px">{Utility.SafeGet($guild.inventory, element[0], 0)} / {element[1]}</p>
        </div>
        {/each}
        <div class="recipe-container">
            <p style="font-size:xx-large"><b>·</b></p> 
            <p style="font-size:large;"><i class="fa-solid fa-coins" style="color:#fcba03; margin-left: 5px"></i> {recipe.gold}</p>
        </div>
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
        align-items: center;
    }

    hr {
        border: none;
        border-bottom: 1px solid #ccc;
        margin: 5px 0px;
    }
</style>
