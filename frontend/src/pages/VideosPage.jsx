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
  useTheme,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import VideoCard from "../components/VideoCard";
import api from "../services/api";
import videosImage from "../../assets/videos.jpg";

const VideosPage = () => {
  const { domain } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          domain ? `/videos/${domain}` : "/videos"
        );
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [domain]);

  if (loading) {
    return (
      <Container maxW="1200px" py={12}>
        <Skeleton height="300px" mb={8} />
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[...Array(6)].map((_, i) => (
            <Box key={i} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Skeleton height="200px" />
              <Box p={6}>
                <SkeletonText mt="4" noOfLines={3} spacing="4" />
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    );
  }

  const groupedVideos = !domain
    ? videos.reduce((acc, video) => {
        const domainKey = video.domaine || video.domain;
        if (!acc[domainKey]) {
          acc[domainKey] = [];
        }
        acc[domainKey].push(video);
        return acc;
      }, {})
    : null;

  return (
    <Box>
      <Box position="relative" h="300px">
        <Image
          src={videosImage}
          alt="Videos"
          w="full"
          h="full"
          objectFit="cover"
          fallback={<Skeleton height="100%" />}
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
              ? `${domain.charAt(0).toUpperCase() + domain.slice(1)} Videos`
              : "All Videos"}
          </Heading>
          <Text fontSize="xl">
            {domain
              ? `Explore our ${domain} videos`
              : "Browse our complete videos catalog"}
          </Text>
        </Box>
      </Box>

      <Container maxW="1200px" py={12}>
        {domain ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </SimpleGrid>
        ) : (
          <VStack spacing={12} align="stretch">
            {Object.entries(groupedVideos).map(([domainName, domainVideos]) => (
              <Box key={domainName}>
                <Heading size="lg" mb={6} color={theme.colors.stem[domainName]}>
                  {domainName.charAt(0).toUpperCase() + domainName.slice(1)}
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {domainVideos.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </SimpleGrid>
                <Divider my={8} />
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
};

export default VideosPage;
