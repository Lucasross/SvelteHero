<script lang="ts">
    import type Hero from "../data/Hero";
    import HeroItemView from "./HeroItemView.svelte";
    import { writableHero as hero } from "../store/Stores";

    function setName(event) {
		hero.update(h => SetName(h, event.detail.name));
	}

    function SetName(hero: Hero, name: string) : Hero {
		hero.name = name;
		return hero;
	}
</script>

<HeroItemView hero={hero} on:setName={setName}/>
<HeroItemView hero={hero} on:setName={setName}/>
<HeroItemView hero={hero} on:setName={setName}/>
<HeroItemView hero={hero} on:setName={setName}/>