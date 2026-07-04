export default function GizlilikPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : juillet 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <h2 className="mb-3 text-lg font-semibold">1. Responsable du traitement</h2>
          <p>
            Cette politique s&apos;applique à la société qui fournit le service Visuimo.<br />
            Société : <strong>Visuimo</strong><br />
            E-mail : <a href="mailto:davutsenol.fr@gmail.com" className="text-primary underline">davutsenol.fr@gmail.com</a>
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">2. Données collectées</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>L&apos;adresse e-mail et le mot de passe fournis lors de la création du compte</li>
            <li>Les photos de biens que vous téléversez et les visuels générés</li>
            <li>Les données techniques de connexion liées à l&apos;utilisation du service (adresse IP, informations du navigateur)</li>
            <li>Les informations d&apos;abonnement et de paiement (traitées via Stripe ; le numéro de carte n&apos;est jamais stocké sur les serveurs de Visuimo)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">3. Finalités du traitement des données</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Créer et gérer votre compte</li>
            <li>Fournir les services d&apos;amélioration photo, de home staging virtuel et de génération vidéo</li>
            <li>Gérer l&apos;abonnement et la facturation</li>
            <li>Assurer la sécurité et la qualité du service</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">4. Partage des données</h2>
          <p>
            Vos données ne sont partagées avec des tiers que lorsque cela est nécessaire au fonctionnement du service :
          </p>
          <ul className="list-disc space-y-1 pl-5 mt-2">
            <li><strong>Infrastructure de base de données</strong> — stocke de façon sécurisée les données de compte et les visuels</li>
            <li><strong>Fournisseur de traitement d&apos;image</strong> — traite les photos téléversées pour l&apos;amélioration et le home staging virtuel</li>
            <li><strong>Fournisseur de génération vidéo</strong> — traite les visuels pour créer la vidéo de présentation</li>
            <li><strong>Stripe</strong> — traitement des paiements (le numéro de carte n&apos;est jamais stocké sur les serveurs de Visuimo)</li>
          </ul>
          <p className="mt-2">Ces prestataires sont soumis à leurs propres politiques de confidentialité. Vos données ne sont jamais partagées à des fins marketing avec des tiers.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">5. Vos droits (RGPD)</h2>
          <p>En vertu du Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
          <ul className="list-disc space-y-1 pl-5 mt-2">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de demander la rectification de données inexactes</li>
            <li>Droit de demander l&apos;effacement de vos données (&quot;droit à l&apos;oubli&quot;)</li>
            <li>Droit d&apos;opposition au traitement</li>
            <li>Droit à la portabilité des données</li>
          </ul>
          <p className="mt-2">Pour toute demande : <a href="mailto:davutsenol.fr@gmail.com" className="text-primary underline">davutsenol.fr@gmail.com</a></p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">6. Durée de conservation des données</h2>
          <p>
            Vos données de compte sont conservées tant que votre compte est actif. En cas de demande de suppression, vos données sont effacées sous 30 jours.
            Certaines données peuvent être conservées plus longtemps si des obligations légales l&apos;exigent.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">7. Contact</h2>
          <p>
            Pour toute question relative à la confidentialité : <a href="mailto:davutsenol.fr@gmail.com" className="text-primary underline">davutsenol.fr@gmail.com</a>
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour à l&apos;accueil</a>
      </div>
    </div>
  );
}
