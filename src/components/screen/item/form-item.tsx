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
import type { Category } from "@/models/category";
import { useError } from "@/hooks/use-error";
import { PopoversError } from "@/components/layout/popovers/popovers-error";

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
	bottomSheetModalRef: any;
	itemId: string | null;
	items: Item[];
	setItems: React.Dispatch<React.SetStateAction<Item[]>>;
};

export function FormItem({
	bottomSheetModalRef,
	itemId,
	items,
	setItems,
}: Props) {
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
	const { visible, setVisible, error, setError } = useError();
	const [refreshCategory, setRefreshCategory] = useState(false);
	const [categories, setCategories] = useState<Category[]>();

	const getItems = async () => {
		const { data, error } = await supabase.from("items").select("*");

		if (error) {
			setVisible(true);
			setError(null);
			return null;
		}

		return data;
	};

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
			setVisible(true);
			setError(null);
			return;
		}

		const items = await getItems();

		setLoading(false);
		setItems(items ?? []);
		resetField("name");
		resetField("description");
		resetField("image");
	}

	async function onEditItem(data: any) {
		setLoading(true);

		const response = await supabase
			.from("items")
			.update({
				name: data.name,
				category: data.category,
				description: data.description,
				image: data.image,
			})
			.eq("id", itemId);

		if (response.error) {
			setLoading(false);
			setError(null);
			setVisible(true);
			console.log("api", response.error);
			return;
		}

		const items = await getItems();

		setLoading(false);
		setItems(items ?? []);
		bottomSheetModalRef.current?.close();
	}

	async function fetchItem() {
		if (itemId) {
			const { data, error } = await supabase
				.from("items")
				.select("*, categories!inner(*)")
				.eq("id", itemId)
				.single();

			if (error) {
				setError(null);
				setVisible(true);
			}

			if (data) {
				setValue("name", data?.name);
				setValue("description", data?.description);
				setValue("categoryId", data?.categoryId);
				setValue("image", data?.image);
			}
		}
	}

	const fetchCategories = async () => {
		const { data, error } = await supabase.from("categories").select("*");

		if (error) {
			setVisible(true);
			setError(null);
			return;
		}

		setCategories(data);
	};

	useEffect(() => {
		fetchItem();
	}, [itemId]);

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
							keyboardType: "default",
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
							keyboardType: "default",
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
				onPress={handleSubmit(itemId ? onEditItem : onSubmitItem)}
			/>

			{visible && (
				<PopoversError
					visible={visible ?? false}
					setVisible={setVisible}
					title={error?.title}
					statusCode={error?.code}
				/>
			)}
		</View>
	);
}
