import React from "react";

function Button({
  text,
  link,
  new1,
}: {
  text: string;
  link?: string;
  new1?: boolean;
}) {
  return (
    <div className="mt-10 flex items-center gap-x-6 justify-center">
      <a
        href={link}
        target={new1 ? "_blank" : "_self"}
        className="rounded-md border-2 border-black text-black  px-3.5 py-2.5 text-sm font-semibold  shadow-md shadow-black hover:bg-black   hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {text}
      </a>
    </div>
  );
}

export default Button;
