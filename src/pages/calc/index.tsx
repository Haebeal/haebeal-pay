import { Grid, GridItem } from "@chakra-ui/react";
import { PayList } from "../../organisms/pay-list";

export const CalcPage = () => {
  return (
    <Grid py={4} gap={5} templateColumns="repeat(6, 1fr)">
      <GridItem colSpan={6}>
        <PayList />
      </GridItem>
    </Grid>
  );
};
