import type Equipment from "./Equipment";
import type { SlotType } from "./Equipment";

export default class UpgradeRecipe {
    private static recipes: UpgradeRecipe[] = [];
    
    public readonly levelMin: number;
    public readonly levelMax: number;
    public readonly slotType: SlotType;
    public readonly recipes: [string, number];

    constructor(levelMin: number, levelMax: number, slotType: SlotType, recipes: [string, number]) {
        this.levelMin = levelMin;
        this.levelMax = levelMax;
        this.slotType = slotType;
        this.recipes = recipes;
    }

    private contains(equipment: Equipment) : boolean {
        return this.levelMin <= equipment.levelRequired && equipment.levelRequired <= this.levelMax;
    }   
}