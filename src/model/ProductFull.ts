import type {ProductName} from "@/model/ProductName.ts";
import type {ProductElement} from "@/model/ProductElement.ts";

export interface ProductFull {
    id: number,
    code: string,
    energy: number,
    foodGroup: string,
    synonyms: string,
    productNames: ProductName[],
    elements: ProductElement[],
}