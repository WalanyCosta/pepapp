import { useState } from "react";
import { View, Text, Image, Alert, type TextInput } from "react-native";
import { Container, Form, InputControl } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";
import { PopoverDualButton } from "@/components/layout/popovers/dual-button";
import { UserStatus } from "@/models/user";
import { useError } from "@/hooks/use-error";
import type { StatusCode } from "@/components/layout/popovers/popovers-error";

const loginUserFormSchema = z.object({
	email: z.string({ required_error: "Campo email é obrigatório" }).email({
		message: "E-mail inválido",
	}),
});

type LoginUserFormData = z.infer<typeof loginUserFormSchema>;

export default function ForgoutPassword() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginUserFormData>({
		mode: "all",
		resolver: zodResolver(loginUserFormSchema),
	});

	const { visible, setVisible, error, setError } = useError();
	const [loading, setLoading] = useState(false);

	async function onSendEmail(data: any) {
		setLoading(true);
		const { error: userError, data: userFound } = await supabase
			.from("user_profiles")
			.select("*")
			.eq("email", data.email)
			.single();

		if (userError) {
			let messageError: { code: StatusCode; title: string } | null = null;
			if (userError.code === "PGRST116") {
				messageError = {
					code: "INTERNAL_SERVER",
					title: "Usuario não existe!",
				};
			}

			setVisible(true);
			setError(messageError);
			setLoading(false);
			return;
		}

		if (userFound.status === UserStatus.DESACTIVED) {
			setVisible(true);
			setError({
				code: "INTERNAL_SERVER",
				title: "Usuario não authorizado!",
			});
			setLoading(false);
			return;
		}

		setLoading(false);
		router.replace("/(auth)/reset-password");
	}

	async function handleCancelForgoutPassword() {
		router.replace("/(auth)/signin");
	}

	return (
		<Container visible={visible} setVisible={setVisible} error={error}>
			<Image
				className="self-center mt-14 mb-12"
				source={require("@/assets/logo.png")}
			/>

			<View className="justify-center items-center mb-16 gap-3">
				<Text className="font-heading text-2xl text-center">
					Faça login para sua conta
				</Text>
				<Text className="text-base text-center text-gray-400">
					Lorem ipsum is simply dummy text of the printing
				</Text>
			</View>

			<Image
				className="self-center w-56 h-40 mb-4"
				source={require("@/assets/sent-message-bro.png")}
			/>

			<Form>
				<View className="gap-5 justify-center">
					<InputControl
						formProps={{
							name: "email",
							control: control as any,
						}}
						inputProps={{
							label: "E-mail",
							placeholder: "Digite o seu e-mail",
							onSubmitEditing: handleSubmit(onSendEmail),
						}}
						error={errors?.email ? String(errors.email.message) : ""}
					/>
				</View>
			</Form>

			<View className="mt-56 mb-12 gap-2">
				<Button
					label="Continuar"
					isLoading={loading}
					size={"lg"}
					variant={"default"}
					onPress={handleSubmit(onSendEmail)}
				/>
				<Dialog>
					<DialogTrigger>
						<Button
							label="Cancelar"
							isLoading={false}
							size={"lg"}
							variant={"secondary"}
						/>
					</DialogTrigger>
					<DialogContent>
						<PopoverDualButton
							title="Recuperação de senha"
							question="Tem a certeza de que queres cancelar a recuperação da senha?"
							confirm={handleCancelForgoutPassword}
						/>
					</DialogContent>
				</Dialog>
			</View>
		</Container>
	);
}
