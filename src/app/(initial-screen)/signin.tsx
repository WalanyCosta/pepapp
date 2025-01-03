import { useRef, useState } from "react";
import { View, Text, Image, Alert, type TextInput } from "react-native";
import { Container, Form, InputControl } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";

const loginUserFormSchema = z.object({
	email: z.string({ required_error: "Campo email é obrigatório" }).email({
		message: "E-mail inválido",
	}),
	password: z
		.string({ required_error: "Campo password é obrigatório" })
		.min(6, { message: "O password deve ter no minimo 6" }),
});

type LoginUserFormData = z.infer<typeof loginUserFormSchema>;

export default function Home() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginUserFormData>({
		mode: "all",
		resolver: zodResolver(loginUserFormSchema),
	});

	const [loading, setLoading] = useState(false);
	const passwordRef = useRef<TextInput>(null);

	const onSignin = async (data: any) => {
		setLoading(true);
		const { data: result, error } = await supabase.auth.signInWithPassword({
			email: data.email,
			password: data.password,
		});

		if (error) {
			Alert.alert("Error", error.message);
			setLoading(false);
			return;
		}

		setLoading(false);
		router.replace("/(employee)/home");
	};

	return (
		<Container>
			<Image
				className="self-center mt-14 mb-12"
				source={require("@/assets/logo.png")}
			/>

			<View className="justify-center items-center mb-16">
				<Text className="font-heading text-xl text-center text-gray-800">
					Faça login para sua conta
				</Text>
				<Text className="text-sm text-center">
					Lorem ipsum is simply dummy text of the printing
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
				<Text className="text-primary text-right text-sm font-heading my-8">
					Esqueces-te a Senha?
				</Text>

				<Button
					className="mb-12"
					label="Login"
					isLoading={loading}
					size={"default"}
					variant={"default"}
					onPress={handleSubmit(onSignin)}
				/>
			</Form>

			<Text className="mb-14 mt-36 text-xs text-center text-gray-600">
				Lorem ipsum is simply dummy text of the printing
			</Text>
		</Container>
	);
}
