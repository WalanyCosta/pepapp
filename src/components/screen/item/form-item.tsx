import { Form, InputControl } from "@/components/layout";
import { View, type TextInput, Text } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui";
import { Upload } from "@/components/ui/Upload";
import type { Item } from "@/models/item";
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";
import { router } from "expo-router";
import type { Category } from "@/models/category";

const ItemFormDataSchema = z.object({
	name: z
		.string({ required_error: "Campo nome é obrigatório" })
		.min(5, {
			message: "No minimo o campo nome só permite 3",
		})
		.max(250, {
			message: "No máximo o campo nome só permite 250",
		}),
	description: z
		.string()
		.max(200, "No máximo o campo categoria só permite 200")
		.optional(),
	categoryId: z
		.string()
		.max(200, "No máximo o campo categoria só permite 200")
		.optional(),
	image: z.string(),
});

type ItemFormData = z.infer<typeof ItemFormDataSchema>;

type Props = {
	items: Item[];
	setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

export function FormItem({ items, setItems }: Props) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		resetField,
	} = useForm<ItemFormData>({
		mode: "all",
		resolver: zodResolver(ItemFormDataSchema),
	});
	const descriptionRef = useRef<TextInput>(null);
	const categoryRef = useRef<TextInput>(null);
	const [loading, setLoading] = useState(false);
	const [refreshCategory, setRefreshCategory] = useState(false);
	const [categories, setCategories] = useState<Category[]>();

	async function onSubmitItem(data: any) {
		setLoading(true);

		const { error } = await supabase.from("items").insert({
			name: data.name,
			description: data.description,
			categoryId: data.categoryId,
			image: data.image,
		});

		if (error) {
			setLoading(false);
			Alert.alert("Error", error.message);
			return;
		}

		setLoading(false);
		setItems([
			...items,
			{
				name: data.name,
				description: data.description,
				image: data.image,
			} as Item,
		]);
		resetField("name");
		resetField("description");
		resetField("image");
	}
	const fetchCategories = async () => {
		const { data, error } = await supabase.from("categories").select("*");

		if (error) {
			Alert.alert("Error do sistema", error.message);
			return;
		}

		setCategories(data);
	};

	useEffect(() => {
		fetchCategories();
	}, [refreshCategory]);

	return (
		<View className="w-full mx-4 gap-5">
			<Form>
				<View className="gap-4 justify-center">
					<InputControl
						formProps={{
							name: "name",
							control: control as any,
						}}
						inputProps={{
							label: "Nome",
							placeholder: "exemplo t-shirt, botas",
							onSubmitEditing: () => descriptionRef.current?.focus(),
							returnKeyType: "next",
						}}
						error={errors?.name ? String(errors.name.message) : ""}
					/>

					<InputControl
						inputClassName="h-20 align-top "
						ref={descriptionRef}
						formProps={{
							name: "description",
							control: control as any,
						}}
						inputProps={{
							label: "Descrição",
							placeholder: "Descrição do item",
							multiline: true,
							numberOfLines: 4,
							onSubmitEditing: () => categoryRef.current?.focus(),
							returnKeyType: "next",
						}}
						error={
							errors?.description ? String(errors.description.message) : ""
						}
					/>

					<View className="gap-2 justify-center">
						<Controller
							control={control}
							name="categoryId"
							render={({ field }) => (
								<Select
									refreshCategory={refreshCategory}
									setRefreshCategory={setRefreshCategory}
									options={
										categories
											? categories.map((category) => {
													return { id: category.id, category: category.name };
												})
											: [{ id: "any_id", category: "any_name" }]
									}
									label="Categoria"
									onSelect={field.onChange}
									placeholder="Selecione uma categoria"
									selectedValue={field.value}
									labelKey="category"
									valueKey="id"
								/>
							)}
						/>
						{errors.categoryId && (
							<Text className="text-xs font-body text-border-red">
								{errors.categoryId.message}
							</Text>
						)}
					</View>

					<View className="gap-2 justify-center">
						<Controller
							control={control}
							name="image"
							render={({ field }) => (
								<Upload
									label="imagem"
									labelButton="Selecione image"
									labelTypeFile="Só permite imagem com apenas"
									sizeFile={2}
									value={field.value}
									onChange={(value) => {
										setValue("image", value);
									}}
								/>
							)}
						/>
						{errors.image && (
							<Text className="text-xs font-body text-border-red">
								{errors.image.message}
							</Text>
						)}
					</View>
				</View>
			</Form>
			<Button
				label="Cadastrar item"
				isLoading={loading}
				size={"default"}
				variant={"default"}
				onPress={handleSubmit(onSubmitItem)}
			/>
		</View>
	);
}
