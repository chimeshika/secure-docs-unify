import sriLankaLogo from "@/assets/sri-lanka-logo.png";

export const OfficialHeader = () => {
  return (
    <div className="bg-gradient-primary border-b-4 border-secondary py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="bg-background rounded-full p-3 shadow-gold">
          <img src={sriLankaLogo} alt="Sri Lanka Government Logo" className="h-12 w-12 object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
            Ministry of Public Services, Provincial Councils and Local Government
          </h1>
          <p className="text-sm text-primary-foreground/90 font-medium">
            Home Affairs Section – IT Unit (2025)
          </p>
        </div>
      </div>
    </div>
  );
};
