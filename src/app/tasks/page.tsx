"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Plus, Sparkles } from "lucide-react";
import Task from "@/components/custom/task/Task";
import NewTask from "@/components/custom/task/NewTask";
import { useRestSecurityClient } from "@/app/hooks/securityClient";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

// Placeholder for LoadingSpinner
const LoadingSpinner = () => <div className="text-center py-4">Loading...</div>;

// Types
interface Task {
	_id: string;
	title: string;
	description: string;
	status: string;
	category: string;
}

interface TaskResponse {
	result: {
		tasks: Task[];
		statusOfDay: string;
	};
}

interface QuoteResponse {
	quote: string;
}

interface ProductivityLevel {
	value: string;
	label: string;
}

const productivityLevels: Record<string, string> = {
	"0": "Idle",
	"1": "Improving",
	"2": "Moderate",
	"3": "Efficient",
	"4": "Peak",
};

const TaskDashboard = () => {
	const [date, setDate] = useState<Date>(new Date());
	const [taskList, setTaskList] = useState<Task[]>([]);
	const [statusOfDay, setStatusOfDay] = useState<string>("");
	const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
	const [showNewTask, setShowNewTask] = useState<boolean>(false);
	const restClient = useRestSecurityClient();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [quote, setQuote] = useState<string>("");
	const auth = useAuth();

	const handleDropdownChange = (dropdown: string, newValue: string) => {
		setSelectedFilters({ ...selectedFilters, [dropdown]: newValue });
		handleDayUpdate(newValue);
	};

	const handleChangeDateByOne = (date: Date, type: "next" | "previous") => {
		if (type === "next") {
			setDate(new Date(date.setDate(date.getDate() + 1)));
		} else if (type === "previous") {
			setDate(new Date(date.setDate(date.getDate() - 1)));
		}
	};

	const getTasks = async (date: string, userId: string) => {
		try {
			if (!date || !userId) {
				return;
			}
			setIsLoading(true);
			const response = await restClient.get<TaskResponse>(`/tasks/?date=${date}&userId=${userId}`);
			setTaskList(response?.result?.tasks || []);
			setStatusOfDay(response?.result?.statusOfDay || "");
		} catch (error) {
			console.error(error);
		} finally {
			setTimeout(() => {
				setIsLoading(false);
			}, 2000);
		}
	};

	const createNewTask = async (inputData: Partial<Task> & { userId?: string }) => {
		try {
			inputData.userId = auth.userId;
			return await restClient.post(`/tasks/create`, inputData);
		} catch (error) {
			console.error(error);
		} finally {
			const dateInRequiredFormat = new Date(date).toISOString().split("T")[0];
			if (auth.userId) {
				getTasks(dateInRequiredFormat, auth.userId);
			}
		}
	};

	const handleTaskUpdate = async (taskId: string, updatedData: Partial<Task>) => {
		try {
			if (!taskId || !updatedData) {
				throw new Error("Task Id or updated data is missing");
			}
			setIsLoading(true);
			await restClient.put(`/tasks/update`, { taskId, updatedData });
		} catch (error) {
			if (error instanceof Error) {
				toast.error("Oops! Something went wrong while updating the task data", {
					description: error.message,
				});
			}
		} finally {
			const dateInRequiredFormat = new Date(date).toISOString().split("T")[0];
			if (auth.userId) {
				await getTasks(dateInRequiredFormat, auth.userId);
			}
			setIsLoading(false);
		}
	};

	const handleTaskDelete = async (taskId: string) => {
		try {
			if (!taskId) {
				throw new Error("Task Id is missing");
			}
			setIsLoading(true);
			await restClient.delete(`/tasks/delete?taskId=${taskId}`);
			toast.success("Deleted the task successfully");
		} catch (error) {
			if (error instanceof Error) {
				toast.error("Oops! Something went wrong while deleting the task", {
					description: error.message,
				});
			}
		} finally {
			const dateInRequiredFormat = new Date(date).toISOString().split("T")[0];
			if (auth.userId) {
				await getTasks(dateInRequiredFormat, auth.userId);
			}
			setIsLoading(false);
		}
	};

	const handleDayUpdate = async (status: string) => {
		try {
			const requestBody = {
				date: date,
				userId: auth.userId,
				statusOfDay: status,
			};
			setIsLoading(true);
			await restClient.put(`/day`, requestBody);
			toast.success("Updated the status successfully");
		} catch (error) {
			if (error instanceof Error) {
				toast.error("Oops! Something went wrong while updating the status of Day", {
					description: error.message,
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	const getQuote = async () => {
		try {
			const response = await restClient.get<QuoteResponse>(`/quote`);
			setQuote(response?.quote || "");
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (date && auth.userId) {
			try {
				const dateInRequiredFormat = new Date(date).toISOString().split("T")[0];
				getTasks(dateInRequiredFormat, auth.userId);
			} catch (error) {
				console.error(error);
			}
		}
	}, [date]);

	useEffect(() => {
		getQuote();
		setStatusOfDay("0");
	}, []);

	return (
		<div className="w-full h-full p-4 relative">
			{isLoading && <LoadingSpinner />}
			{!showNewTask && (
				<div className="w-full h-full flex flex-col gap-4">
					{/* Header Section */}
					<div className="flex items-center justify-between gap-4 border-b-[1px] border-slate-500 pb-4">
						<h1 className="hidden lg:block text-xl font-medium text-slate-200">
							Tasks Dashboard
						</h1>

						<div className="flex items-center gap-2 w-[100px] lg:w-fit">
							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-[#222] hover:text-white"
								onClick={() => handleChangeDateByOne(date, "previous")}
							>
								<ChevronLeft className="h-5 w-5" />
							</Button>
							<DatePicker date={date} setDate={setDate} />
							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-[#222] hover:text-white"
								onClick={() => handleChangeDateByOne(date, "next")}
							>
								<ChevronRight className="h-5 w-5" />
							</Button>
						</div>

						<Button
							className="bg-sky-600 hover:bg-sky-700 w-[100px] lg:w-fit"
							onClick={() => setShowNewTask(true)}
						>
							<Plus className="h-5 w-5" />
							<span className="hidden lg:block">Add New Task</span>
							<span className="text-xs lg:text-base lg:hidden">New Task</span>
						</Button>
					</div>

					{/* Status Section */}
					<div className="flex">
						<Select onValueChange={(value) => handleDropdownChange("statusOfDay", value)}>
							<SelectTrigger className="w-[150px] bg-[#222] border-slate-700">
								<SelectValue placeholder={productivityLevels[statusOfDay || "0"]} />
							</SelectTrigger>
							<SelectContent className="bg-[#222] border-slate-700">
								{Object.entries(productivityLevels).map(([value, label]) => (
									<SelectItem
										value={value}
										key={value}
										className="text-white focus:bg-[#333] focus:text-slate-300"
									>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Tasks Section */}
					<div className="w-full h-full flex flex-col justify-between overflow-hidden">
						<div className="flex-1 overflow-auto min-h-[60dvh] max-h-[70dvh]">
							{Array.isArray(taskList) && taskList.length > 0 ? (
								<div className="space-y-3">
									{taskList.toReversed().map((task) => (
										<Task
											key={task._id}
											id={task._id}
											title={task.title}
											description={task.description}
											status={task.status}
											category={task.category}
											onTaskUpdate={handleTaskUpdate}
											onDelete={handleTaskDelete}
										/>
									))}
								</div>
							) : (
								<div className="flex justify-center items-center h-[60dvh] text-slate-400">
									<p>No tasks available!</p>
								</div>
							)}
						</div>

						{/* Quotes Section */}
						<div className="flex justify-center">
							<div className="flex items-center gap-2">
								<Sparkles className="w-4 h-4 text-blue-400" />
								<p className="text-xs lg:text-sm italic text-slate-400">
									&ldquo;{quote}&rdquo;
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
			{/* Modal Container */}
			{showNewTask && <NewTask onClose={() => setShowNewTask(false)} onSubmit={createNewTask} />}
		</div>
	);
};

export default TaskDashboard;
