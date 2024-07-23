import React, { useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import IncidentForm from "./IncidentForm";
import "./styles.css";

function CenterMarker() {
  const map = useMap();
  const markerRef = useRef(null);

  React.useEffect(() => {
    if (!markerRef.current) {
      const icon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      markerRef.current = L.marker(map.getCenter(), { icon: icon }).addTo(map);
    }

    const updateMarker = () => {
      const center = map.getCenter();
      markerRef.current.setLatLng(center);
    };

    map.on("move", updateMarker);

    return () => {
      map.off("move", updateMarker);
    };
  }, [map]);

  return null;
}

function App() {
  const [incidents, setIncidents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const mapRef = useRef(null);

  const addIncident = (incident) => {
    const center = mapRef.current.getCenter();
    setIncidents([...incidents, { ...incident, location: center }]);
    setShowForm(false);
  };

  const getDefaultValues = useCallback(() => {
    const now = new Date();
    return {
      defaultDate: now.toISOString().split("T")[0],
      defaultTime: now.toTimeString().split(" ")[0].slice(0, 5),
      defaultDescription: "Near miss incident occurred here.",
    };
  }, []);

  const handleCreateReport = () => {
    setShowForm(true);
  };

  return (
    <div className="app">
      <header>
        <h1>Bicycle Near-Miss Map</h1>
      </header>
      <main>
        <div className="content-wrapper">
          <section className="instructions">
            <h2>How to Use</h2>
            <ol>
              <li>Pan and zoom the map to your desired location.</li>
              <li>
                The red pin in the center indicates where your report will be
                placed.
              </li>
              <li>Click "Create Report Here" to add a new incident.</li>
              <li>Fill out the incident details in the form that appears.</li>
            </ol>
          </section>
          <MapContainer
            center={[39.8283, -98.5795]} // Center of the US
            zoom={4}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CenterMarker />
            {incidents.map((incident, index) => (
              <Marker key={index} position={incident.location}>
                <Popup>
                  <strong>Date: </strong>
                  {incident.date}
                  <br />
                  <strong>Time: </strong>
                  {incident.time}
                  <br />
                  <strong>Description: </strong>
                  {incident.description}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="button-container">
          <button onClick={handleCreateReport} className="report-button">
            Create Report Here
          </button>
        </div>
        {showForm && (
          <IncidentForm
            onSubmit={addIncident}
            onCancel={() => setShowForm(false)}
            defaultValues={getDefaultValues()}
          />
        )}
      </main>
    </div>
  );
}

export default App;
