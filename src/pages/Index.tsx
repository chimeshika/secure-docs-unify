import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, Lock, Search, Users, BarChart3, FolderOpen, Clock, ChevronRight } from "lucide-react";
import { OfficialHeader } from "@/components/layout/OfficialHeader";
import { OfficialFooter } from "@/components/layout/OfficialFooter";
import sriLankaLogo from "@/assets/sri-lanka-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-background">
      <OfficialHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent py-16 md:py-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center mb-8 animate-fade-in">
              <div className="bg-gradient-primary p-6 rounded-2xl shadow-elegant">
                <img src={sriLankaLogo} alt="Sri Lanka Government" className="h-24 w-24 object-contain" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight animate-fade-in">
              Official Document Management System
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-foreground/80 max-w-3xl mx-auto leading-relaxed font-medium">
              Secure, efficient, and modern document management solution for the Ministry of Public Services, 
              Provincial Councils and Local Government - Home Affairs Section
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
              <Link to="/auth">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-primary text-black hover:opacity-90 shadow-elegant text-base px-8 py-6 font-semibold">
                  Access System
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-primary text-foreground hover:bg-primary/5 text-base px-8 py-6 font-semibold">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">100%</p>
                  <p className="text-sm text-muted-foreground font-medium">Secure</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-secondary/20 bg-card/80 backdrop-blur">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">24/7</p>
                  <p className="text-sm text-muted-foreground font-medium">Access</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-accent/20 bg-card/80 backdrop-blur">
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">Multi</p>
                  <p className="text-sm text-muted-foreground font-medium">User</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-primary/20 bg-card/80 backdrop-blur">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">Full</p>
                  <p className="text-sm text-muted-foreground font-medium">Reports</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Comprehensive Document Management
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                Everything you need to manage official government documents securely and efficiently
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <FileText className="h-7 w-7 text-primary" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Document Upload & Storage</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Upload and store documents securely with full metadata tracking and version control
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="bg-secondary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <FolderOpen className="h-7 w-7 text-secondary" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Folder Organization</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Create hierarchical folder structures to organize documents by department or project
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Search className="h-7 w-7 text-accent" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Advanced Search</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Find documents quickly with powerful search and filter capabilities across all metadata
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Lock className="h-7 w-7 text-primary" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Role-Based Access Control</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Admin and officer roles with granular permissions to ensure data security and compliance
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="bg-secondary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="h-7 w-7 text-secondary" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Activity Tracking</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Complete audit trail of all document activities with timestamps and user tracking
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-border bg-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="h-7 w-7 text-accent" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">Comprehensive Reports</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Generate detailed reports and export data to CSV for analysis and record-keeping
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 shadow-elegant">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="bg-gradient-primary p-8 rounded-2xl shadow-elegant flex-shrink-0">
                    <Shield className="h-20 w-20 text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                      Government-Grade Security
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed font-medium mb-6">
                      Built with enterprise security standards to protect sensitive government documents. 
                      Features include encrypted storage, secure authentication, role-based permissions, 
                      and complete audit trails for compliance.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                        <span className="text-sm font-semibold text-foreground">Row Level Security</span>
                      </div>
                      <div className="px-4 py-2 bg-secondary/10 rounded-full border border-secondary/20">
                        <span className="text-sm font-semibold text-foreground">Encrypted Storage</span>
                      </div>
                      <div className="px-4 py-2 bg-accent/10 rounded-full border border-accent/20">
                        <span className="text-sm font-semibold text-foreground">Audit Logs</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 font-medium">
              Access the document management system and start organizing your official documents today
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary text-black hover:opacity-90 shadow-elegant text-base px-10 py-6 font-semibold">
                Access System Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <OfficialFooter />
    </div>
  );
};

export default Index;
