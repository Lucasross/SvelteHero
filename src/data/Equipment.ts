import EquipmentSet from "./EquipmentSet";
import Loot from "./Loot";
import StatEffect, { DamagePercentEffect, DamageRawEffect, GoldRawEffect } from "./StatEffect";

export default class Equipment extends Loot {
    public static equipments: Equipment[] = [];
 
    public readonly levelRequired: number;
    public readonly slotType: SlotType;
    public readonly setId: string | null;
    public readonly statEffects: StatEffect[]; 

    constructor(name: string, spriteName: string, levelRequired: number, setId: string = null, statEffects: StatEffect[] = []) {
        super(name, spriteName);
        this.levelRequired = levelRequired;
        this.setId = setId;
        this.statEffects = statEffects;
    }
    
    protected picturesPath(): string {
        return "equipments";
    }

    getTooltip(): string {
        let tooltip: string;

        tooltip = `<b>${this.name}</b><br>`
        tooltip += "Level " + this.levelRequired + "<br>";
        
        for (let effect of this.statEffects) {
            tooltip += effect.toShortString() + "<br>";
        }

        if(this.setId != null) {
            tooltip += "<br>"
            tooltip += EquipmentSet.getById(this.setId).toLongString(null);
        }

        return tooltip;
    }

    public static getById(id: string): Equipment {
        return Loot.getLootById<Equipment>(Equipment.equipments, id, "equipment");
    }

    public static getEquipmentOfSet(set: EquipmentSet) : Equipment[] {
        return Equipment.equipments.filter(e => e.setId != null && e.setId == set.id);
    }
}

export enum SlotType {
    Weapon,
    Jewelry,
    Head,
    Body,
    Foot,
}

Equipment.equipments.push(new Equipment("Templar Helmet", "close_helmet", 5, "The Ancient Templar", [new DamageRawEffect(5), new GoldRawEffect(5)]));
Equipment.equipments.push(new Equipment("Templar Robe", "cloth_robe", 5, "The Ancient Templar", [new DamageRawEffect(5)]));
Equipment.equipments.push(new Equipment("Templar Necklace", "necklace_losange", 5, "The Ancient Templar", [new GoldRawEffect(10)]));
Equipment.equipments.push(new Equipment("Templar Tower Shield", "tower_shield", 5, "The Ancient Templar", [new DamagePercentEffect(0.05)]));