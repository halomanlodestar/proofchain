import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/hooks/use-auth.tsx";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const NavAvatar = () => {
  const { isAuthenticated, isCheckingAuth, refreshToken, token } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      refreshToken();
    }
  }, [isAuthenticated, token]);

  if (isCheckingAuth) {
    return <Loader2 className={"animate-spin"} />;
  }

  return isAuthenticated ? (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ) : (
    <Button asChild variant={"outline"}>
      <NavLink to={"/auth/signin"}>{"Sign In"}</NavLink>
    </Button>
  );
};

export default NavAvatar;
