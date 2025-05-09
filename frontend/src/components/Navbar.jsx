import {
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Image,
  Center,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const domains = ["science", "technology", "engineering", "mathematics"];
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Flex
      bg="white"
      p={4}
      justifyContent="center"
      alignItems="center"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Center maxW="1200px" w="full" mx="auto">
        <Flex w="full" justifyContent="space-between" alignItems="center">
          <Link as={RouterLink} to="/">
            <Image src={logo} alt="Learnova Logo" h="48px" />
          </Link>

          <Flex gap={4} alignItems="center">
            <Link
              as={RouterLink}
              to="/"
              variant="nav"
              bg={isActive("/") ? "brand.primary" : "transparent"}
              color={isActive("/") ? "white" : "brand.primary"}
              _hover={{
                bg: isActive("/") ? "brand.secondary" : "brand.primaryLight",
              }}
            >
              Home
            </Link>

            {/* Menu Courses */}
            <Menu>
              <MenuButton
                as={Button}
                variant="nav"
                bg={isActive("/courses") ? "brand.primary" : "transparent"}
                color={isActive("/courses") ? "white" : "brand.primary"}
                _hover={{
                  bg: isActive("/courses")
                    ? "brand.secondary"
                    : "brand.primaryLight",
                }}
              >
                Courses
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/courses">
                  All Courses
                </MenuItem>
                {domains.map((domain) => (
                  <MenuItem
                    key={domain}
                    as={RouterLink}
                    to={`/courses/${domain}`}
                  >
                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Menu Articles */}
            <Menu>
              <MenuButton
                as={Button}
                variant="nav"
                bg={isActive("/articles") ? "brand.primary" : "transparent"}
                color={isActive("/articles") ? "white" : "brand.primary"}
                _hover={{
                  bg: isActive("/articles")
                    ? "brand.secondary"
                    : "brand.primaryLight",
                }}
              >
                Articles
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/articles">
                  All Articles
                </MenuItem>
                {domains.map((domain) => (
                  <MenuItem
                    key={domain}
                    as={RouterLink}
                    to={`/articles/${domain}`}
                  >
                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            {/* Menu Videos */}
            <Menu>
              <MenuButton
                as={Button}
                variant="nav"
                bg={isActive("/videos") ? "brand.primary" : "transparent"}
                color={isActive("/videos") ? "white" : "brand.primary"}
                _hover={{
                  bg: isActive("/videos")
                    ? "brand.secondary"
                    : "brand.primaryLight",
                }}
              >
                Videos
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/videos">
                  All Videos
                </MenuItem>
                {domains.map((domain) => (
                  <MenuItem
                    key={domain}
                    as={RouterLink}
                    to={`/videos/${domain}`}
                  >
                    {domain.charAt(0).toUpperCase() + domain.slice(1)}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Center>
    </Flex>
  );
};

export default Navbar;
