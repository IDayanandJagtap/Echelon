import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, ChangeEvent } from "react";
import { Trash2, Edit2, Save, X } from "lucide-react";

// Constants
const statuses = [
	{ label: "In progress", value: "inProgress" },
	{ label: "Done", value: "done" },
	{ label: "Not Done", value: "notDone" },
];

const statusColorLabel: Record<string, { color: string; label: string }> = {
	done: { color: "bg-green-600", label: "Done" },
	inProgress: { color: "bg-yellow-600", label: "In progress" },
	notDone: { color: "bg-red-600", label: "Not Done" },
	todo: { color: "bg-neutral-600", label: "To do" },
	pending: { color: "bg-neutral-600", label: "Pending" },
};

interface TaskProps {
	id: string;
	title: string;
	description: string;
	category: string;
	status: string;
	onTaskUpdate: (id: string, data: Partial<{ title: string; description: string; status: string }>) => void | Promise<void>;
	onDelete: (id: string) => void | Promise<void>;
}

interface SelectedFilters {
	statusOfTask?: string;
	[key: string]: string | undefined;
}

const Task: React.FC<TaskProps> = ({
	id,
	title,
	description,
	category,
	status,
	onTaskUpdate,
	onDelete,
}) => {
	const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({});
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState(title);
	const [editedDescription, setEditedDescription] = useState(description);

	const handleDropdownChange = (dropdown: string, newValue: string) => {
		setSelectedFilters({ ...selectedFilters, [dropdown]: newValue });
		onTaskUpdate(id, { status: newValue });
	};

	const handleEditClick = () => {
		setIsEditing(true);
	};

	const handleSaveClick = async () => {
		const updatedData = {
			title: editedTitle,
			description: editedDescription,
		};
		await onTaskUpdate(id, updatedData);
		setIsEditing(false);
	};

	const handleCancelClick = () => {
		setEditedTitle(title);
		setEditedDescription(description);
		setIsEditing(false);
	};

	const handleDeleteClick = () => {
		onDelete(id);
	};

	useEffect(() => {
		setSelectedFilters((prev) => ({ ...prev, statusOfTask: status }));
	}, [status]);

	return (
		<div className="bg-[#222] px-4  my-2 rounded-lg">
			<Accordion type="single" collapsible value={isEditing ? "item-1" : undefined}>
				<AccordionItem value="item-1" className="border-none">
					<AccordionTrigger className="hover:no-underline">
						<div className="flex w-full items-center justify-between">
							<div className="flex flex-col gap-1 w-full">
								{isEditing ? (
									<div className="flex flex-col gap-1 w-full">
										<Label htmlFor="title" className="text-xs text-gray-400">
											Title
										</Label>
										<Input
											id="title"
											value={editedTitle}
											onChange={(e: ChangeEvent<HTMLInputElement>) => setEditedTitle(e.target.value)}
											className="bg-[#181818] border-none w-full "
										/>
									</div>
								) : (
									<div className="flex flex-col gap-1">
										<h3 className="text-sm font-medium lg:text-md">{title}</h3>
										<Badge className="bg-purple-500/20 text-purple-300 text-xs rounded-md px-2 py-0.5 w-fit border-none">
											{category}
										</Badge>
									</div>
								)}
							</div>
							{!isEditing && (
								<Select
									onValueChange={(value: string) => handleDropdownChange("statusOfTask", value)}
									value={selectedFilters.statusOfTask}
								>
									<SelectTrigger
										className={`w-[110px] h-[30px] ${
											statusColorLabel[selectedFilters.statusOfTask ?? "todo"].color
										} border-none text-xs`}
									>
										<SelectValue placeholder={statusColorLabel[status]?.label} />
									</SelectTrigger>
									<SelectContent className="bg-[#222] border-slate-700">
										{statuses.map((item) => (
											<SelectItem
												value={item.value}
												key={item.value}
												className="text-white focus:bg-[#333] focus:text-slate-300"
											>
												{item.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						</div>
					</AccordionTrigger>
					<AccordionContent>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-3">
								{isEditing ? (
									<>
										<div className="flex flex-col gap-1">
											<Label htmlFor="category" className="text-xs text-gray-400">
												Category
											</Label>
											<Badge className="bg-purple-500/20 text-purple-300 text-xs rounded-md px-2 py-0.5 w-fit border-none">
												{category}
											</Badge>
										</div>
										<div className="flex flex-col gap-1">
											<Label htmlFor="description" className="text-xs text-gray-400">
												Description
											</Label>
											<Textarea
												id="description"
												value={editedDescription}
												onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditedDescription(e.target.value)}
												className="bg-[#181818] border-input border-none min-h-[100px]"
											/>
										</div>
									</>
								) : (
									<p className="text-sm text-gray-300">{description}</p>
								)}
							</div>
							<div className="border-t border-border/10 pt-2">
								<div className="flex justify-end gap-2">
									<Button
										variant="ghost"
										size="icon"
										className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
										onClick={handleDeleteClick}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
									{isEditing ? (
										<>
											<Button
												variant="ghost"
												size="icon"
												className="text-green-500 hover:text-green-600 hover:bg-green-500/10"
												onClick={handleSaveClick}
											>
												<Save className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="text-gray-500 hover:text-gray-600 hover:bg-gray-500/10"
												onClick={handleCancelClick}
											>
												<X className="h-4 w-4" />
											</Button>
										</>
									) : (
										<Button
											variant="ghost"
											size="icon"
											className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
											onClick={handleEditClick}
										>
											<Edit2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};

export default Task;
