import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Image,
  Text,
  Divider,
  VStack,
  Container,
} from "@chakra-ui/react";
import api from "../services/api";
import scienceImage from "../../assets/science.png";
import technologyImage from "../../assets/technology.jpg";
import engineeringImage from "../../assets/engineering.png";
import mathematicsImage from "../../assets/mathematics.png";

const domainImages = {
  science: scienceImage,
  technology: technologyImage,
  engineering: engineeringImage,
  mathematics: mathematicsImage,
};

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/course/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <Text>Loading...</Text>;
  if (!course) return <Text>Course not found</Text>;

  return (
    <Container maxW="800px" py={12}>
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">{course.title}</Heading>

        <Image
          src={course.image || domainImages[course.domain]}
          alt={course.title}
          borderRadius="lg"
          objectFit="cover"
          w="full"
          maxH="400px"
          fallbackSrc={domainImages[course.domain]} // Image de fallback
        />

        <Text fontSize="lg" textAlign="center">
          {course.description}
        </Text>

        <Divider />

        {course.content.map((section, index) => (
          <Box key={index}>
            <Heading size="md" mb={4}>
              {section.element}
            </Heading>
            <Text>{section.section}</Text>
            {index < course.content.length - 1 && <Divider my={6} />}
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default CourseDetail;
