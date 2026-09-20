"use client";

import UploadForm from "./UploadForm";
import UserManagement from "./UserManagement";
import PremiumPlans from "./PremiumPlans";
import SystemHealth from "./SystemHealth";
import BulkUpload from "./BulkUpload";
import LinkMonitor from "./LinkMonitor";
import AuditLedger from "./AuditLedger";
import FinancialExport from "./FinancialExport";

import AmbienceUpload from "./AmbienceUpload";


export default function AdminWorkspace({ currentView }) {
  
  return (
    <div className="w-full transition-opacity duration-300 animate-fade-in-up">
      
      
      
      {currentView === "content" && <UploadForm />}
      {currentView === "bulk" && <BulkUpload />}
      
      
      {currentView === "ambience" && <AmbienceUpload />}
      
      {currentView === "team" && <UserManagement />}
      {currentView === "plans" && <PremiumPlans />}
      {currentView === "health" && <SystemHealth />}
      {currentView === "monitor" && <LinkMonitor />}
      {currentView === "audit" && <AuditLedger />}
      {currentView === "finance" && <FinancialExport />}
      
      
      {(currentView === "workspace" || !currentView) && <UploadForm />}
      
    </div>
  );
}