import { Form, InputControl } from "@/components/layout";
import { View, type TextInput, Text, Alert } from "react-native";
import { Fragment, useEffect, useRef, useState } from "react";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { type User, UserRole, UserStatus } from "@/models/user";
import { useError } from "@/hooks/use-error";
import { PopoversError } from "@/components/layout/popovers/popovers-error";
import { createUser } from "@/lib/create-user";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { useAuth } from "@/context/auth-context";

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
	bottomSheetModalRef: any;
	userId: string | null;
	filterStatus: string;
	users: User[];
	setUsers: (users: User[]) => void;
};

export function FormUsers({
	bottomSheetModalRef,
	userId,
	users,
	filterStatus,
	setUsers,
}: Props) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		resetField,
		setValue,
	} = useForm<UserFormData>({
		mode: "all",
		resolver: zodResolver(UserFormDataSchema),
	});
	const { user } = useAuth();
	const { visible, setVisible, error, setError } = useError();
	const [loading, setLoading] = useState(false);
	const emailRef = useRef<TextInput>(null);
	const isOnline = useOnlineStatus();

	const getUsers = async () => {
		const { data, error } = await supabase
			.from("users")
			.select("*")
			.neq("id", user?.id)
			.eq("status", filterStatus);

		if (error) {
			setVisible(true);
			setError(null);
			return null;
		}

		return data;
	};

	async function onSubmitItem(data: any) {
		setLoading(true);

		if (!isOnline) {
			setError({
				code: "INFO",
				title: "Ligue a sua internet",
			});
			setVisible(true);
			return;
		}

		const response = await createUser({
			email: data.email,
			password: "peapp1234",
			data: {
				name: data.name,
				role: data.role,
				status: UserStatus.ACTIVED,
			},
		});

		if (response.error) {
			setLoading(false);

			if (response.error === "Esse e-mail já existe") {
				setError({
					code: "UNAUTHORIZED",
					title: "Já existe uma conta com esse email",
				});
				setVisible(true);
				return;
			}
			setError(null);
			setVisible(true);
			return;
		}

		const users = await getUsers();

		setUsers(users ?? []);
		setLoading(false);
		resetField("name");
		resetField("email");
	}

	async function onEditUser(data: any) {
		setLoading(true);

		if (!isOnline) {
			setError({
				code: "INFO",
				title: "Ligue a sua internet",
			});
			setVisible(true);
			return;
		}

		const response = await supabase
			.from("users")
			.update({ name: data.name, role: data.role })
			.eq("id", userId);

		if (response.error) {
			setLoading(false);
			setError(null);
			setVisible(true);
			console.log("api", response.error);
			return;
		}

		const users = await getUsers();

		setUsers(users ?? []);
		setLoading(false);
		bottomSheetModalRef.current?.close();
	}

	async function getUser() {
		if (userId) {
			const { data, error } = await supabase
				.from("user_profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				setError(null);
				setVisible(true);
			}

			if (data) {
				setValue("name", data?.name);
				setValue("email", data?.email);
				setValue("role", data?.role);
			}
		}
	}

	const iterableUserRole = (): any[] => {
		const roles: any[] = [];
		Object.entries(UserRole).forEach(([key, value]) => {
			roles.push({ id: key, role: value });
		});

		return roles;
	};

	useEffect(() => {
		getUser();
	}, [userId]);

	return (
		<Fragment>
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
					size={"lg"}
					variant={"default"}
					onPress={handleSubmit(!userId ? onSubmitItem : onEditUser)}
				/>
			</View>
			{visible && (
				<PopoversError
					visible={visible ?? false}
					setVisible={setVisible}
					title={error?.title}
					statusCode={error?.code}
				/>
			)}
		</Fragment>
	);
}
