import type React from "react";
import { useRef, useState } from "react";
import {
	FlatList,
	type LayoutRectangle,
	Modal,
	Text,
	TouchableOpacity,
	View,
	type TextInput,
} from "react-native";
import { cn } from "../../lib/utils";
import { DialogCategory } from "@/components/screen/item/dialog-category";

// Extra types to you if you need :)
export interface ISelectedOption {
	label: string;
	value: string;
}

export interface ISelectedOptionsArray {
	options?: ISelectedOption[];
}

export type ISelectedValue = string | number | undefined;

const convertToOptions = <T extends Record<string, any>>(
	data?: T[],
	labelKey?: keyof T,
	valueKey?: keyof T,
): ISelectedOption[] => {
	if (!data || !labelKey || !valueKey) return [];
	return data.map((item) => ({
		label: String(item[labelKey]),
		value: item[valueKey],
	}));
};

export interface SelectProps {
	/** Add label string */
	label?: string;
	/** Add style to label*/
	labelClasses?: string;
	/** Add style to touchableOpacity selector*/
	selectClasses?: string;
	/** Add your options array -> send any type (example model: [{item:'',key:''}]) to converter to ISelectedOption > {label, value}*/
	options: any[];
	onPress?: () => void;
	/** Add your selected state changer*/
	onSelect: (value: string | number) => void;
	/** Add your selected state value*/
	selectedValue?: string | number;
	/** Add your selected placeholder -> default is 'Select an option' */
	placeholder?: string;
	/** Define labelKey to options */
	labelKey: string;
	/** Define valueKey to options */
	valueKey: string;
	refreshCategory?: boolean;
	setRefreshCategory?: (refresh: boolean) => void;
	isVisibleButtonAdd: boolean;
}

/** Customizable Select Component :) options receive any data type and converter into label and value to render  */
export const Select = ({
	label,
	labelClasses,
	selectClasses,
	options,
	onSelect,
	selectedValue,
	placeholder = "Select an option",
	labelKey,
	valueKey,
	isVisibleButtonAdd = true,
	refreshCategory,
	setRefreshCategory,
}: SelectProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [dropdownPosition, setDropdownPosition] =
		useState<LayoutRectangle | null>(null);
	const selectButtonRef = useRef<TouchableOpacity>(null);

	const new_options = convertToOptions(options, labelKey, valueKey);

	const handleSelect = (value: string | number) => {
		onSelect(value);
		setIsDropdownOpen(false);
	};

	const openDropdown = () => {
		selectButtonRef.current?.measure((_fx, _fy, _w, _h, px, py) => {
			setDropdownPosition({
				x: px,
				y: py + _h / 2,
				width: _w,
				height: _h,
			});
			setIsDropdownOpen(true);
		});
	};

	return (
		<View className={cn("flex flex-col gap-1.5")}>
			{label && (
				<Text
					className={cn("font-heading text-sm text-gray-800", labelClasses)}
				>
					{label}
				</Text>
			)}
			<TouchableOpacity
				ref={selectButtonRef}
				className={cn(
					selectClasses,
					"border border-input py-3 px-4 rounded-lg bg-white",
				)}
				onPress={openDropdown}
			>
				<Text
					className={`text-base capitalize ${selectedValue ? "text-gray-800" : "text-gray-400"}`}
				>
					{selectedValue
						? new_options.find((option) => option.value === selectedValue)
								?.label
						: placeholder}
				</Text>
			</TouchableOpacity>

			{/* Dropdown modal */}
			{isDropdownOpen && dropdownPosition && (
				<Modal visible={isDropdownOpen} transparent animationType="none">
					<TouchableOpacity
						style={{ flex: 1 }}
						onPress={() => setIsDropdownOpen(false)}
					>
						<View
							style={{
								top: dropdownPosition.y,
								left: dropdownPosition.x,
								width: dropdownPosition.width,
								shadowOpacity: 0.2,
								shadowOffset: { width: 0, height: 2 },
								shadowRadius: 8,
								elevation: 5,
							}}
							className="absolute bg-white shadow-sm p-2 rounded-md shadow-black"
						>
							<FlatList
								data={new_options}
								keyExtractor={(item) => item.value.toString()}
								renderItem={({ item }) => (
									<TouchableOpacity
										onPress={() => handleSelect(item.value)}
										className="p-2 border-b border-input"
									>
										<Text className="text-gray-800 capitalize">
											{item.label}
										</Text>
									</TouchableOpacity>
								)}
							/>

							{isVisibleButtonAdd && (
								<DialogCategory
									refreshCategory={refreshCategory}
									setRefreshCategory={setRefreshCategory}
								/>
							)}
						</View>
					</TouchableOpacity>
				</Modal>
			)}
		</View>
	);
};
