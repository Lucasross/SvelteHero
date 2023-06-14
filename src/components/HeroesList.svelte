<script lang="ts">
  import HeroItemView from "./HeroItemView.svelte";
  import { heroes } from "../store/Stores";
  import Title from "./generic/Title.svelte";
</script>

<div >
    <Title label="Heroes" />
    <div class="border">
        {#each heroes as hero, i}
          <HeroItemView {hero} index={i}/>
        {/each}
    </div>
</div>


<style>
  .border {
    border: solid black 1px;
    border-top: 0px;
  }
</style>