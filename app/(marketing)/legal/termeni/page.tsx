import type { Metadata } from "next";
import { LegalDoc } from "@/components/marketing/legal-doc";
import { siteConfig } from "@/lib/site";
import { BreadcrumbJsonLd, WebPageJsonLd } from "@/lib/seo/json-ld";

const TITLE = "Termeni și condiții";
const DESCRIPTION =
  "Termenii și condițiile de utilizare a platformei InfoBac.md, conform legislației Republicii Moldova.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/legal/termeni",
    languages: { "ro-MD": "/legal/termeni" },
  },
  robots: { index: true, follow: true },
};

export default function TermeniPage() {
  return (
    <>
      <WebPageJsonLd
        page={{
          path: "/legal/termeni",
          title: TITLE,
          description: DESCRIPTION,
          dateModified: "2026-04-30",
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Acasă", url: "/" },
          { name: "Termeni și condiții", url: "/legal/termeni" },
        ]}
      />
    <LegalDoc
      title="Termeni și condiții"
      lastUpdated="30 aprilie 2026"
      status="draft"
    >
      <section>
        <h2>1. Definiții</h2>
        <p>
          În acest document, următorii termeni au sensul descris mai jos:
        </p>
        <ul>
          <li>
            <strong>InfoBac</strong> sau <strong>Platforma</strong> — site-ul
            web disponibil la {siteConfig.url}, operat de echipa InfoBac din
            Chișinău, Republica Moldova.
          </li>
          <li>
            <strong>Utilizator</strong> — orice persoană care accesează
            Platforma, fie ca vizitator, fie ca abonat.
          </li>
          <li>
            <strong>Conținut</strong> — toate materialele text, video, quiz-uri,
            simulări și alte resurse educaționale disponibile prin Platformă.
          </li>
          <li>
            <strong>Abonament</strong> — accesul plătit la Platformă pe baza
            unui plan ales (Basic, Standard, Lifetime).
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Acceptarea termenilor</h2>
        <p>
          Prin crearea unui cont sau prin accesarea Platformei, accepți acești
          termeni în întregime. Dacă nu ești de acord cu vreuna dintre
          prevederi, te rugăm să nu folosești serviciul.
        </p>
        <p>
          Pentru utilizatorii minori (sub 18 ani), acceptarea termenilor și
          plata sunt efectuate de un părinte sau tutore legal, care rămâne
          responsabil pentru utilizarea contului.
        </p>
      </section>

      <section>
        <h2>3. Descrierea serviciului</h2>
        <p>
          InfoBac oferă materiale educaționale online pentru pregătirea
          examenelor Certiport IT Specialist (Python, Databases, Networking
          &amp; Devices), care sunt acceptate de Ministerul Educației și
          Cercetării din Republica Moldova pentru echivalarea probei de
          informatică la examenul de bacalaureat.
        </p>
        <p>
          <strong>Important:</strong> InfoBac nu organizează examenele
          Certiport. Voucherele și sesiunile de examen se obțin separat de la
          centrele de testare autorizate.
        </p>
      </section>

      <section>
        <h2>4. Înregistrare și cont</h2>
        <p>
          Pentru a accesa conținutul plătit, este necesară crearea unui cont
          cu email valid. Te angajezi să:
        </p>
        <ul>
          <li>furnizezi informații corecte și actuale;</li>
          <li>păstrezi parola confidențială;</li>
          <li>
            ne notifici imediat dacă suspectezi acces neautorizat la cont;
          </li>
          <li>
            nu împărtășești contul cu alte persoane (cu excepția contului
            extra inclus în planul Lifetime).
          </li>
        </ul>
      </section>

      <section>
        <h2>5. Plăți și facturare</h2>
        <p>
          Prețurile sunt afișate în lei moldovenești (MDL), cu echivalent
          informativ în EUR. Plata se efectuează prin card bancar pentru
          abonamente lunare sau prin transfer bancar pentru planul Lifetime.
        </p>
        <p>
          Pentru abonamentele lunare, taxarea recurentă are loc automat la
          aceeași dată în luna următoare, până la anularea abonamentului din
          contul tău.
        </p>
        <p>
          Plata Lifetime e o tranzacție unică, fără reînnoire automată.
        </p>
      </section>

      <section>
        <h2>6. Politica de refund</h2>
        <p>
          În primele <strong>7 zile calendaristice</strong> de la prima plată,
          poți solicita refund integral fără explicații, prin email la{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          . Refund-ul se procesează în maximum 5 zile lucrătoare pe aceeași
          metodă de plată.
        </p>
        <p>
          După cele 7 zile, anularea abonamentului se aplică începând cu
          următoarea perioadă, fără rambursarea perioadei curente.
        </p>
      </section>

      <section>
        <h2>7. Drepturi de proprietate intelectuală</h2>
        <p>
          Tot conținutul Platformei (texte, video, quiz-uri, structură,
          design, software) e protejat de legea drepturilor de autor și
          aparține echipei InfoBac. Ai dreptul să folosești conținutul pentru
          studiul personal, dar:
        </p>
        <ul>
          <li>
            nu poți redistribui materialele în niciun fel (upload pe alte
            site-uri, share în grupuri publice, vânzare);
          </li>
          <li>
            nu poți crea lucrări derivate (rezumate publicate, cursuri
            replicate);
          </li>
          <li>
            poți partaja link-ul către pagini publice ale Platformei.
          </li>
        </ul>
      </section>

      <section>
        <h2>8. Conduita utilizatorului</h2>
        <p>Te angajezi să nu:</p>
        <ul>
          <li>încerci să accesezi conturi sau zone restricționate;</li>
          <li>folosești scripturi automate pentru extragerea conținutului;</li>
          <li>
            postezi conținut ilegal, abuziv sau care încalcă drepturile altor
            persoane în secțiunile interactive (Q&amp;A, comentarii);
          </li>
          <li>
            încerci să copiezi întrebările examenelor Certiport reale (e
            ilegal și încalcă termenii Certiport).
          </li>
        </ul>
      </section>

      <section>
        <h2>9. Limitarea răspunderii</h2>
        <p>
          InfoBac depune efort să ofere materiale corecte și actualizate, dar
          nu garantează rezultatul examenelor. Promovarea certificărilor
          Certiport depinde de pregătirea individuală și de execuția în ziua
          examenului.
        </p>
        <p>
          În niciun caz răspunderea InfoBac nu va depăși suma plătită de
          utilizator în ultimele 12 luni.
        </p>
      </section>

      <section>
        <h2>10. Modificări ale termenilor</h2>
        <p>
          Putem actualiza acești termeni periodic. Schimbările materiale vor
          fi notificate prin email cu cel puțin 14 zile înainte de intrarea
          în vigoare. Continuarea utilizării după notificare reprezintă
          acceptarea noilor termeni.
        </p>
      </section>

      <section>
        <h2>11. Lege aplicabilă și jurisdicție</h2>
        <p>
          Acești termeni sunt guvernați de legislația Republicii Moldova. În
          caz de litigiu, părțile vor încerca soluționarea amiabilă; dacă nu
          se reușește, competența aparține instanțelor de la sediul InfoBac
          din Chișinău.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          Pentru întrebări despre acești termeni:{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </section>
    </LegalDoc>
    </>
  );
}
