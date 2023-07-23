import { Utility } from "../utility/Utility";
import Hero from "./Hero";
import type Loot from "./Loot";

export default class Guild {
    public gold: number;
    public inventory: Map<string, number>;
    public equipment: string[] = [];

    private savedInventory; // used in save

    constructor(gold: number) {
        this.gold = gold;
        this.inventory = new Map<string, number>();
    }

    init(savedInventory, equipment) : Guild {
        this.inventory = new Map(JSON.parse(savedInventory));
        this.equipment = equipment == null ? [] : equipment;
        return this;
    }

    public addItem(loot: Loot) {
        Utility.setOrAdd(this.inventory, loot.id, 1);
    }

    prepareForSave() {
        this.savedInventory = JSON.stringify([...this.inventory]);
    }

    recruit(nbHero: number) : Guild{
        this.gold -= Hero.goldForNextHero(nbHero);
        return this;
    }
}

