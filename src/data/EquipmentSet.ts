import Equipment from "./Equipment";
import type Hero from "./Hero";
import StatEffect, { DamagePercentEffect, DamageRawEffect, ExperiencePercentEffect, ExperienceRawEffect, GoldPercentEffect, GoldRawEffect } from "./StatEffect";

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
    public static readonly AquaVanitySet = ["Aqua Destroyer", "Aqua Diamond"];
    public static readonly PyroVanisherSet = ["Pyro Walker", "Pyro Chestplate"];
    public static readonly MistyMirageSet = ["Misty Vision", "Misty Trace", "Misty Pendulum", "Misty Pest"];
    public static readonly IslandMysterySet = ["Mystery Key-Sword", "Mystery Shuriken", "Mystery Horns", "Mystery Guards", "Mystery Traveller"];
    
    public static readonly PiratesTreasure = ["Pirates Wooden Leg", "Pirates Cutlasses", "Straw Hat"];
    public static readonly MandibleAndDart = ["The Dart", "The Mandibule"];
    public static readonly AstralRush = ["Astral Urbans", "Astral Glasses", "Astral Coat"];
    public static readonly CristalizedEssence = ["Cristalized Chilblain", "Cristalized Cleats"];
    public static readonly Triumvirat = ["Triumvirat Inferno", "Triumvirat Frostbites", "Triumvirat Silica", "Triumvirat Catalyser"];
    public static readonly FairyDust = ["Fairy Nightmare", "Fairy Crusher"];
    public static readonly HeavyAura = ["Aura of Shadow", "Aura of Death", "Aura of Unease", "Aura of Destruction"];
    public static readonly CosmicEnergy = ["Cosmic Punition", "Cosmic Power", "Cosmic Eclipse", "Cosmic Guardian", "Cosmic Nebula"];

    public static readonly AfterLife = ["After Life Fang", "After Life Shell", "After Life Feather"]
    public static readonly Eternity = ["Eternity Step", "Eternity Clock", "Eternity Musical", "Eternity Vision"]
    public static readonly Implosion = ["Implosion Point", "Implosion Relativity", "Implosion Overview", "Implosion Protector", "Implosion Accelerator"]
    public static readonly DarkClan = ["Dark Divider", "Dark Enchantment", "Dark Mind", "Dark Obligation", "Dark Movement"]
    public static readonly Reborn = ["Reborn Pacifier", "Reborn Artefact", "Reborn Decree", "Reborn Resolution", "Reborn Path"]
    public static readonly SoulEater = ["Soul Piercer", "Soul Possessor", "Soul Devourer", "Soul Territory", "Soul Land"]
}

//#region Meivin
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
        [3, new DamageRawEffect(1000)],
        [4, new ExperiencePercentEffect(0.4)],
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
//#endregion

//#region Ekosma
EquipmentSet.sets.push(new EquipmentSet("Pirates Treasure",
    new Map<number, StatEffect>([
        [2, new GoldRawEffect(1500)],
        [3, new GoldPercentEffect(0.5)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Mandible and Dart",
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(3000)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Astral Rush",
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(4000)],
        [3, new DamagePercentEffect(0.4)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Cristalized Essence",
    new Map<number, StatEffect>([
        [2, new ExperiencePercentEffect(0.75)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Triumvirat",
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(4000)],
        [3, new GoldRawEffect(5000)],
        [4, new ExperienceRawEffect(6000)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Fairy Dust",
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(10000)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Heavy Aura",
    new Map<number, StatEffect>([
        [2, new ExperienceRawEffect(20000)],
        [3, new ExperiencePercentEffect(0.5)],
        [4, new DamagePercentEffect(0.35)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Cosmic Energy",
    new Map<number, StatEffect>([
        [2, new ExperienceRawEffect(30000)],
        [3, new DamageRawEffect(20000)],
        [4, new DamagePercentEffect(0.25)],
        [5, new DamagePercentEffect(0.75)],
    ])
))
//#endregion

//#region Kaelin
EquipmentSet.sets.push(new EquipmentSet("After Life", 
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(20000)],
        [3, new DamagePercentEffect(1)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Eternity", 
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(25000)],
        [3, new DamagePercentEffect(1)],
        [4, new DamageRawEffect(20000)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Implosion", 
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(10000)],
        [3, new DamagePercentEffect(1.5)],
        [4, new DamagePercentEffect(0.5)],
        [5, new DamageRawEffect(25000)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Dark Clan", 
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(25000)],
        [3, new DamagePercentEffect(1)],
        [4, new DamageRawEffect(25000)],
        [5, new DamagePercentEffect(2)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Reborn", 
    new Map<number, StatEffect>([
        [2, new DamageRawEffect(30000)],
        [3, new DamageRawEffect(30000)],
        [4, new DamagePercentEffect(2)],
        [5, new DamagePercentEffect(2)],
    ])
))

EquipmentSet.sets.push(new EquipmentSet("Soul Eater", 
    new Map<number, StatEffect>([
        [1, new DamageRawEffect(10000)],
        [2, new DamageRawEffect(20000)],
        [3, new DamageRawEffect(70000)],
        [4, new DamageRawEffect(100000)],
        [5, new DamagePercentEffect(5)],
    ])
))
//#endregion