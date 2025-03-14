import { navlinks } from "@/lib/navlinks.ts";
import { useAuth } from "@/hooks/use-auth.tsx";
import NavAvatar from "@/components/Navbar/NavAvatar.tsx";

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
            <li key={link.href}></li>
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
