export default abstract class StatEffect {
    
    public type: EffectType;
    public value: number;

    constructor(type: EffectType, value: number) {
        this.type = type;
        this.value = value;
    }

    abstract toShortString(): string;
    abstract toLongString(): string;
}

export class GoldRawEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.GoldRaw, value);
    }

    toShortString(): string {
        return `+${this.value} gold`;
    }

    toLongString(): string {
        return `Increase gold found on the area this hero stand by <b>+${this.value}.</b>`;
    }
} 

export class GoldPercentEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.GoldRaw, value);
    }

    toShortString(): string {
        return `+${Math.round(this.value * 100)}% gold`;
    }

    toLongString(): string {
        return `Increase gold found on the area this hero stand by <b>${Math.round(this.value * 100)}%</b>.`;
    }
} 

export class DamageRawEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.DamageRaw, value);
    }

    toShortString(): string {
        return `+${this.value} damage`;
    }

    toLongString(): string {
        return `Increase damage dealt by <b>+${this.value}.</b>`;
    }
} 

export class DamagePercentEffect extends StatEffect {

    constructor(value: number) {
        super(EffectType.DamagePercent, value);
    }

    toShortString(): string {
        return `+${Math.round(this.value * 100)}% damage`;
    }

    toLongString(): string {
        return `Increase damage dealt by <b>${Math.round(this.value * 100)}%</b>.`;
    }
} 

export enum EffectType {
    GoldRaw,
    GoldPercent,
    DamageRaw,
    DamagePercent,
}

