<script lang="ts">
    import AreaData from "../data/AreaData";
    import tooltip from '../utility/Tooltip';
    import { area_id as storedArea } from "../store/Stores";

    export let x: number;
    export let y: number;
    export let area_id: string;

    let area = AreaData.getById(area_id);
    
    function select() {
        storedArea.update(a => a = area_id);
    }
</script>

<div class="location" style="top: {y}%; left: {x}%;" on:click={select} on:keydown={null}>
    <p title="{area.levelRange()}" use:tooltip>{area.name}</p>
    <img title="{area.levelRange()}" use:tooltip width="24" src="pictures/regions/compass.png" alt="position">
</div>

<style>
    .location {
        position: absolute;
        width: 60px;
        text-align: center;
    }
    .location:hover {
        background-color: #c4c4c4aa;
        border: black solid 1px;
    }
    .location > p {
        font-size: x-small;
        font-weight: 800;
        margin: 0;
        padding: 0;
    }
</style>