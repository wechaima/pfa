import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Badge,
  Skeleton,
  Image,
} from "@chakra-ui/react";
import api from "../services/api";

const domainColors = {
  science: "blue",
  technology: "green",
  engineering: "orange",
  mathematics: "red",
};

const getVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/video/${id}`);
        setVideo(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading)
    return (
      <Container maxW="800px" py={12}>
        <Skeleton height="40px" mb={4} />
        <Skeleton height="20px" mb={6} />
        <Skeleton height="450px" mb={6} />
      </Container>
    );

  if (!video) return <Text>Vidéo non trouvée</Text>;

  const domain = video.domaine || video.domain;
  const videoId = getVideoId(video.url);
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1`
    : null;

  return (
    <Container maxW="800px" py={12}>
      <Box>
        <Badge colorScheme={domainColors[domain] || "gray"} mb={4}>
          {domain}
        </Badge>
        <Heading size="xl" mb={4}>
          {video.titre}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={6}>
          {video.chaine} • {video.durée}
        </Text>

        <Box position="relative" paddingBottom="56.25%" mb={6} bg="gray.100">
          {embedUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={video.titre}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0 }}
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <Box
              position="absolute"
              top="0"
              left="0"
              w="full"
              h="full"
              bg="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text>Vidéo non disponible</Text>
            </Box>
          )}
        </Box>

        <Divider mb={6} />
      </Box>
    </Container>
  );
};

export default VideoDetail;
