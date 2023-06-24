import Equipment from "./Equipment";
import type Hero from "./Hero";
import StatEffect, { DamageRawEffect, ExperienceRawEffect, GoldPercentEffect, GoldRawEffect } from "./StatEffect";

export default class EquipmentSet {
    public static sets: EquipmentSet[] = []; 

    public id: string;
    public name: string;
    public effects: Map<number, StatEffect>;

    constructor(name: string, effects: Map<number, StatEffect>) {
        this.id = name;
        this.name = name;
        this.effects = effects;
    }

    toLongString(hero: Hero | null): string {
        let str: string
        let equiped: Equipment[] = hero == null ? null : hero.getEquipedOfSet(this);
        let fullset: Equipment[] = Equipment.getEquipmentOfSet(this);
        
        str = `<b>${this.name}</b> (${hero == null ? 0 : equiped.length}/${fullset.length})<br>`;

        for (let equipement of fullset) {
            if(hero != null && equiped.some(e => e.id == equipement.id)) {
                str += ` · <b>${equipement.name}</b><br>`
            } else {
                str += ` · ${equipement.name}<br>`;
            }
        }

        str += "<br>"

        for (let [key, value] of this.effects) {
            let effectLine = `(${key}) Set: ${value.toLongString()}`;
            str += hero != null && key <= equiped.length ? `<b>${effectLine}</b>` : effectLine;
            str += "<br>"
        }

        return str;
    }

    static getById(id: string): EquipmentSet {
        let filtered = this.sets.filter(m => m.id == id);

        if (filtered.length == 0)
            throw new Error("The following id '" + id + "' has no match in the sets database.");

        return filtered[0];
    }
}

EquipmentSet.sets.push(new EquipmentSet("The Ancient Templar",
    new Map<number, StatEffect>([
        [2, new GoldPercentEffect(0.05)],
        [3, new ExperienceRawEffect(100)],
        [4, new DamageRawEffect(50)]
    ])
))