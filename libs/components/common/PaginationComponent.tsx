import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '../ui/pagination';

interface PaginationComponentProps {
	totalItems: number;
	currentPage?: number;
	limit?: number;
	setCurrentPage: (page: number) => void;
}

const PaginationComponent = ({ totalItems, currentPage = 1, limit = 5, setCurrentPage }: PaginationComponentProps) => {
	if (totalItems <= 0) return null;

	const pageChangeHandler = (page: number) => {
		setCurrentPage(page);
	};
	const totalPages = Math.ceil(totalItems / limit);
	const startPage = Math.max(1, currentPage - Math.floor(limit / 2));
	const endPage = Math.min(totalPages, startPage + limit - 1);

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => pageChangeHandler(currentPage - 1)}
						className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
					/>
				</PaginationItem>

				{startPage > 1 && (
					<>
						<PaginationItem>
							<PaginationLink onClick={() => pageChangeHandler(1)}>1</PaginationLink>
						</PaginationItem>
						{startPage > 2 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}
					</>
				)}

				{Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
					<PaginationItem key={page}>
						<PaginationLink onClick={() => pageChangeHandler(page)} isActive={page === currentPage}>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}

				{endPage < totalPages && (
					<>
						{endPage < totalPages - 1 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}
						<PaginationItem>
							<PaginationLink onClick={() => pageChangeHandler(totalPages)}>{totalPages}</PaginationLink>
						</PaginationItem>
					</>
				)}

				<PaginationItem>
					<PaginationNext
						onClick={() => pageChangeHandler(currentPage + 1)}
						className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default PaginationComponent;
