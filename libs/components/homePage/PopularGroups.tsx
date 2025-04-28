import { Users, Heart, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Group {
	id: string;
	name: string;
	members: number;
	image: string;
	category: string;
}

const PopularGroups = () => {
	const groups: Group[] = [
		{
			id: '1',
			name: 'Tech Enthusiasts',
			members: 1250,
			image: '/images/groups/tech.jpg',
			category: 'Technology',
		},
		{
			id: '2',
			name: 'Music Lovers',
			members: 850,
			image: '/images/groups/music.jpg',
			category: 'Music',
		},
		{
			id: '3',
			name: 'Food & Drink',
			members: 2100,
			image: '/images/groups/food.jpg',
			category: 'Food',
		},
		{
			id: '4',
			name: 'Art & Design',
			members: 950,
			image: '/images/groups/art.jpg',
			category: 'Art',
		},
	];

	return (
		<section className="w-full bg-white py-12">
			<div className="w-full max-w-6xl mx-auto px-4">
				<div className="flex items-center justify-between mb-8">
					<h2 className="text-3xl font-bold text-[#111111]">Popular Groups</h2>
					<Link
						href="/groups"
						className="text-[#E60023] hover:text-[#CC0000] transition-colors duration-200 flex items-center gap-1 text-body"
					>
						View All Groups
						<ChevronRight className="w-4 h-4" />
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{groups.map((group) => (
						<div
							key={group.id}
							className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 animate-slideIn"
						>
							<div className="relative h-40">
								<img src={group.image} alt={group.name} className="w-full h-full object-cover" />
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
									<h3 className="text-lg font-semibold text-white">{group.name}</h3>
									<p className="text-sm text-white/80">{group.category}</p>
								</div>
							</div>
							<div className="p-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Users className="w-4 h-4 text-[#6e6e6e]" />
										<span className="text-sm text-[#6e6e6e]">{group.members.toLocaleString()} members</span>
									</div>
									<button className="p-2 rounded-full hover:bg-[#F5F5F5] transition-colors duration-200">
										<Heart className="w-4 h-4 text-[#6e6e6e]" />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default PopularGroups;
