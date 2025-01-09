import { Skeleton } from "@/components/ui/Skeleton";
import { View, Text } from "react-native";

export function CardScheduleEmpty() {
	return (
		<View className="gap-2">
			<Skeleton className="w-full h-28" />
			<Skeleton className="w-full h-28" />
			<Skeleton className="w-full h-28" />
		</View>
	);
}
