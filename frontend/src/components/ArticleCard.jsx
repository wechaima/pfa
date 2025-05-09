import { Box, Heading, Text, Badge, Link, Image } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import articleDefaultImage from "../../assets/article.png";

const ArticleCard = ({ article }) => {
  const domainColors = {
    science: "blue",
    technology: "green",
    engineering: "orange",
    mathematics: "red",
  };

  const domain = article.domaine || article.domain;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
      transition="all 0.2s"
    >
      <Image
        src={article.image || articleDefaultImage}
        alt={article.titre}
        h="200px"
        w="full"
        objectFit="cover"
        fallbackSrc={articleDefaultImage}
      />

      <Box p={6}>
        <Badge colorScheme={domainColors[domain]} mb={2}>
          {domain}
        </Badge>
        <Heading size="md" mb={2}>
          <Link as={RouterLink} to={`/article/${article.id}`}>
            {article.titre}
          </Link>
        </Heading>
        <Text fontSize="sm" color="gray.500">
          {new Date(article.date_pub).toISOString().split("T")[0]}
        </Text>
      </Box>
    </Box>
  );
};

export default ArticleCard;
