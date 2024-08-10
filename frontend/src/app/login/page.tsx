"use client";
import Button from "@/components/Button";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const signerStatus = useSignerStatus();
  const { logout } = useLogout();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  });
  return (
    <div className="bg-white ">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 h-screen  flex flex-col justify-center items-center ">
        <div className="border-black border-2 p-10 flex flex-col justify-center items-center rounded-xl py-10">
          <div className="flex justify-center items-center gap-5">
            <img className="h-24" src="/judiciary.svg" alt="Your Company" />
          </div>

          <p className="mt-10 text-4xl font-bold text-center  text-gray-900 sm:text-2xl  flex justify-center items-center">
            Login to Verdict Vault
          </p>
          <div>
            {signerStatus.isInitializing ? (
              <>Loading...</>
            ) : user ? (
              <div className="flex flex-col gap-2 p-2">
                <p className="text-xl font-bold">Success!</p>
                Youre logged in as {user.email ?? "anon"}.
                <button
                  className="btn btn-primary mt-6"
                  onClick={() => logout()}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div onClick={openAuthModal}>
                <Button text="Login" />
              </div>
            )}
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="text-black">powered by</div>
            <img src="/alchemy.svg" className="h-20 w-20" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>
    </div>
  );
}
