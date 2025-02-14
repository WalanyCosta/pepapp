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

type OptionViewProps = {
	children: React.ReactNode;
	className?: string;
};

function OptionView({ children, className }: OptionViewProps) {
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

				<DialogContent className={className}>{children}</DialogContent>
			</Dialog>
		</DropDownItem>
	);
}

export enum IconOptionAction {
	CANCEL = "XCircle",
	REMOVE = "Trash",
	DENY = "Prohibit",
	ACCEPT = "Check",
	EDIT = "PencilLine",
}

type OptionActionProps = {
	icon: IconOptionAction;
	title: string;
	onAction: () => void;
};

function OptionAction({ title, icon, onAction }: OptionActionProps) {
	const { setOpen } = useDropdown();

	function handleRemove() {
		onAction();
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

export { OptionRoot, OptionView, OptionAction };
