"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BsStars } from "react-icons/bs";
import { FaChartSimple } from "react-icons/fa6";
import { FaTasks, FaFire } from "react-icons/fa";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useRestSecurityClient } from "@/app/hooks/securityClient";

interface StreakResponse {
	streak: number;
}

interface NavOption {
	label: string;
	path: string;
	icon: React.ReactNode;
}

interface NavbarProps {
	isMobileView: boolean;
}

const navOptions: NavOption[] = [
	{ label: "Visualize", path: "/visualize", icon: <FaChartSimple size={24} /> },
	{ label: "Tasks", path: "/tasks", icon: <FaTasks /> },
	{ label: "AI", path: "/ai", icon: <BsStars /> },
];

const Navbar: React.FC<NavbarProps> = ({ isMobileView }) => {
	const [selectedTab, setSelectedTab] = useState<string>("/");
	const [streak, setStreak] = useState<number>(0);
	const restClient = useRestSecurityClient();
	const router = useRouter();
	const pathname = usePathname();
	const { userId } = useAuth();

	const handleNavLinkClick = (tab: string) => {
		setSelectedTab(tab);
		router.push(tab);
	};

	const getStreak = async () => {
		if (!userId) return;
		try {
			const response = await restClient.get<StreakResponse>(`/day/streak?userId=${userId}`);
			setStreak(response?.result?.streak || 0);
		} catch (error) {
			console.error("Error fetching streak:", error);
		}
	};

	useEffect(() => {
		setSelectedTab(pathname);
	}, [pathname]);

	// useEffect(() => {
	// 	getStreak();
	// }, [userId]);

	return (
		<div className="h-full flex flex-col justify-between py-4">
			{/* Header */}
			<h1
				className="flex items-center py-2 px-1 text-3xl text-zinc-300 cursor-pointer font-cursive"
				onClick={() => router.push("/")}
			>
				{isMobileView ? "E" : "Echelon"}
			</h1>

			{/* Nav links */}
			<div className="w-full h-full flex flex-col justify-center px-1">
				<ul className="text-xl text-zinc-500">
					{navOptions.map((link) => (
						<li
							className={`my-4 py-1 cursor-pointer w-full flex items-center gap-3 ${
								selectedTab === link.path ? "text-zinc-300" : ""
							}`}
							key={link.path}
							onClick={() => handleNavLinkClick(link.path)}
						>
							<p title={link.label}>{link.icon}</p>
							{!isMobileView && <p>{link.label}</p>}
						</li>
					))}
				</ul>
			</div>

			{/* User button */}
			<div className="px-1 flex flex-col items-start gap-6">
				<div className="flex flex-col lg:flex-row items-center gap-2">
					<FaFire className="text-red-500" size={26} />
					<span className="text-amber-600">{streak}</span>
				</div>
				<UserButton />
			</div>
		</div>
	);
};

export default Navbar;
