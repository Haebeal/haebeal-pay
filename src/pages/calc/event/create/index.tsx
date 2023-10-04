import { Grid, GridItem } from "@chakra-ui/react";
import { EventForm } from "@/components/EventForm";

export const CreateEventPage = () => {
  return (
    <Grid py={4} gap={5} templateColumns="repeat(6, 1fr)">
      <GridItem colSpan={6}>
        <EventForm />
      </GridItem>
    </Grid>
  );
};
