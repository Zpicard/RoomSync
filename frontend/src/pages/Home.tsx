import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

const Home = () => {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="2xl" textAlign="center">
          Roommate Finder
        </Heading>
        <Text fontSize="xl" textAlign="center">
          Find your perfect roommate match
        </Text>
      </VStack>
    </Container>
  )
}

export default Home 