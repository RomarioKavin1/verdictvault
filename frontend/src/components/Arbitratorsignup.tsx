import React, { useState } from "react";

const ArbitratorSignup = () => {
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Add logic for Worldcoin verification
  };

  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-1 justify-center items-center">
        <div className="bg-white shadow-sm ring-2 ring-slate-300 sm:rounded-xl">
          <div className="px-4 py-4 sm:p-2">
            {!loading && (
              <div className="grid max-w-2xl grid-cols-1 m-8">
                <div className="sm:col-span-5">
                  <label
                    htmlFor="email"
                    className="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Email Address
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-5 mt-4">
                  <label
                    htmlFor="specialty"
                    className="block text-lg font-bold leading-6 text-gray-900"
                  >
                    Select Your Specialty
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <select
                        id="specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>
                          Select Specialty
                        </option>
                        <option value="code">Code</option>
                        <option value="design">Design</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-x-6 border-gray-900/10 px-4 py-4 sm:px-8 mt-8">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Proceed with Worldcoin Verification
                  </button>
                </div>
              </div>
            )}
            {loading && (
              <div>
                {/* Replace with a proper loading spinner */}
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArbitratorSignup;