<script lang="ts">
  import HeroItemView from "./HeroItemView.svelte";
  import { heroes } from "../store/Stores";
  import Title from "./generic/Title.svelte";
  import AreaData from "../data/AreaData";
</script>

<Title label="Heroes" />

{#each heroes as hero, i}
  <HeroItemView {hero} index={i}/>
{/each}
