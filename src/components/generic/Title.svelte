<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import AreaData from "../../data/AreaData";
    import { area_id, guild, heroes } from "../../store/Stores";

    export let label: String;
    export let enableGold: boolean = false;
    export let area: AreaData = null;
    export let sellAll: boolean = null;

    let dps = 0;

    if (area != null) {
        dps = area.getAreaDps();

        heroes.forEach((h) =>
            h.subscribe(h => {
                dps = AreaData.getById($area_id).getAreaDps();
            })
        );

        area_id.subscribe(a => {
            dps = AreaData.getById(a).getAreaDps();
        });
    }

    const dispatch = createEventDispatcher();
    
    function sellAllItem() {
        dispatch('sellAll');
    }
</script>

<div class="container">
    <div class="title">
        {#if enableGold}
            <img
                style="display: inline-block"
                height="16px"
                src="pictures/cash.png"
                alt="cash"
            />
            <p style="display:inline;">{$guild.gold}</p>
        {/if}
    </div>
    <p class="title">{label}</p>
    <p class="title">
        {#if area != null}
            <img
                style="display: inline-block"
                height="16px"
                src="pictures/damage-sword.png"
                alt="sword"
            />
            <p style="display:inline;">{dps}</p>
        {/if}
        {#if sellAll != null}
            <button on:click={sellAllItem}><i class="fa-solid fa-coins" style="color: #fcba03"></i> All</button>
        {/if}
    </p>
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }
    .container {
        display: flex;
        border: solid black 1px;
        padding: 5px 0 5px 0;
        background-color: #d8eaea;
    }
    .title {
        flex: 1;
        text-align: center;
    }
    button {
        font-size: small;
        padding: 0px 5px;
    }
</style>
