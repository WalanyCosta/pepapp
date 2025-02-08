import type { Item } from "@/models/item";
import type { Order } from "@/models/order";
import { createContext, useContext, useState } from "react";

interface ItemContextProps {
	order: Order | null;
	setOrder: (order: Order | null) => void;
	items: Item[];
	setItems: (items: Item[]) => void;
	addItem: (item: Item) => void;
	deleteItem: (itemId: string) => void;
	getItemSize: () => number;
	clearItems: () => void;
}

const ItemContext = createContext({} as ItemContextProps);

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
	const [items, setItems] = useState<Item[]>([]);
	const [order, setOrder] = useState<Order | null>(null);

	function addItem(item: Item): void {
		const itemNotExists = items.find((oldItem) => oldItem.id === item.id);
		if (!itemNotExists) {
			setItems([...items, item]);
		}
	}

	function deleteItem(itemId: string) {
		const findItems = items.filter((item) => item.id !== itemId);
		setItems(findItems);
	}

	function getItemSize() {
		return items.length;
	}

	function clearItems() {
		items.length = 0;
		setOrder(null);
	}

	return (
		<ItemContext.Provider
			value={{
				items,
				order,
				setOrder,
				setItems,
				addItem,
				deleteItem,
				getItemSize,
				clearItems,
			}}
		>
			{children}
		</ItemContext.Provider>
	);
};

export const useItem = () => useContext(ItemContext);
