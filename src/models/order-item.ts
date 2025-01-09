import type { Item } from "./item";
import type { Order } from "./order";

export type OrderItem = {
	id: number;
	items: Item;
	orders: Order;
	created_at: Date;
};
