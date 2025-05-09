import { Box, Heading, Text, Badge, Link, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const domainColors = {
  science: "blue",
  technology: "green",
  engineering: "orange",
  mathematics: "red",
  // Ajoutez d'autres domaines au besoin
};

const getVideoId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const VideoCard = ({ video }) => {
  const domain = video.domaine || video.domain;
  const videoId = getVideoId(video.url);
  const cardRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&enablejsapi=1`
    : null;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={cardRef}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
      transition="all 0.2s"
    >
      <Box position="relative" paddingBottom="56.25%" bg="gray.100">
        {thumbnailUrl && !shouldLoad && (
          <Image
            src={thumbnailUrl}
            alt={`Miniature: ${video.titre}`}
            position="absolute"
            top="0"
            left="0"
            w="full"
            h="full"
            objectFit="cover"
          />
        )}
        {shouldLoad && embedUrl ? (
          <iframe
            width="100%"
            height="100%"
            src={embedUrl}
            title={video.titre}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0 }}
            loading="lazy"
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
            <Text>Chargement de la vidéo...</Text>
          </Box>
        )}
      </Box>
      <Box p={6}>
        <Badge colorScheme={domainColors[domain] || "gray"} mb={2}>
          {domain}
        </Badge>
        <Heading size="md" mb={2}>
          <Link
            as={RouterLink}
            to={`/video/${video.id}`}
            _hover={{ textDecoration: "none" }}
          >
            {video.titre}
          </Link>
        </Heading>
        <Text fontSize="sm" color="gray.500">
          {video.chaine} • {video.durée}
        </Text>
      </Box>
    </Box>
  );
};

export default VideoCard;
