import { Container, Spinner, Center } from "@chakra-ui/react";

export default function LoadingSpinner() {
  return (
    <Container maxW="container.lg">
      <Center p={12}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    </Container>
  );
}
