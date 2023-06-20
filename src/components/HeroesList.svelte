<script lang="ts">
  import HeroItemView from "./HeroItemView.svelte";
  import { createHero, heroes as heroesList, guild, heroesUpdate } from "../store/Stores";
  import Title from "./generic/Title.svelte";
  import Hero from "../data/Hero";
  import { get } from "svelte/store";
  import { Jobs } from "../data/Job";

  $: heroes = heroesList;

  heroesUpdate.subscribe(u => {
    if(u) {
      heroes = heroesList;
    }
  });

  function recruitHero() {
    if(get(guild).gold > Hero.goldForNextHero(heroes.length)) {
      guild.update(g => g.recruit(heroes.length));
      createHero("Derfi", Jobs.Warrior);
    }
  }
</script>

<div>
  <Title label="Heroes" />
  <div class="border">
    {#each heroes as hero, i}
      <HeroItemView {hero} index={i} />
    {/each}
    <div class="recruit-container background-color-{heroes.length % 2}">
      <button on:click={recruitHero}> 
        Recruit
        <br>
        <img width="16px" src="pictures/cash.png" alt="cash-icon" style="vertical-align: middle;"> 
        {#if heroes.length > 0}
          {Hero.goldForNextHero(heroes.length).toLocaleString("fr-FR")}
        {:else}
          Free
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .border {
    border: solid black 1px;
    border-top: 0px;
  }
  .recruit-container {
    display: flex;
    height: 64px;
    justify-content: center;
    align-items: center;
    border-top: solid black 1px;
  }
  .recruit-container * {
    font-weight: bold;
  }
  .background-color-0 {
    background-color: white;
  }
  .background-color-1 {
    background-color: #f8f8f8;
  }
  .recruit-container > button {
    width: 50%;
    margin-bottom: 0;
    font-size: x-small;
  }
</style>
