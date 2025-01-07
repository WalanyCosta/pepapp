import { Container, Form, InputControl } from "@/components/layout";
import { Button } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "phosphor-react-native";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	TouchableOpacity,
	View,
	Image,
	Text,
	type TextInput,
	FlatList,
	Alert,
} from "react-native";
import * as z from "zod";
import { router } from "expo-router";
import { CardItem } from "@/components/layout/card-item";
import { useItem } from "@/context/item-context";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { PopoverDualButton } from "@/components/layout/popovers/dual-button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { OrderStatus } from "@/models/order";

const loginUserFormSchema = z.object({
	ranson: z
		.string({ required_error: "Campo motivação é obrigatório" })
		.min(10, {
			message: "No minimo o campo descrição do tamanho só permite 10",
		})
		.max(250, {
			message: "No máximo o campo descrição do tamanho só permite 250",
		}),
	descriptionSize: z
		.string()
		.max(200, "No máximo o campo descrição do tamanho só permite 200")
		.optional(),
});

type LoginUserFormData = z.infer<typeof loginUserFormSchema>;

export default function Order() {
	const { user } = useAuth();
	const { items, deleteItem, clearItems, getItemSize } = useItem();
	const [loading, setLoading] = useState(false);
	const ransonRef = useRef<TextInput>(null);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginUserFormData>({
		mode: "all",
		resolver: zodResolver(loginUserFormSchema),
	});

	function handleCancel() {
		clearItems();
		router.replace("/(employee)/home");
	}

	async function handleAddOrders(data: any) {
		if (getItemSize() <= 0) {
			Alert.alert("Error", "Selecione items para fazer pedido");
			return;
		}

		setLoading(true);

		try {
			const date = new Date().toISOString();

			await supabase.from("orders").insert({
				ranson: data.ranson,
				sizeDescription: data.descriptionSize,
				date,
				userId: user?.id,
				status: OrderStatus.PENDING,
			});

			const { data: order } = await supabase
				.from("orders")
				.select("*")
				.eq("userId", user?.id)
				.eq("date", date)
				.single();

			const values = items.map((item) => ({
				itemId: item.id,
				orderId: order?.id,
			}));

			await supabase.from("order_items").insert(values);

			setLoading(false);
			Alert.alert("Feito com successo", "O seu pedido foi feito com sucesso");
			clearItems();
			router.replace("/(employee)/schedule");
		} catch (error: any) {
			Alert.alert("Error", error?.message);
			setLoading(false);
			return;
		}
	}

	return (
		<Container>
			<TouchableOpacity
				onPress={() => {
					router.replace("/(employee)/home");
				}}
				className="w-8 h-8 mt-3 mb-5 justify-center items-start"
			>
				<ArrowLeft color="#4B5563" size={24} />
			</TouchableOpacity>

			<View className="justify-center mb-8">
				<Image className="mb-5" source={require("@/assets/mini-logo.png")} />
				<Text className="font-heading text-xl">Items Solicitados</Text>
			</View>

			{items.length > 0 && (
				<FlatList
					className="gap-2 h-60"
					keyExtractor={(item) => item.id}
					data={items}
					renderItem={({ item }) => (
						<CardItem
							source={require("@/assets/fotos-uniformes.jpg")}
							title={item.name}
							isOption={true}
							description={item.description}
							onPressDelete={() => deleteItem(item.id)}
						/>
					)}
					contentContainerStyle={{ paddingBottom: 100 }}
					showsVerticalScrollIndicator={false}
					style={{ flex: 1 }}
				/>
			)}
			{items.length === 0 && (
				<View className="gap-2 h-[322px] pb-[100px] items-center justify-center">
					<Text className="text-gray-400 text-sm">
						Não existe items cadastrados
					</Text>
				</View>
			)}

			<View className="my-5 h-[1px] bg-gray-200" />

			<Form>
				<View className="gap-5 justify-center">
					<InputControl
						formProps={{
							name: "descriptionSize",
							control: control as any,
						}}
						inputProps={{
							label: "Descrição do tamanho",
							placeholder: "O meu tamanho é xl",
							onSubmitEditing: () => ransonRef.current?.focus(),
							returnKeyType: "next",
						}}
						error={
							errors?.descriptionSize
								? String(errors.descriptionSize.message)
								: ""
						}
					/>

					<InputControl
						inputClassName="h-20 align-top "
						ref={ransonRef}
						formProps={{
							name: "ranson",
							control: control as any,
						}}
						inputProps={{
							label: "Motivo da Solicitação",
							placeholder: "Uniforme que recebe veio com um tamanho menor",
							multiline: true,
							numberOfLines: 4,
							onSubmitEditing: handleSubmit((data) => {}),
						}}
						error={errors?.ranson ? String(errors.ranson.message) : ""}
					/>
				</View>
			</Form>

			<View className="mt-24 mb-12 gap-3">
				<Button
					label="Concluir pedido"
					isLoading={loading}
					size={"default"}
					variant={"default"}
					onPress={handleSubmit(handleAddOrders)}
				/>
				<Dialog>
					<DialogTrigger>
						<Button
							label="cancelar pedido"
							isLoading={false}
							size={"default"}
							variant={"secondary"}
						/>
					</DialogTrigger>
					<DialogContent>
						<PopoverDualButton confirm={handleCancel} />
					</DialogContent>
				</Dialog>
			</View>
		</Container>
	);
}
