import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  VStack,
  Text,
  Divider,
  Image,
  Container,
  SimpleGrid,
} from "@chakra-ui/react";
import CourseCard from "../components/CourseCard";
import api from "../services/api";
import coursesImage from "../../assets/courses.jpg";

const CoursesPage = () => {
  const { domain } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          domain ? `/courses/${domain}` : "/courses"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [domain]);

  if (loading) {
    return (
      <Container maxW="1200px" py={12} textAlign="center">
        <Text>Loading courses...</Text>
      </Container>
    );
  }

  // Group courses by domain only for the "All Courses" view
  const groupedCourses = !domain
    ? courses.reduce((acc, course) => {
        if (!acc[course.domain]) {
          acc[course.domain] = [];
        }
        acc[course.domain].push(course);
        return acc;
      }, {})
    : null;

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" h="300px">
        <Image
          src={coursesImage}
          alt="Courses"
          w="full"
          h="full"
          objectFit="cover"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="rgba(0,0,0,0.5)"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          color="white"
        >
          <Heading size="2xl" mb={4}>
            {domain
              ? `${domain.charAt(0).toUpperCase() + domain.slice(1)} Courses`
              : "All Courses"}
          </Heading>
          <Text fontSize="xl">
            {domain
              ? `Explore our ${domain} courses`
              : "Browse our complete course catalog"}
          </Text>
        </Box>
      </Box>

      {/* Courses Content */}
      <Container maxW="1200px" py={12}>
        {domain ? (
          // Display all courses for a specific domain
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </SimpleGrid>
        ) : (
          // Display all courses grouped by domain for "All Courses" view
          <VStack spacing={12} align="stretch">
            {Object.entries(groupedCourses).map(
              ([domainName, domainCourses]) => (
                <Box key={domainName}>
                  <Heading size="lg" mb={6} color={`stem.${domainName}`}>
                    {domainName.charAt(0).toUpperCase() + domainName.slice(1)}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {domainCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </SimpleGrid>
                  <Divider my={8} />
                </Box>
              )
            )}
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default CoursesPage;
