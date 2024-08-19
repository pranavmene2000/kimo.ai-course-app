import { useEffect, useState } from "react";
import { getCourseOverview } from "../services/api";
import { Link } from "react-router-dom";
import {
	Box,
	Heading,
	SimpleGrid,
	Text,
	Spinner,
	Stack,
	Button,
	Flex,
	Badge,
} from "@chakra-ui/react";
import VoteComponent from "./Vote";

interface CourseOverviewProps {
	courseId: string | undefined;
}

export interface Chapter {
	name: string;
	text: string;
	upvotes: number;
	downvotes: number;
}

export interface Course {
	_id: string;
	name: string;
	date: Date;
	description: string;
	domain: string[];
	chapters: Chapter[];
	total_upvotes: number;
	total_downvotes: number;
}

const CourseOverview = ({ courseId }: CourseOverviewProps) => {
	const [course, setCourse] = useState<Course>();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getCourseOverview(courseId).then((response) => {
			setCourse(response.data);
			setLoading(false);
		});
	}, [courseId]);

	if (loading) {
		return <Spinner size='xl' />;
	}

	return (
		<Box p={4}>
			<Flex flexWrap='wrap' justifyContent='space-between'>
				<Heading as='h2' size='lg' mb={4}>
					{course?.name}
				</Heading>
				<Box alignSelf='start'>
					{course?.domain.map((domain) => (
						<Badge key={domain} colorScheme='orange' mr={1}>
							{domain}
						</Badge>
					))}
				</Box>
			</Flex>
			<Text fontSize='md' mb={6}>
				{course?.description}
			</Text>
			<Stack spacing={4}>
				<Heading as='h3' size='md'>
					Chapters
				</Heading>
				<SimpleGrid columns={[1, 2]} spacing={6}>
					{course?.chapters.map((chapter) => (
						<Box
							key={chapter.name}
							p={4}
							shadow='md'
							borderWidth='1px'
							borderRadius='md'
							transition='transform 0.2s'
							_hover={{ transform: "scale(1.02)", shadow: "lg" }}
							position='relative'
							display='flex'
							alignItems='center'
						>
							<Box flex='1'>
								<Heading as='h4' size='sm' mb={2}>
									{chapter.name}
								</Heading>
								<Text mb={4} noOfLines={2}>
									{chapter.text}
								</Text>
								<Flex justifyContent={"space-between"}>
									<Button
										as={Link}
										to={`/courses/${courseId}/chapters/${chapter.name}`}
										colorScheme='teal'
										variant='outline'
										size='sm'
									>
										View Chapter
									</Button>
									<VoteComponent
										upvotes={chapter?.upvotes}
										downvotes={chapter?.downvotes}
										isDisabled={true}
									/>
								</Flex>
							</Box>
						</Box>
					))}
				</SimpleGrid>
			</Stack>
		</Box>
	);
};

export default CourseOverview;
