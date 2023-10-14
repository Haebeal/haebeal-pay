import { Grid, GridItem } from "@chakra-ui/react";
import { AccountForm } from "@/components/AccountForm";

export const AccountPage = () => {
  return (
    <Grid py={4} gap={5} templateColumns="repeat(6, 1fr)">
      <GridItem colSpan={6}>
        <AccountForm />
      </GridItem>
    </Grid>
  );
};
