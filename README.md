# Landing del bonus – «Il Divano Può Aspettare»

Pagina dove i lettori scrivono **nome, cognome ed email** e solo dopo ricevono il link al **Mazzo degli Imprevisti**.
I contatti finiscono nel tuo Google Sheet, nella scheda **Lead**.

Ci vogliono circa 20 minuti, una volta sola. Segui i passaggi nell'ordine.

---

## 1. Google Sheet + Apps Script (10 minuti)

1. Apri il tuo foglio: https://docs.google.com/spreadsheets/d/1djnApjlN3Pr0ZbyjuF7LkazEth1_xPt5-F8VKGdValw/edit
2. Menu **Estensioni → Apps Script**. Si apre una nuova scheda.
3. Cancella tutto il testo che c'è (di solito `function myFunction() {}`).
4. Apri il file `apps-script/Code.gs` di questo pacchetto, copia **tutto** e incollalo. **Non modificare nulla.**
5. Clicca l'icona del dischetto (Salva).
6. In alto a destra: **Esegui il deployment → Nuovo deployment**.
7. Accanto a "Seleziona tipo" clicca l'ingranaggio → **Applicazione web**.
   - Descrizione: `Lead bonus`
   - Esegui come: **Me**
   - Chi ha accesso: **Chiunque**
8. Clicca **Esegui il deployment** → **Autorizza accesso** → scegli il tuo account Google.
9. Comparirà "Google non ha verificato questa app": è normale per uno script personale.
   Clicca **Avanzate → Vai a … (non sicuro) → Consenti**.
10. Copia l'**URL dell'applicazione web**: finisce con `/exec`. Ti serve al punto 3.

## 2. GitHub (5 minuti)

1. Scompatta lo zip sul computer.
2. Su https://github.com accedi → **New repository** → nome per esempio `bonus-il-divano` → **Private** va benissimo → **Create repository**.
3. Nella pagina del repository clicca **uploading an existing file**.
4. Trascina **tutto il contenuto** della cartella scompattata (non la cartella stessa): `index.html`, `copertina.jpg`, `package.json`, le cartelle `api` e `apps-script`, `README.md`.
   I file `.gitignore` e `.env.example` sono "nascosti": su Windows attivali da Esplora file → **Visualizza → Elementi nascosti**, poi trascinali insieme agli altri.
5. **Commit changes**.

## 3. Vercel (5 minuti)

1. Su https://vercel.com accedi con GitHub → **Add New… → Project** → scegli il repository → **Import**.
2. Prima di cliccare Deploy apri **Environment Variables** e aggiungi queste quattro (i valori sono in `.env.example`):

| Nome | Valore |
|---|---|
| `GOOGLE_SCRIPT_URL` | l'URL `/exec` copiato al punto 1 |
| `APPS_SCRIPT_SECRET` | il codice già scritto in `.env.example` (copialo identico) |
| `BONUS_DRIVE_URL` | `https://drive.google.com/drive/folders/14cauDUSV6DDjYai3b_onf5q1FSAIw67w?usp=sharing` |
| `BOOK_TITLE` | `Il Divano Può Aspettare` |

3. Clicca **Deploy**. Alla fine Vercel ti dà l'indirizzo della pagina (es. `bonus-il-divano.vercel.app`).

> Se aggiungi o cambi una variabile **dopo** il primo deploy: Deployments → i tre puntini dell'ultimo → **Redeploy**. Altrimenti la pagina non la legge.

## 4. Prova finale

1. Apri l'indirizzo Vercel, compila il form con un tuo dato di prova e invia.
2. Deve comparire "Fatto, il mazzo è vostro!" con il pulsante: cliccalo e controlla che apra la cartella Drive.
3. Nel Google Sheet guarda la scheda **Lead** (in basso, accanto a "Foglio1"): c'è la tua riga.
   Se reinvii con la stessa email, la riga si aggiorna e la colonna "Accessi" sale a 2: niente doppioni.

**Se qualcosa non va:** su Vercel apri il progetto → **Logs** (i log di esecuzione, non quelli di build) e invia di nuovo il form: compare l'errore esatto.
Il caso più comune è l'URL `/exec` copiato male o una variabile aggiunta senza Redeploy.

## Da sapere

- La cartella Drive deve essere condivisa come **"Chiunque abbia il link – Visualizzatore"**, altrimenti i lettori vedono "Richiedi accesso".
- Il link del bonus non è scritto nella pagina: lo restituisce il server solo dopo che il Google Sheet ha confermato il salvataggio.
- Se un giorno modifichi `Code.gs`: **Esegui il deployment → Gestisci deployment → matita → Versione: Nuova versione → Esegui il deployment**.
  Non fare "Nuovo deployment", perché cambierebbe l'URL `/exec`.
- L'indirizzo Vercel è quello da mettere nel QR code del libro (pagina "Il vostro bonus").
