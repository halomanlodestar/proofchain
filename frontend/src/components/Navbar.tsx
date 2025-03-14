import { navlinks } from "@/lib/navlinks.ts";
import { NavLink } from "react-router";
import { Button } from "@/components/ui/button.tsx";

const Navbar = () => {
  return (
    <header
      className={
        "flex justify-between items-center w-full border-b h-16 container-x"
      }
    >
      <nav>proofchain</nav>
      <nav>
        <ul>
          {navlinks.map((link) => (
            <li key={link.href}>
              <Button asChild variant={link.variant}>
                <NavLink to={link.href}>{link.name}</NavLink>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
