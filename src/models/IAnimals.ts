import dataJson from "../data.json";

// narrowing of "type" and "gender" fields to specific values
export type TAnimal = (typeof dataJson)[0] & {type: "cat" | "dog", gender: "female" | "male"};