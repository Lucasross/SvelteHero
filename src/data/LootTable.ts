import type Loot from "./Loot";

export default class LootTable {
    
    public loots: Loot[];
    public chance: number;

    constructor(loots: Loot[], chance: number) {
        this.loots = loots;
        this.chance = chance;
    }

    TryLoot(): Loot {
        let roll: number = Math.random() * 100;

        if (roll > this.chance) 
            return null;

        return this.loots[Math.floor(Math.random() * this.loots.length)];
    }
}

