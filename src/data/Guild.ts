import { Utility } from "../utility/Utility";
import Equipment from "./Equipment";
import Hero from "./Hero";
import type Loot from "./Loot";
import type StatEffect from "./StatEffect";
import UpgradeRecipe from "./UpgradeRecipe";

export default class Guild {
    public gold: number;
    public inventory: Map<string, number>;
    public equipment: InventoryEquipment[] = [];

    private savedInventory; // used in save

    constructor(gold: number) {
        this.gold = gold;
        this.inventory = new Map<string, number>();
    }

    init(savedInventory, equipments): Guild {
        this.inventory = new Map(JSON.parse(savedInventory));

        if (equipments == null) {
            this.equipment = [];
        } else {
            equipments.forEach(e => {
                this.equipment.push(new InventoryEquipment(e.equipment).init(e.upgradeLevel, e.lock));
            });
        }

        return this;
    }

    public addItem(loot: Loot) {
        Utility.setOrAdd(this.inventory, loot.id, 1);
    }


    // #region Equipment
    public getEquipment(id: string): InventoryEquipment {
        return null;
    }

    public addEquipmentById(id: string) {
        this.equipment.push(new InventoryEquipment(id));
    }

    public addEquipment(invEquipment: InventoryEquipment) {
        this.equipment.push(invEquipment);
    }

    public removeEquipmentById(id: string) {
        this.removeEquipment(this.getEquipment(id));
    }

    public removeEquipment(e: InventoryEquipment) {
        this.equipment = this.equipment.splice(this.equipment.indexOf(e), 1);
    }

    public nullifyEquipment(e: InventoryEquipment) {
        this.equipment[this.equipment.indexOf(e)] = null;
    }
    //#endregion

    prepareForSave() {
        this.savedInventory = JSON.stringify([...this.inventory]);
    }

    recruit(nbHero: number): Guild {
        this.gold -= Hero.goldForNextHero(nbHero);
        return this;
    }
}

export class InventoryEquipment {
    public equipment: string;
    public upgradeLevel: number;
    public lock: boolean;

    constructor(equipment: string) {
        this.equipment = equipment;
        this.upgradeLevel = 0;
        this.lock = false;
    }

    init(upgradeLevel: number, lock: boolean): InventoryEquipment {
        this.upgradeLevel = upgradeLevel;
        this.lock = lock;

        return this;
    }

    public getEquipment(): Equipment {
        return Equipment.getById(this.equipment);
    }

    public getStatsEffects(): StatEffect[] {
        let statEffect: StatEffect[] = [];

        this.getEquipment().statEffects.forEach(s => {
            statEffect.push(s.upgrade(this.upgradeLevel));
        });

        return statEffect;
    }
}

