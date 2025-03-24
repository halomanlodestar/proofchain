import { Link, NavLink } from "react-router";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Menu } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { useAuth } from "@/hooks/use-auth.tsx";
import { navlinks } from "@/lib/navlinks.ts";
import { Button } from "../ui/button";

const Navbar = () => {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <header
      className={
        "flex justify-between items-center w-full border-b h-16 container-x"
      }
    >
      <nav>
        <Link to={"/"}>proofchain</Link>
      </nav>
      <nav>
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent className={"w-full pt-20 px-10"}>
            <SheetHeader className={"flex flex-row items-center space-x-5"}>
              <Avatar className={"size-16"}>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <SheetTitle className={"w-full flex flex-col"}>
                <span className={"text-3xl"}>{user?.name}</span>
                <span className={"opacity-75"}>{user?.email}</span>
              </SheetTitle>
            </SheetHeader>
            <hr />
            <div className={"py-20 h-full flex flex-col justify-between"}>
              <ul className={"space-y-10"}>
                {navlinks.map((link) => (
                  <li key={link.name} className={"text-2xl hover:underline"}>
                    <SheetClose asChild>
                      <NavLink
                        to={link.href}
                        className={"[.active]:text-rose-500"}
                      >
                        {link.name}
                      </NavLink>
                    </SheetClose>
                  </li>
                ))}
              </ul>
              <ul className={"space-y-10"}>
                <li className={"text-2xl hover:underline"}>
                  <SheetClose asChild>
                    {isAuthenticated ? (
                      <Button
                        variant={"link"}
                        className={"text-2xl hover:underline"}
                        onClick={signOut}
                      >
                        Sign Out
                      </Button>
                    ) : (
                      <Button
                        variant={"link"}
                        className={"text-2xl hover:underline"}
                      >
                        <Link to={"/auth/signin"}>Sign In</Link>
                      </Button>
                    )}
                  </SheetClose>
                </li>
              </ul>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
};

export default Navbar;
