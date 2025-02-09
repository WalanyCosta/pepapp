import { useRef, useState } from "react";
import {
	View,
	Text,
	Image,
	Alert,
	type TextInput,
	TouchableOpacity,
} from "react-native";
import { Container, Form, InputControl } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { UserRole, UserStatus } from "@/models/user";
import {
	PopoversError,
	type StatusCode,
} from "@/components/layout/popovers/popovers-error";

const loginUserFormSchema = z.object({
	email: z.string({ required_error: "Campo e-mail é obrigatório" }).email({
		message: "E-mail inválido",
	}),
	password: z
		.string({ required_error: "Campo senha é obrigatório" })
		.min(6, { message: "A senha deve ter no minimo 6" }),
});

type LoginUserFormData = z.infer<typeof loginUserFormSchema>;

export default function SignIn() {
	const {
		control,
		handleSubmit,
		formState: { errors },
		getValues,
	} = useForm<LoginUserFormData>({
		mode: "all",
		resolver: zodResolver(loginUserFormSchema),
	});

	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [error, setError] = useState<{
		code: StatusCode;
		title: string;
	} | null>(null);
	const passwordRef = useRef<TextInput>(null);

	const onSignin = async (data: any) => {
		setLoading(true);
		const { data: result, error: loginError } =
			await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			});

		if (loginError) {
			setError({
				code: "UNAUTHORIZED",
				title: "E-mail ou senha estão incorrecta",
			});
			setVisible(true);
			setLoading(false);
			return;
		}

		if (result.user) {
			const { data: user, error } = await supabase
				.from("users")
				.select("*")
				.eq("id", result.user.id || "")
				.neq("status", UserStatus.DESACTIVED)
				.single();

			const { error: errorUpdate } = await supabase
				.from("users")
				.update({
					status: UserStatus.ACTIVED,
				})
				.eq("id", result.user.id);

			if (errorUpdate) {
				setError(null);
				setVisible(true);
				setLoading(false);
				return;
			}

			if (error) {
				setError(null);
				setVisible(true);
				setLoading(false);
				return;
			}

			if (user.role === UserRole.MANAGER) {
				setLoading(false);
				router.replace("/(manager)/dashboard");
				return;
			}

			setLoading(false);
			router.replace("/(employee)/home");
		}
	};

	async function replaceRoute() {
		router.replace("/(auth)/forgout-password");
	}

	return (
		<Container visible={visible} setVisible={setVisible} error={error}>
			<Image
				className="self-center mt-14 mb-12"
				source={require("@/assets/logo.png")}
			/>

			<View className="justify-center items-center mb-16">
				<Text className="font-heading text-2xl text-center text-gray-800">
					Faça login para sua conta
				</Text>
				<Text className="text-base text-center text-gray-500">
					Preenchendo os campos caso esteje registrado
				</Text>
			</View>

			<Form>
				<View className="gap-5 justify-center">
					<InputControl
						formProps={{
							name: "email",
							control: control as any,
						}}
						inputProps={{
							keyboardType: "email-address",
							placeholder: "exemplo@mail.com",
							label: "E-mail",
							onSubmitEditing: () => passwordRef.current?.focus(),
							returnKeyType: "next",
						}}
						error={errors?.email ? String(errors.email.message) : ""}
					/>

					<InputControl
						ref={passwordRef}
						formProps={{
							name: "password",
							control: control as any,
						}}
						inputProps={{
							label: "Senha",
							placeholder: "Pass#123",
							secureTextEntry: true,
							onSubmitEditing: handleSubmit(onSignin),
						}}
						error={errors?.password ? String(errors.password.message) : ""}
					/>
				</View>

				<TouchableOpacity onPress={() => replaceRoute()} className="my-10">
					<Text className="text-primary text-right text-base font-heading">
						Esqueces-te a Senha?
					</Text>
				</TouchableOpacity>

				<Button
					className="mb-12"
					label="Login"
					isLoading={loading}
					size={"lg"}
					variant={"default"}
					onPress={handleSubmit(onSignin)}
				/>
			</Form>

			<Text className="mb-14 mt-44 text-sm text-center text-gray-400">
				Todos os direitos reservado à WannasHouse
			</Text>
		</Container>
	);
}
