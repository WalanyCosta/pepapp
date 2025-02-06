import * as Icons from "phosphor-react-native";

export type IconName =
	| "Sun"
	| "Moon"
	| "Star"
	| "Heart"
	| "XCircle"
	| "Prohibit"
	| "Trash"
	| "TrendUp"
	| "TrendDown"
	| "Boot"
	| "HardHat"
	| "ShirtFolded"
	| "ArrowsInCardinal"
	| "PencilLine";

type IconProps = {
	name: IconName;
	size: number;
	color: string;
};

export function Icon(props: IconProps) {
	const IconComponent = Icons[props.name as IconName];
	return <IconComponent size={props.size} color={props.color} />;
}
