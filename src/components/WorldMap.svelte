<script lang="ts">
    import Title from "./generic/Title.svelte";
    import { area_id as area } from "../store/Stores";

    function select(id: string) {
        area.update(a => a = id);
    }
</script>

<div>
    <Title label="World" />
    <div class="template worldmap">
        <img src="pictures/regions/world_map.png" alt="world map">
        <div class="location" style="top: 32%; left: 22%;" on:click={() => select("Plains of Koloh")} on:keydown={null}>
            <p>Plains of lokoh</p>
            <img width="24" src="pictures/regions/compass.png" alt="position">
        </div>

        <div class="location" style="top: 46%; left: 45%;" on:click={() => select("Snowy mountains path")} on:keydown={null}>
            <p>Snowy mountains</p>
            <img width="24" src="pictures/regions/compass.png" alt="position">
        </div>
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
    .location {
        position: absolute;
        width: 60px;
        text-align: center;
    }
    .location:hover {
        background-color: #dbdbdbaa;
        border: black solid 1px;
    }
    .location > p {
        font-size: x-small;
        font-weight: 800;
        margin: 0;
        padding: 0;
    }
</style>