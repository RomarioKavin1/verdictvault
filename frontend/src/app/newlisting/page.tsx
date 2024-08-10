import Createcontract from "@/components/Createcontract";
import Nav from "@/components/Nav";
import React from "react";

function page() {
  return (
    <div className="bg-white h-fit min-h-screen">
      <Nav selected={0} />
      <div className="flex flex-col text-black pt-10 px-56">
        <div className="flex items-center justify-center font-bold text-6xl border-b-2 pb-3">
          <p>Create New Listing</p>
        </div>
        <div className="m-5">
          <Createcontract />
        </div>
      </div>
    </div>
  );
}

export default page;
