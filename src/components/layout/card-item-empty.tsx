import { View } from "react-native";
import { Skeleton } from "@/components/ui/Skeleton";

export function CardItemEmpty (){
  return (
    <View className="gap-2 pb-[100px]">
				<View className="flex-row items-start gap-4">
					<Skeleton className="w-14 h-14 rounded-md" />
					<View className="gap-1 mt-2">
						<Skeleton className="w-32 h-3 rounded-md" />
						<Skeleton className="w-44 h-3 rounded-md" />
					</View>
				</View>

				<View className="flex-row items-start gap-4">
					<Skeleton className="w-14 h-14 rounded-md" />
					<View className="gap-1 mt-2">
						<Skeleton className="w-32 h-3 rounded-md" />
						<Skeleton className="w-44 h-3 rounded-md" />
					</View>
				</View>

				<View className="flex-row items-start gap-4">
					<Skeleton className="w-14 h-14 rounded-md" />
					<View className="gap-1 mt-2">
						<Skeleton className="w-32 h-3 rounded-md" />
						<Skeleton className="w-44 h-3 rounded-md" />
					</View>
				</View>

				<View className="flex-row items-start gap-4">
					<Skeleton className="w-14 h-14 rounded-md" />
					<View className="gap-1 mt-2">
						<Skeleton className="w-32 h-3 rounded-md" />
						<Skeleton className="w-44 h-3 rounded-md" />
					</View>
				</View>
			</View>
  )
}