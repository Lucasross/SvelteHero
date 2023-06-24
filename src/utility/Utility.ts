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
}