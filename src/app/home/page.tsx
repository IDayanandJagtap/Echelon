"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Hero: React.FC = () => {
	const router = useRouter();

	const redirectToDashboard = (): void => {
		router.push("/tasks");
	};

	return (
		<>
			{/* Google Font Link (You could also add this in layout.tsx for global access) */}
			<link href="https://fonts.googleapis.com/css2?family=Habibi&display=swap" rel="stylesheet" />

			<div
				className="min-h-screen h-full  bg-gradient-to-br from-[#0D0D1F] via-[#1A1A2E] to-[#1E1E35] relative overflow-hidden"
				style={{ fontFamily: "'Habibi', serif" }}
			>
				{/* Gradient Overlays */}
				<div className="absolute inset-0 bg-[radial-gradient(var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent opacity-40" />
				<div className="absolute inset-0 bg-[radial-gradient(var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-30" />

				{/* Navigation */}
				<nav className="relative z-10 px-6 py-4">
					<div className="max-w-7xl mx-auto flex items-center justify-between">
						<Link href="/" className="flex items-center space-x-2">
							<span className="text-white text-3xl" style={{ fontFamily: "cursive" }}>
								Echelon
							</span>
						</Link>
						<div className="flex items-center space-x-4">
							<Link
								href="/signin"
								className="text-gray-300 hover:text-white transition-colors"
							>
								Sign in
							</Link>
						</div>
					</div>
				</nav>

				{/* Hero Section */}
				<main className="relative z-10 px-6 pt-20 pb-32 flex justify-center items-center h-[90vh]">
					<div className="max-w-7xl mx-auto text-center">
						<div className="inline-flex items-center bg-white/10 rounded-full px-4 py-1.5 mb-8">
							<span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-white">
								NEW
							</span>
							<span className="text-gray-300 text-sm">Learn new skills</span>
						</div>

						<h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
							A new way to increase the
						</h1>
						<h2 className="text-3xl md:text-5xl font-bold mb-8">
							<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
								productivity levels
							</span>
						</h2>
						<p className="text-gray-400 max-w-2xl mx-auto mb-12">
							We will make you do What you said You will do ..
						</p>
						<button
							className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity"
							onClick={redirectToDashboard}
						>
							Get started
						</button>
					</div>
				</main>
			</div>
		</>
	);
};

export default Hero;
