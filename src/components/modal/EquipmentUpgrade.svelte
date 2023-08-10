<script lang="ts">
    import type { InventoryEquipment } from "../../data/Guild";
    import Sprite from "../generic/Sprite.svelte";

    export let target: InventoryEquipment;
</script>

<div class="container">
    <div class="slot">
        <Sprite sprite={target?.getEquipment().getSprite()}/>
    </div>
    {@html target != null ? target.getEquipment().getTooltipDifference(target.getStatsEffects(), target.getStatsEffects(target.upgradeLevel + 1), target.upgradeLevel) : ""}
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
</style>
