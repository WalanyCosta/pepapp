import {
	Dialog,
	DialogContent,
	DialogTrigger,
	useDialog,
} from "@/components/ui/Dialog";
import { Form, InputControl } from "@/components/layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/layout/icon-component";
import { TouchableOpacity, View, FlatList, Text } from "react-native";
import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Alert } from "react-native";

const IconPicker: React.FC<{
	setValue: (value: any) => void;
	selectedIcon: string;
}> = ({ setValue, selectedIcon }) => {
	const iconNames = ["Sun", "Moon", "Star", "Heart"];

	return (
		<View className="w-full h-32 p-2 border border-input rounded-md mb-4">
			<FlatList
				keyExtractor={(item) => item}
				data={iconNames}
				renderItem={({ item }) => (
					<TouchableOpacity key={item} onPress={() => setValue(item)}>
						<Icon
							name={item as IconName}
							size={32}
							color={selectedIcon === item ? "#7c3aed" : "#9ca3af"}
						/>
					</TouchableOpacity>
				)}
				contentContainerStyle={{
					flexDirection: "row",
					flexWrap: "wrap",
					gap: 5,
				}}
			/>
		</View>
	);
};

type Props = {
	refreshCategory: boolean;
	setRefreshCategory: (refresh: boolean) => void;
};

export function DialogCategory({ setRefreshCategory, refreshCategory }: Props) {
	const ItemFormDataSchema = z.object({
		name: z
			.string({ required_error: "Campo nome é obrigatório" })
			.min(2, {
				message: "No minimo o campo nome só permite 2",
			})
			.max(250, {
				message: "No máximo o campo nome só permite 250",
			}),
		description: z
			.string()
			.max(200, "No máximo o campo categoria só permite 200")
			.optional(),
		icon: z.string().max(200, "No máximo o campo icon só permite 200"),
	});

	type ItemFormData = z.infer<typeof ItemFormDataSchema>;
	const {
		control,
		handleSubmit,
		setValue,
		watch,
		resetField,
		formState: { errors },
	} = useForm<ItemFormData>({
		mode: "all",
		resolver: zodResolver(ItemFormDataSchema),
	});
	const [loading, setLoading] = useState(false);

	const descriptionRef = useRef<TextInput>(null);

	const selectedIcon = watch("icon");

	async function onSubmitCategory(data: any) {
		setLoading(true);

		const { error } = await supabase.from("categories").insert({
			name: data.name,
			description: data.description,
			icon: data.icon,
		});

		if (error) {
			setLoading(false);
			Alert.alert("Error", error.message);
			return;
		}

		resetField("name");
		resetField("description");
		resetField("icon");
		setLoading(false);
		setRefreshCategory(!refreshCategory);
	}
	return (
		<Dialog>
			<DialogTrigger>
				<TouchableOpacity className="p-2 bg-violet-600 rounded-md mt-3">
					<Text className="text-white text-center">Adicionar categoria</Text>
				</TouchableOpacity>
			</DialogTrigger>
			<DialogContent className="w-11/12">
				<View className="">
					<Text className="font-heading text-xl mt-3 mb-4">
						Cadastrar categoria
					</Text>
					<Form>
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
							}}
							error={
								errors?.description ? String(errors.description.message) : ""
							}
						/>

						<View className="gap-2 justify-center">
							<Controller
								control={control}
								name="icon"
								render={({ field }) => (
									<View>
										<Text className="font-heading text-sm text-gray-800">
											Icones
										</Text>
										<View>
											<IconPicker
												setValue={(value: string) => {
													setValue(field.name, value);
												}}
												selectedIcon={selectedIcon || "Moon"}
											/>
										</View>
									</View>
								)}
							/>
							{errors.icon && (
								<Text className="text-xs font-body text-red-500">
									{errors.icon.message}
								</Text>
							)}
						</View>
					</Form>
					<Button
						label="Adicionar categoria"
						isLoading={loading}
						size={"default"}
						variant={"default"}
						onPress={handleSubmit(onSubmitCategory)}
					/>
				</View>
			</DialogContent>
		</Dialog>
	);
}
