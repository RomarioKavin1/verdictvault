import React from "react";
import Button from "./Button";

interface ListingCardProps {
  title: string;
  description: string;
  date: string;
  imgsrc: string;
  createListing?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  title,
  description,
  date,
  imgsrc,
  createListing,
}) => {
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
      namesArray[Math.floor(Math.random() * namesArray.length)];
    const imageUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(
      randomName
    )}`;
    return imageUrl;
  }
  return (
    <div
      className={createListing ? " border-2 m-2 rounded-xl border-black" : ""}
    >
      <div className=" border-2 rounded-md m-5 flex flex-col justify-center  hover:scale-105 border-black p-2 w-96">
        <div className="flex  items-center justify-center gap-5">
          <div className="flex items-center justify-center h-fit">
            <img
              src={getRandomImage()}
              className="w-10 rounded-full"
              alt="avatar"
            />
          </div>
          <div>
            <p className="font-bold text-md  text-wrap w-fit">{title}</p>
            <p className="font-semibold text-lg text-slate-400">{date}</p>
            <p className="text-md">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
