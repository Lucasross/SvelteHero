<script lang="ts">
    import HeroItemView from "./components/HeroItemView.svelte";
    import Hero from "./data/Hero";

	let name: string = "Lucas";
	let hero: Hero = new Hero(14, "Derfi");

	function handleClick() {
		hero.level += 1;
	}

	function receive(event) {
		hero.name = event.detail.name;
	}
</script>

<main>
	<h1>Hello {name}!</h1>
	<HeroItemView {hero} on:setName={receive}/>
	<button on:click={handleClick}>
		Levelup
	</button>
</main>