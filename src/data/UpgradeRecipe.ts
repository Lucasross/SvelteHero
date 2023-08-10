import type Equipment from "./Equipment";
import { SlotType } from "./Equipment";

export default class UpgradeRecipe {
    public static recipes: UpgradeRecipe[] = [];
    
    public readonly levelMin: number;
    public readonly levelMax: number;
    public readonly slotType: SlotType;
    public readonly recipes: [string, number][];

    constructor(levelMin: number, levelMax: number, slotType: SlotType, recipes: [string, number][]) {
        this.levelMin = levelMin;
        this.levelMax = levelMax;
        this.slotType = slotType;
        this.recipes = recipes;
    }

    private IsFor(equipment: Equipment) : boolean {
        return (this.levelMin <= equipment.levelRequired && equipment.levelRequired <= this.levelMax) &&
                equipment.slotType == (this.slotType & equipment.slotType);
    }   

    public static getRecipeFor(equipment: Equipment) : [string, number][] {
        var recipe: UpgradeRecipe = this.recipes.find(r => r.IsFor(equipment));

        if(recipe == undefined) {
            throw new Error(`No upgrade recipe found for ${equipment.name} (Lv${equipment.levelRequired}, Slot:${equipment.slotType})`)
        }

        return recipe.recipes;
    }
}

UpgradeRecipe.recipes.push(new UpgradeRecipe(1, 10, SlotType.All, [["Iron", 5], ["Ardanium", 1]]))