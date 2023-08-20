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

    public static readonly normal_10 = new LootTable(EquipmentSet.trainingDummySet, Item.upgrade10, 1, 4, 3);
    public static readonly elite_10 = new LootTable(EquipmentSet.trainingDummySet.concat(Equipment.random10), Item.upgrade10, 1, 2, 15); 
    public static readonly boss_10 = new LootTable(EquipmentSet.trainingDummySet.concat(Equipment.random10), null, 1, 0, 25);

    public static readonly normal_20 = new LootTable(EquipmentSet.electricPowerSet.concat(Equipment.random20), Item.upgrade20, 1, 4, 2);
    public static readonly elite_20 = new LootTable(EquipmentSet.plagueInfestationSet.concat(Equipment.random20), Item.upgrade20, 1, 2, 10);
    public static readonly boss_20 = new LootTable(EquipmentSet.plagueInfestationSet, null, 1, 0, 25);

    public static readonly normal_30_aqua = new LootTable(EquipmentSet.AquaVanitySet.concat(Equipment.random30_aqua), Item.upgrade30, 1, 6, 1.8);
    public static readonly elite_30_aqua = new LootTable(EquipmentSet.AquaVanitySet.concat(Equipment.random30_aqua), Item.upgrade30, 1, 1, 20);
    public static readonly normal_30_pyro = new LootTable(EquipmentSet.PyroVanisherSet.concat(Equipment.random30_pyro), Item.upgrade30, 1, 5, 1.8);
    public static readonly boss_30_pyro = new LootTable(EquipmentSet.PyroVanisherSet, Item.upgrade30, 1, 0, 30);

    public static readonly normal_40 = new LootTable(EquipmentSet.MistyMirageSet.concat(Equipment.random40), Item.upgrade40, 1, 3, 4);
    public static readonly normal_40_plus = new LootTable(EquipmentSet.MistyMirageSet.concat(Equipment.random40), Item.upgrade40, 1, 3, 8);
    public static readonly boss_40 = new LootTable(EquipmentSet.MistyMirageSet, Item.upgrade40, 1, 1, 25);
}

