# Quest System V2: explicit templates (2026-10-14)

## Product rule, locked

An issued quest is **not** automatically a saved template. "Skicka uppdrag" sends one instance (or a recurring schedule) to the child. "Skapa mall" explicitly saves reusable values for that child, but **does not issue any new quest, create an active recurring schedule, allocate rewards or advance progression**. The parent can choose "Använd mall" to fill the quest form and then independently press "Skicka uppdrag". This is shared Quest V2, independent of Story/Act 3, compatible with Runtime 1.1.

## Storage ownership and migrations

- Existing `parent_quests` rows remain the **authoritative definitions** for real quest instances and recurring schedules. This is an internal implementation detail, not automatic inclusion in the parent's saved-template library.
- `parent_quests.saved_as_template` is **false by default** for newly created real quests. `template_child_id` identifies the child's template library, including standalone saved templates that have no `quest_instances`.
- Migration backfills `saved_as_template=true` for historical definitions with child instances. This conservatively preserves the previously visible library; old clutter can now be removed deliberately without disrupting the actual task.
- Parent-only SQL RPCs: `create_parent_quest_template_v1` (insert definition but NO instance), `list_parent_quest_templates_v1` (saved items only), `remove_parent_quest_template_v1` (unset saved flag, not archive quest).
- `list_parent_quest_definitions_v2` remains intact for recurring-schedule administration. Backend materialization, quest claims, snapshots, earned rewards, and instance lifecycle are unchanged.

## Parent UX

- The creation form has **Skicka uppdrag** (default) and **Skapa mall** (explicit secondary action). A saved template is **not** sent until the parent later uses it.
- **Sparade mallar** lists only explicitly saved and legacy-grandfathered templates, with **Använd mall** and **Ta bort mall**. Removing a template never stops an ongoing schedule.
- **Återkommande uppdrag** separately lists active recurring definitions and retains editing, reactivation and archive/stop controls; no need to save them as templates.
- The child's iPhone app and pairing/saves require no update. The parent web frontend and SQL migration are coordinated release steps.

## Safeguards and acceptance

- Existing templates, quest instance history, rewards and child save data are preserved.
- Parent/child authorization checks are server-side. No template-only row can appear in the child quest list or automatically materialize because it has no initial instance.
- `scripts/test-quest-v2-explicit-templates.mjs` is included in `npm run verify`. A green web build alone does not prove live SQL RPC behavior; a separate parent/child acceptance test is required.
- **Do not apply the migration or deploy the parent frontend before review and an explicit deployment decision.** In the previous release, Supabase was updated before the corresponding Vercel deployment. These two must be coordinated here to avoid RPC-not-found errors.

## Follow-ups

The first increment intentionally treats a saved template as reusable *input*, not a live quest. Existing one-off templates from the legacy library can still be used and removed, while live recurring schedules remain independently configurable. Advanced template editing can be added using an independent template-only edit operation rather than mutating an ongoing quest.
