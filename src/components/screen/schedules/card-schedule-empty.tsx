import { Skeleton } from "@/components/ui/Skeleton";
import { View, Text } from "react-native";

export function CardScheduleEmpty() {
	return (
		<View className="gap-2">
			{Array.from({ length: 3 }).map((_, index) => (
				<Skeleton key={index.toString()} className="w-full h-44" />
			))}
		</View>
	);
}
