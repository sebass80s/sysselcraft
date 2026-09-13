import ChildBackendQuestInbox from "@/components/ChildBackendQuestInbox";
import ReconciliationDiagnostics from "@/components/ReconciliationDiagnostics";
import VillagePrototype from "@/components/VillagePrototype";

export default function Home() {
  return (
    <main>
      <VillagePrototype />
      <ChildBackendQuestInbox />
      <ReconciliationDiagnostics />
    </main>
  );
}
