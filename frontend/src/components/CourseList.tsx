import { useEffect, useState } from "react";
import { getCourses } from "../services/api";
import { Link } from "react-router-dom";
import {
	Box,
	Heading,
	SimpleGrid,
	Text,
	Spinner,
	Badge,
	Flex,
	Button,
} from "@chakra-ui/react";
import VoteComponent from "./Vote";
import { Course } from "./CourseOverview";

interface CourseList {
	sortBy: string;
	domain: string;
}

const CourseList = ({ sortBy, domain }: CourseList) => {
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getCourses(sortBy, domain).then((response) => {
			setCourses(response.data);
			setLoading(false);
		});
	}, [sortBy, domain]);

	if (loading) {
		return <Spinner size='xl' />;
	}

	return (
		<Box p={2}>
			<Heading color="teal" as='h2' size='lg' mb={5}>
				Available Courses
			</Heading>
			<SimpleGrid columns={[1, 2]} spacing={6}>
				{courses.map((course) => (
					<Box
						key={course._id + "-" + Math.random() * 10}
						p={4}
						shadow='md'
						borderWidth='1px'
						borderRadius='md'
						transition='transform 0.2s'
						_hover={{ transform: "scale(1.04)", shadow: "lg" }}
					>
						<Flex
							flexWrap='wrap'
							justifyContent='space-between'
						>
							<Heading as='h3' size='md' mb={2}>
								{course.name}
							</Heading>
							<Box alignSelf="start">
								{course.domain.map((domain) => (
									<Badge key={domain} colorScheme='orange' mr={1}>
										{domain}
									</Badge>
								))}
							</Box>
						</Flex>
						<Text mb={4} noOfLines={2}>
							{course.description}
						</Text>
						<Flex justifyContent={"space-between"}>
							<Button
								as={Link}
								to={`/courses/${course._id}`}
								colorScheme='teal'
								variant='outline'
								size='sm'
							>
								View Course
							</Button>
							<VoteComponent
								upvotes={course.total_upvotes}
								downvotes={course.total_downvotes}
								isDisabled={true}
							/>
						</Flex>
					</Box>
				))}
			</SimpleGrid>
		</Box>
	);
};

export default CourseList;
