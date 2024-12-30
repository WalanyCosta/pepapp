import type { ReactNode } from "react";
import { View, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export function Form({ children }: { children: ReactNode }) {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={100} // ajuste conforme necessário
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View>{children}</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
