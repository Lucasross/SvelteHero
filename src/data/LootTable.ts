import Equipment from "./Equipment";
import EquipmentSet from "./EquipmentSet";
import Item from "./Item";
import type Loot from "./Loot";

export default class LootTable {
    public equipments: string[];
    public items: string[];
    public equipmentWeight: number;
    public itemWeight: number;
    public lootChances: number;

    constructor(equipments: string[], items: string[], equipmentWeight: number, itemWeight: number, lootChances: number) {
        this.equipments = equipments;
        this.items = items;
        this.equipmentWeight = equipmentWeight;
        this.itemWeight = itemWeight;
        this.lootChances = lootChances;
    }

    TryLoot(): Loot {
        var lootRoll = Math.random() * 100;

        if(lootRoll > this.lootChances)
            return null;

        if(this.equipments == null && this.items == null)
            throw new Error("This loot table has no equipments and items");
        else if(this.equipments == null)
            return this.RandomWeighted(Item.toItemList(this.items));
        else if(this.items == null)
            return this.RandomWeighted(Equipment.toEquipmentList(this.equipments));

        var lootWeightTotal: number = this.equipmentWeight + this.itemWeight;
        var tableRoll: number = Math.random() * lootWeightTotal;
        if(tableRoll < this.equipmentWeight)
            return this.RandomWeighted(Equipment.toEquipmentList(this.equipments));
        else
            return this.RandomWeighted(Item.toItemList(this.items));
    }

    private RandomWeighted(list: Loot[]): Loot {        
        const sum = list.reduce((sum, current) => sum + current.lootWeight, 0);
        const randomRoll = Math.random() * sum;
        var currentSum = 0;
        var targetLoot: Loot = null;
        
        list.forEach(e => {
            if(targetLoot != null) return;
            
            currentSum += e.lootWeight;
            if(randomRoll < currentSum) targetLoot = e;
        });

        return targetLoot == null ? list[list.length - 1] : targetLoot;
    }

    public static readonly normal_10 = new LootTable(EquipmentSet.templarSet, Item.upgrade10, 1, 4, 10);
    public static readonly elite_10 = new LootTable(null, Item.upgrade10, 0, 1, 20); 
    public static readonly boss_10 = new LootTable(EquipmentSet.templarSet, null, 1, 0, 40); 
}

