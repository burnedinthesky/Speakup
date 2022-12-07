import { cloneDeep, sum } from "lodash";

export function randomObjectSelection<T>(
    objects: T[],
    take: number,
    weights?: number[]
): T[] {
    if (take > objects.length) throw new Error("Not enough items to take");

    if (!weights) {
        let curretObjects = cloneDeep(objects);
        let ret: T[] = [];
        for (let i = 0; i < take && i <= objects.length; i++) {
            let index = Math.floor(Math.random() * curretObjects.length);
            ret.push(curretObjects[index] as T);
            curretObjects.splice(index, 1);
        }
        return ret;
    } else {
        let ret: T[] = [];
        let currentObjects = cloneDeep(objects);
        let currentWeights = cloneDeep(weights);

        for (let i = 0; i < take && i <= objects.length; i++) {
            let takeIndex = Math.random() * sum(currentWeights);
            let acumIndex = 0,
                iterAdded = false;
            for (let j = 0; j < currentObjects.length; j++) {
                if (acumIndex >= takeIndex) {
                    ret.push(currentObjects[j] as T);
                    currentObjects.splice(j, 1);
                    currentWeights.splice(j, 1);
                    iterAdded = true;
                    break;
                }
                acumIndex += currentWeights[j] as number;
            }
            if (!iterAdded) {
                let index = currentObjects.length - 1;
                ret.push(currentObjects[index] as T);
                currentObjects.splice(index, 1);
                currentWeights.splice(index, 1);
            }
        }

        return ret;
    }
}
