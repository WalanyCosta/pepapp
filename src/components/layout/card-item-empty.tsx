import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";

export function CardItemEmpty() {
	return (
		<View className="gap-2 pb-[100px]">
			{Array.from({ length: 8 }).map((_, index) => (
				<View key={index.toString()} className="flex-row items-start gap-4">
					<Skeleton className="w-16 h-16 rounded-md" />
					<View className="gap-2 mt-2">
						<Skeleton className="w-44 h-3 rounded-md" />
						<Skeleton className="w-80 h-3 rounded-md" />
					</View>
				</View>
			))}
		</View>
	);
}
