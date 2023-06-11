<script lang="ts">
    //import Area from "../data/Area";
    import Title from "./generic/Title.svelte";

    //let area = new Area("Plain's of koloh", "area_plains_beginner");
</script>

<Title label="Area"/>
<div class="container">
    <img src="pictures/plains.jpg" alt="area" />
</div>
<Title label="Area"/>
<style>

    .container > img {
        display: block;
        height: 250px;
        width: 100%;
        object-fit: cover;
    }
</style>