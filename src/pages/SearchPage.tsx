import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const SearchPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Search Documents</h2>
          <p className="text-muted-foreground mt-2">
            Find documents by title, folder, or tags
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>
              Search across all your documents and folders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-10"
              />
            </div>

            <div className="text-center py-12 text-muted-foreground mt-6">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No search results</p>
              <p className="text-sm mt-2">Try searching for a document or folder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SearchPage;
