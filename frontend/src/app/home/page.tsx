import Nav from "@/components/Nav";
// import PolicyCard from "@/components/PolicyCard";
import React from "react";

function page() {
  const policies = [
    {
      title: "Ipl Match 1",
      description: "Policy description for match 1",
      date: "01-06-2024",
    },
    {
      title: "Ipl Match 2",
      description: "Policy description for match 2",
      date: "02-06-2024",
    },
    {
      title: "Ipl Match 3",
      description: "Policy description for match 3",
      date: "03-06-2024",
    },
    {
      title: "Ipl Match 4",
      description: "Policy description for match 4",
      date: "04-06-2024",
    },
    {
      title: "Ipl Match 5",
      description: "Policy description for match 5",
      date: "05-06-2024",
    },
    {
      title: "Ipl Match 6",
      description: "Policy description for match 6",
      date: "06-06-2024",
    },
    {
      title: "Ipl Match 7",
      description: "Policy description for match 7",
      date: "07-06-2024",
    },
    {
      title: "Ipl Match 8",
      description: "Policy description for match 8",
      date: "08-06-2024",
    },
    {
      title: "Ipl Match 9",
      description: "Policy description for match 9",
      date: "09-06-2024",
    },
    {
      title: "Ipl Match 10",
      description: "Policy description for match 10",
      date: "10-06-2024",
    },
  ];
  return (
    <div className="bg-white h-full">
      <Nav selected={1} />
      <div className=" flex flex-col text-black pt-10 px-56">
        <div className="flex items-center justify-center font-bold text-6xl border-b-2 pb-3">
          <p>Public Policies</p>
        </div>
        <div className="flex flex-col-4 flex-wrap">
          {/* {policies.map((policy, index) => (
            <PolicyCard
              imgsrc="/block.svg"
              key={index}
              title={policy.title}
              description={policy.description}
              date={policy.date}
            />
          ))} */}
        </div>
      </div>
    </div>
  );
}

export default page;
