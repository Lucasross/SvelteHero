<script lang="ts">
    import WorldMapLocation from "./WorldMapLocation.svelte";
    import Title from "./generic/Title.svelte";
    import { region_id } from "../store/Stores";
    import RegionData from "../data/RegionData";
    import Sprite from "./generic/Sprite.svelte";

    $: region = RegionData.getById($region_id);
</script>

<div>
    <Title label={region.name} />
    <div class="template worldmap">
        <Sprite sprite={region.getSprite()} />
        {#each region.areas as area}
            <WorldMapLocation x={area.xPos} y={area.yPos} area_id={area.id}/>
        {/each}
    </div>
</div>

<style>
    .template {
        border: solid black 1px;
        border-top: 0px;
    }
    .worldmap {
        position: relative;
    }
    :global(.worldmap > img){
        display: block;
        width: 100%;
    }
</style>