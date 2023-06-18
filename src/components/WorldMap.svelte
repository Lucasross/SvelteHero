<script lang="ts">
    import WorldMapLocation from "./WorldMapLocation.svelte";
    import Title from "./generic/Title.svelte";
</script>

<div>
    <Title label="World" />
    <div class="template worldmap">
        <img src="pictures/regions/world_map.png" alt="world map">
        
        <WorldMapLocation x={48} y={22} area_id={"Snowy mountains"}/>
        <WorldMapLocation x={28} y={34} area_id={"Plains of Koloh"}/>
        <WorldMapLocation x={9} y={32} area_id={"Dark forest"}/>
        <WorldMapLocation x={36} y={0} area_id={"Demon's castle"}/>
        <WorldMapLocation x={33} y={56} area_id={"Keyns village"}/>
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
    .worldmap > img{
        display: block;
        width: 100%;
    }
</style>