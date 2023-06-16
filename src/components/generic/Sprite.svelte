<script lang="ts">
    export let sprite;
    export let alt = "unknow";
</script>

{#await sprite}
    <p>Loading sprite...</p>
{:then result}
    <img src={result} {alt} />
{/await}

