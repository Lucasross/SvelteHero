import { Utility } from "../utility/Utility";

export default abstract class StatEffect {
    public static readonly statMultiplierByLevel: number = 0.25;
    
    public type: EffectType;
    public value: number;

    constructor(type: EffectType, value: number) {
        this.type = type;
        this.value = value;
    }

    toValueString(): string {
        return this.value.toLocaleString();
    }
    abstract toShortString(): string;
    abstract toLongString(): string;
    abstract upgrade(upgradeLevel: number): StatEffect;
}

export class GoldRawEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.GoldRaw, value);
    }

    toShortString(): string {
        return `+${this.value.toLocaleString()} gold`;
    }

    toLongString(): string {
        return `Increase gold found on the area this hero stand by <b>+${this.value.toLocaleString()}.</b>`;
    }

    upgrade(upgradeLevel: number): StatEffect {
        let upgradedValue: number = this.value * (1 + (StatEffect.statMultiplierByLevel * upgradeLevel));
        return new GoldRawEffect(upgradedValue);  
    }
} 

export class GoldPercentEffect extends StatEffect {

     constructor(value: number) {
        super(EffectType.GoldPercent, value);
    }

    toValueString(): string {
        return `+${(this.value * 100).toLocaleString()}%`;
    }

    toShortString(): string {
        return `+${(this.value * 100).toLocaleString()}% gold`;
    }

    toLongString(): string {
        return `Increase gold found on the area this hero stand by <b>${Utility.toLocalFixed(this.value * 100)}%</b>.`;
    }

    upgrade(upgradeLevel: number): StatEffect {
        let upgradedValue: number = this.value * (1 + (StatEffect.statMultiplierByLevel * upgradeLevel));
        return new GoldPercentEffect(upgradedValue);  
    }
} 

export class DamageRawEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.DamageRaw, value);
    }

    toShortString(): string {
        return `+${this.value.toLocaleString()} damage`;
    }

    toLongString(): string {
        return `Increase damage dealt by <b>+${this.value.toLocaleString()}.</b>`;
    }
    
    upgrade(upgradeLevel: number): StatEffect {
        let upgradedValue: number = this.value * (1 + (StatEffect.statMultiplierByLevel * upgradeLevel));
        return new DamageRawEffect(upgradedValue);  
    }
} 

export class DamagePercentEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.DamagePercent, value);
    }

    toValueString(): string {
        return `+${(this.value * 100).toLocaleString()}%`;
    }

    toShortString(): string {
        return `+${(this.value * 100).toLocaleString()}% damage`;
    }

    toLongString(): string {
        return `Increase damage dealt by <b>${Utility.toLocalFixed(this.value * 100)}%</b>.`;
    }

    upgrade(upgradeLevel: number): StatEffect {
        let upgradedValue: number = this.value * (1 + (StatEffect.statMultiplierByLevel * upgradeLevel));
        return new DamagePercentEffect(upgradedValue);  
    }
} 

export class ExperienceRawEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.ExperienceRaw, value);
    }

    toShortString(): string {
        return `+${this.value} experience`;
    }

    toLongString(): string {
        return `Increase experience gained by <b>+${this.value}.</b>`;
    }

    upgrade(upgradeLevel: number): StatEffect {
        let upgradedValue: number = this.value * (1 + (StatEffect.statMultiplierByLevel * upgradeLevel));
        return new ExperienceRawEffect(upgradedValue);  
    }
} 

export class ExperiencePercentEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.ExperiencePercent, value);
    }

    toValueString(): string {
        return `+${(this.value * 100).toLocaleString()}%`;
    }

    toShortString(): string {
        return `+${(this.value * 100).toLocaleString()}% experience`;
    }

    toLongString(): string {
        return `Increase experience gained by <b>${Utility.toLocalFixed(this.value * 100)}%</b>.`;
    }

    upgrade(upgradeLevel: number): StatEffect {
        let upgradedValue: number = this.value * (1 + (StatEffect.statMultiplierByLevel * upgradeLevel));
        return new ExperiencePercentEffect(upgradedValue);  
    }
} 

export enum EffectType {
    GoldRaw = "Gold Raw",
    GoldPercent = "Gold Percent",
    DamageRaw = "Damage Raw",
    DamagePercent = "Damage Percent",
    ExperienceRaw = "Experience Raw",
    ExperiencePercent = "Experience Percent",
}

