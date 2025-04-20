import type {ProductFull} from "@/model/ProductFull.ts";
import type {ErrorResponse} from "@/model/ErrorResponse.ts";

export function parseError(json: string): ErrorResponse {
    console.log(json);
    const error: ErrorResponse = JSON.parse(json);
    return error;
}