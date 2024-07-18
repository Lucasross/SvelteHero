<script lang="ts">
    import Title from "./generic/Title.svelte";
    import Sprite from "./generic/Sprite.svelte";
    import { guild } from "../store/Stores";
    import Item from "../data/Item";
    import { Utility } from "../utility/Utility";

    function buyItem(id) {
        var item = Item.getById(id);
        if ($guild.hasGold(item.gold * 100)) {
            guild.update(g => {
                g.gold -= item.gold * 100;
                Utility.setOrAdd(g.inventory, id, 1)
                return g
            })
        } else {
            alert("Not enough gold to buy " + id)
        }
    }
</script>

<div>
    <Title label="Shop" />
    <div class="template">
        <table>
            {#each [...$guild.inventory] as [key, value]}
                <tr on:click={e => {e.preventDefault(); buyItem(key)}}>
                    <td class="align-left fit-32">
                        <Sprite
                            sprite={Item.getById(key).getSprite()}
                            tooltipText={Item.getById(key).getTooltip(value)}
                            alt={key}
                        />
                    </td>
                    <td class="align-left">{Item.getById(key).name}</td>
                    <td class="align-right">{Item.getById(key).gold * 100}</td>
                    <td class="align-right fit-64">
                        <button>x1</button>
                    </td>
                </tr>
            {/each}
        </table>
    </div>
</div>

<style>
    .template {
        border: solid black 1px;
        border-top: 0px;
        background-color: #fdfdfd;
    }
    table {
        border-collapse: collapse;
        width: 100%;
    }
    td:last-child, td:first-child {
        padding-left: 8px;
        padding-right: 8px;
    }
    button {
        height: 20px;
        width: 50px;
        align-items: center;
        transform: translateY(2px);
    }
    .align-left {
        text-align: left;
    }
    .align-right {
        text-align: right;
    }
    tr:nth-child(even) {
        background-color: #f2f2f2;
    }
    tr:hover {
        background-color: #ECECEC;
    }
    .fit-32 {
        width: 32px
    }
    .fit-64 {
        width: 64px
    }
</style>
