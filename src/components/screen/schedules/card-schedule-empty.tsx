import { Skeleton } from "@/components/ui/Skeleton";
import { View, Text } from "react-native";

export function CardScheduleEmpty() {
	return (
		<View className="gap-2">
			{Array.from({ length: 8 }).map((_, index) => (
				<Skeleton key={index.toString()} className="w-full h-28" />
			))}
		</View>
	);
}
