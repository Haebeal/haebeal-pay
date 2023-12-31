import { Grid, GridItem } from "@chakra-ui/react";
import { UserProfileForm } from "@/components/UserProfileForm";

export const UserProfilePage = () => {
  return (
    <Grid py={4} gap={5} templateColumns="repeat(6, 1fr)">
      <GridItem colSpan={6}>
        <UserProfileForm />
      </GridItem>
    </Grid>
  );
};
