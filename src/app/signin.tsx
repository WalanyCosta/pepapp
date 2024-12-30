import { Container } from "@/components/layout/container";
import { Form } from "@/components/layout/form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { View, Text, Image, Alert } from "react-native";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

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
					<View className="gap-2 justify-center">
						<Controller
							control={control}
							name="email"
							render={({ field: { onChange, onBlur, value } }) => {
								return (
									<Input
										labelClasses="text-sm font-heading text-gray-800"
										label="Email"
										inputClasses={`text-sm text-gray-800 	${clsx({
											["border-border-red"]: !!errors.email === true,
											["border-primary"]: !!errors.email === false && value,
											["border-input"]: !!errors.email === false && !value,
										})}`}
										placeholder="exemplo@mail.com"
										value={value}
										onChangeText={onChange}
										onBlur={onBlur}
									/>
								);
							}}
						/>
						{errors.email && (
							<Text className="text-xs font-body text-border-red">
								{errors.email.message}
							</Text>
						)}
					</View>

					<View className="gap-2 justify-center">
						<Controller
							control={control}
							name="password"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									onChangeText={onChange}
									labelClasses="text-sm font-heading text-gray-800"
									label="Senha"
									placeholder="Pass#123"
									inputClasses={`text-sm text-gray-800 	${clsx({
										["border-border-red"]: !!errors.password === true,
										["border-primary"]: !!errors.password === false && value,
										["border-input"]: !!errors.password === false && !value,
									})}`}
									secureTextEntry
									onBlur={onBlur}
									value={value}
								/>
							)}
						/>
						{errors.password && (
							<Text className="text-xs font-body text-border-red">
								{errors.password.message}
							</Text>
						)}
					</View>
				</View>
				<Text className="text-primary text-right text-sm font-heading my-8">
					Esqueces-te a Senha?
				</Text>

				<Button
					className="mb-12"
					label={loading ? "carregando..." : "Login"}
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
