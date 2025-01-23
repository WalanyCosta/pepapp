import type { OrderItem } from "./order-item";
import type { User } from "./user";

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
	users: User;
	order_items: OrderItem[];
	created_at: Date;
};
