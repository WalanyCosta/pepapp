import { Faders, MagnifyingGlass } from "phosphor-react-native";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { DropDown, DropDownContent, DropDownTrigger } from "./DropDown";
import { useRef } from "react";

type Props = {
	children: React.ReactNode;
	query: string;
	setQuery: (query: string) => void;
};

export function Search({ children, query, setQuery }: Props) {
	const searchRef = useRef<TextInput>(null);

	return (
		<View className="px-3 mb-5 border relative border-input rounded-md bg-white w-full flex-row items-center gap-3">
			<TouchableOpacity
				onPress={() => {
					searchRef.current?.focus();
				}}
			>
				<MagnifyingGlass color="#9ca3af" size={16} />
			</TouchableOpacity>
			<TextInput
				ref={searchRef}
				className="text-base flex-1 text-nowrap text-gray-400 py-2.5"
				placeholder="Pesquisar"
				onChangeText={setQuery}
			/>

			<DropDown>
				<DropDownTrigger>
					<TouchableOpacity>
						<Faders color="#9ca3af" size={16} />
					</TouchableOpacity>
				</DropDownTrigger>
				<DropDownContent className="w-40 border border-input absolute -left-32 top-7">
					{children}
				</DropDownContent>
			</DropDown>
		</View>
	);
}
