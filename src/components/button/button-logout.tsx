import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

const ButtonLogout = () => {
  const session = useSession();

  if (!session.data) return null;

  return (
    <Button onClick={() => signOut()} variant="logout" size="xl">
      Logout
    </Button>
  );
};

export default ButtonLogout;
