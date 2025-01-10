import { useRef, useState } from "react";
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

	const [loading, setLoading] = useState(false);

	async function onSendEmail(data: any) {
		setLoading(true);

		const { error } = await supabase.auth.resetPasswordForEmail(
			data.email || "",
		);

		if (error) {
			setLoading(false);
			Alert.alert("Error", "Error interno do servidor");
			return;
		}

		setLoading(false);
		router.replace("/(initial-screen)/reset-password");
	}

	async function handleCancelForgoutPassword() {
		router.replace("/(initial-screen)/signin");
	}

	return (
		<Container>
			<Image
				className="self-center mt-14 mb-12"
				source={require("@/assets/logo.png")}
			/>

			<View className="justify-center items-center mb-16">
				<Text className="font-heading text-xl text-center text-violet-600">
					Faça login para sua conta
				</Text>
				<Text className="text-sm text-center">
					Lorem ipsum is simply dummy text of the printing
				</Text>
			</View>

			<Image
				className="self-center w-72 h-56 mb-12"
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

			<View className="mt-5 mb-12 gap-2">
				<Button
					label="Continuar"
					isLoading={loading}
					size={"default"}
					variant={"default"}
					onPress={handleSubmit(onSendEmail)}
				/>
				<Dialog>
					<DialogTrigger>
						<Button
							label="Cancelar"
							isLoading={false}
							size={"default"}
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
