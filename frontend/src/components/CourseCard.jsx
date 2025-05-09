import { Box, Image, Heading, Text, Link, Badge } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
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

const CourseCard = ({ course }) => {
  const domainColors = {
    science: "blue",
    technology: "green",
    engineering: "orange",
    mathematics: "red",
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
      transition="all 0.2s"
    >
      <Image
        src={course.image || domainImages[course.domain]}
        alt={course.title}
        h="200px"
        w="full"
        objectFit="cover"
        fallbackSrc={domainImages[course.domain]}
      />

      <Box p={6}>
        <Badge colorScheme={domainColors[course.domain]} mb={2}>
          {course.domain}
        </Badge>
        <Heading size="md" mb={2}>
          <Link as={RouterLink} to={`/course/${course.id}`}>
            {course.title}
          </Link>
        </Heading>
        <Text noOfLines={3}>{course.description}</Text>
      </Box>
    </Box>
  );
};

export default CourseCard;
