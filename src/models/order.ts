import type { User } from "@supabase/supabase-js";
import type { OrderItem } from "./order-item";

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
	date: Date;
	status: OrderStatus;
	user: User;
	order_items: OrderItem[];
  created_at: Date;
};
