import { Form, InputControl } from "@/components/layout";
import { View, type TextInput, Text, Alert } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { type User, UserRole, UserStatus } from "@/models/user";

const UserFormDataSchema = z.object({
	name: z
		.string({ required_error: "Campo nome é obrigatório" })
		.min(5, {
			message: "No minimo o campo nome só permite 3",
		})
		.max(250, {
			message: "No máximo o campo nome só permite 250",
		}),
	email: z.string({ required_error: "Campo nome é obrigatório" }).email(),
	role: z.string({ required_error: "Campo nome é obrigatório" }),
});

type UserFormData = z.infer<typeof UserFormDataSchema>;

type Props = {
	users: User[];
	setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export function FormUsers({ users, setUsers }: Props) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		resetField,
	} = useForm<UserFormData>({
		mode: "all",
		resolver: zodResolver(UserFormDataSchema),
	});
	const emailRef = useRef<TextInput>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmitItem(data: any) {
		setLoading(true);

		const { error } = await supabase.auth.signUp({
			email: data.email,
			password: "peapp1234",
			options: {
				data: {
					name: data.name,
					role: data.role,
					status: UserStatus.ACTIVED,
				},
			},
		});

		if (error) {
			setLoading(false);
			Alert.alert("Error", error.message);
			return;
		}

		const { data: newUsers, error: userError } = await supabase
			.from("user_profiles")
			.select("*");

		if (userError) {
			setLoading(false);
			Alert.alert("Error", userError.message);
			return;
		}

		setUsers(newUsers);
		setLoading(false);
		resetField("name");
		resetField("email");
	}

	const iterableUserRole = (): any[] => {
		const roles: any[] = [];
		Object.entries(UserRole).forEach(([key, value]) => {
			roles.push({ id: key, role: value });
		});

		return roles;
	};

	return (
		<View className="w-full mx-4 gap-5">
			<Form>
				<View className="gap-4 justify-center">
					<InputControl
						formProps={{
							name: "name",
							control: control as any,
						}}
						inputProps={{
							label: "Nome",
							placeholder: "Filipe Argel",
							onSubmitEditing: () => emailRef.current?.focus(),
							returnKeyType: "next",
						}}
						error={errors?.name ? String(errors.name.message) : ""}
					/>

					<InputControl
						ref={emailRef}
						formProps={{
							name: "email",
							control: control as any,
						}}
						inputProps={{
							label: "E-mail",
							placeholder: "exemplo@mail.com",
						}}
						error={errors?.email ? String(errors.email.message) : ""}
					/>

					<View className="gap-2 justify-center">
						<Controller
							control={control}
							name="role"
							render={({ field }) => (
								<Select
									isVisibleButtonAdd={false}
									options={iterableUserRole()}
									label="Cargo"
									onSelect={field.onChange}
									placeholder="Selecione uma categoria"
									selectedValue={field.value}
									labelKey="role"
									valueKey="role"
								/>
							)}
						/>
						{errors.role && (
							<Text className="text-xs font-body text-border-red">
								{errors.role.message}
							</Text>
						)}
					</View>
				</View>
			</Form>
			<Button
				className="mt-5"
				label="Cadastrar item"
				isLoading={loading}
				size={"default"}
				variant={"default"}
				onPress={handleSubmit(onSubmitItem)}
			/>
		</View>
	);
}
