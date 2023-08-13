import type Equipment from "./Equipment";
import { SlotType } from "./Equipment";
import type { InventoryEquipment } from "./Guild";

export default class UpgradeRecipe {
    public static recipes: UpgradeRecipe[] = [];
    
    public readonly levelMin: number;
    public readonly levelMax: number;
    public readonly slotType: SlotType;
    public readonly recipes: [string, number][];
    public readonly gold: number;

    constructor(levelMin: number, levelMax: number, slotType: SlotType, gold: number, recipes: [string, number][]) {
        this.levelMin = levelMin;
        this.levelMax = levelMax;
        this.slotType = slotType;
        this.recipes = recipes;
        this.gold = gold;
    }

    private IsFor(equipment: Equipment) : boolean {
        return (this.levelMin <= equipment.levelRequired && equipment.levelRequired <= this.levelMax) &&
                equipment.slotType == (this.slotType & equipment.slotType);
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

UpgradeRecipe.recipes.push(new UpgradeRecipe(1, 10, SlotType.All, 5000, [["Granacier", 4], ["Jabacite", 0.5]]))

UpgradeRecipe.recipes.push(new UpgradeRecipe(11, 20, SlotType.All, 11500, [["Morvite", 3], ["Patium", 1], ["Primavite", 0.5]]))