import ContactMeetingsManager from "@/components/meetings2/ContactMeetingsManager";
import Meeting from "@/components/meetings2/Meeting";


export default function Page() {
  return (
    <>
      <div className="px-4 lg:px-6">
     {/* <Meeting/> */}
     <ContactMeetingsManager/>
      </div>
    </>
  );
}