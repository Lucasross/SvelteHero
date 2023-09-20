import type Equipment from "./Equipment";
import { SlotType } from "./Equipment";
import EquipmentSet from "./EquipmentSet";
import type { InventoryEquipment } from "./Guild";

export default class UpgradeRecipe {
    public static recipes: UpgradeRecipe[] = [];
    
    public readonly levelMin: number;
    public readonly levelMax: number;
    public readonly slotType: SlotType;
    public readonly targets: string[];
    public readonly recipes: [string, number][];
    public readonly gold: number;

    constructor(levelMin: number, levelMax: number, slotType: SlotType, targets: string[], gold: number, recipes: [string, number][]) {
        this.levelMin = levelMin;
        this.levelMax = levelMax;
        this.slotType = slotType;
        this.targets = targets;
        this.recipes = recipes;
        this.gold = gold;
    }

    private IsFor(equipment: Equipment) : boolean {
        return (this.levelMin <= equipment.levelRequired && equipment.levelRequired <= this.levelMax) &&
                equipment.slotType == (this.slotType & equipment.slotType) &&
                (this.targets == null || this.targets.includes(equipment.id));
    }   

    public static getRecipeFor(invEquipment: InventoryEquipment) : ExportRecipe {
        var equipment = invEquipment.getEquipment();
        
        if(invEquipment.upgradeLevel >= 4)
            return null;
        
        var recipe: UpgradeRecipe = this.recipes.find(r => r.IsFor(equipment));

        if(recipe == undefined) {
            throw new Error(`No upgrade recipe found for ${equipment.name} (Lv.${equipment.levelRequired}, Slot:${equipment.slotType})`)
        }

        var ratioRecipe: [string, number][] = recipe.recipes.map(([s, n]) => [s, Math.floor(n * (invEquipment.upgradeLevel+1))])
        var cost: number = Math.ceil(recipe.gold * (invEquipment.upgradeLevel+1));

        return new ExportRecipe(ratioRecipe, cost);
    }

    public static getDismantleFor(invEquipment: InventoryEquipment) : ExportRecipe {
        var equipment = invEquipment.getEquipment();
        
        var recipe: UpgradeRecipe = this.recipes.find(r => r.IsFor(equipment));

        if(recipe == undefined) {
            throw new Error(`No upgrade recipe found for ${equipment.name} (Lv.${equipment.levelRequired}, Slot:${equipment.slotType})`)
        }

        if(invEquipment.upgradeLevel == 0)
            return new ExportRecipe(recipe.recipes.map(([s, n]) => [s, Math.floor(n / 2) ]), 0);

        var ratioRecipe: [string, number][] = recipe.recipes.map(([s, n]) => [s, Math.floor(n * (invEquipment.upgradeLevel) / 2) ])

        return new ExportRecipe(ratioRecipe, 0);
    }
}

export class ExportRecipe {
    public readonly recipes: [string, number][];
    public readonly gold: number;

    constructor(recipes: [string, number][], gold: number) {
        this.recipes = recipes;
        this.gold = gold;
    }
}

UpgradeRecipe.recipes.push(new UpgradeRecipe(1, 10, SlotType.All, null, 5000, [["Granacier", 4], ["Jabacite", 0.5]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(11, 20, SlotType.All, null, 13500, [["Morvite", 3], ["Patium", 1], ["Primavite", 0.5]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(21, 30, SlotType.All, null, 24700, [["Pepitium", 5], ["Patium", 1.35], ["Primavite", 0.25]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(31, 40, SlotType.All, null, 51300, [["Corite", 4], ["Lunacier", 2], ["Carapium", 0.33]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(41, 50, SlotType.All, null, 125000, [["Seed of risk", 1], ["Seed of savagery", 1], ["Seed of dispair", 1], ["Shaanah's echos", 0.25]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(51, 60, SlotType.All, null, 151000, [["Desert Pearl", 2], ["Red Mushes", 3], ["Dry Branch", 3.5]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(61, 70, SlotType.All, null, 225000, [["Ancient Flame", 1], ["Dandacier", 4], ["Cosmic Energy", 2.34]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(71, 80, SlotType.All, null, 565000, [["Crystalized Snow", 4], ["Sadanite", 4], ["Sand gems", 1.5]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(81, 85, SlotType.All, null, 1295000, [["Magic bark", 3], ["Kathril", 2], ["Fairy gems", 2], ["Magic ore", 1]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(86, 99, SlotType.All, null, 2765000, [["Magic ore", 3], ["Ancient Fossil", 2], ["Sharp water", 3], ["Shaanah's soul", 0.25]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(100, 100, SlotType.All, EquipmentSet.AfterLife, 5_430_000, [["Elixir of time", 10]]))
UpgradeRecipe.recipes.push(new UpgradeRecipe(100, 100, SlotType.All, EquipmentSet.Eternity, 6_890_000, [["Elixir of ice", 10], ["Elixir of magma", 3]]))
UpgradeRecipe.recipes.push(new UpgradeRecipe(100, 100, SlotType.All, EquipmentSet.Implosion, 8_156_000, [["Elixir of ice", 5], ["Elixir of magma", 10]]))
UpgradeRecipe.recipes.push(new UpgradeRecipe(100, 100, SlotType.All, EquipmentSet.DarkClan, 10_468_000, [["Elixir of death", 15]]))
UpgradeRecipe.recipes.push(new UpgradeRecipe(100, 100, SlotType.All, EquipmentSet.Reborn, 20_360_000, [["Elixir of life", 25]]))
UpgradeRecipe.recipes.push(new UpgradeRecipe(100, 100, SlotType.All, EquipmentSet.SoulEater, 50_000_000, [["Elixir of universe", 100]]))
