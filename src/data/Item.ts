import Loot, { LootType } from "./Loot";

export default class Item extends Loot {
    public static items: Item[] = [];
    
    protected picturesPath(): string {
        return "items";
    }

    public getType(): LootType {
        return LootType.Item;
    }

    public getTooltip(): string {
        return `${this.name}<br>Price : ${this.gold}`;
    } 

    public static getById(id: string): Item {
        return Loot.getLootById<Item>(Item.items, id, "items");
    }

    public static toItemList(id: string[]): Item[] {
        return id.map(id => this.getById(id));
    }


    public static readonly upgrade10 = ["Iron"]
}

Item.items.push(new Item("Iron", "iron", Loot.golfForLevel(5) / 3, 4));
Item.items.push(new Item("Ardanium", "ardanium", Loot.golfForLevel(40) / 3, 4));