import { Shield } from "lucide-react";

export const OfficialHeader = () => {
  return (
    <div className="bg-gradient-primary border-b-4 border-secondary py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="bg-background rounded-full p-3 shadow-gold">
          <Shield className="h-12 w-12 text-primary" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
            Ministry of Public Services, Provincial Councils and Local Government
          </h1>
          <p className="text-sm text-primary-foreground/90 font-medium">
            Home Affairs Section – IT Branch (2025)
          </p>
        </div>
      </div>
    </div>
  );
};
