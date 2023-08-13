<script lang="ts">
    import WorldMapLocation from "./WorldMapLocation.svelte";
    import Title from "./generic/Title.svelte";
</script>

<div>
    <Title label="World" />
    <div class="template worldmap">
        <img src="pictures/regions/world_map.png" alt="world map">
        
        <WorldMapLocation x={28} y={34} area_id={"Training center"}/>
        <WorldMapLocation x={36} y={26} area_id={"Koloh's plains"}/>
        <WorldMapLocation x={9} y={32} area_id={"Dark forest"}/>
        <WorldMapLocation x={33} y={56} area_id={"Keyn's village"}/>
        <WorldMapLocation x={24} y={62} area_id={"Keyn's lair"}/>
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