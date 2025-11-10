import sriLankaLogo from "@/assets/sri-lanka-logo.png";

export const OfficialHeader = () => {
  return (
    <header className="bg-gradient-primary border-b-4 border-secondary py-5 px-6 shadow-elegant">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="bg-background rounded-full p-3 shadow-gold flex-shrink-0">
          <img src={sriLankaLogo} alt="Sri Lanka Government Logo" className="h-14 w-14 object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base md:text-lg lg:text-xl font-bold text-black tracking-tight leading-tight">
            SecureDocs Document Management System – IT Unit (2025)
          </h1>
          <p className="text-xs md:text-sm lg:text-base text-black font-medium mt-1">
            Ministry of Public Services, Provincial Councils and Local Government
          </p>
        </div>
      </div>
    </header>
  );
};
