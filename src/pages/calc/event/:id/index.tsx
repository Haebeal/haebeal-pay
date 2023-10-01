import { Grid, GridItem } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { EventForm } from "../../../../organisms/event-form";

export const EditEventPage = () => {
  const { id } = useParams();

  return (
    <Grid py={4} gap={5} templateColumns="repeat(6, 1fr)">
      <GridItem colSpan={6}>
        <EventForm eventId={id} />
      </GridItem>
    </Grid>
  );
};
