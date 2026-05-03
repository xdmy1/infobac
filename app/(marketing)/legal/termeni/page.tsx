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
      status="final"
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
            unui plan ales (Un modul, Toate modulele, Pe 6 luni).
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
          &amp; Devices) — certificări internațional recunoscute, utile pentru
          pregătirea probei de informatică din cadrul examenului de
          bacalaureat din Republica Moldova, conform reglementărilor în
          vigoare.
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
          <li>nu împărtășești contul cu alte persoane.</li>
        </ul>
      </section>

      <section>
        <h2>5. Plăți și facturare</h2>
        <p>
          Prețurile sunt afișate în lei moldovenești (MDL), cu echivalent
          informativ în EUR. Plata se efectuează prin aplicația MIA (Moldovan
          Instant Payment Application) către numărul indicat la finalizarea
          comenzii. După confirmarea plății (screenshot pe Telegram sau
          încărcat pe Platformă), accesul este activat manual de echipă în
          maximum 24 de ore lucrătoare.
        </p>
        <p>
          Planurile <strong>Un modul</strong> și <strong>Toate modulele</strong>{" "}
          sunt lunare. Accesul e valabil pentru perioada plătită; pentru
          continuare, refaci plata. Nu există taxare recurentă automată — nu
          se încarcă cardul tău fără să acționezi.
        </p>
        <p>
          Planul <strong>Pe 6 luni</strong> e o plată unică ce acoperă 6 luni
          consecutive de acces, fără reînnoire automată.
        </p>
      </section>

      <section>
        <h2>6. Plata și anularea</h2>
        <p>
          Plățile efectuate pentru perioada deja consumată nu se rambursează
          — primele 2 lecții ale fiecărui curs sunt gratuite tocmai ca să poți
          testa platforma înainte. Pentru planurile lunare, poți opri
          reînnoirea oricând și păstrezi accesul până la sfârșitul lunii deja
          plătite. Pachetul pe 6 luni e plată unică, nerambursabilă în
          întregime.
        </p>
      </section>

      <section>
        <h2>7. Drepturi de proprietate intelectuală</h2>
        <p>
          Tot conținutul original al Platformei (texte, video, quiz-uri,
          structură, design, software) e creație proprie a echipei InfoBac
          și e protejat de legea drepturilor de autor (Legea 139/2010 a
          Republicii Moldova și Convenția de la Berna). Toate întrebările
          de auto-evaluare și simulările au fost scrise de la zero de
          echipa noastră, pe baza obiectivelor publice de programă și a
          cunoștințelor noastre din domeniu.
        </p>
        <p>Ai dreptul să folosești conținutul pentru studiul personal, dar:</p>
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
        <h2>
          8. Independența față de Certiport, Pearson VUE și alte mărci
        </h2>
        <p>
          InfoBac e o platformă independentă de educație în tehnologia
          informației. <strong>Nu suntem afiliați</strong> cu, sponsorizați
          de, sau aprobați oficial de Certiport, Pearson VUE, Microsoft,
          sau orice deținător de marcă comercială menționat pe Platformă.
        </p>
        <p>
          Mărcile <em>Certiport</em>, <em>IT Specialist</em>,{" "}
          <em>Pearson VUE</em> și orice alte denumiri ale unor produse sau
          servicii ale terților sunt mărci comerciale ale proprietarilor
          lor respectivi. Le folosim exclusiv în mod descriptiv (
          <em>nominative fair use</em>), pentru a indica subiectele
          tehnologice pe care le predăm și certificările pe care utilizatorii
          noștri pot alege să le obțină independent.
        </p>
        <p>
          Predăm domeniul de cunoștințe (Python, SQL, hardware, rețele) ca
          atare. Faptul că aceste cunoștințe sunt utile pentru obținerea
          unor certificări internaționale (inclusiv cele Certiport care, în
          baza reglementărilor în vigoare din Republica Moldova, pot fi
          folosite pentru pregătirea probei de informatică la BAC) este un
          beneficiu colateral, nu un parteneriat oficial. Voucherele și
          sesiunile de examinare se obțin separat, direct de la centrele
          de testare autorizate.
        </p>
        <p>
          Dacă ești titular de drepturi (Certiport, Pearson VUE etc.) și
          consideri că un material publicat de noi îți încalcă drepturile,
          te rugăm să ne notifici la{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>{" "}
          cu detalii privind materialul vizat. Investigăm și acționăm în
          maximum 48 de ore lucrătoare, conform procedurii standard
          DMCA / drept de autor.
        </p>
      </section>

      <section>
        <h2>9. Conduita utilizatorului</h2>
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
        <h2>10. Limitarea răspunderii</h2>
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
        <h2>11. Modificări ale termenilor</h2>
        <p>
          Putem actualiza acești termeni periodic. Schimbările materiale vor
          fi notificate prin email cu cel puțin 14 zile înainte de intrarea
          în vigoare. Continuarea utilizării după notificare reprezintă
          acceptarea noilor termeni.
        </p>
      </section>

      <section>
        <h2>12. Lege aplicabilă și jurisdicție</h2>
        <p>
          Acești termeni sunt guvernați de legislația Republicii Moldova. În
          caz de litigiu, părțile vor încerca soluționarea amiabilă; dacă nu
          se reușește, competența aparține instanțelor de la sediul InfoBac
          din Chișinău.
        </p>
      </section>

      <section>
        <h2>13. Contact</h2>
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
