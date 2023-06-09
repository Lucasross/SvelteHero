<script lang="ts">
    import { writable } from "svelte/store";
	import HeroItemView from "./components/HeroItemView.svelte";
    import type Hero from "./data/Hero";
	import { writableHero as hero } from "./store/Stores";

	function setLevel() {
		hero.update(SetLevel);
	}

	function setName(event) {
		hero.update(h => SetName(h, event.detail.name));
	}

	function SetLevel(hero : Hero) : Hero {
		hero.level = hero.level + 1;
		return hero;
	}

	function SetName(hero: Hero, name: string) : Hero {
		hero.name = name;
		return hero;
	}
	
	console.log($hero);
</script>

<main>
	<HeroItemView hero={hero} on:setName={setName}/>
	<button on:click={setLevel}>
		Levelup
	</button>
	<p>Level : {$hero.level}</p>
</main>