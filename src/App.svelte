<script lang="ts">
	import HeroesList from "./components/HeroesList.svelte";
	import Area from "./components/Area.svelte";
	import AreaData from "./data/AreaData";
	import WorldMap from "./components/WorldMap.svelte";
	import { guild } from "./store/Stores";
    import CharacterCreation from "./components/CharacterCreation.svelte";
    import Inventory from "./components/Inventory.svelte";
    import Settings from "./components/Settings.svelte";

	let frameSpeed = 1; //in seconds
	let area : Area;

	setInterval(() => {
		AreaData.areas.filter((a) => a.needUpdate()).forEach((a) => a.update(guild));
		area.update();
	}, frameSpeed * 1000);
	
	setInterval(() => {
		AreaData.areas.filter((a) => a.needUpdate()).forEach((a) => a.updateTimer(0.1));
		area.update();
	}, 100) //update every 0.1s
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>{$guild.gold.toFixed(0)} Golds</title> 
</svelte:head>

<main class="main">
	<CharacterCreation/>
	<content class="content">
		<div class="sidecol vertical-list">
			<HeroesList />
			<Inventory isItems={false}/>
			<div style="margin-bottom: 500px"/>
		</div>
		<div class="maincol vertical-list">
			<Area bind:this={area} />
			<WorldMap />
		</div>
		<div class="sidecol vertical-list">
			<Inventory />
			<Settings />
		</div>
	</content>
</main>


<style>
	:global(body) {
		background: url(../pictures/pagebackground.jpg) no-repeat, no-repeat #000000;
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