import { useState } from "react";
import SetNewPassword from "../../components/authentication/NewPassword";
import SuccessMessage from "../../components/authentication/SuccessMessage";
import LeftContent from "../../components/authentication/LeftContent";
export default function NewPassword() {
    const [success, setSuccess] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 font-poppins h-full">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden ">
        <LeftContent/>

        {!success ? <SetNewPassword setSuccess={setSuccess}/> : <SuccessMessage />}
      </div>
    </div>
  );
}
