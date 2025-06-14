import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

// Placeholder for LoadingSpinner
const LoadingSpinner = () => <div className="text-center py-4">Loading...</div>;


// Constants
const categories = [
	{ label: "Personal", value: "personal" },
	{ label: "Work", value: "work" },
	{ label: "Academics", value: "academics" },
];

interface InputValues {
	title: string;
	description: string;
	category: string;
	taskDate: Date;
}

const defaultInputValues: InputValues = {
	title: "",
	description: "",
	category: "",
	taskDate: new Date(),
};

interface NewTaskProps {
	onClose: () => void;
	onSubmit: (input: InputValues) => Promise<{ success: boolean }>;
}

const NewTask: React.FC<NewTaskProps> = ({ onClose, onSubmit }) => {
	const [inputData, setInputData] = useState<InputValues>(defaultInputValues);
	const [isLoading, setIsLoading] = useState(false);

	const handleInputChange = (field: keyof InputValues, value: string | Date) => {
		setInputData({ ...inputData, [field]: value });
	};

	const handleOnCreate = async () => {
		try {
			if (!inputData.title || !inputData.description || !inputData.category || !inputData.taskDate) {
				throw new Error("All fields are required");
			}
			setIsLoading(true);
			const response = await onSubmit(inputData);
			if (response.success) {
				toast("Task created successfully");
			}
		} catch (error) {
			const err = error as Error;
			toast("Oops! Something went wrong while creating task", {
				description: err.message,
				className: "bg-red-600 text-white",
			});
		} finally {
			setIsLoading(false);
			onClose();
		}
	};

	const handleCloseModal = () => {
		setInputData(defaultInputValues);
		onClose();
	};

	return (
		<div className="absolute inset-0 z-50">
			{/* Backdrop */}
			<div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={handleCloseModal} />

			{/* Modal Content */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-2xl mx-auto">
				{isLoading && <LoadingSpinner />}
				<div className="bg-[#111] rounded-lg shadow-lg">
					{/* Header */}
					<div className="flex items-center justify-between p-3 border-b border-slate-700">
						<h3 className="text-sm sm:text-base font-semibold text-slate-200">
							Create a New Task
						</h3>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleCloseModal}
							className="text-slate-400 hover:bg-red-600 hover:text-white h-7 w-7 sm:h-8 sm:w-8"
						>
							<X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						</Button>
					</div>

					{/* Form Content */}
					<div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
						{/* Title Input */}
						<div className="space-y-1">
							<Label htmlFor="title" className="text-xs sm:text-sm text-slate-300">
								Title
							</Label>
							<Input
								id="title"
								className="bg-[#222] border-none h-9 sm:h-10 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500"
								placeholder="Enter task title"
								onChange={e => handleInputChange("title", e.target.value)}
								value={inputData.title}
							/>
						</div>

						{/* Description Input */}
						<div className="space-y-1">
							<Label htmlFor="description" className="text-xs sm:text-sm text-slate-300">
								Description
							</Label>
							<Textarea
								id="description"
								className="bg-[#222] border-none text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 min-h-[80px] sm:min-h-[100px]"
								placeholder="Enter task description"
								value={inputData.description}
								onChange={e => handleInputChange("description", e.target.value)}
							/>
						</div>

						{/* Category and Date Picker */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{/* Category Select */}
							<div className="space-y-1">
								<Label htmlFor="category" className="text-xs sm:text-sm text-slate-300">
									Category
								</Label>
								<Select
									onValueChange={value => handleInputChange("category", value)}
									value={inputData.category}
								>
									<SelectTrigger
										id="category"
										className="bg-[#222] border-none h-9 sm:h-10 text-xs sm:text-sm text-slate-200"
									>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent className="bg-[#222] border-slate-700 ">
										{categories.map(item => (
											<SelectItem
												value={item.value}
												key={item.value}
												className="focus:bg-[#333] focus:text-slate-300 text-xs sm:text-sm text-white"
											>
												{item.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Date Picker */}
							<div className="space-y-1">
								<Label htmlFor="date" className="text-xs sm:text-sm text-slate-300">
									Due Date
								</Label>
								<DatePicker
									className="w-full h-9 sm:h-10 bg-[#222] border-none text-xs sm:text-sm text-slate-200"
									date={inputData.taskDate}
									setDate={(date: Date) => handleInputChange("taskDate", date)}
								/>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className="flex justify-end p-3 border-t border-slate-700">
						<Button
							onClick={handleOnCreate}
							className="text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white h-8 sm:h-9"
						>
							Create Task
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewTask;
