import Loot from "./Loot";

export default class Item extends Loot {
    public static items: Item[] = [];
    
    protected picturesPath(): string {
        return "items";
    }

    public static getById(id: string): Item {
        return Loot.getLootById<Item>(Item.items, id, "items");
    }
}

Item.items.push(new Item("Iron", "iron", Loot.golfForLevel(5) / 3));
Item.items.push(new Item("Ardanium", "ardanium", Loot.golfForLevel(40) / 3));