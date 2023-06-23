<script lang="ts">
    import { onMount } from "svelte";
    import Title from "./generic/Title.svelte";
    import { guild } from "../store/Stores";
    import tooltip from "../utility/Tooltip";

    let grid;

    onMount(async () => {
        resizeItem();
    })

    function resizeItem() {
        grid.style.setProperty('--grid-item-height', grid.firstChild.offsetWidth + 'px');
    }
</script>

<svelte:window on:resize={resizeItem}></svelte:window>
<div class="template">
    <Title label="Inventory" />
    <div bind:this={grid} class="grid grid-style">
        {#each [...$guild.inventory] as [key, value]}
        <div class="slot">
            <img title="{key} x{value}" use:tooltip src="pictures/items/{key}.png" alt="iron"/>
            <p title="{key} x{value}" use:tooltip>{value}</p>
        </div>
        {/each}
        
    </div>
</div>

<style>
    .template {
        background-color: #FDFDFD;
    }
    
    .grid {
        --grid-layout-gap: 2px;
        --grid-column-count: 6;
        --grid-item--min-width: 50px;
        --grid-item-height: 50px;
        
        /**
        * Calculated values.
        */
        --gap-count: calc(var(--grid-column-count) - 1);
        --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
        --grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));
        
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr));
        grid-gap: var(--grid-layout-gap);
    }
    
    .grid-style {
        padding: 2px;
        border: 1px solid black;
        border-top: 0;
    }

    .slot {
        border-radius: 15%;
        height: var(--grid-item-height);
        border: 1px solid #111111;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
