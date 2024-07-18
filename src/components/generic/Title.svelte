<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import AreaData from "../../data/AreaData";
    import { area_id, region_id, guild, heroes } from "../../store/Stores";
    import { get } from "svelte/store";
    import { Utility } from "../../utility/Utility";
    import type RegionData from "../../data/RegionData";

    export let label: String;
    export let enableGold: boolean = false;
    export let area: AreaData = null;
    export let dismantleAll: boolean = null;
    export let sellAll: boolean = null;
    export let regionData: RegionData = null;

    let dps = 0;
    $:region = regionData;

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

    let goldDisplay: HTMLParagraphElement;
    let prevGold: number;
    prevGold = get(guild).gold;

    console.log(dismantleAll)

    guild.subscribe(g => {
        if(goldDisplay != null && prevGold != g.gold) {
            let delta = Math.abs(g.gold - prevGold);
            let sign : string = prevGold < g.gold ? "+" : "-";

            const span = document.createElement("span");
            const value = document.createTextNode(`${sign}${delta}`);
            
            span.classList.add("goldAnim");
            
            span.appendChild(value);
            goldDisplay.appendChild(span);  
            
            prevGold = g.gold;

            setTimeout(s => {
                s.remove();
            }, 850, span);
        }
    })
    
    function sellAllItem() {
        dispatch('sellAll');
    }

    function dismantleAllItem() {
        dispatch('dismantleAll');
    }

    function travelTo(regionId: string) {
        dispatch('travel', {
            regionId: regionId
        });
    }
</script>

<div class="container">
    <div class="title">
        {#if enableGold}
            <p class="gold-animation-container" bind:this={goldDisplay}>
                {Utility.toLocalFixed($guild.gold)}
                <i class="fa-solid fa-coins" style="color: #fcba03"></i>
            </p>
        {/if}
        {#if dismantleAll != null && dismantleAll == true}
            <button on:click={dismantleAllItem}><i class="fa-solid fa-hammer"></i>All</button>
        {/if}
        {#if region != null && region.hasLeftRegion() && region.leftRegionUnlocked($guild)}
            <button on:click={() => travelTo(region.leftRegion)}><i class="fa-solid fa-arrow-left"></i> {region.getLeftRegion().name}</button>
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
            <button on:click={sellAllItem}><i class="fa-solid fa-coins" style="color: #fcba03"></i>All</button>
        {/if}
        {#if region != null && region.hasRightRegion() && region.rightRegionUnlocked($guild)}
            <button on:click={() => travelTo(region.rightRegion)}>{region.getRightRegion().name} <i class="fa-solid fa-arrow-right"></i></button>
        {/if}
    </p>
</div>

<style>
    * {
        margin: 0;
    }
    .container {
        display: flex;
        border: solid black 1px;
        padding: 5px 0 5px 0;
        background-color: #d8eaea;
        align-items: center;
    }
    .title {
        flex: 1;
        text-align: center;
    }
    i {
        margin-right: 3px;
    }
    .gold-animation-container {
        display: inline;
        position: relative;
    }
    :global(.goldAnim) {
        animation: fadeInMoveUp 0.9s;
        font-size: small;
        position: absolute;
    }

    @keyframes fadeInMoveUp {
        0% { 
            opacity: 1;
            bottom: 0px;
        }
        15% { 
            opacity: 1;
            bottom: 0px;
        }
        100% { 
            opacity: 0; 
            bottom: 25px;
        }
    }
</style>
