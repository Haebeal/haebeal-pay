import { Grid, GridItem } from "@chakra-ui/react";
import { EventsList } from "../../../organisms/events-list";

export const EventPage = () => {
  return (
    <Grid py={4} gap={5} templateColumns="repeat(6, 1fr)">
      <GridItem colSpan={6}>
        <EventsList />
      </GridItem>
    </Grid>
  );
};
