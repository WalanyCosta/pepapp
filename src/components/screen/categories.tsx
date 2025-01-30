import type { Category } from "@/models/category";
import { Fragment } from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/Skeleton";
import { FlatList } from "react-native-gesture-handler";
import { CategoryItem } from "../layout/category-item";
import type { IconName } from "../layout/icon-component";

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
					{Array.from({ length: 4 }).map((_, index) => (
						<Skeleton key={index.toString()} className="w-32 h-12 rounded-md" />
					))}
				</View>
			) : (
				<FlatList
					className="mb-8"
					data={categories}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<CategoryItem
							icon={item.icon as IconName}
							name={item.name}
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
