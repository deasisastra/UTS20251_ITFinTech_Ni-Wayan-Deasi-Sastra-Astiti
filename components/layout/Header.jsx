import { useState, useEffect } from "react";
import { FaUserAlt, FaShoppingCart, FaSearch } from "react-icons/fa";
import Logo from "../ui/Logo";
import Search from "../ui/Search";
import { GiHamburgerMenu, GiCancel } from "react-icons/gi";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";

const Header = () => {
  const [isSearchModal, setIsSearchModal] = useState(false);
  const [isMenuModal, setIsMenuModal] = useState(false);
  const cart = useSelector((state) => state.cart);

  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileUrl, setProfileUrl] = useState("/auth/login");

  useEffect(() => {
    if (session?.user?.id) {
      setProfileUrl(`/profile/${session.user.id}`);
    } else {
      setProfileUrl("/auth/login");
    }
  }, [session]);

  return (
    <div
      className={`h-[5.5rem] z-50 relative w-full ${
        router.asPath === "/" ? "bg-transparent fixed" : "bg-secondary"
      }`}
    >
      <div className="container mx-auto text-white flex justify-between items-center h-full">
        <Logo />
        <nav
          className={`sm:static absolute top-0 left-0 sm:w-auto sm:h-auto w-full h-screen sm:text-white text-black sm:bg-transparent bg-white sm:flex hidden z-50 ${
            isMenuModal === true && "!grid place-content-center"
          }`}
        >
          <ul className="flex gap-x-2 sm:flex-row flex-col items-center">
            <li
              className={`px-[5px] py-[10px] uppercase hover:text-primary cursor-pointer ${
                router.asPath === "/" && "text-primary"
              }`}
              onClick={() => setIsMenuModal(false)}
            >
              <Link href="/">Home</Link>
            </li>
            <li
              className={`px-[5px] py-[10px] uppercase hover:text-primary cursor-pointer ${
                router.asPath === "/menu" && "text-primary"
              }`}
              onClick={() => setIsMenuModal(false)}
            >
              <Link href="/menu">Menu</Link>
            </li>
            <li
              className={`px-[5px] py-[10px] uppercase hover:text-primary cursor-pointer ${
                router.asPath === "/about" && "text-primary"
              }`}
              onClick={() => setIsMenuModal(false)}
            >
              <Link href="/about">About</Link>
            </li>
          </ul>
          {isMenuModal && (
            <button
              className="absolute  top-4 right-4 z-50"
              onClick={() => setIsMenuModal(false)}
            >
              <GiCancel size={25} className=" transition-all" />
            </button>
          )}
        </nav>
        <div className="flex gap-x-4 items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsSearchModal(true)}
              className="hover:text-primary transition-all"
            >
              <FaSearch />
            </button>
            <Link href="/cart">
              <span className="relative mx-2 cursor-pointer">
                <FaShoppingCart className="hover:text-primary transition-all" />
                <span className="w-4 h-4 text-xs grid place-content-center rounded-full bg-primary absolute -top-2 -right-3 text-black font-bold">
                  {cart.products.length === 0 ? "0" : cart.products.length}
                </span>
              </span>
            </Link>
          </div>

          {status === "loading" ? (
            <div className="flex items-center gap-x-3">
              <button className="btn-primary-outline" disabled>Loading...</button>
            </div>
          ) : !session ? (
            <div className="flex items-center gap-x-3">
              <Link href="/auth/login">
                <button className="btn-primary-outline">Log in</button>
              </Link>
              <Link href="/auth/register">
                <button className="btn-primary">Sign Up</button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-x-3">
              <Link href={profileUrl}>
                <button className="flex items-center gap-2 btn-primary">
                  <FaUserAlt />
                  <span>{session.user?.name || 'Profile'}</span>
                </button>
              </Link>
              <Link href="/menu">
                <button className="btn-primary">Order Online</button>
              </Link>
            </div>
          )}
          <button
            className="sm:hidden inline-block"
            onClick={() => setIsMenuModal(true)}
          >
            <GiHamburgerMenu className="text-xl hover:text-primary transition-all" />
          </button>
        </div>
      </div>
      {isSearchModal && <Search setIsSearchModal={setIsSearchModal} />}
    </div>
  );
};

export default Header;
