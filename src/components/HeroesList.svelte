<script lang="ts">
  import HeroItemView from "./HeroItemView.svelte";
  import { heroes as heroesList, guild, heroesUpdate } from "../store/Stores";
  import Title from "./generic/Title.svelte";
  import Hero from "../data/Hero";
  import { get } from "svelte/store";
  import CharacterCreation from "./CharacterCreation.svelte";

  $: heroes = heroesList;

  let showModal = false;

  heroesUpdate.subscribe(u => {
    if(u) {
      heroes = heroesList;
    }
  });

  function recruitHero() {
    if (!$guild.GetShaanahPastFlag() && $guild.pastShaanahHeroesCapacityReach()) {
      alert("Beat Past's Shaanah to recruit more heroes")
      return
    }

    if(get(guild).gold > Hero.goldForNextHero(heroes.length)) {
      showModal = true;
    } else {
      alert("Not enough gold to recruit")
    }
  }
  
  function onHeroCreated() {
    guild.update(g => g.recruit(heroes.length - 1));
  }
</script>

<div>
  <CharacterCreation bind:showModal closable={true} on:heroCreated={onHeroCreated}/>
  <Title label="Heroes" />
  <div class="border">
    {#each heroes as hero, i}
      <HeroItemView {hero} index={i} />
    {/each}
    <div class="recruit-container background-color-{heroes.length % 2}">
      <button on:click={recruitHero}> 
        Recruit
        {#if !$guild.GetShaanahPastFlag() && $guild.pastShaanahHeroesCapacityReach()}
        (Lock)
        {/if}
        <br>
        <img width="16px" src="pictures/cash.png" alt="cash-icon" style="vertical-align: middle;"> 
        {#if heroes.length > 0}
          {Math.ceil(Hero.goldForNextHero(heroes.length)).toLocaleString("fr-FR")}
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
