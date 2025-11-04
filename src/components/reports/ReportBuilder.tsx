import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Document, Packer, Paragraph, Table as DocxTable, TableCell as DocxTableCell, TableRow as DocxTableRow, WidthType } from 'docx';

interface TableField {
  table: string;
  field: string;
  displayName: string;
}

interface ReportData {
  [key: string]: any;
}

const availableTables = [
  { name: "documents", label: "Documents" },
  { name: "folders", label: "Folders" },
  { name: "profiles", label: "User Profiles" },
  { name: "departments", label: "Departments" },
  { name: "activity_logs", label: "Activity Logs" },
];

const tableFields: Record<string, TableField[]> = {
  documents: [
    { table: "documents", field: "title", displayName: "Title" },
    { table: "documents", field: "reference_number", displayName: "Reference Number" },
    { table: "documents", field: "file_type", displayName: "File Type" },
    { table: "documents", field: "file_size", displayName: "File Size" },
    { table: "documents", field: "date_received", displayName: "Date Received" },
    { table: "documents", field: "tags", displayName: "Tags" },
    { table: "documents", field: "remarks", displayName: "Remarks" },
    { table: "documents", field: "created_at", displayName: "Created At" },
  ],
  folders: [
    { table: "folders", field: "name", displayName: "Folder Name" },
    { table: "folders", field: "created_at", displayName: "Created At" },
    { table: "folders", field: "updated_at", displayName: "Updated At" },
  ],
  profiles: [
    { table: "profiles", field: "full_name", displayName: "Full Name" },
    { table: "profiles", field: "email", displayName: "Email" },
    { table: "profiles", field: "created_at", displayName: "Account Created" },
  ],
  departments: [
    { table: "departments", field: "name", displayName: "Department Name" },
    { table: "departments", field: "code", displayName: "Department Code" },
    { table: "departments", field: "description", displayName: "Description" },
  ],
  activity_logs: [
    { table: "activity_logs", field: "action", displayName: "Action" },
    { table: "activity_logs", field: "entity_type", displayName: "Entity Type" },
    { table: "activity_logs", field: "details", displayName: "Details" },
    { table: "activity_logs", field: "created_at", displayName: "Timestamp" },
  ],
};

export const ReportBuilder = () => {
  const [selectedTable, setSelectedTable] = useState<string>("documents");
  const [selectedFields, setSelectedFields] = useState<TableField[]>([]);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!roleData);
  };

  const handleFieldToggle = (field: TableField) => {
    setSelectedFields((prev) => {
      const exists = prev.find((f) => f.field === field.field && f.table === field.table);
      if (exists) {
        return prev.filter((f) => !(f.field === field.field && f.table === field.table));
      }
      return [...prev, field];
    });
  };

  const generateReport = async () => {
    if (selectedFields.length === 0) {
      toast({
        title: "No fields selected",
        description: "Please select at least one field to generate a report",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fieldsToSelect = selectedFields.map(f => f.field).join(", ");
      
      let query = supabase.from(selectedTable as any).select(fieldsToSelect);
      
      // Non-admin users only see their own data
      if (!isAdmin && (selectedTable === "documents" || selectedTable === "folders")) {
        query = query.eq("owner_id", user.id);
      } else if (!isAdmin && selectedTable === "activity_logs") {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      setReportData(data || []);
      toast({
        title: "Success",
        description: `Report generated with ${data?.length || 0} records`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (reportData.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `report-${selectedTable}-${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Success",
      description: "Report exported to Excel",
    });
  };

  const exportToPDF = () => {
    if (reportData.length === 0) return;

    const doc = new jsPDF();
    const headers = selectedFields.map(f => f.displayName);
    const rows = reportData.map(row => 
      selectedFields.map(f => {
        const value = row[f.field];
        if (Array.isArray(value)) return value.join(", ");
        if (typeof value === "object") return JSON.stringify(value);
        return String(value || "");
      })
    );

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.text(`${selectedTable.toUpperCase()} Report`, 14, 15);
    doc.save(`report-${selectedTable}-${new Date().toISOString().split('T')[0]}.pdf`);

    toast({
      title: "Success",
      description: "Report exported to PDF",
    });
  };

  const exportToWord = async () => {
    if (reportData.length === 0) return;

    const tableRows = reportData.map(row => 
      new DocxTableRow({
        children: selectedFields.map(f => 
          new DocxTableCell({
            children: [new Paragraph(String(row[f.field] || ""))],
            width: { size: 100 / selectedFields.length, type: WidthType.PERCENTAGE },
          })
        ),
      })
    );

    const headerRow = new DocxTableRow({
      children: selectedFields.map(f => 
        new DocxTableCell({
          children: [new Paragraph(f.displayName)],
          width: { size: 100 / selectedFields.length, type: WidthType.PERCENTAGE },
        })
      ),
    });

    const table = new DocxTable({
      rows: [headerRow, ...tableRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: `${selectedTable.toUpperCase()} Report`,
            heading: "Heading1",
          }),
          table,
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${selectedTable}-${new Date().toISOString().split('T')[0]}.docx`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Report exported to Word",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Table</CardTitle>
            <CardDescription>Choose which table to generate a report from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availableTables.map((table) => (
                <div key={table.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={table.name}
                    checked={selectedTable === table.name}
                    onCheckedChange={() => {
                      setSelectedTable(table.name);
                      setSelectedFields([]);
                      setReportData([]);
                    }}
                  />
                  <Label htmlFor={table.name} className="cursor-pointer">
                    {table.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Fields</CardTitle>
            <CardDescription>Choose which fields to include in your report</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {tableFields[selectedTable]?.map((field) => (
                  <div key={`${field.table}-${field.field}`} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.table}-${field.field}`}
                      checked={selectedFields.some(f => f.field === field.field)}
                      onCheckedChange={() => handleFieldToggle(field)}
                    />
                    <Label htmlFor={`${field.table}-${field.field}`} className="cursor-pointer">
                      {field.displayName}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button onClick={generateReport} disabled={loading || selectedFields.length === 0}>
          {loading ? "Generating..." : "Generate Report"}
        </Button>
        
        {reportData.length > 0 && (
          <>
            <Button onClick={exportToExcel} variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Export to Excel
            </Button>
            <Button onClick={exportToPDF} variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export to PDF
            </Button>
            <Button onClick={exportToWord} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export to Word
            </Button>
          </>
        )}
      </div>

      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>{reportData.length} records found</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedFields.map((field) => (
                      <TableHead key={`${field.table}-${field.field}`}>
                        {field.displayName}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((row, idx) => (
                    <TableRow key={idx}>
                      {selectedFields.map((field) => (
                        <TableCell key={`${field.table}-${field.field}-${idx}`}>
                          {Array.isArray(row[field.field])
                            ? row[field.field].join(", ")
                            : typeof row[field.field] === "object"
                            ? JSON.stringify(row[field.field])
                            : String(row[field.field] || "-")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
