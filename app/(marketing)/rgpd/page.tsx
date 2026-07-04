export default function RgpdPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">RGPD — Vos droits</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : juillet 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Responsable du traitement</h2>
          <p>
            <strong>Visuimo</strong><br />
            Contact : <a href="mailto:contact@visuimo.fr" className="text-primary underline">contact@visuimo.fr</a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Données collectées</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Adresse e-mail et identifiants de compte</li>
            <li>Photos de biens immobiliers téléversées et visuels générés</li>
            <li>Données techniques de connexion (adresse IP, navigateur)</li>
            <li>Informations d'abonnement et de facturation (traitées via Stripe)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Finalités du traitement</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Gestion de votre compte et authentification</li>
            <li>Fourniture des services d'amélioration photo, de staging virtuel et de génération de vidéo</li>
            <li>Gestion de l'abonnement et facturation</li>
            <li>Sécurité et amélioration du service</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Base légale</h2>
          <p>Le traitement repose sur l'exécution du contrat d'abonnement (art. 6.1.b RGPD) et, pour les données techniques, notre intérêt légitime à la sécurité et à la qualité du service (art. 6.1.f RGPD).</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc space-y-1 pl-5 mt-2">
            <li><strong>Accès</strong> — obtenir une copie de vos données</li>
            <li><strong>Rectification</strong> — corriger des données inexactes</li>
            <li><strong>Effacement</strong> — demander la suppression de vos données</li>
            <li><strong>Opposition</strong> — vous opposer à certains traitements</li>
            <li><strong>Portabilité</strong> — recevoir vos données dans un format structuré</li>
            <li><strong>Limitation</strong> — restreindre le traitement dans certains cas</li>
          </ul>
          <p className="mt-3">
            Pour exercer vos droits : <a href="mailto:contact@visuimo.fr" className="text-primary underline">contact@visuimo.fr</a>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            En cas de litige, vous pouvez saisir la <strong>CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) : <span className="font-medium">www.cnil.fr</span>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Durée de conservation</h2>
          <p>
            Les données de compte sont conservées pendant toute la durée de l'abonnement actif.
            En cas de suppression du compte, les données sont effacées sous 30 jours.
            Certaines données peuvent être conservées plus longtemps pour répondre aux obligations légales.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Cookies</h2>
          <p>
            Visuimo utilise uniquement des cookies strictement nécessaires au fonctionnement du service (authentification, préférences de langue).
            Aucun cookie publicitaire ou de tracking tiers n&apos;est déposé.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour à l&apos;accueil</a>
      </div>
    </div>
  );
}
