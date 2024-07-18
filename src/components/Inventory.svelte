<script lang="ts">
    import { onMount } from "svelte";
    import Title from "./generic/Title.svelte";
    import { guild } from "../store/Stores";
    import tooltip from "../utility/Tooltip";
    import ContextMenu from "./generic/ContextMenu.svelte";
    import Sprite from "./generic/Sprite.svelte";
    import EquipmentSelection from "./modal/EquipmentSelection.svelte";
    import Modal from "./generic/Modal.svelte";
    import { afterUpdate } from "svelte/internal";
    import type Guild from "../data/Guild";
    import type Loot from "../data/Loot";
    import Item from "../data/Item";
    import { Utility } from "../utility/Utility";
    import type { InventoryEquipment } from "../data/Guild";
    import EquipmentUpgrade from "./modal/EquipmentUpgrade.svelte";
    import UpgradeRecipe, { ExportRecipe } from "../data/UpgradeRecipe";

    let grid;
    let contextMenu;
    let equipModal: Modal;
    let upgradeModal: Modal;
    let mounted: boolean = false;
    let selectedEquipment: InventoryEquipment;
    $: selectedEquipment = null;
    $: selectedItem = null;
    $: showEquipmentModal = false;
    $: showUpgradeModal = false;

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
            grid.firstChild.offsetWidth + "px",
        );
    }

    function openEquipmentContextMenu(e, invEquipment: InventoryEquipment) {
        selectedEquipment = invEquipment;
        contextMenu.leftClickContextMenu(e);
    }

    function openItemContextMenu(e, itemId: string) {
        selectedItem = Item.getById(itemId);
        contextMenu.leftClickContextMenu(e);
    }

    function equip() {
        showEquipmentModal = true;
    }

    function dismantle() {
        if (selectedEquipment.lock) {
            alert("This equipment can't be dismantle as it is lock, unlock it and try again.");
            return;
        }

        let recipe: ExportRecipe = UpgradeRecipe.getDismantleFor(selectedEquipment);

        guild.update((g) => {
            // Add all items from recipe (divided by 2)
            recipe.recipes.forEach((item) => {
                for (let i = 0; i < item[1]; i++) {
                    g.addItem(Item.getById(item[0]));
                }
            });

            //Remove equipment from guild
            g.removeEquipment(selectedEquipment);
            return g;
        });
    }

    function dismantleEquipment(equipment: InventoryEquipment, g) {
        let recipe: ExportRecipe = UpgradeRecipe.getDismantleFor(equipment);

        // Add all items from recipe (divided by 2)
        recipe.recipes.forEach((item) => {
            for (let i = 0; i < item[1]; i++) {
                g.addItem(Item.getById(item[0]));
            }
        });
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

    function sellEquipment(invEquipment: InventoryEquipment, guild: Guild) {
        guild.gold += invEquipment.getEquipment().gold;
        guild.removeEquipment(invEquipment);
    }

    function sellItems(loot: Loot, guild: Guild, amount: number) {
        if (
            loot != null &&
            guild.inventory.has(loot.id) &&
            guild.inventory.get(loot.id) > amount
        ) {
            guild.gold += loot.gold * amount;
            Utility.setOrAdd(guild.inventory, loot.id, -amount);
        }
    }

    function upgrade() {
        if (selectedEquipment.upgradeLevel < 4) showUpgradeModal = true;
        else alert("Equipment is already maxed.");
    }

    function lock() {
        guild.update((g) => {
            g.getEquipment(selectedEquipment).lock =
                !g.getEquipment(selectedEquipment).lock;
            return g;
        });
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
            onClick: upgrade,
            displayText: "Upgrade",
            class: "fa-solid fa-screwdriver-wrench",
            style: "",
        },
        {
            name: "dismantle",
            onClick: dismantle,
            displayText: "Dismantle",
            class: "fa-solid fa-hammer",
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
        {
            name: "hr",
        },
        {
            name: "Lock",
            onClick: lock,
            displayText: "Lock",
            class: "fa-solid fa-lock",
            style: "color: #5c5c5c",
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
            g.equipment
                .filter((ie) => !ie.lock)
                .forEach((invEquipment) => {
                    g.gold += invEquipment.getEquipment().gold;
                    g.nullifyEquipment(invEquipment);
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

    function dismantleAllEquipment() {
        guild.update((g) => {
            g.equipment
                .filter((ie) => !ie.lock)
                .forEach((invEquipment) => {
                    dismantleEquipment(invEquipment, g);
                    g.nullifyEquipment(invEquipment);
                });
            g.equipment = g.equipment.filter((e) => e != null);
            return g;
        });
    }
</script>

<svelte:window on:resize={resizeItem} />
<div class="template">
    <Title
        label={isItems ? "Inventory" : "Equipment"}
        dismantleAll={true}
        sellAll={true}
        on:sellAll={isItems ? sellAllItems : sellAll}
        on:dismantleAll={dismantleAllEquipment}
    />
    <ContextMenu
        bind:this={contextMenu}
        menuItems={isItems ? menuItems : menuEquipment}
    />
    <Modal bind:this={equipModal} bind:showModal={showEquipmentModal}>
        <EquipmentSelection
            inventoryEquipment={selectedEquipment}
            on:equip={() => equipModal.close()}
        />
    </Modal>
    <Modal bind:this={upgradeModal} bind:showModal={showUpgradeModal}>
        <EquipmentUpgrade
            target={selectedEquipment}
            on:craft={() => upgradeModal.close()}
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
                    <Sprite
                        sprite={Item.getById(key).getSprite()}
                        tooltipText={Item.getById(key).getTooltip(value)}
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
                    class:lock={key.lock}
                >
                    <Sprite
                        tooltipText={key
                            .getEquipment()
                            .getTooltip(
                                null,
                                key.getStatsEffects(),
                                key.upgradeLevel,
                            )}
                        sprite={key.getEquipment().getSprite()}
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

    .lock {
        border: 1px solid red !important;
    }
</style>
