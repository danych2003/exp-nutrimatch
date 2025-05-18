import { defineStore } from 'pinia'
import type {ProductFull} from "@/model/ProductFull.ts";

export const useRecipeStore = defineStore('recipe', {
    state: () => ({
        title: '' as string,
        description: '' as string,
        photoBase64: '' as string,
        products: {} as Record<number, number>,
    }),
    actions: {
        setTitle(title: string) {
            this.title = title
        },
        setDescription(description: string) {
            this.description = description
        },
        setPhotoBase64(photoBase64: string) {
            this.photoBase64 = photoBase64
        },
        addProduct(productId: number, quantity: number) {
            this.products[productId] = quantity
        },
        getProductIds() {
            return Object.keys(this.products).map(id => Number(id))
        },
        getProductRecipes() {
            return this.products;
        },
    },
})