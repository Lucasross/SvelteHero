<script lang="ts">
  import type Hero from "../data/Hero";
  import HeroItemView from "./HeroItemView.svelte";
  import { heroes } from "../store/Stores";
  import Title from "./generic/Title.svelte";
  import AreaData from "../data/AreaData";

  function setName(event) {
    heroes.update((h) => SetName(h, event));

    function SetName(heroes: Array<Hero>, event): Array<Hero> {
      heroes[event.detail.index].name = event.detail.name;
      console.log("list : " + heroes[event.detail.index]);
      return heroes;
    }
  }

  function sendHero(event) {
    heroes.update((h) => SetArea(h, event));

    function SetArea(heroes: Array<Hero>, event): Array<Hero> {
      if (heroes[event.detail.index].isInLocation()) {
        heroes[event.detail.index].sendToGuild();
      } else {
        heroes[event.detail.index].sendToArea(AreaData.areas[0]);
      }

      return heroes;
    }
  }
</script>

<Title label="Heroes" />

{#each $heroes as hero, i}
  <HeroItemView {hero} index={i} on:sendHero={sendHero} on:setName={setName} />
{/each}
