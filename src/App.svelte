<script lang="ts">
    import HeroesList from "./components/HeroesList.svelte";
	import Area from "./components/Area.svelte";
	import AreaData from "./data/AreaData";
    import WorldMap from "./components/WorldMap.svelte";
    import Title from "./components/generic/Title.svelte";
</script>

<main class="main">
	<content class="content">
		<div class="sidecol vertical-list">
			<HeroesList/>
		</div>
		<div class="maincol vertical-list">
			<Area area={AreaData.areas[1]}/>
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