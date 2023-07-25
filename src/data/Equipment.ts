import EquipmentSet from "./EquipmentSet";
import type Hero from "./Hero";
import Loot, { LootType } from "./Loot";
import StatEffect, { DamagePercentEffect, DamageRawEffect, ExperiencePercentEffect, GoldRawEffect } from "./StatEffect";

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

    getTooltip(hero: Hero = null): string {
        let tooltip: string;

        tooltip = `<b>${this.name}</b><br>`
        tooltip += "Level " + this.levelRequired + "<br>";
        
        for (let effect of this.statEffects) {
            tooltip += effect.toShortString() + "<br>";
        }

        if(this.setId != null) {
            tooltip += "<br>"
            tooltip += EquipmentSet.getById(this.setId).toLongString(hero);
        }

        return tooltip;
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

Equipment.equipments.push(new Equipment("Templar Helmet", SlotType.Head, "close_helmet", 5, 2, "The Ancient Templar", [new DamageRawEffect(5), new GoldRawEffect(5)]));
Equipment.equipments.push(new Equipment("Templar Robe",  SlotType.Body, "cloth_robe", 5, 2, "The Ancient Templar", [new DamageRawEffect(5), new ExperiencePercentEffect(0.1)]));
Equipment.equipments.push(new Equipment("Templar Necklace",  SlotType.Jewelry, "necklace_losange", 5, 1, "The Ancient Templar", [new GoldRawEffect(10)]));
Equipment.equipments.push(new Equipment("Templar Tower Shield",  SlotType.Weapon, "tower_shield", 5, 1, "The Ancient Templar", [new DamagePercentEffect(0.05)]));