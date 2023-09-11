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
    public static readonly random40 = ["Core Slicer", "Stealth White Coat"];
    public static readonly random60 = ["Dried Shoes", "Ethereal Aspect", "Delusion Breaker"];
    public static readonly random70 = ["Thermal Vest", "Lava Rock Pendant", "Delusion Breaker"];
    public static readonly random80 = ["Fluffy Ear Cover", "Flask", "Bones Fragment"];
    public static readonly random90_fairy = ["Eternal Leaf", "Thorns Plate", "Antlers", ];
    public static readonly random90_worldend = ["Infused pickaxe", "Dark Walker", "Lost Hopes", "Last View"];
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
Equipment.equipments.push(new Equipment("Aqua Diamond", SlotType.Weapon, "jewelry/ring_diamond", 24, 1, "Aqua Vanity", [new DamagePercentEffect(0.15), new ExperiencePercentEffect(0.15), new GoldPercentEffect(0.15)]));
Equipment.equipments.push(new Equipment("Aqua Destroyer", SlotType.Jewelry, "sword/aqua_destroyer", 26, 1, "Aqua Vanity", [new DamagePercentEffect(0.1), new ExperiencePercentEffect(0.15), new GoldPercentEffect(0.2)]));

Equipment.equipments.push(new Equipment("Pyro Walker", SlotType.Foot, "feet/basic_armored", 26, 1, "Pyro Vanisher", [new DamagePercentEffect(0.1), new ExperiencePercentEffect(0.15), new GoldPercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Pyro Chestplate", SlotType.Body, "body/breastplate_red", 27, 1, "Pyro Vanisher", [new DamagePercentEffect(0.1), new ExperiencePercentEffect(0.15), new GoldPercentEffect(0.2)]));

Equipment.equipments.push(new Equipment("Closest to Depth", SlotType.Foot, "feet/basic_metal", 23, 3, null, [new GoldRawEffect(250), new GoldPercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Rocky Helmet", SlotType.Head, "head/studded_helmet", 24, 2, null, [new DamagePercentEffect(0.25)]));
Equipment.equipments.push(new Equipment("Climbers", SlotType.Foot, "feet/chainmail_boots", 25, 2, null, [new ExperienceRawEffect(600), new GoldRawEffect(300)]));
Equipment.equipments.push(new Equipment("Silver Ring", SlotType.Jewelry, "jewelry/ring_silver", 28, 2, null, [new GoldPercentEffect(0.2), new GoldRawEffect(50), new DamageRawEffect(300)]));
//#endregion

//#region 31 - 40
Equipment.equipments.push(new Equipment("Misty Vision", SlotType.Head, "head/warrior_flag", 31, 1, "Misty Mirage", [new GoldPercentEffect(0.1), new ExperiencePercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Misty Trace", SlotType.Foot, "feet/basic_shell", 33, 1, "Misty Mirage", [new ExperienceRawEffect(1000)]));
Equipment.equipments.push(new Equipment("Misty Pendulum", SlotType.Jewelry, "jewelry/pendulum", 34, 1, "Misty Mirage", [new DamagePercentEffect(0.2), new GoldRawEffect(25)]));
Equipment.equipments.push(new Equipment("Misty Pest", SlotType.Weapon, "sword/bones", 36, 1, "Misty Mirage", [new DamageRawEffect(200), new ExperiencePercentEffect(0.1)]));

Equipment.equipments.push(new Equipment("Core Slicer", SlotType.Weapon, "sword/double_guarded", 32, 3, null, [new DamageRawEffect(300), new DamagePercentEffect(0.05)]));
Equipment.equipments.push(new Equipment("Stealth White Coat", SlotType.Body, "body/stealth_coat_white", 36, 3, null, [new GoldRawEffect(250)]));
//#endregion

//#region 41 - 50
Equipment.equipments.push(new Equipment("Mystery Key-Sword", SlotType.Weapon, "weapon/key", 45, 1, "Island Mystery", [new DamageRawEffect(500)]));
Equipment.equipments.push(new Equipment("Mystery Shuriken", SlotType.Jewelry, "jewelry/earring_shuriken", 45, 1, "Island Mystery", [new DamagePercentEffect(0.1), new DamageRawEffect(150)]));
Equipment.equipments.push(new Equipment("Mystery Horns", SlotType.Head, "head/barbarian", 45, 1, "Island Mystery", [new DamageRawEffect(300)]));
Equipment.equipments.push(new Equipment("Mystery Guards", SlotType.Body, "body/worked_jacket_alt", 45, 1, "Island Mystery", [new ExperiencePercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Mystery Traveller", SlotType.Foot, "foot/studded_boots", 45, 1, "Island Mystery", [new GoldPercentEffect(0.2)]));
//#endregion

//#region 51 - 60
Equipment.equipments.push(new Equipment("Dried Shoes", SlotType.Foot, "feet/pirate_shoes", 52, 2, null, [new ExperiencePercentEffect(0.2)]));

Equipment.equipments.push(new Equipment("Pirates Wooden Leg", SlotType.Foot, "feet/basic_browner", 50, 1, "Pirates Treasure", [new GoldRawEffect(500)]));
Equipment.equipments.push(new Equipment("Pirates Cutlasses", SlotType.Weapon, "sword/skinner", 51, 1, "Pirates Treasure", [new DamageRawEffect(1000)]));
Equipment.equipments.push(new Equipment("Straw Hat", SlotType.Head, "head/strawhat", 53, 1, "Pirates Treasure", [new ExperiencePercentEffect(0.5), new DamagePercentEffect(0.1)]));

Equipment.equipments.push(new Equipment("The Dart", SlotType.Jewelry, "jewelry/pendant_natural", 57, 2, "Mandible and Dart", [new DamagePercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("The Mandibule", SlotType.Head, "head/warrior_horned", 59, 2, "Mandible and Dart", [new DamageRawEffect(1500)]));

Equipment.equipments.push(new Equipment("Ethereal Aspect", SlotType.Body, "body/pink_shirt_up", 56, 2, null, [new ExperienceRawEffect(2500), new DamageRawEffect(1000)]));
Equipment.equipments.push(new Equipment("Delusion Breaker", SlotType.Weapon, "weapon/eyed", 58, 2, null, [new DamagePercentEffect(0.2), new ExperienceRawEffect(2000)]));
//#endregion

//#region 61 - 80
Equipment.equipments.push(new Equipment("Thermal Vest", SlotType.Body, "body/small_oni", 62, 2, null, [new ExperienceRawEffect(3000), new GoldPercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Lava Rock Pendant", SlotType.Jewelry, "jewelry/pendant_strawberry", 68, 2, null, [new DamagePercentEffect(0.25), new DamageRawEffect(1500)]));
Equipment.equipments.push(new Equipment("Fluffy Ear Cover", SlotType.Head, "head/cloth_hood", 73, 2, null, [new GoldRawEffect(3000), new ExperienceRawEffect(2500)]));
Equipment.equipments.push(new Equipment("Flask", SlotType.Jewelry, "jewelry/ring_silver_basic_green", 76, 2, null, [new DamageRawEffect(3000)]));
Equipment.equipments.push(new Equipment("Bones Fragment", SlotType.Body, "body/white_jacket", 79, 2, null, [new DamageRawEffect(3500), new ExperiencePercentEffect(0.35)]));

Equipment.equipments.push(new Equipment("Cristalized Chilblain", SlotType.Weapon, "sword/water_dancing", 71, 1, "Cristalized Essence", [new DamagePercentEffect(0.3)]));
Equipment.equipments.push(new Equipment("Cristalized Cleats", SlotType.Foot, "feet/chainmail", 73, 1, "Cristalized Essence", [new DamageRawEffect(2500), new ExperienceRawEffect(3000)]));

Equipment.equipments.push(new Equipment("Astral Urbans", SlotType.Foot, "feet/basic_metal", 63, 1, "Astral Rush", [new ExperiencePercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Astral Glasses", SlotType.Head, "head/soldier_visor", 65, 1, "Astral Rush", [new GoldRawEffect(2500), new DamageRawEffect(1000)]));
Equipment.equipments.push(new Equipment("Astral Coat", SlotType.Body, "body/stealth_coat", 66, 1, "Astral Rush", [new DamageRawEffect(1200)]));

Equipment.equipments.push(new Equipment("Triumvirat Inferno", SlotType.Foot, "feet/lined_high", 65, 1, "Triumvirat", [new DamageRawEffect(3000)]));
Equipment.equipments.push(new Equipment("Triumvirat Frostbites", SlotType.Head, "head/wizard", 70, 1, "Triumvirat", [new ExperienceRawEffect(4000)]));
Equipment.equipments.push(new Equipment("Triumvirat Silica", SlotType.Body, "body/shirt_up_white", 75, 1, "Triumvirat", [new GoldRawEffect(5000)]));
Equipment.equipments.push(new Equipment("Triumvirat Catalyser", SlotType.Jewelry, "jewelry/prism", 80, 1, "Triumvirat", [new DamagePercentEffect(0.33), new ExperiencePercentEffect(0.33), new GoldPercentEffect(0.33)]));
//#endregion

//#region 81 - 90
Equipment.equipments.push(new Equipment("Fairy Nightmare", SlotType.Body, "body/breastplate_green_2", 81, 1, "Fairy Dust", [new DamageRawEffect(2500)]));
Equipment.equipments.push(new Equipment("Fairy Crusher", SlotType.Foot, "feet/elf_green", 83, 1, "Fairy Dust", [new GoldRawEffect(3500)]));

Equipment.equipments.push(new Equipment("Aura of Shadow", SlotType.Jewelry, "jewelry/pendant_skull", 84, 1, "Heavy Aura", [new ExperiencePercentEffect(0.3), new GoldRawEffect(5000)]));
Equipment.equipments.push(new Equipment("Aura of Death", SlotType.Body, "body/lava_up", 85, 1, "Heavy Aura", [new DamageRawEffect(4500)]));
Equipment.equipments.push(new Equipment("Aura of Unease", SlotType.Head, "head/demonic", 86, 1, "Heavy Aura", [new ExperienceRawEffect(9000)]));
Equipment.equipments.push(new Equipment("Aura of Destruction", SlotType.Weapon, "weapon/aura_chaos", 88, 1, "Heavy Aura", [new DamageRawEffect(5000), new DamagePercentEffect(0.2)]));

Equipment.equipments.push(new Equipment("Eternal Leaf", SlotType.Jewelry, "jewelry/pendant_emerald", 82, 2, null, [new DamageRawEffect(3000), new ExperienceRawEffect(7500)]));
Equipment.equipments.push(new Equipment("Thorns Plate", SlotType.Body, "body/turtle_jacket", 83, 2, null, [new DamagePercentEffect(0.4), new DamageRawEffect(2000)]));
Equipment.equipments.push(new Equipment("Infused pickaxe", SlotType.Weapon, "weapon/thorn_rock", 84, 2, null, [new DamageRawEffect(5000), new GoldPercentEffect(0.4)]));
Equipment.equipments.push(new Equipment("Antlers", SlotType.Head, "head/barbarian", 85, 2, null, [new ExperiencePercentEffect(0.4), new ExperienceRawEffect(5000), new DamageRawEffect(1250)]));
Equipment.equipments.push(new Equipment("Dark Walker", SlotType.Foot, "feet/thieves_fur", 86, 2, null, [new ExperiencePercentEffect(0.4), new GoldRawEffect(10000)]));
Equipment.equipments.push(new Equipment("Lost Hopes", SlotType.Jewelry, "jewelry/earring_angel", 87, 2, null, [new ExperiencePercentEffect(0.3), new ExperienceRawEffect(20000)]));
Equipment.equipments.push(new Equipment("Last View", SlotType.Head, "head/hood_gold", 89, 2, null, [new ExperienceRawEffect(10000), new ExperiencePercentEffect(0.2), new DamageRawEffect(4500), new DamagePercentEffect(0.25), new GoldRawEffect(3500), new DamagePercentEffect(0.3)]));

Equipment.equipments.push(new Equipment("Cosmic Punition", SlotType.Weapon, "weapon/cosmic", 90, 1, "Cosmic Energy", [new DamageRawEffect(3500), new ExperienceRawEffect(5000)]));
Equipment.equipments.push(new Equipment("Cosmic Power", SlotType.Jewelry, "jewelry/pendant_blue_butterfly", 90, 1, "Cosmic Energy", [new DamageRawEffect(2000), new DamagePercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Cosmic Eclipse", SlotType.Head, "head/chaos", 90, 1, "Cosmic Energy", [new DamagePercentEffect(0.1), new ExperiencePercentEffect(0.3)]));
Equipment.equipments.push(new Equipment("Cosmic Guardian", SlotType.Body, "body/big_demon", 90, 1, "Cosmic Energy", [new ExperiencePercentEffect(0.4), new GoldRawEffect(15000)]));
Equipment.equipments.push(new Equipment("Cosmic Nebula", SlotType.Foot, "feet/greaves", 90, 1, "Cosmic Energy", [new ExperienceRawEffect(25000)]));
//#endregion

//#region 100 - Kaelin
Equipment.equipments.push(new Equipment("After Life Fang", SlotType.Weapon, "weapon/armored_pink", 100, 1, "After Life", [new DamageRawEffect(5000)]));
Equipment.equipments.push(new Equipment("After Life Shell", SlotType.Body, "body/pink_armor_up", 100, 1, "After Life", [new ExperienceRawEffect(5000)]));
Equipment.equipments.push(new Equipment("After Life Feather", SlotType.Jewelry, "jewelry/pendant_natural", 100, 1, "After Life", [new ExperienceRawEffect(5000)]));

Equipment.equipments.push(new Equipment("Eternity Step", SlotType.Foot, "feet/thieves_fur", 100, 1, "Eternity", [new DamageRawEffect(7000)]));
Equipment.equipments.push(new Equipment("Eternity Clock", SlotType.Jewelry, "jewelry/pendant_blue_butterfly", 100, 1, "Eternity", [new DamageRawEffect(7000)]));
Equipment.equipments.push(new Equipment("Eternity Musical", SlotType.Weapon, "weapon/musical", 100, 1, "Eternity", [new DamageRawEffect(7000), new DamagePercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Eternity Vision", SlotType.Head, "head/warrior_flag_dark", 100, 1, "Eternity", [new DamageRawEffect(7000), new DamagePercentEffect(0.2)]));

Equipment.equipments.push(new Equipment("Implosion Point", SlotType.Weapon, "weapon/armored_lava", 100, 1, "Implosion", [new DamagePercentEffect(0.1), new DamageRawEffect(5000)]));
Equipment.equipments.push(new Equipment("Implosion Relativity", SlotType.Jewelry, "jewelry/earring_sun", 100, 1, "Eternity", [new DamagePercentEffect(0.25)]));
Equipment.equipments.push(new Equipment("Implosion Overview", SlotType.Head, "head/hood_gold", 100, 1, "Eternity", [new DamagePercentEffect(0.2)]));
Equipment.equipments.push(new Equipment("Implosion Protector", SlotType.Body, "head/big_oni", 100, 1, "Eternity", [new DamagePercentEffect(0.2), new DamageRawEffect(5000)]));
Equipment.equipments.push(new Equipment("Implosion Accelerator", SlotType.Foot, "feet/dragon", 100, 1, "Eternity", [new DamagePercentEffect(0.25)]));

Equipment.equipments.push(new Equipment("Dark Divider", SlotType.Weapon, "weapon/bloody", 100, 1, "Dark Clan", [new DamagePercentEffect(0.5), new DamageRawEffect(5000)]));
Equipment.equipments.push(new Equipment("Dark Enchantment", SlotType.Jewelry, "jewelry/earring_shuriken", 100, 1, "Dark Clan", [new DamagePercentEffect(0.25), new DamageRawEffect(1000)]));
Equipment.equipments.push(new Equipment("Dark Mind", SlotType.Head, "head/wizard", 100, 1, "Dark Clan", [new DamagePercentEffect(0.25), new DamageRawEffect(2000)]));
Equipment.equipments.push(new Equipment("Dark Obligation", SlotType.Body, "body/black_jacket_up", 100, 1, "Dark Clan", [new DamagePercentEffect(0.25), new DamageRawEffect(2000)]));
Equipment.equipments.push(new Equipment("Dark Movement", SlotType.Foot, "feet/basic_leather_dark", 100, 1, "Dark Clan", [new DamagePercentEffect(0.25), new DamageRawEffect(1000)]));
//#endregion