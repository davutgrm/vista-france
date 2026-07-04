export default function KullanimKosullariPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Conditions d&apos;utilisation</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : juillet 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <h2 className="mb-3 text-lg font-semibold">1. Parties</h2>
          <p>
            Les présentes conditions constituent le contrat entre <strong>Visuimo</strong>, qui fournit le service,
            et la personne ou l&apos;entité qui l&apos;utilise (l&apos;&quot;Utilisateur&quot;).
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">2. Portée du service</h2>
          <p>
            Visuimo propose des services d&apos;amélioration de photos d&apos;annonces immobilières par intelligence artificielle, de home staging virtuel et de génération de vidéos de présentation.
            Les services fonctionnent selon un système de crédits ; chaque opération consomme un nombre défini de crédits.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">3. Obligations de l&apos;utilisateur</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Vous déclarez détenir les droits d&apos;auteur sur les photos téléversées ou disposer d&apos;une autorisation d&apos;utilisation.</li>
            <li>Vous devez informer clairement les acheteurs lorsque les visuels générés contiennent du home staging virtuel.</li>
            <li>Vous ne pouvez pas utiliser les services à des fins illégales ou pour produire du contenu trompeur.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">4. Propriété intellectuelle</h2>
          <p>
            Vous conservez la propriété de vos photos originales et des résultats générés.
            Visuimo ne traite ces contenus que dans le cadre de la fourniture du service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">5. Paiement et annulation</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Les forfaits payants sont facturés mensuellement.</li>
            <li>L&apos;abonnement peut être annulé à tout moment avant la prochaine période de facturation.</li>
            <li>En cas d&apos;annulation, l&apos;accès reste actif jusqu&apos;à la fin de la période en cours.</li>
            <li>Les crédits non utilisés ne sont pas remboursés.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">6. Limitation de responsabilité</h2>
          <p>
            Visuimo ne garantit pas que les visuels générés par intelligence artificielle conviennent à tout usage.
            Il incombe à l&apos;Utilisateur de s&apos;assurer de la conformité légale des contenus produits.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">7. Contact</h2>
          <p>
            Pour toute question : <a href="mailto:davutsenol.fr@gmail.com" className="text-primary underline">davutsenol.fr@gmail.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour à l&apos;accueil</a>
      </div>
    </div>
  );
}
