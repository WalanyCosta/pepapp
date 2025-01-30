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
	Modal,
} from "react-native";
import * as z from "zod";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { CardItem } from "@/components/layout/card-item";
import { useItem } from "@/context/item-context";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { PopoverDualButton } from "@/components/layout/popovers/dual-button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { OrderStatus } from "@/models/order";
import { PopoversSuccess } from "@/components/layout/popovers/popovers-success";
import { HeaderBack } from "@/components/layout/header-back";
import {
	PopoversError,
	type StatusCode,
} from "@/components/layout/popovers/popovers-error";

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
	const [visible, setVisible] = useState(false);
	const [visibleError, setVisibleError] = useState(false);
	const [error, setError] = useState<{
		code: StatusCode;
		title: string;
	} | null>(null);
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
			setError({
				code: "INFO",
				title: "Selecione um item para poder fazer pedido",
			});
			setVisibleError(true);
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
			setVisible(true);
		} catch (error: any) {
			setError(null);
			setVisible(true);
			setLoading(false);
			return;
		}
	}

	return (
		<Container>
			<HeaderBack title="Fazendo pedido" backRoute="/(employee)/home" />

			{items.length > 0 && (
				<FlatList
					className="gap-2 h-80"
					keyExtractor={(item) => item.id}
					data={items}
					renderItem={({ item }) => (
						<CardItem
							image={item.image}
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
					size={"lg"}
					variant={"default"}
					onPress={handleSubmit(handleAddOrders)}
				/>
				<Dialog>
					<DialogTrigger>
						<Button
							label="Cancelar pedido"
							isLoading={false}
							size={"lg"}
							variant={"secondary"}
						/>
					</DialogTrigger>
					<DialogContent>
						<PopoverDualButton
							title="Cancelar pedido"
							question="Tem a certeza de que queres cancelar o pedido?"
							confirm={handleCancel}
						/>
					</DialogContent>
				</Dialog>
			</View>
			<PopoversError
				visible={visibleError}
				setVisible={setVisibleError}
				title={error?.title}
				statusCode={error?.code}
			/>
			<PopoversSuccess visible={visible} setVisible={setVisible} />
		</Container>
	);
}
