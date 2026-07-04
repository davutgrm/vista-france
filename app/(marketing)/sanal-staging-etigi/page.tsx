export default function SanalStagingEtigiPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8 lg:py-24">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Sanal Staging Etiği</h1>
      <p className="mt-2 text-sm text-muted-foreground">Son güncelleme: Temmuz 2026</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/85">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Sanal staging nedir?</h2>
          <p>
            Sanal staging, boş veya seyrek döşenmiş bir mülk fotoğrafına yapay zeka ile sanal mobilya ve dekorasyon eklemektir.
            Gerçek bir mobilya ya da mekan değişikliği yapılmaz; yalnızca görsel bir sunum aracıdır.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Dürüstlük ilkemiz</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Etiketleme zorunluluğu:</strong> Visuimo ile üretilen tüm sanal staging görsellerinin
              ilan veya broşürde <em>"Sanal olarak döşenmiştir"</em> ya da <em>"Image de synthèse"</em> ibaresiyle
              işaretlenmesi gerekir.
            </li>
            <li>
              <strong>Yapısal değişiklik yasağı:</strong> Sanal staging sadece mobilya ve dekorasyonu kapsar.
              Duvar, pencere, zemin veya odanın boyutları hiçbir şekilde değiştirilmez.
            </li>
            <li>
              <strong>Yanıltıcı sunum yasağı:</strong> Mülkün gerçekte sahip olmadığı özellikleri varmış gibi
              gösteren görsel üretimi kullanım koşullarımıza aykırıdır.
            </li>
            <li>
              <strong>Şeffaflık:</strong> Alıcılar, bir görsel veya videonun yapay zeka ile üretildiğini
              sormadan anlayabilmelidir.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Yasal çerçeve (Fransa)</h2>
          <p>
            Fransa&apos;da emlak ilanlarında kullanılan görsellerin gerçekçi ve yanıltmaz nitelikte olması
            tüketici hukuku kapsamında zorunludur. Sanal staging görsellerinin orijinal fotoğraflardan
            açıkça ayırt edilebilir şekilde etiketlenmesi bu yükümlülüğü karşılar.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Kullanım sorumluluğu</h2>
          <p>
            Visuimo, dürüst ve şeffaf bir araç sağlamaktan sorumludur.
            Görsellerin nasıl kullanıldığından ise ilan sahibi sorumludur.
            Yanıltıcı ilan yayımlanması durumunda sorumluluk kullanıcıya aittir.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Soru ve bildirimler</h2>
          <p>
            Etik ihlal bildirimleriniz için:{" "}
            <a href="mailto:contact@visuimo.fr" className="text-primary underline">contact@visuimo.fr</a>
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Ana sayfaya dön</a>
      </div>
    </div>
  );
}
