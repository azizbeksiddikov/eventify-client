import { Users, Heart, Code2 } from 'lucide-react';

const Acknowledgements = () => {
	return (
		<section className="py-20 bg-muted">
			<div className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-6 mx-auto">
				{/* Team & Community Section */}
				<div className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-4 border-b border-border">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-lg bg-primary/5">
								<Users className="w-5 h-5 text-primary" />
							</div>
							<h3 className="text-lg font-semibold text-card-foreground">Team & Community</h3>
						</div>
					</div>
					<div className="p-4">
						<ul className="space-y-3">
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Our dedicated development team
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Early adopters and beta testers
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Community moderators
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								User feedback contributors
							</li>
						</ul>
					</div>
				</div>

				{/* Partners Section */}
				<div className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-4 border-b border-border">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-lg bg-primary/5">
								<Heart className="w-5 h-5 text-primary" />
							</div>
							<h3 className="text-lg font-semibold text-card-foreground">Partners</h3>
						</div>
					</div>
					<div className="p-4">
						<ul className="space-y-3">
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Technology partners
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Event organizers
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Venue partners
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Sponsors and supporters
							</li>
						</ul>
					</div>
				</div>

				{/* Open Source Section */}
				<div className="bg-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn">
					<div className="p-4 border-b border-border">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-lg bg-primary/5">
								<Code2 className="w-5 h-5 text-primary" />
							</div>
							<h3 className="text-lg font-semibold text-card-foreground">Open Source</h3>
						</div>
					</div>
					<div className="p-4">
						<ul className="space-y-3">
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Open source contributors
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Library maintainers
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
								Documentation writers
							</li>
							<li className="flex items-center gap-2 text-sm text-muted-foreground">
								<span className="w-1.5 h-1.5 rounded-full bg-primary" />
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
