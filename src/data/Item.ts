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
    public static readonly upgrade50_island = ["Seed of risk", "Seed of savagery", "Seed of dispair"]
    public static readonly upgrade50_shaanah = ["Shaanah's echos"]

    public static readonly desert_60 = ["Desert Pearl","Red Mushes","Dry Branch"]
    public static readonly cosmic_70 = ["Dandacier", "Cosmic Energy"]
    public static readonly volcano_70 = ["Dandacier", "Ancient Flame"]
    public static readonly snow_80 = ["Sadanite", "Crystalized Snow"]
    public static readonly desert_80 = ["Sadanite", "Sand gems"]
    public static readonly plains_90 = ["Magic bark", "Kathril", "Fairy gems"]
    public static readonly devastated_90 = ["Magic ore", "Ancient fossil"]
    public static readonly typhoon_90 = ["Sharp water"]
    public static readonly stronghold_90 = ["Sharp water", "Magic ore", "Fairy gems"]
    public static readonly shaanah_90 = ["Shaanah's soul"]
}

//#region Meivin
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
//#endregion

//#region Ekosma
Item.items.push(new Item("Desert Pearl", "boatite", Loot.golfForLevel(55), 3));
Item.items.push(new Item("Red Mushes", "chamavite", Loot.golfForLevel(55) / 2, 4));
Item.items.push(new Item("Dry Branch", "branium", Loot.golfForLevel(55), 5));

Item.items.push(new Item("Ancient Flame", "flamite", Loot.golfForLevel(65) * 2, 2));
Item.items.push(new Item("Dandacier", "dandacier", Loot.golfForLevel(65) / 2, 5));
Item.items.push(new Item("Cosmic Energy", "khosium", Loot.golfForLevel(65), 3));

Item.items.push(new Item("Crystalized Snow", "vagacier", Loot.golfForLevel(75), 3));
Item.items.push(new Item("Sand gems", "doralde", Loot.golfForLevel(75) * 2, 2));
Item.items.push(new Item("Sadanite", "pikthril", Loot.golfForLevel(75) / 2, 6));

Item.items.push(new Item("Magic bark", "tortium", Loot.golfForLevel(85) / 2, 6));
Item.items.push(new Item("Kathril", "kathril", Loot.golfForLevel(85), 4));
Item.items.push(new Item("Fairy gems", "veratium", Loot.golfForLevel(85) * 3, 2));
Item.items.push(new Item("Magic ore", "tourmacier", Loot.golfForLevel(85) * 5, 2));
Item.items.push(new Item("Ancient fossil", "grifacier", Loot.golfForLevel(85) * 4, 3));
Item.items.push(new Item("Sharp water", "volium", Loot.golfForLevel(90) * 2, 4));
Item.items.push(new Item("Shaanah's soul", "tolium", Loot.golfForLevel(95) * 5, 1));
//#endregion