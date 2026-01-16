'use client';
import Image from "next/image";
import { Topbar } from "./components/layout/Topbar";


export default function Home() {
  const RenderContent = ({ image, buttoncontent }: any) => {
    return (
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <img
          src={image}
          alt="content image"
          className="w-full h-64 object-cover"
        />
        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#EF7C5C] hover:bg-[#d96647] text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300">
          {buttoncontent}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      <div className="relative w-2/3 h-96 md:h-auto text-white">
        
        <video
          src="/KNjmnFp5kwda6KegO13wieYyI0.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover rounded-br-4xl rounded-bl-4xl"
        />
        <div className="absolute bottom-16 left-4 md:left-16">
          <h1 className="text-8xl font-medium text-[#EFE7D2] drop-shadow-lg">
            SUSHI <br/> SENSATION
          </h1>
        </div>
        <Topbar />
      </div>
      
      <div className="relative md:w-1/3 w-full bg-white py-16 px-6 md:px-8 flex items-start justify-center">
        <RenderContent image="/Sushi.avif" buttoncontent="Explore Menu" />
      </div>
    </div>
  );
}
