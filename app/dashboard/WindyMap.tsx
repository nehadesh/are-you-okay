// "use client";
// import { useEffect } from "react";

// declare global {
//   interface Window {
//     windyInit?: (options: any, callback: (api: any) => void) => void;
//   }
// }

// export default function WindyMap() {
//   useEffect(() => {
//     // Load Windy script only if not loaded
//     if (!window.windyInit) {
//       const script = document.createElement("script");
//       script.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
//       script.async = true;
//       script.onload = () => {
//         initWindy();
//       };
//       document.body.appendChild(script);
//     } else {
//       initWindy();
//     }

//     function initWindy() {
//       if (!window.windyInit) {
//         console.error("windyInit is not available on window");
//         return;
//       }

//       window.windyInit(
//         {
//           key: "LBQ3lj0xRLrpqGtF3qEQqfpPibiW5UQs", // YOUR WINDY API KEY
//           lat: 50.4,
//           lon: 14.3,
//           zoom: 5,
//         },
//         (windyAPI) => {
//           const { picker, utils, broadcast, store } = windyAPI;

//           picker.on("pickerOpened", ({ lat, lon, values, overlay }) => {
//             console.log("opened", lat, lon, values, overlay);
//             const windObject = utils.wind2obj(values);
//             console.log(windObject);
//           });

//           picker.on("pickerMoved", ({ lat, lon, values, overlay }) => {
//             console.log("moved", lat, lon, values, overlay);
//           });

//           picker.on("pickerClosed", () => {
//             console.log("picker closed");
//           });

//           store.on("pickerLocation", ({ lat, lon }) => {
//             console.log("picker location changed", lat, lon);
//             const { values, overlay } = picker.getParams();
//             console.log(values, overlay);
//           });

//           broadcast.once("redrawFinished", () => {
//             picker.open({ lat: 48.4, lon: 14.3 });
//           });
//         }
//       );
//     }
//   }, []);

//   return <div id="windy" style={{ width: "100%", height: 300 }} />;
// }
