import {
	House,
	ListPlus,
	CalendarCheck,
	GearSix,
	Archive,
	BagSimple,
} from "phosphor-react-native";

export type IconName =
	| "House"
	| "ListPlus"
	| "CalendarCheck"
	| "GearSix"
	| "Archive"
	| "BagSimple";

type IconSystemProps = {
	icon: string;
	active: string;
	color: string;
	colorActive: string;
	size: number;
};

export function IconSystem({
	icon,
	active,
	color,
	colorActive,
	size,
}: IconSystemProps) {
	if (icon === "GearSix") {
		return (
			<GearSix color={active === icon ? colorActive : color} size={size} />
		);
	}

	if (icon === "ListPlus") {
		return (
			<ListPlus color={active === icon ? colorActive : color} size={size} />
		);
	}

	if (icon === "BagSimple") {
		return (
			<BagSimple color={active === icon ? colorActive : color} size={size} />
		);
	}

	if (icon === "Archive") {
		return (
			<Archive color={active === icon ? colorActive : color} size={size} />
		);
	}

	if (icon === "CalendarCheck") {
		return (
			<CalendarCheck
				color={active === icon ? colorActive : color}
				size={size}
			/>
		);
	}

	return <House color={active === icon ? colorActive : color} size={size} />;
}
