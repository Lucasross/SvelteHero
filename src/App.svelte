<script lang="ts">
	import HeroesList from "./components/HeroesList.svelte";
	import Area from "./components/Area.svelte";
	import AreaData from "./data/AreaData";
	import WorldMap from "./components/WorldMap.svelte";
	import Title from "./components/generic/Title.svelte";
	import { guild } from "./store/Stores";

	let frameSpeed = 1; //in seconds
	let area;

	setInterval(() => {
		AreaData.areas.filter((a) => a.needUpdate()).forEach((a) => a.update(guild));
		area.update();
	}, frameSpeed * 1000);
	
	setInterval(() => {
		AreaData.areas.filter((a) => a.needUpdate()).forEach((a) => a.updateTimer(0.1));
		area.update();
	}, 100) //update every 0.1s
</script>

<main class="main">
	<content class="content">
		<div class="sidecol vertical-list">
			<HeroesList />
		</div>
		<div class="maincol vertical-list">
			<Area bind:this={area} />
			<WorldMap />
		</div>
		<div class="sidecol vertical-list">
			<Title label="Empty" />
		</div>
	</content>
</main>

<style>
	:global(body) {
		background-image: url(../pictures/pagebackground.jpg);
		background-position: center top;
    	background-size: 100% auto;
	}

	:global(body, *) {
		margin: 0;
	}

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
