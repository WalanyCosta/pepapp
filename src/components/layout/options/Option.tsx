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
import { cn } from "../../../lib/utils";
import { Icon, type IconName } from "../icon-component";

type Props = {
	className?: string;
	contentClassName?: string;
	children: React.ReactNode;
};

function OptionRoot(props: Props) {
	return (
		<DropDown>
			<DropDownTrigger>
				<TouchableOpacity className={cn("items-end", props.className)}>
					<DotsThree color="#4B5563" size={20} />
				</TouchableOpacity>
			</DropDownTrigger>
			<DropDownContent
				className={cn(
					"w-40 border border-input absolute -left-36 top-2",
					props.contentClassName,
				)}
			>
				<DropDownLabel labelTitle="Opções" />
				{props.children}
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
						<Eye color="#4B5563" size={20} />
						<Text className="text-sm ">Ver mais</Text>
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

export enum IconOptionDelete {
	CANCEL = "XCircle",
	REMOVE = "Trash",
	DENY = "Prohibit",
	ACCEPT = "Check",
}

type OptionDeleteProps = {
	icon: IconOptionDelete;
	title: string;
	onRemove: () => void;
};

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
				<Icon name={icon as IconName} color="#4B5563" size={20} />
				<Text className="text-sm ">{title}</Text>
			</TouchableOpacity>
		</DropDownItem>
	);
}

export { OptionRoot, OptionView, OptionDelete };
