import { Grid, GridItem } from "@chakra-ui/react";
import { PayForm } from "../../../components/pay-form";

export const PayPage = () => {
  return (
    <Grid py={4} gap={5} templateColumns="repeat(6, 1fr)">
      <GridItem colSpan={6}>
        <PayForm />
      </GridItem>
    </Grid>
  );
};
