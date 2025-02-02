import type { StatusCode } from "@/components/layout/popovers/popovers-error";
import { useState } from "react";

export function useError() {
	const [visible, setVisible] = useState(false);
	const [error, setError] = useState<{
		code: StatusCode;
		title: string;
	} | null>(null);

	return {
		visible,
		setVisible,
		error,
		setError,
	};
}
