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

    //#region Meivin
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

    public static readonly island_boss_50 = new LootTable(EquipmentSet.IslandMysterySet, Item.upgrade50_island, 1, 2, 3)
    public static readonly shaanah_boss_50 = new LootTable(EquipmentSet.IslandMysterySet, Item.upgrade50_shaanah, 1, 2, 5)
    //#endregion

    //#region Ekosma
    public static readonly desert_60 = new LootTable(EquipmentSet.PiratesTreasure.concat(Equipment.random60), Item.desert_60, 1, 2, 4)
    public static readonly insectoid_60 = new LootTable(EquipmentSet.MandibleAndDart.concat(Equipment.random60), Item.desert_60, 1, 1, 20)
    
    public static readonly astral_70 = new LootTable(EquipmentSet.AstralRush.concat(Equipment.random60), Item.astral_70, 1, 2, 4)
    public static readonly lava_70 = new LootTable(Equipment.random70, Item.volcano_70, 1, 2, 4)
    public static readonly lava_boss_70 = new LootTable(["Triumvirat Inferno", "Triumvirat Catalyser"].concat(Equipment.random70), Item.volcano_70, 1, 1, 10)

    public static readonly snow_80 = new LootTable(EquipmentSet.CristalizedEssence.concat(Equipment.random80), Item.snow_80, 1, 2, 4)
    public static readonly snow_elite_80 = new LootTable(EquipmentSet.CristalizedEssence.concat(["Triumvirat Frostbites", "Triumvirat Catalyser"]).concat(Equipment.random80), Item.snow_80, 1, 1, 12)

    public static readonly desert_80 = new LootTable(Equipment.random80, Item.desert_80, 1, 2, 4)
    public static readonly desert_elite_80 = new LootTable(["Triumvirat Silica", "Triumvirat Catalyser"].concat(Equipment.random80), Item.desert_80, 1, 1, 8)

    public static readonly observatory_90 = new LootTable(EquipmentSet.Triumvirat.concat(EquipmentSet.FairyDust).concat(Equipment.random90_fairy), Item.plains_90, 1, 1, 15)
    public static readonly fairy_90 = new LootTable(Equipment.random90_fairy, Item.plains_90, 1, 2, 2)
    public static readonly fairy_elite_90 = new LootTable(EquipmentSet.FairyDust.concat(Equipment.random90_fairy), Item.plains_90, 1, 1, 8)
    public static readonly devastated_90 = new LootTable(Equipment.random90_worldend, Item.devastated_90, 1, 2, 8)
    public static readonly worldedge_90 = new LootTable(EquipmentSet.HeavyAura.concat(Equipment.random90_worldend), Item.devastated_90, 1, 1, 3)
    public static readonly stronghold_90 = new LootTable(EquipmentSet.CosmicEnergy, Item.stronghold_90, 1, 2, 2)
    public static readonly shaanah_boss_90 = new LootTable(EquipmentSet.CosmicEnergy, Item.shaanah_90, 2, 1, 5)
    public static readonly shalkols_boss_90 = new LootTable(null, Item.typhoon_90, 0, 1, 2)
    //#endregion

    //#region Kaelin 
    public static readonly kaelin_saki = new LootTable(["After Life Feather"], null, 1, 0, 3);
    public static readonly kaelin_kaani = new LootTable(["After Life Fang"], null, 1, 0, 3);
    public static readonly kaelin_roshe = new LootTable(["After Life Shell"], null, 1, 0, 2);
    
    public static readonly kaelin_golem = new LootTable(["Eternity Step"], null, 1, 0, 3);
    public static readonly kaelin_titan = new LootTable(["Eternity Clock"], null, 1, 0, 3);
    public static readonly kaelin_ice_goddess = new LootTable(["Eternity Musical"], null, 1, 0, 3);
    public static readonly kaelin_demeres = new LootTable(["Eternity Vision"], null, 1, 0, 2);
    
    public static readonly kaelin_slimegod = new LootTable(["Implosion Accelerator"], null, 1, 0, 3);
    public static readonly kaelin_kitsune = new LootTable(["Implosion Relativity"], null, 1, 0, 3);
    public static readonly kaelin_worm = new LootTable(["Implosion Overview"], null, 1, 0, 3);
    public static readonly kaelin_titan_magma = new LootTable(["Implosion Protector"], null, 1, 0, 3);
    public static readonly kaelin_tiamat = new LootTable(["Implosion Point"], null, 1, 0, 2);

    public static readonly kaelin_karmin = new LootTable(["Dark Mind"], null, 1, 0, 3);
    public static readonly kaelin_izarro = new LootTable(["Dark Enchantment"], null, 1, 0, 3);
    public static readonly kaelin_regulus = new LootTable(["Dark Obligation"], null, 1, 0, 2);
    public static readonly kaelin_asselus = new LootTable(["Dark Movement"], null, 1, 0, 2);
    public static readonly kaelin_jeanne = new LootTable(["Dark Divider"], null, 1, 0, 1);
    //#endregion
}

