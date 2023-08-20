import Loot, { LootType } from "./Loot";

export default class Item extends Loot {
    public static items: Item[] = [];
    
    protected picturesPath(): string {
        return "items";
    }

    public getType(): LootType {
        return LootType.Item;
    }

    public getTooltip(amount: number = 0): string {
        return `${this.name} (x${amount})
        <br><i class="fa-solid fa-coins" style="color: #fcba03"></i> ${this.gold} (${this.gold * amount})`;
    } 

    public static getById(id: string): Item {
        return Loot.getLootById<Item>(Item.items, id, "items");
    }

    public static toItemList(id: string[]): Item[] {
        return id.map(id => this.getById(id));
    }


    public static readonly upgrade10 = ["Granacier", "Jabacite"]
    public static readonly upgrade20 = ["Primavite", "Patium", "Morvite"]
    public static readonly upgrade30 = ["Pepitium", "Triarite", "Ronavite"]
    public static readonly upgrade40 = ["corite", "lunacier", "carapium"]
}

Item.items.push(new Item("Granacier", "granacier", Loot.golfForLevel(5) / 5, 2));
Item.items.push(new Item("Jabacite", "jabacite", Loot.golfForLevel(5) / 3, 1));

Item.items.push(new Item("Morvite", "morvite", Loot.golfForLevel(15) / 5, 4));
Item.items.push(new Item("Patium", "patium", Loot.golfForLevel(15) / 2.5, 2));
Item.items.push(new Item("Primavite", "primavite", Loot.golfForLevel(15), 1));

Item.items.push(new Item("Pepitium", "pepitium", Loot.golfForLevel(25) / 5, 6));
Item.items.push(new Item("Ronavite", "ronavite", Loot.golfForLevel(25) / 3, 3));
Item.items.push(new Item("Triarite", "triarite", Loot.golfForLevel(25) / 2, 1));

Item.items.push(new Item("Corite", "corite", Loot.golfForLevel(35) / 5, 4));
Item.items.push(new Item("Lunacier", "lunacier", Loot.golfForLevel(35) / 3, 3));
Item.items.push(new Item("Carapium", "carapium", Loot.golfForLevel(35) / 2, 1));

Item.items.push(new Item("Seed of risk", "exalde", Loot.golfForLevel(45) * 2, 1));
Item.items.push(new Item("Seed of savagery", "florathril", Loot.golfForLevel(45) * 2, 1));
Item.items.push(new Item("Seed of dispair", "ambricite", Loot.golfForLevel(45) * 2, 1));
Item.items.push(new Item("Shaanah's echos", "vionatite", Loot.golfForLevel(55) * 4, 1));
