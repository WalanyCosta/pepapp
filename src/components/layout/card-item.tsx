import {
	View,
	Text,
	Image,
	TouchableOpacity,
	type ImageSourcePropType,
} from "react-native";
import { Trash } from "phosphor-react-native";

type Props = {
	source: ImageSourcePropType;
	title: string;
	description: string;
	isOption?: boolean;
	onPress?: () => void;
	onPressDelete?: () => void;
};

export function CardItem({
	source,
	title,
	description,
	isOption = false,
	onPress,
	onPressDelete,
}: Props) {
	return (
		<TouchableOpacity
			onPress={onPress}
			className="flex-row gap-4 mb-2 px-2 py-3 border border-input rounded-md"
		>
			<Image className="w-14 h-14" source={source} />
			<View className="gap-1 w-64">
				<Text className="text-base font-heading">{title}</Text>
				<Text className="text-xs text-wrap text-gray-500">{description}</Text>
			</View>
			{isOption && (
				<TouchableOpacity
					onPress={onPressDelete}
					className="absolute right-2 top-1/2 opacity-75"
				>
					<Trash color="#4B5563" size={20} />
				</TouchableOpacity>
			)}
		</TouchableOpacity>
	);
}
