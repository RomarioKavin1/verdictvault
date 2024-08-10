import ListingCard from "@/components/Listingcard";
import Nav from "@/components/Nav";
import React from "react";

function page() {
  const policies = [
    {
      title: "Design react website frontend",
      description: "0xf8037442abe0e1119...",
      date: "01-06-2024",
    },
    {
      title: "Create a responsive dashboard UI",
      description: "0x8a3749bb213bb67...",
      date: "02-06-2024",
    },
    {
      title: "Develop full-stack web application",
      description: "0xa7823ff9c9a7d99...",
      date: "03-06-2024",
    },
    {
      title: "Build a custom CMS with Node.js",
      description: "0x9cdd7493b0dffe4...",
      date: "04-06-2024",
    },
    {
      title: "Integrate payment gateway in app",
      description: "0x7b028489b8a4d29...",
      date: "05-06-2024",
    },
    {
      title: "Migrate website to Next.js platform",
      description: "0xef473c8d3c4db8f...",
      date: "06-06-2024",
    },
    {
      title: "Refactor legacy codebase to ES6+",
      description: "0x5fbc48395c47e3d...",
      date: "07-06-2024",
    },
    {
      title: "Optimize API performance with Redis",
      description: "0xa432ec9891b4f7d...",
      date: "08-06-2024",
    },
    {
      title: "Convert Figma design to HTML/CSS",
      description: "0x3b74a893ce87d2f...",
      date: "09-06-2024",
    },
  ];
  const freelanceDesignJobs = [
    {
      title: "Create a modern logo for a startup",
      description: "0xe6a8439b8d7e1c2...",
      date: "01-06-2024",
    },
    {
      title: "Design a sleek mobile app interface",
      description: "0xa482b9c3f7d9b1e...",
      date: "02-06-2024",
    },
    {
      title: "Redesign a corporate website layout",
      description: "0x5f3b4d8e2c9a87d...",
      date: "03-06-2024",
    },
    {
      title: "Craft a unique brand identity kit",
      description: "0xb283d74f9e5c7a8...",
      date: "04-06-2024",
    },
    {
      title: "Develop social media banners and ads",
      description: "0xc4a982b1d7e6c38...",
      date: "05-06-2024",
    },
    {
      title: "Design promotional posters for event",
      description: "0x7e1b3a8d4f6c9b2...",
      date: "06-06-2024",
    },
    {
      title: "Create wireframes for a new product",
      description: "0xd28a9b4e7c6f8b2...",
      date: "07-06-2024",
    },
    {
      title: "Design a professional business card",
      description: "0x9f3c7d8e2b1a64c...",
      date: "08-06-2024",
    },
    {
      title: "Illustrate custom icons for website",
      description: "0x3a9b7d4e2f8c6a7...",
      date: "09-06-2024",
    },
  ];
  return (
    <div className="bg-white h-full">
      <Nav selected={1} />
      <div className=" flex flex-col text-black pt-10 px-20">
        <div className="flex items-center justify-center font-bold text-6xl border-b-2 pb-3">
          <p>Public Open Listings</p>
        </div>
        <div className="text-5xl font-bold">Coding</div>
        <div className="flex flex-col-4 flex-wrap">
          {policies.map((policy, index) => (
            <ListingCard
              key={index}
              title={policy.title}
              description={policy.description}
              date={policy.date}
              imgsrc="/diamond.svg"
            />
          ))}
        </div>
        <div className="text-5xl font-bold">Design</div>

        <div className="flex flex-col-4 flex-wrap">
          {freelanceDesignJobs.map((policy, index) => (
            <ListingCard
              key={index}
              title={policy.title}
              description={policy.description}
              date={policy.date}
              imgsrc="/diamond.svg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
