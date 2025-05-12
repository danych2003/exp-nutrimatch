import type {ProductRecipe} from "@/model/ProductRecipe.ts";

export interface Recipe {
    title: string,
    description: string,
    username: string,
    photoBase64: string | null,
    products: ProductRecipe[],
}