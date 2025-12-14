import { Users, Heart, Code2 } from "lucide-react";

const Acknowledgements = () => {
	return (
		<section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-muted w-full min-w-0">
			<div className="content-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
				{/* Team & Community Section */}
				<div className="bg-card rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-3 sm:p-4 border-b">
						<div className="flex items-center gap-1.5 sm:gap-2">
							<div className="p-1.5 sm:p-2 rounded-lg bg-primary/5">
								<Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
							</div>
							<h3 className="text-base sm:text-lg font-semibold text-card-foreground">{"Team & Community"}</h3>
						</div>
					</div>
					<div className="p-3 sm:p-4">
						<ul className="space-y-2 sm:space-y-3">
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Our dedicated development team"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Early adopters and beta testers"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Community moderators"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"User feedback contributors"}
							</li>
						</ul>
					</div>
				</div>

				{/* Partners Section */}
				<div className="bg-card rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-3 sm:p-4 border-b">
						<div className="flex items-center gap-1.5 sm:gap-2">
							<div className="p-1.5 sm:p-2 rounded-lg bg-primary/5">
								<Heart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
							</div>
							<h3 className="text-base sm:text-lg font-semibold text-card-foreground">{"Partners"}</h3>
						</div>
					</div>
					<div className="p-3 sm:p-4">
						<ul className="space-y-2 sm:space-y-3">
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Technology partners"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Event organizers"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Venue partners"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Sponsors and supporters"}
							</li>
						</ul>
					</div>
				</div>

				{/* Open Source Section */}
				<div className="bg-card rounded-lg sm:rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-3 sm:p-4 border-b">
						<div className="flex items-center gap-1.5 sm:gap-2">
							<div className="p-1.5 sm:p-2 rounded-lg bg-primary/5">
								<Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
							</div>
							<h3 className="text-base sm:text-lg font-semibold text-card-foreground">{"Open Source"}</h3>
						</div>
					</div>
					<div className="p-3 sm:p-4">
						<ul className="space-y-2 sm:space-y-3">
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Open source contributors"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Library maintainers"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Documentation writers"}
							</li>
							<li className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
								<span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary" />
								{"Bug reporters"}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Acknowledgements;
