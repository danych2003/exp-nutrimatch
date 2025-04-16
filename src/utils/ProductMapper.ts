import type {ProductFull} from "@/model/ProductFull.ts";
import type {ViewProduct} from "@/model/ViewProduct.ts";
import type {ProductElement} from "@/model/ProductElement.ts";

export function parse(json: string): ProductFull {
    const product: ProductFull = JSON.parse(json);
    return product;
}

export function getProductView(product: ProductFull): ViewProduct {
    let name = "None";

    const fishKeyWords = ['fish', 'kala'];
    const allergens = []
    let isFish = product.foodGroup.toLowerCase().includes('kala');
    for (const productName of product.productNames) {
        if(productName.language == 'EN') {
            name = productName.name;
        }
        if((fishKeyWords.some(allergen => name.toLowerCase().includes(allergen)) || isFish)) {
            isFish = true;
        }
    }

    if(isFish) {
        allergens.push('fish')
    }

    if(product.elements.find(element => element.name === "Lactose")) {
        allergens.push('lactose')
    }

    if(product.elements.find(element => element.name === "Sugars")) {
        allergens.push('sugars')
    }



    return {
        id: product.id.toString(),
        name: name,
        type: product.foodGroup,
        allergens: allergens
    }
}
