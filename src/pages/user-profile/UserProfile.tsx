import { Card, Container } from "@mantine/core";
import UserInfoForm from "../../components/user/UserInfoForm";

const UserProfile = () => {
  return (
    <Container size="lg" py="xl">
      <Card>
        <UserInfoForm />
      </Card>
    </Container>
  );
};

export default UserProfile;
