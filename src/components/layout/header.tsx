import { Image, View, Text } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Fragment } from "react";
import { useAuth } from "@/context/auth-context";

type Props = {
	url?: string | null;
};

export function Header({ url }: Props) {
	const { user } = useAuth();

	return (
		<Fragment>
			<Image
				className="mt-6 mb-10"
				source={require("@/assets/mini-logo.png")}
			/>
			<View className="flex-row mb-12 justify-between items-center">
				<View className="gap-2 flex-1 justify-center">
					<Text className="font-heading text-2xl">
						Olá {user?.name.split(" ")[0]} 👋
					</Text>
					<Text className="text-base text-gray-400">
						Seja bem-vindo novamente, esperamos que tenhas uma boa experência
					</Text>
				</View>
				<View>
					<Avatar className="w-16 h-16">
						{user?.image ? (
							<AvatarImage
								source={{
									uri: user?.image,
								}}
							/>
						) : (
							<AvatarFallback textClassname="text-xl">pq</AvatarFallback>
						)}
					</Avatar>
				</View>
			</View>
		</Fragment>
	);
}
