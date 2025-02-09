import {
	View,
	Text,
	Image,
	TouchableOpacity,
	type ImageSourcePropType,
} from "react-native";
import { Trash } from "phosphor-react-native";
import { verifyImageUri } from "@/utils/verify-image-uri";

type Props = {
	image: string;
	title: string;
	description: string;
	isOption?: boolean;
	onPress?: () => void;
	onPressDelete?: () => void;
};

export function CardItem({
	image,
	title,
	description,
	isOption = false,
	onPress,
	onPressDelete,
}: Props) {
	return (
		<TouchableOpacity
			onPress={onPress}
			className="flex-row items-center gap-4 mb-2 px-3 py-5 border border-input rounded-md"
		>
			<Image className="w-16 h-16" source={verifyImageUri(image)} />
			<View className="gap-1 w-80">
				<Text className="text-xl font-heading">{title}</Text>
				<Text className="text-sm text-wrap text-gray-500">{description}</Text>
			</View>
			{isOption && (
				<TouchableOpacity
					onPress={onPressDelete}
					className="absolute right-4 top-4 opacity-75"
				>
					<Trash color="#4B5563" size={18} />
				</TouchableOpacity>
			)}
		</TouchableOpacity>
	);
}
