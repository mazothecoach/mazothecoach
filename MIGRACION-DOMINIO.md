# Migracion a dominio propio

**Estado:** pendiente. Dominio elegido: `mazobastidas.com` (verificado libre en el RDAP de Verisign el 5-oct-2026).
Registrar: Cloudflare. El sitio se queda en GitHub Pages.

## El orden importa (leer antes de tocar nada)

Si el archivo `CNAME` aparece en el repo **antes** de que el DNS resuelva, GitHub Pages
empieza a mandar 301 desde `mazothecoach.github.io/mazothecoach` al dominio nuevo. Si ese
dominio todavia no apunta a ningun lado, el sitio queda caido y con el los links de la bio
de Instagram, las descripciones del podcast y los flujos de ManyChat. Por eso el `CNAME`
va al final y lo crea GitHub solo, nunca a mano.

## Pasos

**1. Comprar** `mazobastidas.com` en Cloudflare Registrar.

**2. Crear los registros DNS** en Cloudflare. Todos en **DNS only** (nube gris). Si quedan
proxeados (nube naranja), GitHub no puede completar el reto del certificado: te quedas sin
HTTPS o con bucle de redireccion.

| Tipo | Nombre | Valor |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | mazothecoach.github.io |

Las IP son las que publica GitHub en su documentacion de dominios personalizados.
Si Cloudflare dejo un registro por defecto al crear la zona, borralo antes.

**3. Verificar que propago** antes de seguir:

```
nslookup mazobastidas.com 8.8.8.8
```

Tiene que devolver las cuatro IP de arriba. Si no, esperar. No avanzar al paso 4.

**4. En GitHub:** repo `mazothecoach` > Settings > Pages > Custom domain >
escribir `mazobastidas.com` > Save. Eso crea el archivo `CNAME` en la raiz del repo.

**5. Esperar el certificado.** Tarda de minutos a una hora. Cuando GitHub deje de decir que
lo esta provisionando, marcar **Enforce HTTPS**.

**6. Cambiar las URLs del repo.** Hay 32 ocurrencias del dominio viejo repartidas en
canonicals, `og:url`, el JSON-LD, `sitemap.xml`, `robots.txt` y `llms.txt`. Si se quedan
apuntando a github.io, los canonical le dicen a Google que la version buena es la vieja y
la mudanza se sabotea sola.

```
grep -rl "mazothecoach\.github\.io/mazothecoach" --include=*.html --include=*.xml --include=*.txt --include=*.webmanifest . | grep -v "^./precios/" | xargs sed -i 's|mazothecoach\.github\.io/mazothecoach|mazobastidas.com|g'
```

Los `.md` quedan fuera a proposito: `CLAUDE.md` habla *sobre* github.io y no se debe
reemplazar a ciegas. Revisar esos dos a mano.

**6b. Arreglar las rutas absolutas.** Hay 9 rutas que empiezan con `/mazothecoach/` y no
llevan dominio, asi que el comando de arriba no las toca. Con dominio propio la raiz del repo
pasa a ser la raiz del sitio, o sea que `/mazothecoach/algo` deja de existir. Si no se
cambian: los dos botones de la pagina 404 llevan a un 404, y el `site.webmanifest` pierde el
`start_url` y los tres iconos. Peor: los `Disallow` de `robots.txt` dejan de cubrir
`v2.html` y el aviso de privacidad, que deben seguir fuera del indice.

```
sed -i 's|/mazothecoach/|/|g' 404.html robots.txt site.webmanifest
```

**6c. Tapar los documentos internos.** Al tener dominio propio el `robots.txt` por fin se
lee, y con el quedan expuestos los `.md` del repo (`CLAUDE.md`, `GOOGLE-BUSINESS.md`, este
mismo). Jekyll los sirve crudos porque no llevan front matter. Agregar al `robots.txt`:

```
Disallow: /*.md$
```

**7. Post-mudanza:**

- Search Console: dar de alta `mazobastidas.com` como propiedad nueva, verificar y reenviar
  el sitemap. La propiedad vieja se deja viva unos meses para ver como pasa el trafico.
- Perfil de Google: cambiar el sitio web al dominio nuevo.
- Bio de Instagram, descripciones del podcast y ManyChat: cambiar el link. El 301 los cubre,
  pero el punto de comprar dominio era dar una URL decible.

## El premio

Con dominio propio, `mazobastidas.com/robots.txt` y `mazobastidas.com/llms.txt` por fin son
los del repo y los crawlers de IA si los leen. Hoy viven en una subcarpeta que nadie consulta.
Tambien desaparece el rotulo "GitHub Pages documentation" que Google pone hoy encima del link.

## Lo que no cambia

Las rutas relativas y los nombres de archivo y anchors. La regla de no renombrar sigue
vigente: la mudanza cambia el dominio, no la estructura.
