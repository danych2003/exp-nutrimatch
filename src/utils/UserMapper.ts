import type {ProductFull} from "@/model/ProductFull.ts";
import type {User} from "@/model/User.ts";

export function getUserFromJson(json:string) {
    const user: User = JSON.parse(json);
    return user;
}