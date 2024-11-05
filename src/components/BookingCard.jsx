import React from "react";
import { CheckCircle2, ExternalLink } from "lucide-react";

const BookingCard = ({ booking }) => {
  if (!booking) return null;

  return (
    <div className="bg-green-50 rounded-lg shadow p-4 mt-4">
      <div className="flex items-center">
        <CheckCircle2 className="text-green-500 mr-3" size={24} />
        <div className="flex-1">
          <h3 className="font-bold text-green-800 mb-1">
            Completed Reservation
          </h3>
          {/* <a
            href={`https://booking.sterlingholidays.com/bookings/confiramtion/${booking?.data?.bookingId}`}
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors duration-200 group"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Booking Details
            <ExternalLink className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
          </a> */}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
