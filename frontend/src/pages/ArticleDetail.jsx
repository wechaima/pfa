import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Container,
  Divider,
  Badge,
  Image,
} from "@chakra-ui/react";
import api from "../services/api";
import articleDefaultImage from "../../assets/article.png";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const domainColors = {
    science: "blue",
    technology: "green",
    engineering: "orange",
    mathematics: "red",
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/article/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) return <Text>Loading...</Text>;
  if (!article) return <Text>Article not found</Text>;

  const domain = article.domaine || article.domain;

  return (
    <Container maxW="800px" py={12}>
      <Box>
        <Image
          src={article.image || articleDefaultImage}
          alt={article.titre}
          borderRadius="lg"
          w="full"
          h="300px"
          objectFit="cover"
          mb={6}
          fallbackSrc={articleDefaultImage}
        />

        <Badge colorScheme={domainColors[domain]} mb={4}>
          {domain}
        </Badge>
        <Heading size="xl" mb={4}>
          {article.titre}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={6}>
          {article.source} •{" "}
          {new Date(article.date_pub).toISOString().split("T")[0]}
        </Text>

        <Divider mb={6} />

        <Text whiteSpace="pre-line">{article.contenu}</Text>
      </Box>
    </Container>
  );
};

export default ArticleDetail;
