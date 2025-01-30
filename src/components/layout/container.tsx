import type { ReactNode } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PopoversError, type StatusCode } from "./popovers/popovers-error";

type Props = {
	children: ReactNode;
	visible?: boolean;
	setVisible?: (visible: boolean) => void;
	error?: { code: StatusCode; title: string };
};

export function Container({ children, visible, setVisible, error }: Props) {
	return (
		<SafeAreaView className="flex-1 bg-white font-body text-gray-800 relative">
			<View className="mx-7">{children}</View>
			<PopoversError
				visible={visible ?? false}
				setVisible={(visible: boolean) => {}}
				title={error?.title}
				statusCode={error?.code}
			/>
		</SafeAreaView>
	);
}
