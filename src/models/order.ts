import type { User } from "@supabase/supabase-js";
import type { Item } from "./item";

export enum OrderStatus {
	PENDING = "AGUARDANDO",
	CANCEL = "CANCELADO",
	DENIED = "NEGADO",
	ACCEPTED = "ACEITADO",
}

export type Order = {
	id: string;
	ranson: string;
	sizeDescription: string;
	status: OrderStatus;
	item: Item;
	user: User;
};
