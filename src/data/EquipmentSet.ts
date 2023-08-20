import Equipment from "./Equipment";
import type Hero from "./Hero";
import StatEffect, { DamagePercentEffect, DamageRawEffect, ExperiencePercentEffect, ExperienceRawEffect, GoldPercentEffect } from "./StatEffect";

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
            if (hero != null && equiped.some(e => e.id == equipement.id)) {
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

    public static readonly trainingDummySet = ["Training Boots", "Training Shirt", "Training Ring", "Training Sword"];
    public static readonly electricPowerSet = ["Electric Brogues", "Electric Headset", "Electric Surcoat"];
    public static readonly plagueInfestationSet = ["Plague Footwraps", "Plague Damnation", "Plague Slicer"];
    public static readonly AquaVanitySet = ["Aqua Destroyer", "Aqua Bubbles"];
    public static readonly PyroVanisherSet = ["Pyro Walker", "Pyro Chestplate"];
    public static readonly MistyMirageSet = ["Misty Vision", "Misty Trace", "Misty Pendulum", "Misty Pest"];
}

EquipmentSet.sets.push(new EquipmentSet("Training Dummy",
    new Map<number, StatEffect>([
        [2, new GoldPercentEffect(0.05)],
        [3, new ExperienceRawEffect(100)],
        [4, new DamageRawEffect(50)]
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Electric Power",
    new Map<number, StatEffect>([
        [2, new GoldPercentEffect(0.25)],
        [3, new ExperiencePercentEffect(0.25)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Plague Infestation",
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(150)],
        [3, new DamagePercentEffect(0.15)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Aqua Vanity",
    new Map<number, StatEffect>([
        [2, new DamagePercentEffect(0.25)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Pyro Vanisher",
    new Map<number, StatEffect>([
        [2, new DamagePercentEffect(0.25)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Misty Mirage",
    new Map<number, StatEffect>([
        [2, new DamagePercentEffect(0.35)],
        [4, new ExperiencePercentEffect(0.4)],
        [3, new DamageRawEffect(1000)],
    ])
))


EquipmentSet.sets.push(new EquipmentSet("Island Mystery",
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(500)],
        [3, new DamageRawEffect(1000)],
        [4, new DamageRawEffect(1500)],
        [5, new DamagePercentEffect(0.5)],
    ])
))