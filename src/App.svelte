<script lang="ts">
    import HeroesList from "./components/HeroesList.svelte";
	import Area from "./components/Area.svelte";
	import AreaData from "./data/AreaData";
</script>

<main class="main">
	<content class="content">
		<div class="sidecol">
			<HeroesList/>
		</div>
		<div class="maincol">
			<Area area={AreaData.areas[0]}/>
		</div>
		<div class="sidecol">
	
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
		flex: 1;                             /* THE KEY RULE */
		height: 100%;
		border: 1px solid black;             /* non-essential decorative styles */
	}
	
	.maincol {
		margin-left: 50px;
		margin-right: 50px;
		flex: 1.8;                             /* THE KEY RULE */
		height: 100%;
		border: 1px solid black;             /* non-essential decorative styles */
	}
</style>