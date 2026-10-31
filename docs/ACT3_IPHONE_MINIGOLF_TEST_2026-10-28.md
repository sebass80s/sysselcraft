# Akt 3: minigolf på riktig iPhone, utan att ändra TestFlight

Uppdaterad: 2026-10-31. Gäller `nova/act3-development`.

## Mål och avgränsning

Första fysiska touch-acceptansen sker i **Safari på iPhone i liggande läge** mot en lokal Next.js-utvecklingsserver på Mac. Det är riktig iPhone/Safari-touch, **inte** en installerad Capacitor-/TestFlight-build. Den andra (senare) acceptansen måste göras i en separat native-app med annat bundle-ID innan vi distribuerar en ny TestFlight-build. Ersätt aldrig en befintlig `se.sysselcraft.app`-installation, radera aldrig Adams sparning och gör ingen ny publik/privat Vercel-deployment enbart för detta test.

Den lokala provservern använder **fiktiva Supabase-miljövariabler** och Akt 3:s **debug-fixture**. Varken godkända riktiga quests, köp eller något barns konto ska användas. Debugvägen är endast tillgänglig när `NODE_ENV !== "production"`.

## På din Mac

Behåll det befintliga lokala repot och TestFlight-arbetsträdet orörda. Skapa en **separat, frikopplad worktree**:

```sh
git -C ~/Developer/sysselcraft fetch origin nova/act3-development
git -C ~/Developer/sysselcraft worktree add --detach ~/Developer/sysselcraft-minigolf origin/nova/act3-development
cd ~/Developer/sysselcraft-minigolf
npm ci
npm run dev:iphone-minigolf
```

Låt terminalfönstret vara öppet när du testar. Startkommandot läser automatiskt Macens Wi-Fi-adress (`en0`) och sätter `SYSSELCRAFT_MINIGOLF_LAN_HOST`, som endast i Next.js utvecklingsläge läggs till i `allowedDevOrigins`. **Starta om servern efter uppdatering eller ändrad Wi-Fi-adress**. I ett annat terminalfönster på Mac kan du kontrollera:

```sh
ipconfig getifaddr en0
```

Det visar normalt Macens IP-adress på Wi-Fi (om det blir tomt, identifiera Wi-Fi-interfacet med `networksetup -listallhardwareports`).

## På din iPhone

1. Anslut iPhone och Mac till **samma Wi-Fi**, utan gästnät med klientisolering. Stäng av rotationslåset. Du behöver inte öppna eller logga in i TestFlight.
2. Öppna Safari och skriv `http://MACENS-IP:3000/minigolf-test/` med adressen från kommandot ovan. **Denna fristående debugvy är förstahandsvalet på fysisk iPhone.** Den laddar inte kapitelmotorn alls, och använder samma riktiga React-minigolfkomponent.
3. Vill du efter touchtestet se hela övergången från Novas dialog: `http://MACENS-IP:3000/act3-test/?scene=park009`. Där kommer de kanoniska PARK-009-raderna och sedan samma minigolf. `/act3-test/?scene=park009&play=1` finns kvar som kapitelintegrerat direktläge, men är inte nödvändigt för första iPhone-touchen.
4. Sikta genom att trycka på banan. Håll inne knappen `Tryck eller håll · Slå`, släpp för att skjuta. Spela i hålet och använd `Fortsätt berättelsen`. Den fristående vyn visar `Banan klar!` och låter dig spela igen. Inga riktiga quests hämtas och inget verkligt save skapas.

**Om sidan visas men knapparna inte fungerar via `192.168.x.x`:** kontrollera först att `http://localhost:3000/minigolf-test/` fungerar på Mac. Next.js 16 kan blockera dev-bundles/HMR från nätverks-IP när `allowedDevOrigins` inte matchar, trots att HTML-sidan ger HTTP 200. Hämta senaste `nova/act3-development`, stoppa servern och starta `npm run dev:iphone-minigolf` på nytt; använd Macens nuvarande Wi-Fi-IP. Sök efter `Blocked cross-origin request to Next.js dev resource` i serverns terminal om problemet kvarstår. Detta påverkar inte release och ska inte lösas genom att stänga av säkerhet eller lägga till en bred wildcard-origin.

**Om sidan inte öppnas:** kontrollera att `next dev` är startad och att iPhone och Mac verkligen ser varandra över Wi-Fi, samt att macOS-brandväggen tillåter inkommande trafik till Node. Använd Macens **lokala IP**, inte `localhost` eller `127.0.0.1` på iPhone.

## Vad vi vill utvärdera med riktig iPhone

- Liggande layout: alla knappar, kraftmätare och hål syns även runt Dynamic Island och hemindikatorn.
- Sikta på banan: fingret och siktmarkören hamnar rätt, även nära kanterna och vid olika iPhone-format.
- Håll/släpp: kort tryck ger kort slag, längre håll ger högre kraft; ingen textmarkering, zoomning eller scrollning förstör spelet.
- Bollens känsla: fart, friktion, kollisioner, rimligt antal slag och om banan är begriplig utan instruktion.
- Mobiltesta både `Börja om banan` och `Fortsätt berättelsen` efter att bollen gått i hål.
- Eventuella problem: notera iPhone-modell, iOS-version, liggande orientering och gärna en skärmbild/skärminspelning.

## Verifieringar och säkra gränser

Den separata minigolf-acceptansen testar också ett faktiskt musklick via den uttryckligen tillåtna LAN-IP-adressen, inte bara att HTML ger 200. Browser-smoketestet måste visa att `/minigolf-test/` öppnas i ett mobilt fönster utan kapitel-laddningsskärm, och att `?scene=park009&play=1` ger en valid kapitelstatus i `activity`, att den inte är kopplad till ett barn, att `?scene=park009` börjar med dialogen och att debugvägen är blockerad i produktion. Kapitlets befintliga claim-/save-test äger gränserna till PARK-010. Minigolfens gemensamma fysiktest körs i `npm run verify`.

Detta är inte en slutlig speldesign eller färdig native QA. **Nästa fysiska native-acceptans** bör göras med separat identifierare och installation för att undvika att ersätta TestFlight-appen.
