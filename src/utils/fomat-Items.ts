import type { OrderItem } from "@/models/order-item";

export function formatItems(orderItems: OrderItem[]) {
	const itemNames = orderItems.map((orderItem) => orderItem.items.name);

	if (itemNames.length === 0) {
		return;
	}

	const formattedItems = itemNames.join(", ").replace(/,([^,]*)$/, " e$1");
	return `Os pedidos foram: ${formattedItems}`;
}
