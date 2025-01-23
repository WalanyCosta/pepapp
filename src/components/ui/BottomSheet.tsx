import { View, Text } from "react-native";
import {
	BottomSheetModal,
	BottomSheetView,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";

type Props = {
	children: React.ReactNode;
	snapPoints?: string[];
};

function Background() {
	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.7)",
			}}
		/>
	);
}

export const BottomSheet = forwardRef<
	React.ElementRef<typeof BottomSheetModal>,
	Props
>(({ children, snapPoints = ["95%"] }, ref) => (
	<BottomSheetModalProvider>
		<BottomSheetModal
			ref={ref}
			snapPoints={snapPoints}
			style={{
				padding: 24,
				width: "100%",
				borderTopLeftRadius: 8,
				borderTopRightRadius: 8,
			}}
			enablePanDownToClose={true}
			backdropComponent={() => <Background />}
		>
			<BottomSheetView className="flex-1 items-center">
				<Text className="font-heading text-xl mt-3 mb-4">Novo Item</Text>
				{children}
			</BottomSheetView>
		</BottomSheetModal>
	</BottomSheetModalProvider>
));
