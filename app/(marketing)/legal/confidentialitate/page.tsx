import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/legal-doc";
import { siteConfig } from "@/lib/site";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/seo/json-ld";

const TITLE = "Politica de confidențialitate";
const DESCRIPTION =
  "Cum colectăm, folosim și protejăm datele tale pe InfoBac.md — conform Legii 133/2011 din Republica Moldova și GDPR.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/legal/confidentialitate",
    languages: { "ro-MD": "/legal/confidentialitate" },
  },
  robots: { index: true, follow: true },
};

export default function ConfidentialitatePage() {
  return (
    <>
      <WebPageJsonLd
        page={{
          path: "/legal/confidentialitate",
          title: TITLE,
          description: DESCRIPTION,
          dateModified: "2026-04-30",
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: "/" },
          {
            name: "Politica de confidențialitate",
            url: "/legal/confidentialitate",
          },
        ]}
      />
    <LegalDoc
      title="Politica de confidențialitate"
      lastUpdated="30 aprilie 2026"
      status="draft"
    >
      <section>
        <h2>1. Cine suntem</h2>
        <p>
          InfoBac e o platformă educațională operată din Chișinău, Republica
          Moldova. Ne luăm în serios protecția datelor tale și acționăm
          conform <strong>Legii nr. 133 din 8 iulie 2011 privind protecția
          datelor cu caracter personal</strong> din Republica Moldova și a{" "}
          <strong>Regulamentului UE 2016/679 (GDPR)</strong>.
        </p>
      </section>

      <section>
        <h2>2. Ce date colectăm</h2>
        <h3>Cont și autentificare</h3>
        <ul>
          <li>nume complet;</li>
          <li>adresă de email;</li>
          <li>parola (stocată hash-uită, nu e accesibilă echipei);</li>
          <li>opțional: liceul și clasa.</li>
        </ul>

        <h3>Plată și facturare</h3>
        <ul>
          <li>
            informații de card bancar — procesate exclusiv de procesatorul
            de plăți (Stripe sau echivalent), nu sunt stocate de InfoBac;
          </li>
          <li>istoric tranzacții (date, sume, plan);</li>
          <li>opțional: nume + adresă de facturare pentru factură fiscală.</li>
        </ul>

        <h3>Utilizare platformă</h3>
        <ul>
          <li>progres lecții, scoruri quiz-uri, timp petrecut;</li>
          <li>răspunsuri la simulări (pentru analiză puncte slabe);</li>
          <li>preferințe (limbă interfață, mod întunecat).</li>
        </ul>

        <h3>Tehnice</h3>
        <ul>
          <li>adresă IP (anonimizată în logurile noastre după 30 zile);</li>
          <li>tip browser și sistem de operare;</li>
          <li>cookie-uri de autentificare (sesiune).</li>
        </ul>
      </section>

      <section>
        <h2>3. Scopul prelucrării și baza legală</h2>
        <p>Folosim datele tale pentru:</p>
        <ul>
          <li>
            <strong>Furnizarea serviciului</strong> (acces la cursuri,
            urmărire progres) — bază: executarea contractului.
          </li>
          <li>
            <strong>Plăți și facturare</strong> — bază: obligație legală
            (legislație fiscală RM).
          </li>
          <li>
            <strong>Comunicări tranzacționale</strong> (confirmare cont,
            resetare parolă, factură) — bază: executarea contractului.
          </li>
          <li>
            <strong>Comunicări de marketing</strong> (newsletter, oferte) —
            doar cu consimțământul tău explicit, dezactivabil oricând.
          </li>
          <li>
            <strong>Analitice și îmbunătățire produs</strong> — bază: interes
            legitim, agregat și anonimizat.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Cu cine partajăm datele</h2>
        <p>
          Folosim furnizori externi (procesatori) pentru a opera Platforma.
          Toate aceste companii au acorduri de prelucrare a datelor (DPA)
          conforme GDPR:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> (Irlanda, EU) — bază de date și
            autentificare.
          </li>
          <li>
            <strong>Resend</strong> (SUA, cu Standard Contractual Clauses) —
            trimitere emailuri tranzacționale.
          </li>
          <li>
            <strong>Vercel</strong> (SUA, cu SCC) — hosting site web.
          </li>
          <li>
            <strong>Procesator plăți</strong> (Stripe sau echivalent) — date
            de card.
          </li>
        </ul>
        <p>
          <strong>Nu vindem datele tale.</strong> Nu le partajăm cu terți
          pentru scopuri de marketing.
        </p>
      </section>

      <section>
        <h2>5. Drepturile tale</h2>
        <p>
          Conform Legii 133/2011 RM și GDPR, ai următoarele drepturi:
        </p>
        <ul>
          <li>
            <strong>Acces</strong> — să ne ceri o copie a datelor pe care le
            avem despre tine;
          </li>
          <li>
            <strong>Rectificare</strong> — să corectezi datele greșite;
          </li>
          <li>
            <strong>Ștergere</strong> („dreptul de a fi uitat") — să ceri
            ștergerea contului și datelor asociate;
          </li>
          <li>
            <strong>Portabilitate</strong> — să primești datele tale în format
            structurat (JSON) și să le transferi în altă platformă;
          </li>
          <li>
            <strong>Restricționare</strong> — să ceri pauzarea prelucrării
            în anumite scopuri;
          </li>
          <li>
            <strong>Opoziție</strong> — să te opui prelucrării bazate pe
            interes legitim sau marketing;
          </li>
          <li>
            <strong>Plângere la autoritate</strong> — la Centrul Național
            pentru Protecția Datelor cu Caracter Personal din RM (datepersonale.md).
          </li>
        </ul>
        <p>
          Pentru exercitarea oricărui drept, scrie-ne la{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          . Răspundem în maximum 30 de zile.
        </p>
      </section>

      <section>
        <h2>6. Cookie-uri</h2>
        <p>Folosim trei tipuri de cookie-uri:</p>
        <ul>
          <li>
            <strong>Esențiale</strong> — pentru autentificare și sesiune.
            Nu pot fi dezactivate.
          </li>
          <li>
            <strong>Preferințe</strong> — pentru a reține alegerea de mod
            întunecat / luminos. Dezactivabile.
          </li>
          <li>
            <strong>Analitice</strong> — pentru a înțelege ce pagini sunt
            populare. Anonimizate, dezactivabile la prima vizită.
          </li>
        </ul>
        <p>
          Nu folosim cookie-uri de tracking pentru reclame third-party.
        </p>
      </section>

      <section>
        <h2>7. Securitate</h2>
        <p>
          Datele tale sunt criptate la transport (HTTPS pe toate paginile) și
          la stocare (la nivelul Supabase / procesator de plăți). Parolele
          sunt hash-uite cu algoritm bcrypt sau echivalent — nici echipa
          InfoBac nu le poate vedea în clar.
        </p>
      </section>

      <section>
        <h2>8. Perioada de retenție</h2>
        <ul>
          <li>
            <strong>Cont activ</strong> — pe toată durata abonamentului.
          </li>
          <li>
            <strong>Cont inactiv {">"}24 luni</strong> — datele personale sunt
            anonimizate; progresul cursurilor e șters.
          </li>
          <li>
            <strong>Date fiscale</strong> — păstrate 10 ani, conform
            legislației fiscale RM.
          </li>
          <li>
            <strong>Loguri tehnice</strong> — anonimizate după 30 de zile.
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Minori</h2>
        <p>
          Pentru utilizatorii sub 16 ani, prelucrarea datelor necesită
          consimțământul părintelui sau tutorelui legal. Putem cere
          confirmare scrisă în caz de dubiu.
        </p>
      </section>

      <section>
        <h2>10. Modificări ale acestei politici</h2>
        <p>
          Vom notifica orice schimbare materială prin email și banner pe
          site, cu cel puțin 14 zile înainte de intrarea în vigoare.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Responsabil cu protecția datelor (DPO):{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          . Răspundem în maximum 30 de zile la orice cerere.
        </p>
      </section>
    </LegalDoc>
    </>
  );
}
