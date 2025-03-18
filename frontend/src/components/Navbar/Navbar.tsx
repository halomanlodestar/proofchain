import { navlinks } from "@/lib/navlinks.ts";
import NavAvatar from "@/components/Navbar/NavAvatar.tsx";
import { Link } from "react-router";

const Navbar = () => {
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
        <ul className={"flex items-center space-x-4"}>
          {navlinks.map((link) => (
            <li key={link.href}>
              <Link to={link.href}>{link.name}</Link>
            </li>
          ))}
          <li key={"nav-avatar"}>
            <NavAvatar />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
