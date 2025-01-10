import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import { View, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type Props = ViewProps & {
	children: ReactNode;
};

export function Form({ children, ...rest }: Props) {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={100} // ajuste conforme necessário
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View {...rest}>{children}</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
