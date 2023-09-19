export class Utility {
    public static Quadratic(a: number, b: number, c: number, x: number) {
        return a * Math.pow(x, 2) + b * x + c;
    }

    public static Polynome3(a: number, b: number, c: number, d: number, x: number) {
        return a * Math.pow(x, 3) + this.Quadratic(b, c, d, x);
    }

    public static Polynome4(a: number, b: number, c: number, d: number, e: number, x: number) {
        return a * Math.pow(x, 4) + this.Polynome3(b, c, d, e, x);
    }

    public static Exp(a: number, b: number, x: number) {
        return a * Math.exp(b * x);
    }

    public static enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
        return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
    }

    public static setOrAdd<T, K>(map: Map<T, K>, key, value) {
        if (map.has(key)) {
            map.set(key, map.get(key) + value);
        } else {
            map.set(key, value);
        }
    }

    public static SafeGet<T, K>(map: Map<T, K>, key: T, _default: K): K {
        if (map.has(key)) {
            return map.get(key)
        } else {
            return _default;
        }
    }

    public static zip(array1, array2) {
        return array1.map((element, index) => {
            return [element, array2[index]];
        });
    }

    public static toLocalFixed(number: number) {
        return Math.floor(number).toLocaleString();
    }

    public static toLocalDigit(number: number) {
        return number.toLocaleString("en-US", {maximumFractionDigits: 2});
    }
}