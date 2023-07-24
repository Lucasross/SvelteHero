<script lang="ts">
    import { onMount } from "svelte";
    import Title from "./generic/Title.svelte";
    import { guild } from "../store/Stores";
    import tooltip from "../utility/Tooltip";
    import ContextMenu from "./generic/ContextMenu.svelte";
    import Sprite from "./generic/Sprite.svelte";
    import Equipment from "../data/Equipment";
    import EquipmentSelection from "./modal/EquipmentSelection.svelte";
    import Modal from "./generic/Modal.svelte";
    import { afterUpdate, subscribe } from "svelte/internal";
    import type Guild from "../data/Guild";
    import type Loot from "../data/Loot";
    import Item from "../data/Item";
    import { Utility } from "../utility/Utility";

    let grid;
    let contextMenu;
    let equipModal: Modal;
    let mounted: boolean = false;
    $: selectedEquipment = null;
    $: selectedItem = null;
    $: showEquipmentModal = false;

    export let isItems: boolean = true;

    onMount(async () => {
        resizeItem();
        mounted = true;
    });

    afterUpdate(() => {
        if (mounted) resizeItem();
    });

    function resizeItem() {
        grid.style.setProperty(
            "--grid-item-height",
            grid.firstChild.offsetWidth + "px"
        );
    }

    function openEquipmentContextMenu(e, equipmentId: string) {
        selectedEquipment = Equipment.getById(equipmentId);
        contextMenu.leftClickContextMenu(e);
    }

    function openItemContextMenu(e, itemId: string) {
        selectedItem = Item.getById(itemId);
        contextMenu.leftClickContextMenu(e);
    }

    function equip() {
        showEquipmentModal = true;
    }

    function sell() {
        guild.update((g) => {
            sellEquipment(selectedEquipment, g);
            return g;
        });
    }

    function sellItem(amount: number) {
        guild.update((g) => {
            sellItems(selectedItem, g, amount);
            return g;
        });
    }

    function sellEquipment(loot: Loot, guild: Guild) {
        guild.gold += loot.gold;
        guild.equipment.splice(guild.equipment.indexOf(loot.id), 1);
    }

    function sellItems(loot: Loot, guild: Guild, amount: number) {
        if(loot != null && guild.inventory.has(loot.id) && guild.inventory.get(loot.id) > amount) {
            guild.gold += loot.gold * amount;
            Utility.setOrAdd(guild.inventory, loot.id, -amount);
        }
    }

    function wip() {
        alert("wip");
    }

    let menuEquipment = [
        {
            name: "equip",
            onClick: equip,
            displayText: "Equip",
            class: "fa-solid fa-shirt",
            style: "",
        },
        {
            name: "upgrade",
            onClick: wip,
            displayText: "Upgrade",
            class: "fa-solid fa-hammer",
            style: "",
        },
        {
            name: "craft",
            onClick: wip,
            displayText: "Craft",
            class: "fa-solid fa-screwdriver-wrench",
            style: "",
        },
        {
            name: "hr",
        },
        {
            name: "Sell",
            onClick: sell,
            displayText: "Sell",
            class: "fa-solid fa-coins",
            style: "color: #fcba03",
        },
    ];

    let menuItems = [
        {
            name: "Sell",
            onClick: () => sellItem(1),
            displayText: "Sell",
            class: "fa-solid fa-coins",
            style: "color: #fcba03",
        },
        {
            name: "Sellx10",
            onClick: () => sellItem(10),
            displayText: "Sell x10",
            class: "fa-solid fa-coins",
            style: "color: #fcba03",
        },
        {
            name: "Sellx100",
            onClick: () => sellItem(100),
            displayText: "Sell x100",
            class: "fa-solid fa-coins",
            style: "color: #fcba03",
        },
    ];

    function sellAll() {
        guild.update((g) => {
            g.equipment.forEach((eId) => {
                let l: Loot = Equipment.getById(eId);
                g.gold += l.gold;
                g.equipment[g.equipment.indexOf(l.id)] = null;
            });
            g.equipment = g.equipment.filter((e) => e != null);
            return g;
        });
    }

    function sellAllItems() {
        guild.update((g) => {
            g.inventory.forEach((value: number, key: string) => {
                let l: Loot = Item.getById(key);
                g.gold += l.gold * value;
                Utility.setOrAdd(g.inventory, key, -value);
            });
            return g;
        });
    }
</script>

<svelte:window on:resize={resizeItem} />
<div class="template">
    <Title
        label={isItems ? "Inventory" : "Equipment"}
        sellAll={true}
        on:sellAll={isItems ? sellAllItems : sellAll}
    />
    <ContextMenu
        bind:this={contextMenu}
        menuItems={isItems ? menuItems : menuEquipment}
    />
    <Modal bind:this={equipModal} bind:showModal={showEquipmentModal}>
        <EquipmentSelection
            equipment={selectedEquipment}
            on:equip={() => equipModal.close()}
        />
    </Modal>
    <div bind:this={grid} class="grid grid-style">
        {#if isItems}
            {#each [...$guild.inventory] as [key, value]}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    on:click|preventDefault|stopPropagation={(e) =>
                        openItemContextMenu(e, key)}
                    class="slot"
                >
                    <img
                        title="{key} x{value}"
                        use:tooltip
                        src="pictures/items/{key}.png"
                        alt={key}
                    />
                    <p title="{key} x{value}" use:tooltip>{value}</p>
                </div>
            {/each}
        {:else}
            {#each $guild.equipment as key}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                    on:click|preventDefault|stopPropagation={(e) =>
                        openEquipmentContextMenu(e, key)}
                    class="slot"
                >
                    <Sprite
                        tooltipText={Equipment.getById(key).getTooltip()}
                        sprite={Equipment.getById(key).getSprite()}
                    />
                </div>
            {/each}
        {/if}
    </div>
</div>

<style>
    .template {
        background-color: #fdfdfd;
    }

    .grid {
        --grid-layout-gap: 2px;
        --grid-column-count: 6;
        --grid-item--min-width: 50px;
        --grid-item-height: 50px;

        /**
        * Calculated values.
        */
        --gap-count: calc(var(--grid-column-count) - 1);
        --total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));
        --grid-item--max-width: calc(
            (100% - var(--total-gap-width)) / var(--grid-column-count)
        );

        display: grid;
        grid-template-columns: repeat(
            auto-fill,
            minmax(
                max(var(--grid-item--min-width), var(--grid-item--max-width)),
                1fr
            )
        );
        grid-gap: var(--grid-layout-gap);
    }

    .grid-style {
        padding: 2px;
        border: 1px solid black;
        border-top: 0;
    }

    .slot {
        border-radius: 15%;
        height: var(--grid-item-height);
        border: 1px solid #111111;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
</style>
