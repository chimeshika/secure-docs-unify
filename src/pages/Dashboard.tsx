import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderOpen, Upload } from "lucide-react";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Welcome to SecureDocs</h2>
          <p className="text-muted-foreground mt-2">
            Your secure document management system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Documents</CardTitle>
              <CardDescription>
                View and manage your uploaded documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total documents</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <FolderOpen className="h-8 w-8 text-secondary mb-2" />
              <CardTitle>Folders</CardTitle>
              <CardDescription>
                Organize documents in folders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Total folders</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <Upload className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Quick Upload</CardTitle>
              <CardDescription>
                Upload new documents quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to upload
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
