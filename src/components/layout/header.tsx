import { Image, View, Text } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Fragment } from "react";
import { useAuth } from "@/context/auth-context";

type Props = {
	url: string | null;
};

export function Header({ url }: Props) {
	const { user } = useAuth();

	return (
		<Fragment>
			<Image
				className="mt-6 mb-10"
				source={require("@/assets/mini-logo.png")}
			/>
			<View className="gap-1 mb-12 justify-center">
				<View className="flex-row justify-between items-center">
					<Text className="font-heading text-2xl">
						Olá {user?.name.split(" ")[0]} 👋
					</Text>
					<View className="rounded-md size-10 items-center justify-center relative">
						<Avatar className="absolute -top-3">
							{url ? (
								<AvatarImage
									source={{
										uri: url,
									}}
								/>
							) : (
								<AvatarFallback>pq</AvatarFallback>
							)}
						</Avatar>
					</View>
				</View>
				<Text className="text-sm text-gray-500">
					Lorem ipsum is simply dummy text of te printing
				</Text>
			</View>
		</Fragment>
	);
}
