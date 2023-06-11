<script lang="ts">
  import type Hero from "../data/Hero";
  import HeroItemView from "./HeroItemView.svelte";
  import { heroes } from "../store/Stores";

  function setName(event) {
    heroes.update((h) => SetName(h, event));

    function SetName(heroes: Array<Hero>, event): Array<Hero> {
      heroes[event.detail.index].name = event.detail.name;
      return heroes;
    }
  }
</script>

<div>
  <p class="title">Heroes</p>
</div>
{#each $heroes as hero, i}
  <HeroItemView {hero} index={i} on:setName={setName} />
{/each}

<style>
  * {
    margin: 0;
    padding: 0;
  }
  .title {
    padding: 5px 0 5px 0;
    background-color: #D8EAEA;
    text-align: center;
    border-bottom: solid black 1px;
 }
</style>
