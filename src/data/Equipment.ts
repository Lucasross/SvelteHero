import { Utility } from "../utility/Utility";
import EquipmentSet from "./EquipmentSet";
import type Hero from "./Hero";
import Loot, { LootType } from "./Loot";
import StatEffect, { DamagePercentEffect, DamageRawEffect, ExperiencePercentEffect, ExperienceRawEffect, GoldPercentEffect, GoldRawEffect } from "./StatEffect";

export default class Equipment extends Loot {
    public static equipments: Equipment[] = [];
 
    public readonly levelRequired: number;
    public readonly slotType: SlotType;
    public readonly setId: string | null;
    public readonly statEffects: StatEffect[]; 

    constructor(name: string, slotType: SlotType, spriteName: string, levelRequired: number, lootWeight: number, setId: string = null, statEffects: StatEffect[] = []) {
        super(name, spriteName, Loot.golfForLevel(levelRequired), lootWeight);
        this.levelRequired = levelRequired;
        this.setId = setId;
        this.statEffects = statEffects;
        this.slotType = slotType;
    }
    
    protected picturesPath(): string {
        return "equipments";
    }

    getTooltip(hero: Hero = null, statEffects: StatEffect[] = null, upgradeLevel: number = 0): string {
        let tooltip: string;

        if(upgradeLevel == 0) {
            tooltip = `<b>${this.name}</b><br>`
        } else {
            tooltip = `<span style="color:${Equipment.getColorByLevel(upgradeLevel)}"><b>${this.name} +${upgradeLevel}</b></span><br>`
        }

        tooltip += `Level ${this.levelRequired} - ${SlotType[this.slotType]} <br>`;
        
        for (let effect of (statEffects != null ? statEffects : this.statEffects)) {
            tooltip += effect.toShortString() + "<br>";
        }

        if(this.setId != null) {
            tooltip += "<br>"
            tooltip += EquipmentSet.getById(this.setId).toLongString(hero);
        }

        return tooltip;
    }

    getTooltipDifference(originStats: StatEffect[], endingEffects: StatEffect[], currentLevel: number) {
        let tooltip: string;
        let nextLevel: number = currentLevel + 1;
        let stats: [StatEffect, StatEffect][] = Utility.zip(originStats, endingEffects);

        if(currentLevel == 0) {
            tooltip = `<b>${this.name}</b> -> <b><span style="color:${Equipment.getColorByLevel(nextLevel)}">${this.name} +${nextLevel}</span></b><br>`
        } else {
            tooltip = `<span style="color:${Equipment.getColorByLevel(currentLevel)}"><b>${this.name} +${currentLevel}</b></span> -> <span style="color:${Equipment.getColorByLevel(nextLevel)}"><b>${nextLevel}</b></color></span><br>`
        }
        
        tooltip += `Level ${this.levelRequired} - ${SlotType[this.slotType]} <br>`;
        
        for (let duo of stats) {
            tooltip += `${duo[0].toValueString()} -> <b><span style="color:${Equipment.getColorByLevel(nextLevel)}">${duo[1].toShortString()}</b></span><br>`;
        }

        if(this.setId != null) {
            tooltip += "<br>"
            tooltip += EquipmentSet.getById(this.setId).toLongString(null);
        }

        return tooltip;
    }

    public static getColorByLevel(upgradeLevel: number) {
        switch(upgradeLevel) {
            case 1: return "#17d914";
            case 2: return "#1479d9";
            case 3: return "#a119b5";
            case 4: return "#c92e16";
        }
    }

    public getType(): LootType {
        return LootType.Equipment;
    }

    public static getById(id: string): Equipment {
        return Loot.getLootById<Equipment>(Equipment.equipments, id, "equipment");
    }

    public static getEquipmentOfSet(set: EquipmentSet) : Equipment[] {
        return Equipment.equipments.filter(e => e.setId != null && e.setId == set.id);
    }

    public static toEquipmentList(id: string[]): Equipment[] {
        return id.map(id => this.getById(id));
    }

    public static readonly random10 = ["Fine Blade"];
    public static readonly random20 = ["Fur coat", "Gold ring", "Thunder Slash"];
    public static readonly random30_aqua = ["Silver Ring", "Closest to Depth"];
    public static readonly random30_pyro = ["Rocky Helmet", "Climbers"];
}

export enum SlotType {
    Weapon = 1 << 1,
    Jewelry = 1 << 2,
    Head = 1 << 3,
    Body = 1 << 4,
    Foot = 1 << 5,

    Clothing = Head | Body | Foot,
    All = Weapon | Jewelry | Head | Body | Foot, 
}

//#region 1 - 10
Equipment.equipments.push(new Equipment("Training Boots", SlotType.Foot, "feet/basic_big", 5, 2, "Training Dummy", [new DamageRawEffect(5), new GoldRawEffect(5)]));
Equipment.equipments.push(new Equipment("Training Shirt",  SlotType.Body, "body/shirt_light", 5, 2, "Training Dummy", [new DamageRawEffect(5), new ExperiencePercentEffect(0.1)]));
Equipment.equipments.push(new Equipment("Training Ring",  SlotType.Jewelry, "jewelry/ring_silver_basic", 5, 1, "Training Dummy", [new GoldRawEffect(10)]));
Equipment.equipments.push(new Equipment("Training Sword",  SlotType.Weapon, "sword/simple", 5, 1, "Training Dummy", [new DamagePercentEffect(0.05)]));
Equipment.equipments.push(new Equipment("Fine Blade",  SlotType.Weapon, "sword/skinner", 10, 1, null, [new DamagePercentEffect(0.1), new DamageRawEffect(75)]));
//#endregion

//#region 11 - 20
Equipment.equipments.push(new Equipment("Electric Brogues", SlotType.Foot, "feet/elf_purple", 13, 2, "Electric Power", [new ExperienceRawEffect(150), new GoldRawEffect(15)]));
Equipment.equipments.push(new Equipment("Electric Headset", SlotType.Head, "head/metal_hat", 14, 2, "Electric Power", [new DamageRawEffect(150)]));
Equipment.equipments.push(new Equipment("Electric Surcoat", SlotType.Body, "body/pink_armor", 15, 1, "Electric Power", [new ExperiencePercentEffect(0.1), new GoldPercentEffect(0.1)]));

Equipment.equipments.push(new Equipment("Plague Footwraps", SlotType.Foot, "feet/basic_leather_dark", 18, 1, "Plague Infestation", [new DamageRawEffect(40), new ExperienceRawEffect(50)]));
Equipment.equipments.push(new Equipment("Plague Damnation", SlotType.Jewelry, "jewelry/pendant_mutisha", 19, 1, "Plague Infestation", [new DamageRawEffect(40), new ExperiencePercentEffect(0.05)]));
Equipment.equipments.push(new Equipment("Plague Slicer", SlotType.Weapon, "sword/baffle", 20, 1, "Plague Infestation", [new DamageRawEffect(150)]));

Equipment.equipments.push(new Equipment("Fur coat", SlotType.Body, "body/jacket_gray", 17, 2, null, [new ExperienceRawEffect(200), new GoldRawEffect(50)]));
Equipment.equipments.push(new Equipment("Gold ring", SlotType.Jewelry, "jewelry/ring_gold_big", 20, 1, null, [new GoldPercentEffect(0.25)]));
Equipment.equipments.push(new Equipment("Thunder Slash", SlotType.Weapon, "sword/aura_thunder", 20, 2, null, [new ExperienceRawEffect(200), new ExperiencePercentEffect(0.1)]));
//#endregion

//#region 21 - 30
Equipment.equipments.push(new Equipment("Aqua Diamond", SlotType.Weapon, "jewelry/ring_diamond", 24, 1, null, [new DamagePercentEffect(0.15), new ExperiencePercentEffect(0.15), new GoldPercentEffect(0.15)]));
Equipment.equipments.push(new Equipment("Aqua Destroyer", SlotType.Jewelry, "sword/aqua_destroyer", 26, 1, null, [new DamagePercentEffect(0.1), new ExperiencePercentEffect(0.15), new GoldPercentEffect(0.2)]));

Equipment.equipments.push(new Equipment("Pyro Walker", SlotType.Foot, "feet/simple_armored", 26, 1, null, [new DamagePercentEffect(0.1), new ExperiencePercentEffect(0.15), new GoldPercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Pyro Chestplate", SlotType.Body, "body/breastplate_red", 27, 1, null, [new DamagePercentEffect(0.1), new ExperiencePercentEffect(0.15), new GoldPercentEffect(0.2)]));

Equipment.equipments.push(new Equipment("Closest to Depth", SlotType.Foot, "Feet/ring_silver", 23, 3, null, [new GoldRawEffect(250), new GoldPercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Rocky Helmet", SlotType.Head, "head/studded_helmet", 24, 2, null, [new DamagePercentEffect(0.25)]));
Equipment.equipments.push(new Equipment("Climbers", SlotType.Foot, "head/studded_helmet", 25, 2, null, [new ExperienceRawEffect(600), new GoldRawEffect(300)]));
Equipment.equipments.push(new Equipment("Silver Ring", SlotType.Jewelry, "jewelry/ring_silver", 28, 2, null, [new GoldPercentEffect(0.2), new GoldRawEffect(50), new DamageRawEffect(300)]));
//#endregion

