import { Container, Form, InputControl } from "@/components/layout";
import { Button } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "phosphor-react-native";
import { ArrowLeft } from "phosphor-react-native";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
	TouchableOpacity,
	View,
	Image,
	Text,
	type TextInput,
} from "react-native";
import * as z from "zod";
import { router } from "expo-router";

const loginUserFormSchema = z.object({
	descriptionSize: z.string({ required_error: "" }),
	ranson: z.string({ required_error: "Campo password é obrigatório" }),
});

type LoginUserFormData = z.infer<typeof loginUserFormSchema>;

export default function Order() {
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

	function handleBack() {
		router.back();
	}

	return (
		<Container>
			<TouchableOpacity
				onPress={handleBack}
				className="w-8 h-8 mt-3 mb-5 justify-center items-start"
			>
				<ArrowLeft color="#4B5563" size={24} />
			</TouchableOpacity>

			<View className="justify-center mb-8">
				<Image className="mb-5" source={require("@/assets/mini-logo.png")} />
				<Text className="font-heading text-xl">Items Solicitados</Text>
			</View>

			<View className="gap-2">
				<View className="flex-row gap-4 px-2 py-3 border border-input rounded-md">
					<Image
						className="w-16 h-16"
						source={require("@/assets/ilustration.png")}
					/>
					<View className="gap-1 w-64">
						<Text className="text-base font-heading">T-shirt padrão</Text>
						<Text className="text-xs text-wrap">
							Lorem ipsum dolor sit amet consectetur adipisicing elit
						</Text>
					</View>

					<TouchableOpacity className="absolute right-2 top-1/2 opacity-75">
						<Trash color="#4B5563" size={20} />
					</TouchableOpacity>
				</View>

				<View className="flex-row gap-4 px-2 py-3 border relative border-input rounded-md">
					<Image
						className="w-16 h-16 bg-red-700"
						source={require("@/assets/fotos-uniformes.jpg")}
					/>

					<View className="gap-1 w-64">
						<Text className="text-base font-heading">T-shirt padrão</Text>
						<Text className="text-xs text-wrap">
							Lorem ipsum dolor sit amet consectetur adipisicing elit
						</Text>
					</View>

					<TouchableOpacity className="absolute right-2 top-1/2 opacity-75">
						<Trash color="#4B5563" size={20} />
					</TouchableOpacity>
				</View>
			</View>

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
					label="Concluir solicitaçao"
					isLoading={loading}
					size={"default"}
					variant={"default"}
					onPress={handleSubmit((data) => {})}
				/>
				<Button
					label="Voltar para Home"
					isLoading={false}
					size={"default"}
					variant={"secondary"}
					onPress={handleBack}
				/>
			</View>
		</Container>
	);
}
