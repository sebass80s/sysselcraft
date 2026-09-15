import ChildBackendQuestInbox from "@/components/ChildBackendQuestInbox";
import KeyboardInputGuard from "@/components/KeyboardInputGuard";
import ReconciliationDiagnostics from "@/components/ReconciliationDiagnostics";
import VillagePrototype from "@/components/VillagePrototype";

export default function Home() {
  return (
    <main>
      <KeyboardInputGuard />
      <VillagePrototype />
      <ChildBackendQuestInbox />
      <ReconciliationDiagnostics />
    </main>
  );
}
