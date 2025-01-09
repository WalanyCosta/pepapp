import clsx from "clsx";
import { View, Text } from "react-native";

export type VariantsProps = "AGUARDANDO" | "CANCELADO" | "NEGADO" | "ACEITADO";

const variantsText = {
	AGUARDANDO: "text-yellow-500",
	CANCELADO: "text-red-500",
	NEGADO: "text-red-500",
	ACEITADO: "text-green-500",
};

const variants = {
	AGUARDANDO: "bg-yellow-50 border-yellow-500",
	CANCELADO: "bg-red-50 border-red-500",
	NEGADO: "bg-red-50 border-red-500",
	ACEITADO: "bg-green-50 border-green-500",
};

type BadgeProps = {
	text: VariantsProps;
};

export function Badge({ text }: BadgeProps) {
	return (
		<View
			className={` p-1 flex-row rounded-md border justify-center items-center ${variants[text]}`}
		>
			<Text className={`text-xs text-center capitalize ${variantsText[text]}`}>
				{text}
			</Text>
		</View>
	);
}
