"use client";
import Button from "@/components/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white ">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 h-screen justify-center items-center">
        <div className="mx-auto w-1/2 pb-24 pt-10 sm:pb-32 flex lg:gap-x-10 lg:px-8  justify-center items-center">
          <div className="px-6 lg:px-0 lg:pt-4 ">
            <div className="mx-auto max-w-3xl">
              <div className="max-w-2xl">
                <img className="h-11" src="/judiciary.svg" alt="Your Company" />
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Verdict Vault:Decentralized Justice, Transparent and Fair for
                  All.
                </h1>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img
              src="/judge.svg"
              className=" flex justify-center items-center"
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-1/2">
            <p className=" text-lg leading-8 text-gray-800">
              Verdict Vault is your gateway to a new era of justice, where trust
              and transparency are paramount. As a decentralized judiciary
              platform, Verdict Vault empowers individuals and businesses to
              create legally binding contracts, resolve disputes, and ensure
              fairness—all on the blockchain. No middlemen, no bias, just pure,
              community-driven adjudication.
            </p>
            <Link href="/login">
              <Button text="Launch app" />
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>
    </div>
  );
}
