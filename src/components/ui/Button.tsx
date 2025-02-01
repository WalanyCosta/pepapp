import { type VariantProps, cva } from "class-variance-authority";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"flex flex-row items-center justify-center rounded-md",
	{
		variants: {
			variant: {
				default: "bg-primary",
				secondary: "bg-violet-100",
				destructive: "bg-destructive",
				ghost: "bg-white",
				link: "text-primary underline-offset-4",
			},
			size: {
				default: "h-10 px-4",
				sm: "h-8 px-2",
				lg: "h-12 px-8",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const buttonTextVariants = cva("text-center font-medium", {
	variants: {
		variant: {
			default: "text-primary-foreground",
			secondary: "text-violet-600",
			destructive: "text-destructive-foreground",
			ghost: "text-violet-600",
			link: "text-primary-foreground underline",
		},
		size: {
			default: "text-base",
			sm: "text-sm",
			lg: "text-base",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

interface ButtonProps
	extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
		VariantProps<typeof buttonVariants> {
	label: string;
	isLoading?: boolean;
	labelClasses?: string;
}
function Button({
	label,
	labelClasses,
	className,
	variant,
	size,
	isLoading,
	...props
}: ButtonProps) {
	return (
		<TouchableOpacity
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		>
			<Text
				className={cn(
					buttonTextVariants({ variant, size, className: labelClasses }),
				)}
			>
				{!isLoading ? (
					label
				) : (
					<ActivityIndicator className="size-4 bg-transparent" color="#fff" />
				)}
			</Text>
		</TouchableOpacity>
	);
}

export { Button, buttonVariants, buttonTextVariants };
