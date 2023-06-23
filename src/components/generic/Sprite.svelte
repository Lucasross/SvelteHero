<script lang="ts">
    import tooltip from "../../utility/Tooltip";

    export let sprite;
    export let alt = "unknown";
    export let tooltipText: string | null = null;
</script>

{#await sprite}
    <p>Loading sprite...</p>
{:then result}
    {#if tooltipText != null}
        <img title={tooltipText} use:tooltip src={result} {alt} />
    {:else}
        <img src={result} {alt} />
    {/if}
{/await}
