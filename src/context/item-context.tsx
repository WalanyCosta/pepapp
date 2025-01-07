import type { Item } from "@/models/item";
import { createContext, useContext, useState } from "react";

interface ItemContextProps {
	items: Item[];
	addItem: (item: Item) => void;
	deleteItem: (itemId: string) => void;
	getItemSize: () => number;
	clearItems: () => void;
}

const ItemContext = createContext({} as ItemContextProps);

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
	const [items, setItems] = useState<Item[]>([]);

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
	}

	return (
		<ItemContext.Provider
			value={{ items, addItem, deleteItem, getItemSize, clearItems }}
		>
			{children}
		</ItemContext.Provider>
	);
};

export const useItem = () => useContext(ItemContext);
