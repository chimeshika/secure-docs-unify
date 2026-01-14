import { ExternalLink } from "lucide-react";

export const OfficialFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-primary text-white py-6 px-6 border-t-4 border-secondary mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm md:text-base font-semibold text-black">
              Developed by IT Unit – Home Affairs Section ({currentYear})
            </p>
            <p className="text-xs md:text-sm text-black mt-1">
              Ministry of Public Services, Provincial Councils and Local Government
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm">
            <a 
              href="https://www.gov.lk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-primary-foreground flex items-center gap-1 transition-colors"
            >
              Government Portal <ExternalLink className="h-3 w-3" />
            </a>
            <a 
              href="https://www.pubad.gov.lk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-primary-foreground flex items-center gap-1 transition-colors"
            >
              Ministry Website <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-black/20 text-center">
          <p className="text-xs text-black">
            © {currentYear} Government of Sri Lanka. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
