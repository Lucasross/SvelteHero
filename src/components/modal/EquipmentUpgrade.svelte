<script lang="ts">
    import type { InventoryEquipment } from "../../data/Guild";
    import UpgradeRecipe, { ExportRecipe } from "../../data/UpgradeRecipe";
    import Item from "../../data/Item";
    import Sprite from "../generic/Sprite.svelte";
    import { guild } from "../../store/Stores";
    import { Utility } from "../../utility/Utility";
    import { createEventDispatcher } from "svelte";

    export let target: InventoryEquipment;
    let recipe: ExportRecipe;

    $: target = target;
    $: recipe = target != null ? UpgradeRecipe.getRecipeFor(target) : null;

    const dispatch = createEventDispatcher();

    function UpgradeTarget() {
        if($guild.canCraftRecipe(recipe)) {
            guild.update(g => g.upgradeEquipment(target).removeRecipeItems(recipe));
        }
        dispatch("craft");
    }
</script>

{#if target != null && target.upgradeLevel < 4}
<div class="container">
    <div class="slot">
        <Sprite sprite={target?.getEquipment().getSprite()}/>
    </div>
    {@html target.getEquipment().getTooltipDifference(target.getStatsEffects(), target.getStatsEffects(target.upgradeLevel + 1), target.upgradeLevel)}
    <hr>
    <div class="recipe-container">
        <h3>Upgrade Recipe</h3>
    </div>
    {#each recipe.recipes as element }
        {#if element[1] > 0}
        <div class="recipe-container">
            <p style="font-size:xx-large"><b>·</b></p>
            <Sprite sprite={Item.getById(element[0]).getSprite()}/>
            <p style="font-size:large; margin-left: 5px">{Utility.SafeGet($guild.inventory, element[0], 0)} / {element[1]}</p>
        </div>
        {/if}
    {/each}
    <div class="recipe-container">
        <p style="font-size:xx-large"><b>·</b></p> 
        <p style="font-size:large;"><i class="fa-solid fa-coins" style="color:#fcba03; margin: 0 5px 0 5px"></i> {recipe.gold.toLocaleString()}</p>
    </div>
    <div class="recipe-container">
        <button on:click={UpgradeTarget} disabled={!$guild.canCraftRecipe(recipe)}>Upgrade</button>
    </div>
</div>
{/if}

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
