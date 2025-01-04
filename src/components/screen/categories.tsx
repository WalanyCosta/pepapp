import type { Category } from "@/models/category";
import { Fragment } from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/Skeleton";
import { FlatList } from "react-native-gesture-handler";
import { CategoryItem, type IconProps } from "../layout/category-item";

type Props = {
	categories: Category[];
	isLoadingCategory: boolean;
	isActive: string;
	setIsActive: (isActive: string) => void;
};

export function Categories({
	categories,
	isLoadingCategory,
	isActive,
	setIsActive,
}: Props) {
	return (
		<Fragment>
			{isLoadingCategory ? (
				<View className="gap-2 mb-8 flex-row">
					<Skeleton className="w-24 h-10 rounded-md" />
					<Skeleton className="w-24 h-10 rounded-md" />
					<Skeleton className="w-24 h-10 rounded-md" />
					<Skeleton className="w-24 h-10 rounded-md" />
				</View>
			) : (
				<FlatList
					className="mb-8"
					data={categories}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<CategoryItem
							name={item.name}
							icon={item.icon as IconProps}
							isActive={isActive}
							setIsActive={setIsActive}
						/>
					)}
					showsHorizontalScrollIndicator={false}
					horizontal={true}
				/>
			)}
		</Fragment>
	);
}
