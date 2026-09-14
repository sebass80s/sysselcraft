import ChildBackendQuestInbox from "@/components/ChildBackendQuestInbox";
import ReconciliationDiagnostics from "@/components/ReconciliationDiagnostics";
import TestResetControl from "@/components/TestResetControl";
import VillagePrototype from "@/components/VillagePrototype";

export default function Home() {
  return (
    <main>
      <VillagePrototype />
      <ChildBackendQuestInbox />
      <TestResetControl />
      <ReconciliationDiagnostics />
    </main>
  );
}
