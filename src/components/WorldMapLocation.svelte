<script lang="ts">
    import AreaData from "../data/AreaData";
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
    <p>{area.name}</p>
    <img width="24" src="pictures/regions/compass.png" alt="position">
</div>

<style>
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