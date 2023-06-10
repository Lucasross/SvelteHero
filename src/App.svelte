<script lang="ts">
    import HeroesList from "./components/HeroesList.svelte";
import type Hero from "./data/Hero";
	import { writableHero as hero } from "./store/Stores";

	function setLevel() {
		hero.update(SetLevel);
	}

	function SetLevel(hero : Hero) : Hero {
		hero.level = hero.level + 1;
		return hero;
	}
</script>

<main class="main">
	<content class="content">
		<div class="sidecol">
			<HeroesList/>
		</div>
		<div class="maincol">
			
			<button on:click={setLevel}>
				Levelup
			</button>
			<p>Level : {$hero.level}</p>
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