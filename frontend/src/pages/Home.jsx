import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Image as ChakraImage,
  SimpleGrid,
  Stack,
  VStack,
  HStack,
  Icon,
  Container,
  IconButton,
  Badge,
  Spinner,
  Link,
  Center,
  Skeleton,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  FaBook,
  FaVideo,
  FaNewspaper,
  FaRobot,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import heroImage from "../../assets/home.png";
import aboutImage from "../../assets/about.png";
import api from "../services/api";
import scienceImage from "../../assets/science.png";
import technologyImage from "../../assets/technology.jpg";
import engineeringImage from "../../assets/engineering.png";
import mathematicsImage from "../../assets/mathematics.png";

// Debug logger
const debug = {
  log: (...args) => console.log("[DEBUG]", ...args),
  error: (...args) => console.error("[DEBUG]", ...args),
};

// Cache for preloaded images
const imageCache = new Map();

// Enhanced preloading function with better error handling
const preloadImages = async () => {
  const images = [
    { name: "science", src: scienceImage },
    { name: "technology", src: technologyImage },
    { name: "engineering", src: engineeringImage },
    { name: "mathematics", src: mathematicsImage },
    { name: "hero", src: heroImage },
    { name: "about", src: aboutImage },
  ];

  debug.log("Starting image preloading...");

  // Use Promise.allSettled to continue even if some images fail to load
  const results = await Promise.allSettled(
    images.map(({ name, src }) => {
      return new Promise((resolve) => {
        if (imageCache.has(src)) {
          debug.log(`Image ${name} already in cache`);
          return resolve();
        }

        // Create image element in a way that works in all environments
        const img = document.createElement("img");
        img.src = src;
        img.onload = () => {
          imageCache.set(src, true);
          debug.log(`Successfully preloaded ${name} image`);
          resolve();
        };
        img.onerror = (e) => {
          debug.error(`Failed to preload ${name} image`, e);
          resolve();
        };
      });
    })
  );

  // Log any failures
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      debug.error(
        `Failed to preload ${images[index].name} image:`,
        result.reason
      );
    }
  });
};

const domainImages = {
  science: scienceImage,
  technology: technologyImage,
  engineering: engineeringImage,
  mathematics: mathematicsImage,
};

const domainColors = {
  science: "blue",
  technology: "green",
  engineering: "orange",
  mathematics: "red",
};

const CourseCard = memo(({ course }) => {
  const [imgSrc, setImgSrc] = useState(
    course.image ||
      domainImages[course.domain.toLowerCase()] ||
      mathematicsImage
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const attemptsRef = useRef(0);
  const loadingTimeout = useRef();

  const handleImageError = useCallback(() => {
    if (attemptsRef.current < 2) {
      attemptsRef.current += 1;
      debug.log(
        `Image error for course ${course.id}, attempt ${attemptsRef.current}`
      );

      const fallbackSrc =
        domainImages[course.domain.toLowerCase()] || mathematicsImage;

      if (fallbackSrc !== imgSrc) {
        loadingTimeout.current = setTimeout(() => {
          setImgSrc(fallbackSrc);
        }, 300);
      } else {
        setImageLoaded(true);
      }
    } else {
      setImageLoaded(true); // Give up and show placeholder
    }
  }, [course.domain, course.id, imgSrc]);

  const handleImageLoad = useCallback(() => {
    debug.log(`Image loaded for course ${course.id}`);
    clearTimeout(loadingTimeout.current);
    setImageLoaded(true);
    imageCache.set(imgSrc, true);
  }, [course.id, imgSrc]);

  useEffect(() => {
    const initialSrc =
      course.image ||
      domainImages[course.domain.toLowerCase()] ||
      mathematicsImage;

    if (imageCache.has(initialSrc)) {
      debug.log(`Image for course ${course.id} found in cache`);
      setImageLoaded(true);
    }

    return () => {
      clearTimeout(loadingTimeout.current);
    };
  }, [course.id, course.image, course.domain]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
      h="100%"
      display="flex"
      flexDirection="column"
      maxW="360px"
      w="100%"
    >
      <Box position="relative" h="200px" w="full">
        {!imageLoaded && (
          <Skeleton
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            borderRadius="none"
          />
        )}
        <ChakraImage
          src={imgSrc}
          alt={course.title}
          h="200px"
          w="full"
          objectFit="cover"
          onError={handleImageError}
          onLoad={handleImageLoad}
          opacity={imageLoaded ? 1 : 0}
          transition="opacity 0.3s ease"
          position="relative"
          fallbackSrc={mathematicsImage}
          loading="lazy"
        />
      </Box>
      <Box p={4} flex="1" display="flex" flexDirection="column">
        <Badge
          colorScheme={domainColors[course.domain]}
          mb={2}
          fontSize="xs"
          px={1}
          alignSelf="flex-start"
        >
          {course.domain}
        </Badge>
        <Heading size="sm" mb={2}>
          <Link as={RouterLink} to={`/course/${course.id}`}>
            {course.title}
          </Link>
        </Heading>
        <Button
          as={RouterLink}
          to={`/course/${course.id}`}
          colorScheme="blue"
          size="sm"
          w="full"
          mt="auto"
        >
          View Course
        </Button>
      </Box>
    </Box>
  );
});

const FeatureCard = ({ icon, title, description }) => (
  <VStack
    bg="white"
    p={6}
    borderRadius="lg"
    boxShadow="md"
    textAlign="center"
    spacing={4}
  >
    <Icon as={icon} boxSize={8} color="brand.primary" />
    <Heading size="md">{title}</Heading>
    <Text color="gray.600">{description}</Text>
  </VStack>
);

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagesPreloaded, setImagesPreloaded] = useState(false);
  const slidesToShow = 2;
  const autoRotateInterval = useRef();

  useEffect(() => {
    debug.log("Component mounted, starting image preload");
    const startTime = performance.now();

    preloadImages()
      .then(() => {
        const endTime = performance.now();
        debug.log(
          `Image preloading completed in ${(endTime - startTime).toFixed(2)}ms`
        );
        setImagesPreloaded(true);
      })
      .catch((error) => {
        debug.error("Image preloading error:", error);
        setImagesPreloaded(true); // Continue even if preloading fails
      });

    return () => {
      if (autoRotateInterval.current) {
        clearInterval(autoRotateInterval.current);
      }
    };
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      debug.log("Starting courses fetch");
      setLoading(true);
      const response = await api.get("/courses");

      const coursesByDomain = response.data.reduce((acc, course) => {
        if (!acc[course.domain]) {
          acc[course.domain] = [];
        }
        if (acc[course.domain].length < 2) {
          acc[course.domain].push(course);
        }
        return acc;
      }, {});

      const featured = Object.values(coursesByDomain).flat();
      setFeaturedCourses(featured);
      debug.log("Courses fetched successfully", featured.length);
    } catch (error) {
      debug.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (imagesPreloaded) {
      debug.log("Images are preloaded, fetching courses");
      fetchCourses();
    }
  }, [fetchCourses, imagesPreloaded]);

  useEffect(() => {
    if (featuredCourses.length > 0) {
      debug.log("Starting carousel auto-rotation");
      autoRotateInterval.current = setInterval(() => {
        setCurrentIndex(
          (prev) =>
            (prev + 1) % Math.ceil(featuredCourses.length / slidesToShow)
        );
      }, 5000);

      return () => {
        debug.log("Clearing carousel interval");
        clearInterval(autoRotateInterval.current);
      };
    }
  }, [featuredCourses, slidesToShow]);

  const nextSlide = useCallback(() => {
    debug.log("Manual next slide");
    setCurrentIndex(
      (prev) => (prev + 1) % Math.ceil(featuredCourses.length / slidesToShow)
    );
  }, [featuredCourses.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    debug.log("Manual prev slide");
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.ceil(featuredCourses.length / slidesToShow)) %
        Math.ceil(featuredCourses.length / slidesToShow)
    );
  }, [featuredCourses.length, slidesToShow]);

  if (!imagesPreloaded) {
    debug.log("Rendering loading state while images preload");
    return (
      <Center h="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading resources...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" h="80vh">
        <ChakraImage
          src={heroImage}
          alt="Learnova Platform"
          w="full"
          h="full"
          objectFit="cover"
          opacity={0.7}
          fallback={<Skeleton w="full" h="full" />}
          loading="eager"
        />
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="rgba(0,0,0,0.4)"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          color="white"
        >
          <Heading size="3xl" mb={6}>
            Learnova
          </Heading>
          <Text fontSize="2xl" maxW="800px" mb={8}>
            Your gateway to STEM education - Explore, Learn, Innovate
          </Text>
          <Button
            as={RouterLink}
            to="/courses"
            colorScheme="blue"
            size="lg"
            px={8}
          >
            Start Learning
          </Button>
        </Box>
      </Box>

      {/* About Section */}
      <Container maxW="1200px" py={20}>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={12}
          alignItems="center"
        >
          <Box flex={1}>
            <Heading size="xl" mb={6}>
              About Learnova
            </Heading>
            <Text fontSize="lg" mb={4}>
              Learnova is an innovative platform dedicated to STEM education,
              providing high-quality resources in Science, Technology,
              Engineering, and Mathematics.
            </Text>
            <Text fontSize="lg">
              Our mission is to make STEM education accessible to everyone, with
              carefully curated courses, articles, and videos from experts in
              various fields.
            </Text>
          </Box>
          <Box flex={1} maxW="320px">
            <ChakraImage
              src={aboutImage}
              alt="About Learnova"
              borderRadius="lg"
              boxShadow="lg"
              w="100%"
              fallback={<Skeleton w="full" h="200px" />}
              loading="eager"
            />
          </Box>
        </Stack>
      </Container>

      {/* Features Section */}
      <Box bg="gray.50" py={20}>
        <Container maxW="1200px">
          <Heading textAlign="center" mb={16}>
            What We Offer
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
            <FeatureCard
              icon={FaBook}
              title="Courses"
              description="Comprehensive courses in all STEM disciplines"
            />
            <FeatureCard
              icon={FaVideo}
              title="Videos"
              description="Engaging video content for visual learners"
            />
            <FeatureCard
              icon={FaNewspaper}
              title="Articles"
              description="In-depth articles on cutting-edge topics"
            />
            <FeatureCard
              icon={FaRobot}
              title="Chatbot"
              description="AI-powered assistant to guide your learning"
            />
          </SimpleGrid>
        </Container>
      </Box>

      {/* Courses Carousel Section */}
      <Container maxW="1200px" py={20} position="relative">
        <Heading textAlign="center" mb={12}>
          Featured Courses
        </Heading>

        {loading ? (
          <Box textAlign="center">
            <Spinner size="xl" />
            <Text mt={4}>Loading courses...</Text>
          </Box>
        ) : featuredCourses.length > 0 ? (
          <Box position="relative">
            <Center>
              <Box position="relative" overflow="hidden" maxW="800px" w="100%">
                <IconButton
                  aria-label="Previous slide"
                  icon={<FaChevronLeft />}
                  position="absolute"
                  left="0px"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex="1"
                  onClick={prevSlide}
                  colorScheme="blue"
                  borderRadius="full"
                  boxShadow="md"
                />

                <IconButton
                  aria-label="Next slide"
                  icon={<FaChevronRight />}
                  position="absolute"
                  right="0px"
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex="1"
                  onClick={nextSlide}
                  colorScheme="blue"
                  borderRadius="full"
                  boxShadow="md"
                />

                <Box
                  display="flex"
                  transition="transform 0.5s ease"
                  transform={`translateX(-${currentIndex * 100}%)`}
                  width="100%"
                >
                  {Array(Math.ceil(featuredCourses.length / slidesToShow))
                    .fill()
                    .map((_, groupIndex) => (
                      <Box
                        key={groupIndex}
                        flex="0 0 100%"
                        display="flex"
                        px={2}
                        justifyContent="center"
                        gap={4}
                      >
                        {featuredCourses
                          .slice(
                            groupIndex * slidesToShow,
                            (groupIndex + 1) * slidesToShow
                          )
                          .map((course) => (
                            <Box key={course.id} flex="1" minW="0" maxW="360px">
                              <CourseCard course={course} />
                            </Box>
                          ))}
                      </Box>
                    ))}
                </Box>
              </Box>
            </Center>

            <HStack justify="center" mt={6} spacing={2}>
              {Array.from({
                length: Math.ceil(featuredCourses.length / slidesToShow),
              }).map((_, index) => (
                <Box
                  key={index}
                  as="button"
                  w="12px"
                  h="12px"
                  borderRadius="full"
                  bg={index === currentIndex ? "blue.500" : "gray.300"}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </HStack>
          </Box>
        ) : (
          <Text textAlign="center">No courses available</Text>
        )}
      </Container>
    </Box>
  );
};

export default Home;
