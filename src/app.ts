// Code goes here!
import Axios from "axios";

const form = document.querySelector("form")! as HTMLFormElement;
const addressInput = document.getElementById("address")! as HTMLInputElement;
const showAddress = document.getElementById(
  "show_address"
)! as HTMLParagraphElement;

const GOOGLE_API_KEY = "YOUR_API_KEY";

declare var google: any;

type GoogleGeometryResponse = {
  results: {
    formatted_address: string | null;
    geometry: { location: { lat: number; lng: number } };
  }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;
  Axios.get<GoogleGeometryResponse>(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
      enteredAddress
    )}&key=${GOOGLE_API_KEY}`
  )
    .then((res) => {
      console.log(res);
      if (res.data.status !== "OK") {
        throw new Error("Could not fetch location1");
      }
      const coordinates = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map"), {
        center: coordinates,
        zoom: 16,
      });
      new google.maps.Marker({
        position: coordinates,
        map: map,
      });

      showAddress.textContent = res.data.results[0].formatted_address;
    })
    .catch((err) => {
      alert(err.messages);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
