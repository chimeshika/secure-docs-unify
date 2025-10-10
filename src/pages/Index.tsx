import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="bg-gradient-primary border-b-4 border-secondary py-6 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="bg-background rounded-full p-4 shadow-gold">
            <Shield className="h-16 w-16 text-primary" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
              Ministry of Public Services, Provincial Councils and Local Government
            </h1>
            <p className="text-base text-primary-foreground/90 font-medium mt-1">
              Home Affairs Section – IT Branch (2025)
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Shield className="h-16 w-16 text-primary" strokeWidth={2} />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              SecureDocs
            </h2>
            
            <p className="text-xl md:text-2xl mb-6 text-muted-foreground font-medium">
              Official Document Management System
            </p>
            
            <p className="text-lg mb-10 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Secure document management system for the Ministry of Public Services, 
              Provincial Councils and Local Government. Manage and organize official 
              documents with role-based access control and advanced security features.
            </p>

            <div className="flex gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-foreground">Document Management</h3>
              <p className="text-muted-foreground text-center">
                Upload, organize, and manage official documents with secure folder structures
              </p>
            </div>
            
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Lock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-foreground">Role-Based Access</h3>
              <p className="text-muted-foreground text-center">
                Officer and admin roles with granular permissions for data security
              </p>
            </div>
            
            <div className="bg-card border-2 border-border rounded-lg p-8 shadow-card hover:shadow-elegant transition-shadow">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center text-foreground">Government Security</h3>
              <p className="text-muted-foreground text-center">
                Enterprise-grade security standards for official government documents
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-primary text-primary-foreground py-4 px-6 border-t-2 border-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm font-medium">
            Developed by IT Branch – Home Affairs Section (2025)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
