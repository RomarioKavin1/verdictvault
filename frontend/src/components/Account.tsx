import React, { useState, useRef, useEffect } from "react";
import { useLogout, useUser } from "@account-kit/react";
import { useRouter } from "next/navigation";

const Account = () => {
  const user = useUser();
  const { logout } = useLogout();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const truncatedAddress = user?.address
    ? `${user.address.slice(0, 10)}...`
    : "anon";

  const namesArray = [
    "Garfield",
    "Baby",
    "Callie",
    "Mittens",
    "Bear",
    "Abby",
    "Cuddles",
    "George",
    "Casper",
    "Jack",
    "Missy",
    "Spooky",
    "Cali",
    "Miss kitty",
    "Mimi",
    "Bandit",
    "Gizmo",
    "Toby",
    "Scooter",
    "Patches",
  ];
  function getRandomImage() {
    const randomName =
      namesArray[
        Math.floor(
          parseInt(user?.address?.charAt(user?.address.length - 1) ?? "0") *
            namesArray.length
        )
      ];
    const imageUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(
      randomName
    )}`;
    return imageUrl;
  }
  const router = useRouter();
  return (
    <div className="relative">
      <button
        className="flex items-center gap-x-2 rounded-md border-2 border-black px-3 py-2 text-sm font-semibold text-black shadow-md hover:bg-slate-100 hover:text-slate-500"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex flex-col gap-0">
          <div className=" flex gap-2 items-center justify-center">
            <img
              src={getRandomImage()}
              className="h-7 w-7 rounded-full"
              alt="avatar"
            />
            <div>{truncatedAddress}</div>
          </div>
          <div className="flex justify-center items-center gap-2 -mt-2 -mb-2">
            <div className="text-black text-xs ">powered by</div>
            <img src="/alchemy.svg" className="h-12 w-12" />
          </div>
        </div>
      </button>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-48 bg-white border border-black rounded-md shadow-lg"
        >
          {/* <div className="px-4 py-2 text-sm text-black">
            {user?.address ?? "anon"}
          </div> */}
          <button
            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-red-100"
            onClick={() => router.push("/arbitrator")}
          >
            Signup as an Arbitrator
          </button>

          <button
            className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-red-100"
            onClick={() => logout()}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default Account;
