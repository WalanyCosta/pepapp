import { View, Text, TouchableOpacity } from "react-native";
import { UploadSimple } from "phosphor-react-native";
import { useImage } from "@/hooks/use-image";
import { Image } from "react-native";
import { Fragment, useEffect } from "react";

type Props = {
	label: string;
	labelButton: string;
	labelTypeFile: string;
	sizeFile: number;
	value: string | null;
	onChange: (value: string) => void;
};

export function Upload({
	label,
	labelButton,
	labelTypeFile,
	sizeFile,
	value,
	onChange,
}: Props) {
	const { uploadImage, url, isLoadingDownload } = useImage("files");

	function handleUploadImage() {
		uploadImage();
	}

	useEffect(() => {
		if (url) {
			onChange(url);
		}
	}, [url]);

	return (
		<View className="justify-center gap-3">
			<Text className="text-gray-800 font-heading text-sm">{label}</Text>
			<View
				className={`items-center p-4 rounded-md border border-input border-dashed h-40 ${url && "justify-center"}`}
			>
				{value ? (
					<TouchableOpacity onPress={handleUploadImage}>
						{isLoadingDownload && !value ? (
							<View className="w-48 h-48 rounded-full justify-center items-center bg-violet-500/5">
								<Text className="text-xs">Carregando...</Text>
							</View>
						) : (
							<Image className="w-48 h-36" source={{ uri: value }} />
						)}
					</TouchableOpacity>
				) : (
					<Fragment>
						<UploadSimple color="#9ca3af" size={24} />
						<Text className="mt-3 text-sm">
							{labelTypeFile}{" "}
							<Text className="text-violet-600 font-heading">
								{sizeFile} MB
							</Text>
						</Text>
						<TouchableOpacity
							onPress={uploadImage}
							className="mt-3 border border-input p-2 items-center justify-center rounded-md"
						>
							<Text className="text-sm font-heading">{labelButton}</Text>
						</TouchableOpacity>
					</Fragment>
				)}
			</View>
		</View>
	);
}
