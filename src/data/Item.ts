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


    public static readonly upgrade10 = ["jabacite"]
}

Item.items.push(new Item("Jabacite", "jabacite", Loot.golfForLevel(5) / 3, 4));
Item.items.push(new Item("Ardanium", "ardanium", Loot.golfForLevel(40) / 3, 4));