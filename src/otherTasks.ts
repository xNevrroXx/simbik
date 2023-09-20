import dataJson from "./data.json";
import {TAnimal} from "./models/IAnimals.ts";

const data = dataJson as TAnimal[];

export default function() {
    interface ITask11 {
        dogs: number,
        cats: number,
        average: number
    }
    const task11Result = (animals: TAnimal[]): ITask11 => {
        const result = animals.reduce<ITask11>((prev, curr) => {
            curr.type === "cat" ? prev.cats++ : prev.dogs++;
            prev.average += curr.age;
            return prev;
        }, {
            dogs: 0,
            cats: 0,
            average: 0
        });
        result.average = Math.floor(result.average / animals.length);

        return result;
    };
    console.log("task11Result: ", task11Result(data));


    const task12Result = (animals: TAnimal[]): number => {
        return animals.filter(({type, breed, features}) =>
            type === "dog" && breed && features.includes("black")
        ).length;
    };
    console.log("task12Result: ", task12Result(data));


    type TTask13 =  TAnimal & {type: "cat", features: ["black", ...string[]]}
        | TAnimal & {type: "dog", features: ["white", ...string[]]};
    function isBlackCatOrWhiteDog(animal: TAnimal): animal is TTask13 {
        const {type, features} = animal;

        if (type === "cat" && features.includes("black")) {
            return true;
        }
        return type === "dog" && features.includes("white");
    }
    const task13Result = (animals: TAnimal[]): TTask13[] => {
        return animals.filter(isBlackCatOrWhiteDog);
    };
    console.log("task13Result: ", task13Result(data));


// as far as I understand, the cats ought to be ahead of all dogs.
    const task14Result = (animals: TAnimal[]): TAnimal[] => {
        const result = animals.sort((a1, a2) => {
            if (a1.type === "cat" && a2.type === "dog") {
                return -1;
            }
            else if (a1.type === "dog" && a2.type === "cat") {
                return 1;
            }

            if (a1.type === "cat" && a2.type === "cat") {
                // if the first cat is older - it should be ahead of the second cat.
                return a2.age - a1.age;
            }

            // if the first dog is younger - it should be ahead of the second dog.
            return a1.age - a2.age;
        });
        // your code here
        return result;
    };
    console.log("task14Result: ", task14Result(data));


    const myPowFunc = (number: number, n: number): number => {
        if (n < 0) {
            try {
                throw new Error("ERROR: The \"n\" parameter has to be greater than or equal to zero");
            }
            catch (error) {
                console.warn((error as Error).message);
                return -1;
            }
        }
        return countPow(number, n);

        function countPow(number: number, n: number): number {
            if (n === 0) {
                return 1;
            }
            return number * countPow(number, n - 1);
        }
    };
    console.log("myPowFunc: ", myPowFunc(3, 4));


    const myFlatFunc = (inputArray: any[], depth?: number) => {
        const initialDepth = depth ?? Infinity;
        return flat(inputArray, initialDepth);

        function flat(arr: any[], restDepth: number): any[] {
            if (restDepth === 0) {
                return arr;
            }

            const result: any[] = [];
            for (let i = 0, length = arr.length; i < length; i++) {
                const el = arr[i];

                if (!(el instanceof Array)) {
                    result.push(el);
                    continue;
                }

                const deeperArr = flat(el, restDepth - 1);
                result.push(...deeperArr);
            }

            return result;
        }
    };
    console.log("myFlatFunc: ", myFlatFunc([1, 3, 5, [1, [4,5], 'asdf', [76, [56, [66, 59]]]]]));
    // result 1, 3, 5, 1, 4, 5, 'asdf', 76, 56, 66, 59
}