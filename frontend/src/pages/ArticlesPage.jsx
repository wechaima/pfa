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
} from "@chakra-ui/react";
import ArticleCard from "../components/ArticleCard";
import api from "../services/api";
import articlesImage from "../../assets/articles.jpg";

const ArticlesPage = () => {
  const { domain } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          domain ? `/articles/${domain}` : "/articles"
        );
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [domain]);

  if (loading) {
    return (
      <Container maxW="1200px" py={12} textAlign="center">
        <Text>Loading articles...</Text>
      </Container>
    );
  }

  // Group articles by domain only for the "All Articles" view
  const groupedArticles = !domain
    ? articles.reduce((acc, article) => {
        if (!acc[article.domaine]) {
          acc[article.domaine] = [];
        }
        acc[article.domaine].push(article);
        return acc;
      }, {})
    : null;

  return (
    <Box>
      {/* Hero Section */}
      <Box position="relative" h="300px">
        <Image
          src={articlesImage}
          alt="Articles"
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
              ? `${domain.charAt(0).toUpperCase() + domain.slice(1)} Articles`
              : "All Articles"}
          </Heading>
          <Text fontSize="xl">
            {domain
              ? `Explore our ${domain} articles`
              : "Browse our complete articles catalog"}
          </Text>
        </Box>
      </Box>

      {/* Articles Content */}
      <Container maxW="1200px" py={12}>
        {domain ? (
          // Display all articles for a specific domain
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </SimpleGrid>
        ) : (
          // Display all articles grouped by domain for "All Articles" view
          <VStack spacing={12} align="stretch">
            {Object.entries(groupedArticles).map(
              ([domainName, domainArticles]) => (
                <Box key={domainName}>
                  <Heading
                    size="lg"
                    mb={6}
                    color={theme.colors.stem[domainName]}
                  >
                    {domainName.charAt(0).toUpperCase() + domainName.slice(1)}
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {domainArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
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

export default ArticlesPage;
