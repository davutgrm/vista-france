export default function SanalStagingEtigiPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Éthique du home staging virtuel</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : juillet 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Qu&apos;est-ce que le home staging virtuel ?</h2>
          <p>
            Le home staging virtuel consiste à ajouter, par intelligence artificielle, du mobilier et une décoration virtuels à la photo d&apos;un bien vide ou peu meublé.
            Aucun mobilier réel ni aucune modification du lieu n&apos;est effectué ; il s&apos;agit uniquement d&apos;un outil de présentation visuelle.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Notre principe d&apos;honnêteté</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Obligation d&apos;étiquetage :</strong> tous les visuels de home staging virtuel générés avec Visuimo
              doivent porter, dans l&apos;annonce ou la brochure, la mention <em>« Meublé virtuellement »</em> ou <em>« Image de synthèse »</em>.
            </li>
            <li>
              <strong>Interdiction de modification structurelle :</strong> le home staging virtuel ne concerne que le mobilier et la décoration.
              Les murs, fenêtres, sols ou dimensions de la pièce ne sont en aucun cas modifiés.
            </li>
            <li>
              <strong>Interdiction de présentation trompeuse :</strong> la production de visuels laissant croire que le bien possède des
              caractéristiques qu&apos;il n&apos;a pas réellement est contraire à nos conditions d&apos;utilisation.
            </li>
            <li>
              <strong>Transparence :</strong> les acheteurs doivent pouvoir comprendre, sans avoir à le demander, qu&apos;un visuel ou
              une vidéo a été généré par intelligence artificielle.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Cadre légal (France)</h2>
          <p>
            En France, le droit de la consommation impose que les visuels utilisés dans les annonces immobilières soient
            réalistes et non trompeurs. L&apos;étiquetage clair des visuels de home staging virtuel, les distinguant des
            photos originales, répond à cette obligation.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Responsabilité d&apos;usage</h2>
          <p>
            Visuimo est responsable de fournir un outil honnête et transparent.
            L&apos;usage qui est fait des visuels relève de la responsabilité de l&apos;auteur de l&apos;annonce.
            En cas de publication d&apos;une annonce trompeuse, la responsabilité incombe à l&apos;utilisateur.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Questions et signalements</h2>
          <p>
            Pour signaler un manquement à cette éthique :{" "}
            <a href="mailto:davutsenol.fr@gmail.com" className="text-primary underline">davutsenol.fr@gmail.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour à l&apos;accueil</a>
      </div>
    </div>
  );
}
