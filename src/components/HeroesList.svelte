<script lang="ts">
  import type Hero from "../data/Hero";
  import HeroItemView from "./HeroItemView.svelte";
  import { heroes } from "../store/Stores";
    import Title from "./generic/Title.svelte";

  function setName(event) {
    heroes.update((h) => SetName(h, event));

    function SetName(heroes: Array<Hero>, event): Array<Hero> {
      heroes[event.detail.index].name = event.detail.name;
      return heroes;
    }
  }
</script>

<Title label="Heroes"/>

{#each $heroes as hero, i}
  <HeroItemView {hero} index={i} on:setName={setName} />
{/each}
