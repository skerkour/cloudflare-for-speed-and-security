# cloudflare-book-origin


## Deployment

```bash
docker run -d -v -p 80:8080 -p 443:8443 `pwd`/certs:/origin/certs -e HTTPS_DOMAIN="YOUR_DOMAIN" -e HTTPS_LETS_ENCRYPT_EMAIL="YOUR_EMAIL" ghcr.io/skerkour/cloudflare-book-origin
```
