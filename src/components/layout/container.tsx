import type { ReactNode } from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PopoversError, type StatusCode } from "./popovers/popovers-error";
import clsx from "clsx";

type Props = {
	className?: string;
	children: ReactNode;
	visible?: boolean;
	setVisible: (visible: boolean) => void;
	error?: { code: StatusCode; title: string } | null;
};

export function Container({
	children,
	visible,
	setVisible,
	error,
	className,
}: Props) {
	return (
		<SafeAreaView
			className={clsx(
				"flex-1 bg-white font-body text-gray-800 relative",
				className,
			)}
		>
			<View className="mx-7">{children}</View>
			{visible && (
				<PopoversError
					visible={visible ?? false}
					setVisible={setVisible}
					title={error?.title}
					statusCode={error?.code}
				/>
			)}
		</SafeAreaView>
	);
}
