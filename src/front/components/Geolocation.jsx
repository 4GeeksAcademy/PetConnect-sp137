import React from "react";

export const Geolocation = ({ latitude, longitude }) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    const hasValidCoordinates = !isNaN(lat) && !isNaN(lng) && latitude !== null && longitude !== undefined;

    return (
        <div className="card shadow-sm p-2 w-100">
            <div style={{ width: "100%", height: "250px", borderRadius: "8px", overflow: "hidden" }}>
                {hasValidCoordinates ? (
                    <iframe
                        title="Google Map Location"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                    ></iframe>
                ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light h-100 text-muted">
                        Location not available
                    </div>
                )}
            </div>
        </div>
    );
};