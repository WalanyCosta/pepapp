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
import { useAuth } from "@/context/auth-context";

const loginUserFormSchema = z
	.object({
		password: z
			.string({ required_error: "Campo senha é obrigatória" })
			.min(6, { message: "O password deve ter no minimo 6" }),
		confirmPassword: z.string({
			required_error: "Campo confirmação de senha é obrigatória",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Senhas diferente",
		path: ["confirmPassword"], // Indica onde o erro deve aparecer
	});

type LoginUserFormData = z.infer<typeof loginUserFormSchema>;

export default function ResetPassword() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginUserFormData>({
		mode: "all",
		resolver: zodResolver(loginUserFormSchema),
	});

	const { user, setAuth } = useAuth();
	const [loading, setLoading] = useState(false);
	const confirmPasswordRef = useRef<TextInput>(null);

	const onResetPasswond = async (data: any) => {
		setLoading(true);
		const { data: result, error } = await supabase.auth.updateUser({
			password: data.password,
		});

		if (error) {
			Alert.alert("Error", error.message);
			setLoading(false);
			return;
		}

		if (user !== null) {
			await supabase.auth.signOut();
			setAuth(null);
		}
		setLoading(false);
		router.replace("/(auth)/signin");
	};

	function handleCancelResetPassword() {
		if (user === null) {
			router.replace("/(employee)/home");
			return;
		}
		router.replace("/(auth)/signin");
	}

	return (
		<Container>
			<Image
				className="self-center mt-14 mb-12"
				source={require("@/assets/logo.png")}
			/>

			<View className="justify-center items-center mb-16">
				<Text className="font-heading text-xl text-center text-gray-800">
					Muda a sua senha
				</Text>
				<Text className="text-sm text-center">
					Lorem ipsum is simply dummy text of the printing
				</Text>
			</View>

			<Form>
				<View className="gap-5 justify-center">
					<InputControl
						formProps={{
							name: "password",
							control: control as any,
						}}
						inputProps={{
							placeholder: "Digite a sua nova senha",
							label: "Senha nova",
							secureTextEntry: true,
							onSubmitEditing: () => confirmPasswordRef.current?.focus(),
							returnKeyType: "next",
						}}
						error={errors?.password ? String(errors.password.message) : ""}
					/>

					<InputControl
						ref={confirmPasswordRef}
						formProps={{
							name: "confirmPassword",
							control: control as any,
						}}
						inputProps={{
							label: "Confirmar Senha",
							placeholder: "Digite a sua nova senha novamente",
							secureTextEntry: true,
							onSubmitEditing: handleSubmit(onResetPasswond),
						}}
						error={
							errors?.confirmPassword
								? String(errors.confirmPassword.message)
								: ""
						}
					/>
				</View>
			</Form>

			<View className="mt-32 mb-12 gap-2">
				<Button
					label="Continuar"
					isLoading={loading}
					size={"default"}
					variant={"default"}
					onPress={handleSubmit(onResetPasswond)}
				/>
				<Dialog>
					<DialogTrigger>
						<Button
							label="cancelar"
							isLoading={false}
							size={"default"}
							variant={"secondary"}
						/>
					</DialogTrigger>
					<DialogContent>
						<PopoverDualButton
							title="Cancelar a troca de senha"
							question="Tem a certeza de que queres cancelar o processo de troca de senha?"
							confirm={handleCancelResetPassword}
						/>
					</DialogContent>
				</Dialog>
			</View>
		</Container>
	);
}
