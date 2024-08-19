import { useEffect, useState } from "react";
import CourseList from "../components/CourseList";
import {
	Box,
	Heading,
	Stack,
	Select,
	Container,
	Text,
	Flex,
	Divider,
	Button,
	Spinner,
} from "@chakra-ui/react";
import { getDomains } from "../services/api";

const HomePage = () => {
	const [filters, setFilters] = useState({
		sortBy: "name",
		domain: "",
	});

	const [domains, setDomains] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getDomains().then((response) => {
			setDomains(response.data);
			setLoading(false);
		});
	}, []);

	const handleFilters = (e: React.ChangeEvent<HTMLSelectElement>) => {
		e.preventDefault();
		if (e.target.name === "sortBy" && e.target.value === "") return;
		setFilters((prevFilters) => {
			return {
				...prevFilters,
				[e.target.name]: e.target.value,
			};
		});
	};

	const handleReset = () => {
		setFilters({
			sortBy: "name",
			domain: "",
		});
	};

	if (loading) {
		return <Spinner size='xl' />;
	}

	return (
		<Box bg='gray.50' minH='100vh' py={8}>
			<Container maxW='container.xl'>
				<Flex
					justify='center'
					align='center'
					direction='column'
					textAlign='center'
					mb={8}
				>
					<Heading as='h1' size='2xl' fontWeight='bold' mb={4} color='teal.600'>
						Explore Courses
					</Heading>
					<Text fontSize='lg' color='gray.600' maxW='600px'>
						Discover a variety of courses across different domains. Filter and
						sort the courses based on your preferences.
					</Text>
				</Flex>

				<Divider my={8} borderColor='gray.300' />

				<Stack
					direction={["column", "row"]}
					spacing={4}
					mb={6}
					align='center'
					justify='center'
				>
					<Select
						placeholder='Sort by'
						onChange={handleFilters}
						value={filters.sortBy}
						name='sortBy'
						maxW='300px'
						bg='white'
						shadow='sm'
						borderRadius='md'
					>
						<option value='name'>Name ASC</option>
						<option value='date'>Date DESC</option>
						<option value='total_upvotes'>Up Votes DESC</option>
						<option value='total_downvotes'>Down Votes DESC</option>
					</Select>
					<Select
						placeholder='Filter by Domain'
						onChange={handleFilters}
						name='domain'
						value={filters.domain}
						maxW='300px'
						bg='white'
						shadow='sm'
						borderRadius='md'
					>
						{domains.map((d) => (
							<option value={d}>{formatDomain(d)}</option>
						))}
					</Select>
					<Button
						isDisabled={
							(filters.sortBy === "name" && !filters.domain) || loading
						}
						onClick={handleReset}
						colorScheme='teal'
						variant='solid'
						size='md'
					>
						Reset filters
					</Button>
				</Stack>

				<Divider my={8} borderColor='gray.300' />

				<CourseList sortBy={filters.sortBy} domain={filters.domain} />
			</Container>
		</Box>
	);
};

export default HomePage;

const formatDomain = (domain: string) => {
	return domain.charAt(0).toUpperCase() + domain.slice(1);
};
