import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-primary">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <Shield className="h-20 w-20 mx-auto mb-6 opacity-90" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            SecureDocs
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Professional Document Management System
          </p>
          
          <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto">
            Secure, organize, and manage your organization's documents with 
            role-based access control and advanced search capabilities.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <FileText className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Document Management</h3>
              <p className="text-white/80">
                Upload, organize, and manage documents with ease
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Lock className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
              <p className="text-white/80">
                Role-based permissions keep your data safe
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Shield className="h-10 w-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Data Protection</h3>
              <p className="text-white/80">
                Enterprise-grade security for your documents
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
