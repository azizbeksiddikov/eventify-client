import { Users, Heart, Code2 } from 'lucide-react';

const Acknowledgements = () => {
	return (
		<section className="space-y-6 animate-fadeIn">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Team & Community Section */}
				<div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-4 border-b border-[#F5F5F5]">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-lg bg-[#e60023]/5">
								<Users className="w-5 h-5 text-[#e60023]" />
							</div>
							<h3 className="text-lg font-semibold text-[#111111]">Team & Community</h3>
						</div>
					</div>
					<div className="p-4">
						<ul className="space-y-3">
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Our dedicated development team
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Early adopters and beta testers
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Community moderators
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								User feedback contributors
							</li>
						</ul>
					</div>
				</div>

				{/* Partners Section */}
				<div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-4 border-b border-[#F5F5F5]">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-lg bg-[#e60023]/5">
								<Heart className="w-5 h-5 text-[#e60023]" />
							</div>
							<h3 className="text-lg font-semibold text-[#111111]">Partners</h3>
						</div>
					</div>
					<div className="p-4">
						<ul className="space-y-3">
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Technology partners
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Event organizers
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Venue partners
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Sponsors and supporters
							</li>
						</ul>
					</div>
				</div>

				{/* Open Source Section */}
				<div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-4 border-b border-[#F5F5F5]">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-lg bg-[#e60023]/5">
								<Code2 className="w-5 h-5 text-[#e60023]" />
							</div>
							<h3 className="text-lg font-semibold text-[#111111]">Open Source</h3>
						</div>
					</div>
					<div className="p-4">
						<ul className="space-y-3">
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Open source contributors
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Library maintainers
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Documentation writers
							</li>
							<li className="flex items-center gap-2 text-sm text-[#6e6e6e]">
								<span className="w-1.5 h-1.5 rounded-full bg-[#e60023]" />
								Bug reporters
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Acknowledgements;
