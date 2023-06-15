<script lang="ts">
    import HeroesList from "./components/HeroesList.svelte";
	import Area from "./components/Area.svelte";
	import AreaData from "./data/AreaData";
    import WorldMap from "./components/WorldMap.svelte";
    import Title from "./components/generic/Title.svelte";
	import { area_id } from "./store/Stores";

	let frameSpeed = 1; //in seconds
	let area;

	setInterval(() => {

		AreaData.areas.filter(a => a.needUpdate).forEach(a => a.update());
		area.update();

    }, frameSpeed * 1000);
</script>

<main class="main">
	<content class="content">
		<div class="sidecol vertical-list">
			<HeroesList/>
		</div>
		<div class="maincol vertical-list">
			<Area bind:this={area} area={AreaData.getById($area_id)}/>
			<WorldMap/>
		</div>
		<div class="sidecol vertical-list">
			<Title label="Empty"/>
		</div>
	</content>
</main>

<style>
	.main {
		margin-right: 10em;
		margin-left: 10em;
	}

	.content {
		display: flex;
		width: 100%;
	}

	.sidecol {
		flex: 1;                             
		height: 100%;
	}

	.maincol {
		margin-left: 50px;
		margin-right: 50px;
		min-width: 500px;
		flex: 1.8;                             
		height: 100%;
	}

	.vertical-list > :global(*) {
		margin-bottom: 1em;
	}

	.vertical-list > :global(:last-child) {
		margin-bottom: 0;
	}
</style>