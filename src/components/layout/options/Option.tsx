import {
	DropDown,
	DropDownItem,
	DropDownItemSeparator,
	DropDownLabel,
	DropDownTrigger,
	DropDownContent,
	useDropdown,
} from "@/components/ui/DropDown";
import { TouchableOpacity, Text } from "react-native";
import {
	DotsThree,
	Eye,
	Trash,
	PencilLine,
	XCircle,
	Prohibit,
} from "phosphor-react-native";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/Dialog";

function OptionRoot({ children }: { children: React.ReactNode }) {
	return (
		<DropDown>
			<DropDownTrigger>
				<TouchableOpacity className="items-end">
					<DotsThree color="#4B5563" size={16} />
				</TouchableOpacity>
			</DropDownTrigger>
			<DropDownContent className="w-40 border border-input absolute -left-36 top-2">
				<DropDownLabel labelTitle="Opções" />
				<DropDownItemSeparator />
				{children}
			</DropDownContent>
		</DropDown>
	);
}

function OptionView({ children }: { children: React.ReactNode }) {
	const { setOpen } = useDropdown();

	return (
		<DropDownItem className="border border-input">
			<Dialog>
				<DialogTrigger>
					<TouchableOpacity
						className="flex-row item-center gap-2"
						onPress={() => {
							setOpen(false);
						}}
					>
						<Eye color="#4B5563" size={16} />
						<Text className="text-xs ">Ver mais</Text>
					</TouchableOpacity>
				</DialogTrigger>

				<DialogContent>{children}</DialogContent>
			</Dialog>
		</DropDownItem>
	);
}

function OptionEditar({ children }: { children: React.ReactNode }) {
	const { setOpen } = useDropdown();

	return (
		<DropDownItem className="border border-input gap-1">
			<Dialog>
				<DialogTrigger>
					<TouchableOpacity
						className="flex-row item-center gap-2"
						onPress={() => setOpen(false)}
					>
						<PencilLine color="#4B5563" size={16} />
						<Text className="text-xs ">Editar</Text>
					</TouchableOpacity>
				</DialogTrigger>

				<DialogContent className="w-96">{children}</DialogContent>
			</Dialog>
		</DropDownItem>
	);
}

type IconOptionDelete = "CANCEL" | "REMOVE" | "DENIED";

type OptionDeleteProps = {
	icon: IconOptionDelete;
	title: string;
	onRemove: () => void;
};

function IconOptionDelete({ icon }: { icon: string }) {
	if (icon === "CANCEL") {
		return <XCircle color="#4B5563" size={16} />;
	}

	if (icon === "REMOVE") {
		return <Prohibit color="#4B5563" size={16} />;
	}

	return <Trash color="#4B5563" size={16} />;
}

function OptionDelete({ title, icon, onRemove }: OptionDeleteProps) {
	const { setOpen } = useDropdown();

	function handleRemove() {
		onRemove();
		setOpen(false);
	}

	return (
		<DropDownItem className="border border-input">
			<TouchableOpacity
				className="flex-row item-center gap-2"
				onPress={handleRemove}
			>
				<IconOptionDelete icon={icon} />
				<Text className="text-xs ">{title}</Text>
			</TouchableOpacity>
		</DropDownItem>
	);
}

export { OptionRoot, OptionView, OptionDelete };
