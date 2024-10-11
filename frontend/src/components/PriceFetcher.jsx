

import React, { useState } from 'react'
import axios from 'axios'

const PriceFetcher = () => {
    const [iPhone16Details, setIPhone16Details] = useState([]) // Store the iPhone16 details
    const [minPricePhone, setMinPricePhone] = useState(null) // Store the min price phone details

    const fetchPrices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/scrape')
            console.log(response.data)
            setIPhone16Details(response.data.iPhone16Details) // Set the full list of iPhone 16 details
            setMinPricePhone(response.data.minPricePhone) // Set the min price phone details
        } catch (error) {
            console.error("Error fetching prices:", error)
        }
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Price Fetcher</h1>
            <div className="text-center">
                <button
                    onClick={fetchPrices}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Fetch Prices
                </button>
            </div>

            {/* Display the list of iPhone 16 details */}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {iPhone16Details.map((item, index) => (
                    <li key={index} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition">
                        <img
                            src={item.image}
                            alt={item.phoneName}
                            className="w-full h-48 object-cover mb-4 rounded"
                        />
                        <p className="text-lg font-semibold mb-2">{item.phoneName}</p>
                        <p className="text-lg font-semibold text-green-600 mb-2">{item.price}</p>
                        <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                        <p className="text-sm text-gray-500">{item.deliveryDate}</p>
                    </li>
                ))}
            </ul>

            {/* Display the lowest price phone details */}
            {minPricePhone && (
                <div className="mt-10 border rounded-lg p-6 shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Lowest Price</h2>
                    <div className="flex items-center">
                        <img
                            src={minPricePhone.image}
                            alt="Lowest Price Product"
                            className="w-32 h-32 object-cover rounded mr-6"
                        />
                        <div>
                            <p className="text-xl font-semibold text-blue-600 mb-2">{minPricePhone.phoneName}</p>
                            <p className="text-xl font-semibold text-green-600 mb-2">{minPricePhone.price}</p>
                            <p className="text-sm text-gray-700 mb-4">{minPricePhone.details}</p>
                            <p className="text-sm text-green-500">{minPricePhone.deliveryDate}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PriceFetcher

