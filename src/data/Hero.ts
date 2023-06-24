import type { Writable } from "svelte/store";
import { Utility } from "../utility/Utility";
import Equipment from "./Equipment";
import { SlotType } from "./Equipment";
import Job, { Jobs } from "./Job";
import type Guild from "./Guild";
import type EquipmentSet from "./EquipmentSet";

export default class Hero {
    public readonly saveIndex: number;

    public name: string;
    public level: number;
    public experience: number;
    public attack: number; // note that it's damage per seconds (dps)
    public area_id: string | null; // reference to the area database
    private readonly job: string;

    public weaponSlot : EquipmentSlot = new EquipmentSlot(SlotType.Weapon);
    public jewelrySlot : EquipmentSlot = new EquipmentSlot(SlotType.Jewelry);
    public headSlot : EquipmentSlot = new EquipmentSlot(SlotType.Head);
    public bodySlot : EquipmentSlot = new EquipmentSlot(SlotType.Body);
    public footSlot : EquipmentSlot = new EquipmentSlot(SlotType.Foot);

    constructor(saveIndex: number, name: string, level: number, experience: number, job: Jobs) {
        this.saveIndex = saveIndex;
        this.name = name;
        this.level = level;
        this.experience = experience;
        this.attack = Hero.baseAttackForLevel(level);
        this.area_id = null;
        this.job = Jobs[job];
    }

    // Act as a constructor from save
    Init(area_id: string, weaponSlot, jewelrySlot, headSlot, bodySlot, footSlot): Hero {
        this.area_id = area_id;
        if (area_id == undefined)
            this.area_id = null;

        this.weaponSlot.setById(weaponSlot.equipmentId);
        this.jewelrySlot.setById(jewelrySlot.equipmentId);
        this.headSlot.setById(headSlot.equipmentId);
        this.bodySlot.setById(bodySlot.equipmentId);
        this.footSlot.setById(footSlot.equipmentId);

        return this;
    }

    setName(name: string): Hero {
        this.name = name;
        return this;
    }

    getLocation(): string {
        return this.isInLocation() ? this.area_id : "Guild hall";
    }

    isInLocation(): boolean {
        return this.area_id != null;
    }

    sendToArea(areaId: string) {
        this.area_id = areaId;
        return this;
    }

    sendToGuild(): Hero {
        this.area_id = null;
        return this;
    }

    giveExp(exp: number, monsterLevel: number): Hero {
        let diff: number = this.level - monsterLevel;

        if (diff > 5 || diff < -5)
            exp = 0;
        else if (diff > 0)
            exp = exp * (1 - (diff / 5));

        this.experience += Math.round(exp);

        while (this.experience >= this.experienceToNextLevel()) {
            this.levelup();
        }
        return this;
    }

    experienceToNextLevel(): number {
        return Hero.experienceForLevel(this.level);
    }

    getJob() : Job {
        return Job.getById(Jobs[this.job]);
    }

    equip(equipment: Equipment, guild: Writable<Guild>) : boolean {
        if(this.level >= equipment.levelRequired) {
            let oldEquipment: Equipment = this.getSlot(equipment.slotType).set(equipment);

            guild.update(g => {
                if(oldEquipment != null) {
                    g.equipement.push(oldEquipment.id);
                }
                g.equipement = g.equipement.splice(g.equipement.indexOf(equipment.id), 1);
                return g;
            })

            return true;
        }

        return false;
    }

    unequip(slot: SlotType, guild: Writable<Guild>) {
        let oldEquipment = this.getSlot(slot).set(null);

        guild.update(g => {
            if(oldEquipment != null) {
                g.equipement.push(oldEquipment.id);
            }
            return g;
        })
    }

    getEquipedOfSet(set: EquipmentSet) : Equipment[] {
        return this.equipments().filter(s => s.get().setId == set.id).map(s => s.get());
    }

    equipments() : EquipmentSlot[] {
        return [this.weaponSlot, this.jewelrySlot, this.headSlot, this.bodySlot, this.footSlot];
    }

    private getSlot(slot: SlotType) : EquipmentSlot {
        switch(slot) {
            case SlotType.Weapon:
                return this.weaponSlot;
            case SlotType.Jewelry:
                return this.jewelrySlot;
            case SlotType.Head:
                return this.headSlot;
            case SlotType.Body:
                return this.bodySlot;
            case SlotType.Foot:
                return this.footSlot;
        }
    }

    private levelup() {
        this.experience -= this.experienceToNextLevel();
        this.level += 1;
        this.attack = Hero.baseAttackForLevel(this.level);
    }

    static experienceForLevel(level: number): number {
        return Math.round((level * 100 * (level / 15)) + 350 * level);
    }

    static baseAttackForLevel(level: number): number {
        let a = 0.4;
        let b = 21.6;
        let c = 20;
        return Math.round(Utility.Quadratic(a, b , c, level));
    }

    static goldForNextHero(nbHero: number) {
        return 5000 * (Math.pow(nbHero, 3)) + 25000;
    }
}

class EquipmentSlot {
    public readonly slotType: SlotType;

    public equipment: Equipment | null = null;
    public equipmentId: string | null = null;

    constructor(slotType: SlotType) {
        this.slotType = slotType;
    }

    public setById(equipmentId: string | null) {
        if(equipmentId == null)
            return;
            
        this.set(Equipment.getById(equipmentId));
    }

    public set(equipment: Equipment) : Equipment {
        let oldEquipment = equipment;

        this.equipment = equipment;
        this.equipmentId = equipment == null ? null : equipment.id;

        return oldEquipment;
    }

    public get(): Equipment {
        return this.equipment;
    }
}