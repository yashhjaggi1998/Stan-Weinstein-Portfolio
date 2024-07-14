import { Container, Spinner, Center } from "@chakra-ui/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


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
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You can add components and dependencies to your app using the cli.
          </AlertDescription>
        </Alert>

      </Center>
    </Container>
  );
}
