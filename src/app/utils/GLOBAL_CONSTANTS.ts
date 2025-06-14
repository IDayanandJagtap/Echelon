export class GLOBAL_CONSTANTS {
	// public static readonly productivityLevels = [
	// 	{ label: "Idle", value: 0 },
	// 	{ label: "Improving", value: 1 },
	// 	{ label: "Moderate", value: 2 },
	// 	{ label: "Efficient", value: 3 },
	// 	{ label: "Peak", value: 4 },
	// ];
	public static readonly productivityLevels = [
		{ label: "Idle", value: 0, color: "#CCCCCC" }, // gray
		{ label: "Improving", value: 1, color: "#FFC107" }, // orange
		{ label: "Moderate", value: 2, color: "#8BC34A" }, // green
		{ label: "Efficient", value: 3, color: "#03A9F4" }, // blue
		{ label: "Peak", value: 4, color: "#FF69B4" }, // pink
	];

	public static readonly skillLevelMapping = ["Beginner", "Intermediate", "Advance", "Expert"];
}
